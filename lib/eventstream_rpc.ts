/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */

/**
 * @packageDocumentation
 * @module eventstream_rpc
 */


import {CrtError, eventstream, io} from 'aws-crt';
import {EventEmitter, once} from 'events';

/**
 * Indicates the general category of an error thrown by the eventstream RPC implementation
 */
export enum RpcErrorType {

    /**
     * An error occurred while serializing a client model into a message in the eventstream protocol.
     */
    SerializationError,

    /**
     * An error occurred while deserializing a message from the eventstream protocol into the client model.
     */
    DeserializationError,

    /**
     * An error occurred within the underlying eventstream protocol.  In theory, this should always be fatal and
     * the result of an implementation bug, not external events or user error.
     */
    ProtocolError,

    /**
     * An error that isn't classifiable occurred.
     */
    InternalError,

    /**
     * An error occurred while validating input into the eventstream RPC implementation.  In theory, this is
     * always a result of a user data-modeling mistake.
     */
    ValidationError,

    /**
     * An error occurred due to an attempt to invoke an API while the target operation or client is not in the
     * right state to perform the API.
     */
    ClientStateError,

    /**
     * An error occurred ostensibly due to an underlying networking failure.
     */
    NetworkError
};

/**
 * Wrapper type for all exceptions thrown by rpc clients and operations.  This includes rejected promises.
 *
 * The intention is for this data model to help users make better decisions in the presence of errors.  Not all errors
 * are fatal/terminal, but JS doesn't really give a natural way to classify or conditionally react to general errors.
 */
export interface RpcError {

    /** The error's broad category */
    type: RpcErrorType;

    /** Plain language description of the error */
    description: string;

    /** Optional inner/triggering error that can contain additional context. */
    internalError?: CrtError;
}

/**
 * Wrapper for all data associated with an RPC client disconnection event
 */
export interface DisconnectionEvent {

    /**
     * Underlying reason for the disconnection
     */
    reason : CrtError;
}

/**
 * Event listener type signature for listening to client disconnection events
 */
export type DisconnectionListener = (eventData?: DisconnectionEvent) => void;

/**
 * All data associated with the client successfully establishing an eventstream connection.
 *
 * Exists for future proofing at the moment.  Could eventually take connack properties, etc...
 */
export interface SuccessfulConnectionResult {

}

/**
 * Type signature for an asynchronous function that can transform eventstream messages.  Used to allow client
 * implementations to modify the initial eventstream connect message.
 */
export type RpcMessageTransformation = (message: eventstream.Message) => Promise<eventstream.Message>;

/**
 * All configuration options for creating a new eventstream RPC client
 */
export interface RpcClientConfig {

    /**
     * Name of the host to connect to
     */
    hostName: string;

    /**
     * Port of the host to connect to
     */
    port: number;

    /**
     * Optional, additional socket options for the underlying connection
     */
    socketOptions?: io.SocketOptions;

    /**
     * Optional TLS context to use when establishing a connection
     */
    tlsCtx?: io.ClientTlsContext;

    /**
     * Optional message transformation function to apply to the eventstream connect message sent by the client.
     */
    connectTransform?: RpcMessageTransformation;

    /**
     * Optional timeout for connection establishment and initial eventstream handshake
     */
    connectTimeoutMs?: number;
};

/**
 * @internal a rough mirror of the internal connection state, but ultimately must be independent due to the more
 * complex connection establishment process (connect/connack).  Used to prevent API invocations when the client
 * is not in the proper state to attempt them.
 */
enum ClientState {
    None,
    Connecting,
    Connected,
    Finished,
    Closed
};

/**
 * @internal
 */
const DEFAULT_CONNECT_TIMEOUT_MS : number = 5000;

/**
 * Basic eventstream RPC client
 */
export class RpcClient extends EventEmitter {

    private emitDisconnectOnClose : boolean;
    private state: ClientState;
    private connection: eventstream.ClientConnection;
    private unclosedOperations? : Set<OperationBase>;

    private disconnectionReason? : CrtError;

    private constructor(private config: RpcClientConfig) {
        super();
        this.unclosedOperations = new Set<OperationBase>();
        this.state = ClientState.None;
        this.emitDisconnectOnClose = false;

        let connectionOptions : eventstream.ClientConnectionOptions = {
            hostName: config.hostName,
            port: config.port,
            socketOptions: config.socketOptions,
            tlsCtx: config.tlsCtx
        };

        try {
            // consider factoring connect timeout into socket options to help bound promise resolution/wait time in
            // connect()
            this.connection = new eventstream.ClientConnection(connectionOptions);
        } catch (e) {
            throw createRpcError(RpcErrorType.InternalError, "Failed to create eventstream connection", e as CrtError);
        }
    }

    /**
     * Factory method to create a new client
     *
     * @param config configuration options that the new client must use
     *
     * Returns a new client on success, otherwise throws an RpcError
     */
    static new(config: RpcClientConfig) : RpcClient {
        return new RpcClient(config);
    }

    /**
     * Attempts to open a network connection to the configured remote endpoint.  Returned promise will be fulfilled if
     * the transport-level connection is successfully established, and rejected otherwise.
     *
     * Returns a promise that is resolved with additional context on a successful connection, otherwise rejected.
     *
     * connect() may only be called once.
     */
    async connect() : Promise<SuccessfulConnectionResult> {
        return new Promise<SuccessfulConnectionResult>(async (resolve, reject) => {
            if (this.state != ClientState.None) {
                reject(createRpcError(RpcErrorType.ClientStateError, "RpcClient.connect() can only be called once"));
                return;
            }

            setTimeout(() => {
                if (this.state == ClientState.Connecting) {
                    this.state = ClientState.Finished;
                    reject(createRpcError(RpcErrorType.NetworkError, "RpcClient.connect() timed out"));
                    setImmediate(() => { this.close(); });
                }
            }, this.config.connectTimeoutMs ?? DEFAULT_CONNECT_TIMEOUT_MS);

            let onDisconnectWhileConnecting : eventstream.DisconnectionListener = (eventData: eventstream.DisconnectionEvent) => {
                if (this.state == ClientState.Connecting) {
                    this.state = ClientState.Finished;
                    reject(createRpcError(RpcErrorType.NetworkError, "RpcClient.connect() failed - connection closed"));
                    setImmediate(() => { this.close(); });
                }
            };

            this.connection.on('disconnection', onDisconnectWhileConnecting);

            this.state = ClientState.Connecting;
            let connack = undefined;

            try {
                await this.connection.connect();

                const connectResponse = once(this.connection, eventstream.ClientConnection.PROTOCOL_MESSAGE);

                // create, transform, and send the connect
                let connectMessage: eventstream.Message = {
                    type: eventstream.MessageType.Connect
                };

                if (this.config.connectTransform) {
                    connectMessage = await this.config.connectTransform(connectMessage);
                }

                await this.connection.sendProtocolMessage({
                    message: connectMessage
                });

                // wait for the conn ack
                let response: eventstream.MessageEvent = (await connectResponse)[0];
                connack = response.message;
            } catch (err) {
                if (this.state == ClientState.Connecting) {
                    this.state = ClientState.Finished;
                    setImmediate(() => { this.close(); });
                }

                reject(createRpcError(RpcErrorType.InternalError, "Failed to establish eventstream RPC connection", err as CrtError));
                return;
            }

            /*
             * If we timed out, we might make it here but the client has been finished/closed and the promise
             * rejected.  Promise rejection (via external actor) does not seem to stop body execution.
             */
            if (this.state != ClientState.Connecting) {
                reject(createRpcError(RpcErrorType.InternalError, "Eventstream RPC connection attempt interrupted"));
                return;
            }

            if (!connack || !RpcClient.isValidConnack(connack)) {
                this.state = ClientState.Finished;
                reject(createRpcError(RpcErrorType.ProtocolError, "Failed to establish eventstream RPC connection - invalid connack"));
                setImmediate(() => { this.close(); });
                return;
            }

            /*
             * Remove the promise-rejecting disconnect listener and replace it with a regular old listener that
             * doesn't reject the connect() promise since we're going to resolve it now.
             */
            this.connection.removeListener('disconnection', onDisconnectWhileConnecting);
            this.connection.on('disconnection', (eventData: eventstream.DisconnectionEvent) => {
                if (eventData.errorCode != 0) {
                    this.disconnectionReason = new CrtError(eventData.errorCode);
                }
                setImmediate(() => { this.close(); });
            });

            /* Per the client contract, we only emit disconnect after a successful connection establishment */
            this.emitDisconnectOnClose = true;
            this.state = ClientState.Connected;
            resolve({});
        });
    }

    /**
     * Returns true if the connection is currently open and ready-to-use, false otherwise.
     */
    isConnected() : boolean {
        return this.state == ClientState.Connected;
    }

    /**
     * @internal
     *
     * Adds an unclosed operation to the set tracked by the client.  When the client is closed, all unclosed operations
     * will also be closed.  While not foolproof, this enables us to avoid many kinds of resource leaks when the user
     * doesn't do exactly what we would like them to do (which may not be obvious to them, in all fairness).
     *
     * @param operation unclosed operation to register
     */
    registerUnclosedOperation(operation: OperationBase) {
        if (!this.isConnected() || !this.unclosedOperations) {
            throw createRpcError(RpcErrorType.ClientStateError, "Operation registration only allowed when the client is connected");
        }

        this.unclosedOperations.add(operation);
    }

    /**
     * @internal
     *
     * Removes an unclosed operation from the set tracked by the client.  When the client is closed, all unclosed operations
     * will also be closed.
     *
     * @param operation operation to remove, presumably because it just got closed
     */
    removeUnclosedOperation(operation: OperationBase) {
        if (this.unclosedOperations) {
            this.unclosedOperations.delete(operation);
        }
    }

    /**
     * Shuts down the client and begins the process of release all native resources associated with the client
     * and in-progress operations.  It is critical that this function be called when finished with the client;
     * otherwise, native resources will leak.
     *
     * The client tracks unclosed operations and, as part of this process, closes them as well.
     */
    close() {
        if (this.state == ClientState.Closed) {
            return;
        }

        if (this.emitDisconnectOnClose) {
            this.emitDisconnectOnClose = false;
            if (!this.disconnectionReason) {
                this.disconnectionReason = new CrtError("User-initiated disconnect");
            }

            setImmediate(() => {
                this.emit('disconnection', { reason: this.disconnectionReason });
            });
        }

        this.state = ClientState.Closed;

        if (this.unclosedOperations) {
            let unclosedOperations: Set<OperationBase> = this.unclosedOperations;
            this.unclosedOperations = undefined;

            unclosedOperations.forEach((operation: OperationBase) => {
                operation.close();
            });
        }

        this.connection.close();
    }

    /**
     * @internal
     *
     * Creates a new stream on the client's connection for an RPC operation to use.
     *
     * Returns a new stream on success, otherwise throws an RpcError
     */
    newStream() : eventstream.ClientStream {
        if (this.state != ClientState.Connected) {
            throw createRpcError(RpcErrorType.ClientStateError, "New streams may only be created while the client is connected");
        }

        try {
            return this.connection.newStream();
        } catch (e) {
            throw createRpcError(RpcErrorType.InternalError, "Failed to create new event stream", e as CrtError);
        }
    }

    /**
     * Event emitted when the client's underlying network connection is ended.  Only emitted if the connection
     * was previously successfully established, including a successful connect/connack handshake.
     *
     * Listener type: {@link DisconnectionListener}
     *
     * @event
     */
    static DISCONNECTION : string = 'disconnection';

    on(event: 'disconnection', listener: DisconnectionListener): this;

    on(event: string | symbol, listener: (...args: any[]) => void): this {
        super.on(event, listener);
        return this;
    }

    private static isValidConnack(message: eventstream.Message) : boolean {
        if (message.type != eventstream.MessageType.ConnectAck) {
            return false;
        }

        if (((message.flags ?? 0) & eventstream.MessageFlags.ConnectionAccepted) == 0) {
            return false;
        }

        return true;
    }
}

/**
 * Event listener type signature for listening to client disconnection events
 */
export type RpcErrorListener = (eventData: RpcError) => void;


export interface OperationEndedEvent {

}

/**
 * Event listener type signature for listening to operation ended events
 */
export type OperationEndedListener = (eventData: OperationEndedEvent) => void;

export interface OperationActivationResult {

}

enum OperationState {
    None,
    Activating,
    Activated,
    Ended,
    Closed
}

interface OperationConfig {
    name: string;

    client: RpcClient;
};




class OperationBase extends EventEmitter {

    private emitEndedOnClose : boolean;
    private state : OperationState;
    private stream : eventstream.ClientStream;

    // this promise exists to passively clean up after ourselves if no one else calls close.  It does not
    // need to be referenced.
    // @ts-ignore
    private janitor? : Promise<void>;

    constructor(private operationConfig: OperationConfig) {
        super();
        this.state = OperationState.None;
        this.stream = operationConfig.client.newStream();
        this.emitEndedOnClose = false;

        operationConfig.client.registerUnclosedOperation(this);
    }

    close() {
        if (this.state == OperationState.Closed) {
            return;
        }

        this.operationConfig.client.removeUnclosedOperation(this);

        if (this.emitEndedOnClose) {
            this.emitEndedOnClose = false;

            setImmediate(() => {
                this.emit('ended', {});
            });
        }

        let shouldTerminateStream : boolean = this.state == OperationState.Activated;

        this.state = OperationState.Closed;
        this.janitor = undefined;

        if (shouldTerminateStream) {
            try {
                this.stream.sendMessage({
                    message : {
                        type : eventstream.MessageType.ApplicationMessage,
                        flags : eventstream.MessageFlags.TerminateStream
                    }
                });
            } catch (e) {
                // an exception generated from trying to gently end the stream should not propagate
                setImmediate(() => {
                    this.emit('error', createRpcError(RpcErrorType.InternalError, "Failure while nicely closing operation stream", e as CrtError));
                });
            }
        }

        setImmediate(() => { this.stream.close(); });
    }

    async activate(message: eventstream.Message) : Promise<OperationActivationResult> {
        return new Promise<OperationActivationResult>(async (resolve, reject) => {
            if (this.state != OperationState.None) {
                reject(createRpcError(RpcErrorType.ClientStateError, "Eventstream operations may only have activate() invoked once"));
                return;
            }

            this.state = OperationState.Activating;

            var bothFinished;

            try {
                let endedPromise = once(this.stream, eventstream.ClientStream.ENDED);
                let activatePromise = this.stream.activate({
                    operation : this.operationConfig.name,
                    message : message
                });

                /*
                 * A stream that has both activated and ended is safe to close.  If it seems counter-intuitive that
                 * a stream can end before its activation promise completes, welcome to the club, but that's the way
                 * it is.
                 */
                bothFinished = Promise.all([endedPromise, activatePromise]);

                await activatePromise;
            } catch (e) {
                if (this.state == OperationState.Activating) {
                    this.state = OperationState.Ended;
                    setImmediate(() => { this.close(); });
                }

                reject(createRpcError(RpcErrorType.InternalError, "Operation stream activation failure", e as CrtError));
                return;
            }

            if (this.state != OperationState.Activating) {
                reject(createRpcError(RpcErrorType.InternalError, "Operation stream activation interruption"));
                return;
            }

            this.state = OperationState.Activated;
            this.emitEndedOnClose = true;
            resolve({});

            /* Make the operation auto-close as soon as both ended and activate have completed */
            this.janitor = bothFinished.then(
                () => { setImmediate(() => { this.close(); }); },
                () => { setImmediate(() => { this.close(); }); }
            );
        });
    }

    /**
     * Returns true if the stream is currently active and ready-to-use, false otherwise.
     */
    isActive() : boolean {
        return this.state == OperationState.Activated;
    }

    getStream() : eventstream.ClientStream { return this.stream; }

    /**
     * TODO
     *
     * @event
     */
    static ENDED : string = 'ended';

    static ERROR : string = 'error';

    on(event: 'ended', listener: OperationEndedListener): this;

    on(event: 'error', listener: RpcErrorListener): this;

    on(event: string | symbol, listener: (...args: any[]) => void): this {
        super.on(event, listener);
        return this;
    }
}


export interface RequestResponseOperationConfig<RequestType, ResponseType> {
    requestSerializer: (request: RequestType) => eventstream.Message;
    responseDeserializer: (message: eventstream.Message) => ResponseType;
}

export class RequestResponseOperation<RequestType, ResponseType> extends EventEmitter {

    private operation : OperationBase;
    private responseMessage? : eventstream.Message;

    constructor(operationConfig: OperationConfig, private requestResponseConfig: RequestResponseOperationConfig<RequestType, ResponseType>) {
        super();
        this.operation = new OperationBase(operationConfig);
    }

    async execute(request: RequestType) : Promise<ResponseType> {
        return new Promise<ResponseType>(async (resolve, reject) => {
            try {
                let stream : eventstream.ClientStream = this.operation.getStream();

                let endedPromise = once(this.operation, "ended");
                stream.on('message', this._onStreamMessageEvent.bind(this));

                let requestMessage: eventstream.Message = this.requestResponseConfig.requestSerializer(request);
                await this.operation.activate(requestMessage);

                await endedPromise;
                if (this.responseMessage) {
                    let response : ResponseType = this.requestResponseConfig.responseDeserializer(this.responseMessage);
                    resolve(response);
                } else {
                    reject(createRpcError(RpcErrorType.ProtocolError, "Operation stream ended before response received"));
                }
            } catch (e) {
                reject(e);
            }
        });
    }

    private _onStreamMessageEvent(eventData: eventstream.MessageEvent) {
        this.responseMessage = eventData.message;
    }
}



export interface StreamingOperationConfig<RequestType, ResponseType, MessageType> {
    requestSerializer: (request: RequestType) => eventstream.Message;
    responseDeserializer: (message: eventstream.Message) => ResponseType;
    messageDeserializer: (message: eventstream.Message) => MessageType;
}

export class InboundStreamingOperation<RequestType, ResponseType, InboundMessageType> extends EventEmitter {
    private operation : OperationBase;
    private responseHandled : boolean;
    private responsePromiseResolve? : (value: (ResponseType | PromiseLike<ResponseType>)) => void;
    private responsePromiseReject? : (reason?: any) => void;

    // @ts-ignore
    private endedPromise? : any;

    constructor(operationConfig: OperationConfig, private streamingConfig: StreamingOperationConfig<RequestType, ResponseType, InboundMessageType>) {
        super();

        this.operation = new OperationBase(operationConfig);
        this.responseHandled = false;
    }

    async execute(request: RequestType) : Promise<ResponseType> {
        return new Promise<ResponseType>(async (resolve, reject) => {
            try {
                this.responsePromiseResolve = resolve;
                this.responsePromiseReject = reject;

                let stream : eventstream.ClientStream = this.operation.getStream();

                stream.on('message', this._onStreamMessageEvent.bind(this));

                this.endedPromise = once(this.operation, "ended").then(() => {
                    if (!this.responseHandled) {
                        this.responseHandled = true;
                        // @ts-ignore
                        this.responsePromiseReject(createRpcError(RpcErrorType.ProtocolError, "Operation stream ended before initial response received"));
                    }

                    setImmediate(() => {
                        this.emit('ended', {});
                    });
                });

                let requestMessage: eventstream.Message = this.streamingConfig.requestSerializer(request);
                await this.operation.activate(requestMessage);
            } catch (e) {
                reject(e);
            }
        });
    }

    private _onStreamMessageEvent(eventData: eventstream.MessageEvent) {
        if (this.responseHandled) {
            try {
                let streamingMessage: InboundMessageType = this.streamingConfig.messageDeserializer(eventData.message);
                setImmediate(() => {
                    this.emit('message', streamingMessage);
                });
            } catch (err) {
                setImmediate(() => { this.emit('error', err as RpcError); });
            }
        } else {
            this.responseHandled = true;
            try {
                let response : ResponseType = this.streamingConfig.responseDeserializer(eventData.message);

                // @ts-ignore
                this.responsePromiseResolve(response);
            } catch (err) {
                // @ts-ignore
                this.responsePromiseReject(err);
            }
        }
    }

    static ENDED : string = 'ended';

    static ERROR : string = 'error';

    static MESSAGE : string = 'message';

    on(event: 'ended', listener: OperationEndedListener): this;

    on(event: 'error', listener: RpcErrorListener): this;

    on(event: 'message', listener: (message: InboundMessageType) => void): this;

    on(event: string | symbol, listener: (...args: any[]) => void): this {
        super.on(event, listener);
        return this;
    }
}



function createRpcError(type: RpcErrorType, description: string, internalError?: CrtError) {
    return {
        type: type,
        description: description,
        internalError: internalError
    };
}