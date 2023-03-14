/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */

import {CrtError, eventstream, io} from 'aws-crt';
import {EventEmitter, once} from 'events';

export enum RpcErrorType {
    SerializationError,
    DeserializationError,
    ProtocolError,
    InternalError,
    ValidationError,
    ClientStateError,
    NetworkError
};

export interface RpcError {
    type: RpcErrorType;
    description: string;
    internalError?: CrtError;
}

function createRpcError(type: RpcErrorType, description: string, internalError?: CrtError) {
    return {
        type: type,
        description: description,
        internalError: internalError
    };
}

export type RpcErrorListener = (eventData: RpcError) => void;

type RpcMessageTransformation = (message: eventstream.Message) => Promise<eventstream.Message>;

interface RpcClientConfig {
    hostName: string;
    port: number;
    socketOptions?: io.SocketOptions;
    tlsCtx?: io.ClientTlsContext;

    connectTransform?: RpcMessageTransformation;

    connectTimeoutMs?: number;
};

enum ClientState {
    None,
    Connecting,
    Connected,
    Finished,
    Closed
};

/*
 Invariants:

 (1) All exceptions are RpcErrors
 (2) Exceptions surfacing from the CRT are wrapped as RpcErrors
 (3) RpcClient disconnection event once and only once after a successful connect
 */

/*
  ToRemember:
      emitDisconnectOnClose a pattern to push down to the CRT?
      event name consistency
      cache crt emitted event data for later emission?
 */
const DEFAULT_CONNECT_TIMEOUT_MS : number = 5000;

export class RpcClient extends EventEmitter {

    private emitDisconnectOnClose : boolean;
    private state: ClientState;
    private connection: eventstream.ClientConnection;
    private unclosedOperations? : Set<OperationBase>;

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
            this.connection = new eventstream.ClientConnection(connectionOptions);
        } catch (e) {
            throw createRpcError(RpcErrorType.InternalError, "Failed to create eventstream connection", e as CrtError);
        }

        // set up connection event listeners
        this.connection.on('disconnection', (eventData: eventstream.DisconnectionEvent) => {
            if (this.state != ClientState.Closed) {
                this.state = ClientState.Finished;

                setImmediate(() => {
                    setImmediate(() => { this.close(); });
                });
            }
        });
    }

    static new(config: RpcClientConfig) : RpcClient {
        return new RpcClient(config);
    }

    async connect() : Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
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
                this.state = ClientState.Finished;
                reject(createRpcError(RpcErrorType.InternalError, "Failed to establish eventstream RPC connection", err as CrtError));
                setImmediate(() => { this.close(); });
                return;
            }

            if (!connack || !RpcClient.isValidConnack(connack)) {
                this.state = ClientState.Finished;
                reject(createRpcError(RpcErrorType.ProtocolError, "Failed to establish eventstream RPC connection - invalid connack"));
                setImmediate(() => { this.close(); });
                return;
            }

            if (this.state != ClientState.Connecting) {
                return;
            }

            this.emitDisconnectOnClose = true;
            this.state = ClientState.Connected;
            resolve();
        });
    }

    isConnected() : boolean {
        return this.state == ClientState.Connected;
    }

    registerUnclosedOperation(operation: OperationBase) {
        if (!this.isConnected() || !this.unclosedOperations) {
            throw createRpcError(RpcErrorType.ClientStateError, "Operation registration only allowed when the client is connected");
        }

        this.unclosedOperations.add(operation);
    }

    removeUnclosedOperation(operation: OperationBase) {
        if (this.unclosedOperations) {
            this.unclosedOperations.delete(operation);
        }
    }

    close() {
        if (this.state == ClientState.Closed) {
            return;
        }

        if (this.emitDisconnectOnClose) {
            this.emitDisconnectOnClose = false;
            setImmediate(() => { this.emit('disconnection', {}); });
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

    newStream() : eventstream.ClientStream {
        if (this.state != ClientState.Connected) {
            throw createRpcError(RpcErrorType.ClientStateError, "New streams may only be created while the client is connected");
        }

        try {
            let stream: eventstream.ClientStream = this.connection.newStream();
            return stream;
        } catch (e) {
            throw createRpcError(RpcErrorType.InternalError, "??", e as CrtError);
        }
    }

    /**
     * Event emitted when the client's underlying network connection is ended.
     *
     * Listener type: {@link DisconnectionListener}
     *
     * @event
     */
    static DISCONNECTION : string = 'disconnection';

    on(event: 'disconnection', listener: eventstream.DisconnectionListener): this;

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

enum OperationState {
    None,
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

        if (this.emitEndedOnClose) {
            this.emitEndedOnClose = false;
            ??;
        }

        let shouldTerminateStream : boolean = this.state == OperationState.Activated;

        this.state = OperationState.Closed;
        this.janitor = undefined;

        this.operationConfig.client.removeUnclosedOperation(this);

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
                    this.emit('error', ??);
                });
            }
        }

        setImmediate(() => { this.stream.close(); });
    }

    async activate(message: eventstream.Message) : Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (this.state != OperationState.None) {
                reject(createRpcError(RpcErrorType.ClientStateError, "Eventstream operations may only have activate() invoked once"));
                return;
            }

            let endedPromise = once(this.stream, eventstream.ClientStream.STREAM_ENDED);
            let activatePromise = this.stream.activate({
                    operation : this.operationConfig.name,
                    message : message
                });

            let bothFinished = Promise.all([endedPromise, activatePromise]);
            this.janitor = bothFinished.then();

            try {
                await activatePromise;
            } catch (e) {
                reject(createRpcError(RpcErrorType.InternalError, "", e as CrtError));
                ??;
                return;
            }

            this.emitEndedOnClose = true;
            resolve();
        });
    }

    /**
     * TODO
     *
     * @event
     */
    static OPERATION_ENDED : string = 'ended';

    on(event: 'ended', listener: eventstream.DisconnectionListener): this;

    on(event: string | symbol, listener: (...args: any[]) => void): this {
        super.on(event, listener);
        return this;
    }
}

export interface RequestResponseOperationConfig<RequestType, ResponseType> {
    requestValidater: (request: RequestType) => void;
    requestSerializer: (request: RequestType) => eventstream.Message;
    responseDeserializer: (message: eventstream.Message) => ResponseType;
}

export class RequestResponseOperation<RequestType, ResponseType> extends OperationBase {

    constructor(operationConfig: OperationConfig, private requestResponseConfig: RequestResponseOperationConfig<RequestType, ResponseType>) {
        super(operationConfig);
    }
}

export interface StreamingOperationConfig<RequestType, ResponseType, MessageType> {
    requestValidater: (request: RequestType) => void;
    requestSerializer: (request: RequestType) => eventstream.Message;
    responseDeserializer: (message: eventstream.Message) => ResponseType;
    messageDeserializer: (message: eventstream.Message) => MessageType;
}

export class StreamingOperation<RequestType, ResponseType, MessageType> extends OperationBase {
    constructor(operationConfig: OperationConfig, private streamingConfig: StreamingOperationConfig<RequestType, ResponseType, MessageType>) {
        super(operationConfig);
    }
}