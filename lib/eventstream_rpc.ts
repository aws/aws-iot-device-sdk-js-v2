/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */

/**
 * @packageDocumentation
 * @module eventstream_rpc
 */


import {CrtError, eventstream, io, cancel} from 'aws-crt';
import {EventEmitter} from 'events';
import {toUtf8} from "@aws-sdk/util-utf8-browser";

/**
 * @internal
 *
 * Service model data about an individual operation
 */
export interface EventstreamRpcServiceModelOperation {
    requestShape: string,
    responseShape: string,
    outboundMessageShape?: string,
    inboundMessageShape?: string,
    errorShapes: Set<string>
}

/**
 * @internal
 *
 * Normalizers strip unmodeled data from a value (by making a new value with only modeled data)
 */
export type ShapeNormalizer = (value: any) => any;

/**
 * @internal
 *
 * Validators throw errors if modeled data is of the wrong type, is missing when required, or violates any
 * other checkable protocol constraint we can think of.
 *
 * Validation is only performed on input shapes.  Output shapes must be left alone in order to support
 * service evolution indepedent of client.
 */
export type ShapeValidator = (value: any) => void;

/**
 * @internal
 *
 * Deserializers take a raw eventstream message and return a modeled shape.  If a modeled shape could not be
 * produced, an error is thrown.
 */
export type ShapeDeserializer = (message: eventstream.Message) => any;

/**
 * @internal
 *
 * Serializers take a modeled shape and return an eventstream message.  The assumption is that once a value
 * has been both validated and normalized, serializing the final value will result in a message that
 * an eventstream_rpc server can deserialize without error.
 */
export type ShapeSerializer = (value: any) => eventstream.Message;

/**
 * @internal
 *
 * Collection of service-specific utility functions and definitions that enable an eventstream RPC client to
 * correctly perform operations
 */
export interface EventstreamRpcServiceModel {

    normalizers: Map<string, ShapeNormalizer>;

    validators: Map<string, ShapeValidator>;

    deserializers: Map<string, ShapeDeserializer>;

    serializers: Map<string, ShapeSerializer>;

    operations: Map<string, EventstreamRpcServiceModelOperation>;

    enums: Map<string, Set<string>>;
}

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
     * An error occurred during the connect-connack handshake between client and server.  Usually this means
     * the connect was not accepted by the server and thus hints at an authentication problem.
     */
    HandshakeError,

    /**
     * An error that isn't classifiable as one of the other RpcErrorType values.
     */
    InternalError,

    /**
     * An error occurred due to an attempt to invoke an API while the target operation or client is not in the
     * right state to perform the API.
     */
    ClientStateError,

    /**
     * An error occurred ostensibly due to an underlying networking failure.
     */
    NetworkError,

    /**
     * An error occurred where the underlying transport was shut down unexpectedly.
     */
    InterruptionError,

    /**
     * Invalid data was passed into the RPC client.
     */
    ValidationError,

    /**
     * A formally-modeled error sent from server to client
     */
    ServiceError
}

/**
 * @internal
 */
interface RpcErrorModel {
    type: RpcErrorType;

    description: string;

    internalError?: CrtError;

    serviceError?: any;
};

/**
 * Wrapper type for all exceptions thrown by rpc clients and operations.  This includes rejected promises.
 *
 * The intention is for this data model to help users make better decisions in the presence of errors.  Not all errors
 * are fatal/terminal, but JS doesn't really give a natural way to classify or conditionally react to general errors.
 */
export class RpcError extends Error {

    /** The error's broad category */
    readonly type: RpcErrorType;

    /** Plain language description of the error */
    readonly description: string;

    /** Optional inner/triggering error that can contain additional context. */
    readonly internalError?: CrtError;

    /** Optional service-specific modelled error data */
    readonly serviceError?: any;

    /** @internal */
    constructor(model: RpcErrorModel) {
        super(model.description);

        this.type = model.type;
        this.description = model.description;
        if (model.internalError) {
            this.internalError = model.internalError;
        }
        if (model.serviceError) {
            this.serviceError = model.serviceError;
        }
    }
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
 * Configuration for the (potentially) asynchronous message transformation applied to the CONNECT message
 * sent by the client once the underlying transport connection has been completed.
 */
export interface RpcMessageTransformationOptions {

    /**
     * (CONNECT) message to transform
     */
    message: eventstream.Message,

    /**
     * Optional controller that allows for cancellation of the asynchronous process.  The transformation implementation
     * is responsible for respecting this.
     */
    cancelController?: cancel.ICancelController
}

/**
 * Type signature for an asynchronous function that can transform eventstream messages.  Used to allow client
 * implementations to modify the initial eventstream connect message.
 */
export type RpcMessageTransformation = (options: RpcMessageTransformationOptions) => Promise<eventstream.Message>;


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
}

/**
 * Checks an RPC Client configuration structure and throws an exception if there is a problem with one of the
 * required properties.  Does explicit type checks in spite of typescript to validate even when used from a
 * pure Javascript project.
 *
 * @param config RPC client configuration to validate
 */
export function validateRpcClientConfig(config: RpcClientConfig) {
    if (!config) {
        throw createRpcError(RpcErrorType.ValidationError, "Eventstream RPC client configuration is undefined");
    }

    if (!config.hostName) {
        throw createRpcError(RpcErrorType.ValidationError, "Eventstream RPC client configuration must have a valid host name");
    }

    if (typeof config.hostName !== 'string') {
        throw createRpcError(RpcErrorType.ValidationError, "Eventstream RPC client configuration host name must be a string");
    }

    if (config.port === undefined || config.port === null) {
        throw createRpcError(RpcErrorType.ValidationError, "Eventstream RPC client configuration must have a valid port");
    }

    if (typeof config.port !== 'number' || !Number.isSafeInteger(config.port as number) || config.port < 0 || config.port > 65535) {
        throw createRpcError(RpcErrorType.ValidationError, "Eventstream RPC client configuration host name must be 16-bit integer");
    }
}

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
}

/**
 * Configuration options for the RPC client's connect step
 */
export interface RpcClientConnectOptions {

    /**
     * Optional controller that allows the user to cancel the asynchronous connect process.
     *
     * For example:
     *
     * ```
     * setTimeout(() => {controller.cancel();}, 30000);
     * await client.connect({
     *    cancelController: controller
     * });
     * ```
     *
     * would apply a 30 second timeout to the client's connect call.
     */
    cancelController?: cancel.ICancelController;
}

/**
 * Eventstream RPC client - uses an underlying eventstream connection to implement the eventstream RPC protocol
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
     * the transport-level connection is successfully established and the eventstream handshake completes without
     * error.
     *
     * Returns a promise that is resolved with additional context on a successful connection, otherwise rejected.
     *
     * connect() may only be called once.
     */
    async connect(options?: RpcClientConnectOptions) : Promise<SuccessfulConnectionResult> {
        return new Promise<SuccessfulConnectionResult>(async (resolve, reject) => {
            if (this.state != ClientState.None) {
                reject(createRpcError(RpcErrorType.ClientStateError, "RpcClient.connect() can only be called once"));
                return;
            }

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
                await this.connection.connect({
                    cancelController: options?.cancelController
                });

                // create, transform, and send the connect
                let connectMessage: eventstream.Message = {
                    type: eventstream.MessageType.Connect
                };

                if (this.config.connectTransform) {
                    connectMessage = await this.config.connectTransform({
                        message: connectMessage,
                        cancelController: options?.cancelController
                    });
                }

                this._applyEventstreamRpcHeadersToConnect(connectMessage);

                let connackPromise : Promise<eventstream.Message> = cancel.newCancellablePromiseFromNextEvent({
                    cancelController: options?.cancelController,
                    emitter : this.connection,
                    eventName : eventstream.ClientConnection.PROTOCOL_MESSAGE,
                    eventDataTransformer: (eventData: any) => { return (eventData as eventstream.MessageEvent).message; },
                    cancelMessage: "Eventstream connect() cancelled by user request"
                });

                await this.connection.sendProtocolMessage({
                    message: connectMessage,
                    cancelController: options?.cancelController
                });

                // wait for the conn ack or cancel
                connack = await connackPromise;
            } catch (err) {
                if (this.state == ClientState.Connecting) {
                    this.state = ClientState.Finished;
                    setImmediate(() => { this.close(); });
                }

                reject(createRpcError(RpcErrorType.InternalError, "Failed to establish eventstream RPC connection", err as CrtError));
                return;
            }

            if (this.state != ClientState.Connecting) {
                reject(createRpcError(RpcErrorType.InternalError, "Eventstream RPC connection attempt interrupted"));
                return;
            }

            if (!connack || !RpcClient.isValidConnack(connack)) {
                this.state = ClientState.Finished;
                reject(createRpcError(RpcErrorType.HandshakeError, "Failed to establish eventstream RPC connection - invalid connack"));
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
    async close() : Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            try {
                if (this.state == ClientState.Closed) {
                    resolve();
                    return;
                }

                this.state = ClientState.Closed;

                if (this.emitDisconnectOnClose) {
                    this.emitDisconnectOnClose = false;
                    if (!this.disconnectionReason) {
                        this.disconnectionReason = new CrtError("User-initiated disconnect");
                    }

                    setImmediate(() => {
                        this.emit('disconnection', {reason: this.disconnectionReason});
                    });
                }

                if (this.unclosedOperations) {
                    let unclosedOperations: Set<OperationBase> = this.unclosedOperations;
                    this.unclosedOperations = undefined;

                    for (const operation of unclosedOperations) {
                        await operation.close();
                    }
                }

                this.connection.close();
                resolve();
            } catch (err) {
                reject(err);
            }
        });
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

    private _applyEventstreamRpcHeadersToConnect(connectMessage : eventstream.Message) {
        if (!connectMessage.headers) {
            connectMessage.headers = [];
        }

        connectMessage.headers.push(
            eventstream.Header.newString(':version', '0.1.0')
        );
    }
}

/**
 * Event data wrapper for the result of activating an operation
 */
export interface OperationActivationResult {
}

/**
 * @internal a rough mirror of the internal stream binding state.
 */
enum OperationState {
    None,
    Activating,
    Activated,
    Ended,
    Closed
}

/**
 * User-facing operation configuration
 */
export interface OperationOptions {

    /**
     * Optional cancel controller to cancel the sending of eventstream messages with.  Cancellation includes both
     * operation activation and sending of streaming messages.  It does not affect a streaming operation's state.
     */
    cancelController?: cancel.ICancelController;

    /**
     * Disables client-side data validation.  Useful for testing how the client handles errors from the service.
     */
    disableValidation? : boolean;
}

/**
 * @internal
 *
 * Internal eventstream RPC operation configuration
 */
export interface OperationConfig {
    /**
     * Service-prefixed operation name.  Ex: `awstest#EchoMessage`
     */
    name: string;

    /**
     * RPC client to use to perform the operation
     */
    client: RpcClient;

    /**
     * Additional user-supplied configuration
     */
    options: OperationOptions;
}

/**
 * @internal
 *
 * Common eventstream RPC operation class that includes self-cleaning functionality (via the RPC client's
 * unclosed operations logic)
 */
class OperationBase extends EventEmitter {

    private state : OperationState;
    private stream : eventstream.ClientStream;


    constructor(readonly operationConfig: OperationConfig) {
        super();
        this.state = OperationState.None;
        this.stream = operationConfig.client.newStream();

        operationConfig.client.registerUnclosedOperation(this);
    }

    /**
     * Shuts down the operation's stream binding, with an optional flush of a termination message to the server.
     * Also removes the operation from the associated client's unclosed operation set.
     */
    async close() {
        return new Promise<void>(async (resolve, reject) => {
            if (this.state == OperationState.Closed) {
                resolve();
                return;
            }

            this.operationConfig.client.removeUnclosedOperation(this);

            let shouldTerminateStream: boolean = this.state == OperationState.Activated;

            this.state = OperationState.Closed;

            if (shouldTerminateStream) {
                try {
                    await this.stream.sendMessage({
                        message: {
                            type: eventstream.MessageType.ApplicationMessage,
                            flags: eventstream.MessageFlags.TerminateStream
                        }
                    });
                } catch (e) {
                    // an exception generated from trying to gently end the stream should not propagate
                }
            }

            setImmediate(() => {
                this.stream.close();
            });

            resolve();
        });
    }

    /**
     * Activates an eventstream RPC operation
     *
     * @param message eventstream message to send as part of stream activation
     */
    async activate(message: eventstream.Message) : Promise<OperationActivationResult> {
        return new Promise<OperationActivationResult>(async (resolve, reject) => {
            if (this.state != OperationState.None) {
                reject(createRpcError(RpcErrorType.ClientStateError, "Eventstream operations may only have activate() invoked once"));
                return;
            }

            this.state = OperationState.Activating;

            try {
                let activatePromise = this.stream.activate({
                    operation : this.operationConfig.name,
                    message : message,
                    cancelController : this.operationConfig.options.cancelController
                });

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
            resolve({});
        });
    }

    /**
     * @return true if the stream is currently active and ready-to-use, false otherwise.
     */
    isActive() : boolean {
        return this.state == OperationState.Activated;
    }

    /**
     * @return the operation's underlying event stream binding object
     */
    getStream() : eventstream.ClientStream { return this.stream; }

    /**
     * Set this operation state to be "Ended" so that closing the operation will not send a terminate message.
     */
    setStateEnded() {
        this.state = OperationState.Ended;
    }
}

/**
 * Implementation for request-response eventstream RPC operations.
 */
export class RequestResponseOperation<RequestType, ResponseType> extends EventEmitter {

    private operation : OperationBase;

    /**
     * @internal
     *
     * @param operationConfig
     * @param serviceModel
     */
    constructor(private operationConfig: OperationConfig, private serviceModel: EventstreamRpcServiceModel) {
        if (!serviceModel.operations.has(operationConfig.name)) {
            throw createRpcError(RpcErrorType.InternalError, `service model has no operation named ${operationConfig.name}`);
        }

        super();

        this.operation = new OperationBase(this.operationConfig);
    }

    /**
     * Performs the request-response interaction
     *
     * @param request modeled request data
     */
    async activate(request: RequestType) : Promise<ResponseType> {
        let resultPromise : Promise<ResponseType> = new Promise<ResponseType>(async (resolve, reject) => {
            try {
                let stream : eventstream.ClientStream = this.operation.getStream();

                let responsePromise : Promise<eventstream.Message> = cancel.newCancellablePromiseFromNextEvent({
                    cancelController: this.operationConfig.options.cancelController,
                    emitter : stream,
                    eventName : eventstream.ClientStream.MESSAGE,
                    eventDataTransformer: (eventData: any) => { return (eventData as eventstream.MessageEvent).message; },
                    cancelMessage: "Eventstream execute() cancelled by user request"
                });


                if (!this.operationConfig.options.disableValidation) {
                    validateRequest(this.serviceModel, this.operationConfig.name, request);
                }

                let requestMessage: eventstream.Message = serializeRequest(this.serviceModel, this.operationConfig.name, request);
                await this.operation.activate(requestMessage);

                let message : eventstream.Message = await responsePromise;

                // If the server terminated the stream, then set the operation to be ended immediately
                if ((message.flags ?? 0) & eventstream.MessageFlags.TerminateStream) {
                    this.operation.setStateEnded();
                }
                let response : ResponseType = deserializeResponse(this.serviceModel, this.operationConfig.name, message);

                resolve(response);
            } catch (e) {
                reject(e);
            }
        });

        let autoClosePromise : Promise<ResponseType> = resultPromise.finally(async () => { await this.operation.close(); });

        return autoClosePromise;
    }
}

/**
 * Event listener type signature for listening to streaming operation error events.  These occcur after
 * successful activation when the operation receives a modeled error or is unable to deserialize an inbound message
 * into a modeled type.
 */
export type StreamingRpcErrorListener = (eventData: RpcError) => void;

/**
 * Event data emitted when a streaming operation is ended.
 */
export interface StreamingOperationEndedEvent {
}

/**
 * Event listener type signature for listening to ended events for streaming operations
 */
export type StreamingOperationEndedListener = (eventData: StreamingOperationEndedEvent) => void;

/**
 * Implementation of a bi-direction streaming operation.
 *
 * TODO: may change slightly for uni-directional operations
 */
export class StreamingOperation<RequestType, ResponseType, OutboundMessageType, InboundMessageType> extends EventEmitter {
    private operation : OperationBase;
    private responseHandled : boolean;

    /**
     * @internal
     *
     * @param request
     * @param operationConfig
     * @param serviceModel
     */
    constructor(private request: RequestType, private operationConfig: OperationConfig, private serviceModel: EventstreamRpcServiceModel) {
        if (!serviceModel.operations.has(operationConfig.name)) {
            throw createRpcError(RpcErrorType.InternalError, `service model has no operation named ${operationConfig.name}`);
        }

        if (!operationConfig.options.disableValidation) {
            validateRequest(serviceModel, operationConfig.name, request);
        }

        super();

        this.operation = new OperationBase(operationConfig);
        this.responseHandled = false;
    }

    /**
     * Activates a streaming operation
     */
    async activate() : Promise<ResponseType> {
        return new Promise<ResponseType>(async (resolve, reject) => {
            try {
                let stream : eventstream.ClientStream = this.operation.getStream();
                stream.addListener(eventstream.ClientStream.MESSAGE, this._onStreamMessageEvent.bind(this));
                stream.addListener(eventstream.ClientStream.ENDED, this._onStreamEndedEvent.bind(this));

                let responsePromise : Promise<eventstream.Message> = cancel.newCancellablePromiseFromNextEvent({
                    cancelController: this.operationConfig.options.cancelController,
                    emitter : stream,
                    eventName : eventstream.ClientStream.MESSAGE,
                    eventDataTransformer: (eventData: any) => {
                        this.responseHandled = true;
                        return (eventData as eventstream.MessageEvent).message;
                        },
                    cancelMessage: "Eventstream execute() cancelled by user request"
                });


                let requestMessage: eventstream.Message = serializeRequest(this.serviceModel, this.operationConfig.name, this.request);
                await this.operation.activate(requestMessage);

                let message : eventstream.Message = await responsePromise;
                let response : ResponseType = deserializeResponse(this.serviceModel, this.operationConfig.name, message);

                // If the server terminated the stream, then set the operation to be ended immediately
                if ((message.flags ?? 0) & eventstream.MessageFlags.TerminateStream) {
                    this.operation.setStateEnded();
                    // Server hung up on us. Immediately cleanup the operation state.
                    // Do this before resolving the promise so that any user-initiated
                    // requests will see the correct state, which is that the operation is closed.
                    await this.close();
                }

                resolve(response);
            } catch (e) {
                await this.close();
                reject(e);
            }
        });
    }

    /**
     * Sends an outbound message on a streaming operation, if the operation allows outbound streaming messages.
     *
     * @param message modeled data to send
     */
    async sendMessage(message: OutboundMessageType) : Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            try {
                if (!doesOperationAllowOutboundMessages(this.serviceModel, this.operationConfig.name)) {
                    throw createRpcError(RpcErrorType.ValidationError, `Operation '${this.operationConfig.name}' does not allow outbound streaming messages.`);
                }

                if (!this.operationConfig.options.disableValidation) {
                    validateOutboundMessage(this.serviceModel, this.operationConfig.name, message);
                }

                let serializedMessage: eventstream.Message = serializeOutboundMessage(this.serviceModel, this.operationConfig.name, message);
                let stream: eventstream.ClientStream = this.operation.getStream();
                await stream.sendMessage({
                    message: serializedMessage,
                    cancelController : this.operationConfig.options.cancelController
                });
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     * Asynchronous close method for the underlying event stream.  The user should call this function when finished
     * with the operation in order to clean up native resources.  Failing to do so will cause the native resources
     * to persist until the client is closed.  If the client is never closed then every unclosed operation will leak.
     */
    async close() : Promise<void> {
        return this.operation.close();
    }

    /**
     * Event emitted when the operation's stream has ended.  Only emitted if the stream was successfully activated.
     *
     * Listener type: {@link StreamingOperationEndedListener}
     *
     * @event
     */
    static ENDED : string = 'ended';

    /**
     * Event emitted when an incoming eventstream message resulted in some kind of error.  Usually this is either
     * a modeled service error or a deserialization error for messages that cannot be mapped to the service model.
     *
     * Listener type: {@link StreamingRpcErrorListener}
     *
     * @event
     */
    static STREAM_ERROR : string = 'streamError';

    /**
     * Event emitted when an incoming eventstream message is successfully deserialized into a modeled inbound streaming
     * shape type.
     *
     * @event
     */
    static MESSAGE : string = 'message';

    on(event: 'ended', listener: StreamingOperationEndedListener): this;

    on(event: 'streamError', listener: StreamingRpcErrorListener): this;

    on(event: 'message', listener: (message: InboundMessageType) => void): this;

    on(event: string | symbol, listener: (...args: any[]) => void): this {
        super.on(event, listener);
        return this;
    }

    private _onStreamMessageEvent(eventData: eventstream.MessageEvent) {
        if (this.responseHandled) {
            try {
                let streamingMessage: InboundMessageType = deserializeInboundMessage(this.serviceModel, this.operationConfig.name, eventData.message);

                setImmediate(() => {
                    this.emit(StreamingOperation.MESSAGE, streamingMessage);
                });
            } catch (err) {
                setImmediate(() => { this.emit(StreamingOperation.STREAM_ERROR, err as RpcError); });
            }
        }
    }

    private _onStreamEndedEvent(eventData: eventstream.StreamEndedEvent) {
        setImmediate(async () => {
            this.emit(StreamingOperation.ENDED, {});
            await this.close();
        })
    }
}

/**
 * Utility function to create RpcError errors
 *
 * @param type type of error
 * @param description longer description of error
 * @param internalError optional CrtError that caused this error
 * @param serviceError optional modeled eventstream RPC service error that triggered this error
 *
 * @return a new RpcError object
 */
export function createRpcError(type: RpcErrorType, description: string, internalError?: CrtError, serviceError?: any) {
    return new RpcError({
        type: type,
        description: description,
        internalError: internalError,
        serviceError: serviceError
    });
}

const SERVICE_MODEL_TYPE_HEADER_NAME : string = 'service-model-type';
const CONTENT_TYPE_HEADER_NAME : string = ':content-type';
const CONTENT_TYPE_PLAIN_TEXT : string = 'text/plain';

function getEventStreamMessageHeaderValueAsString(message: eventstream.Message, headerName : string) : string | undefined {
    if (!message.headers) {
        return undefined;
    }

    try {
        for (const header of message.headers) {
            if (header.name === headerName) {
                return header.asString();
            }
        }
    } catch (err) {
        return undefined;
    }

    return undefined;
}

type OperationShapeSelector = (operation : EventstreamRpcServiceModelOperation) => string | undefined;

function validateShape(model: EventstreamRpcServiceModel, shapeName: string, shape: any) : void {
    if (!shape) {
        throw createRpcError(RpcErrorType.ValidationError, `Shape of type '${shapeName}' is undefined`);
    }

    let validator = model.validators.get(shapeName);
    if (!validator) {
        throw createRpcError(RpcErrorType.ValidationError, `No shape named '${shapeName}' exists in the service model`);
    }

    validator(shape);
}

function validateOperationShape(model: EventstreamRpcServiceModel, operationName: string, shape: any, shapeSelector : OperationShapeSelector) : void {
    let operation = model.operations.get(operationName);
    if (!operation) {
        throw createRpcError(RpcErrorType.InternalError, `No operation named '${operationName}' exists in the service model`);
    }

    let selectedShape : string | undefined = shapeSelector(operation);
    if (!selectedShape) {
        throw createRpcError(RpcErrorType.ValidationError, `Operation '${operationName}' does not have a defined selection shape`);
    }

    return validateShape(model, selectedShape, shape);
}
function validateRequest(model: EventstreamRpcServiceModel, operationName: string, request: any) : void {
    validateOperationShape(model, operationName, request, (operation : EventstreamRpcServiceModelOperation) => { return operation.requestShape; });
}

function validateOutboundMessage(model: EventstreamRpcServiceModel, operationName: string, message: any) : void {
    validateOperationShape(model, operationName, message, (operation : EventstreamRpcServiceModelOperation) => { return operation.outboundMessageShape; });
}

function doesOperationAllowOutboundMessages(model: EventstreamRpcServiceModel, operationName: string) : boolean {
    let operation = model.operations.get(operationName);
    if (!operation) {
        throw createRpcError(RpcErrorType.InternalError, `No operation named '${operationName}' exists in the service model`);
    }

    return operation.outboundMessageShape !== undefined;
}

function serializeMessage(model: EventstreamRpcServiceModel, operationName: string, message: any, shapeSelector: OperationShapeSelector) : eventstream.Message {
    let operation = model.operations.get(operationName);
    if (!operation) {
        throw createRpcError(RpcErrorType.InternalError, `No operation named '${operationName}' exists in the service model`);
    }

    let shapeName : string | undefined = shapeSelector(operation);
    if (!shapeName) {
        throw createRpcError(RpcErrorType.InternalError, `Operation '${operationName}' does not have a defined selection shape`);
    }

    let serializer = model.serializers.get(shapeName);
    if (!serializer) {
        throw createRpcError(RpcErrorType.InternalError, `No top-level shape serializer for '${shapeName}' exists in the service model`);
    }

    return serializer(message);
}

function serializeRequest(model: EventstreamRpcServiceModel, operationName: string, request: any) : eventstream.Message {
    return serializeMessage(model, operationName, request, (operation : EventstreamRpcServiceModelOperation) => { return operation.requestShape; });
}

function serializeOutboundMessage(model: EventstreamRpcServiceModel, operationName: string, message: any) : eventstream.Message {
    return serializeMessage(model, operationName, message, (operation : EventstreamRpcServiceModelOperation) => { return operation.outboundMessageShape; });
}

function throwResponseError(model: EventstreamRpcServiceModel, errorShapes: Set<string>, shapeName: string | undefined, message: eventstream.Message) : void {
    if (!shapeName) {
        if (message.type != eventstream.MessageType.ApplicationMessage) {
            if (message.type == eventstream.MessageType.ApplicationError) {
                let contentType : string | undefined = getEventStreamMessageHeaderValueAsString(message, CONTENT_TYPE_HEADER_NAME);
                if (contentType && contentType === CONTENT_TYPE_PLAIN_TEXT) {
                    let payloadAsString : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));;
                    throw createRpcError(RpcErrorType.InternalError, `Eventstream (response) message was not a modelled shape.  Plain text payload is: '${payloadAsString}'`);
                }
            }
        }

        throw createRpcError(RpcErrorType.InternalError, "Eventstream (response) message was not an application message");
    }

    let isErrorShape : boolean = errorShapes.has(shapeName);
    let serviceError : any | undefined = undefined;
    if (isErrorShape) {
        let errorDeserializer = model.deserializers.get(shapeName);
        if (errorDeserializer) {
            serviceError = errorDeserializer(message);
        }
    }

    let errorType : RpcErrorType = serviceError ? RpcErrorType.ServiceError : RpcErrorType.InternalError;
    let errorDescription : string = serviceError ? "Eventstream RPC request failed.  Check serviceError property for details." : `Unexpected response shape received: '${shapeName}'`
    let rpcError : RpcError = createRpcError(errorType, errorDescription, undefined, serviceError);

    throw rpcError;
}

function deserializeMessage(model: EventstreamRpcServiceModel, operationName: string, message: eventstream.Message, shapeSelector : OperationShapeSelector) {
    let operation = model.operations.get(operationName);
    if (!operation) {
        throw createRpcError(RpcErrorType.InternalError, `No operation named '${operationName}' exists in the service model`);
    }

    let messageShape : string | undefined = getEventStreamMessageHeaderValueAsString(message, SERVICE_MODEL_TYPE_HEADER_NAME);
    let operationShape : string | undefined = shapeSelector(operation);
    if (!messageShape || messageShape !== operationShape || !operationShape) {
        throwResponseError(model, operation.errorShapes, messageShape, message);
        return;
    }

    let deserializer = model.deserializers.get(operationShape);
    if (!deserializer) {
        throw createRpcError(RpcErrorType.InternalError, `No top-level shape deserializer for '${operationShape}' exists in the service model`);
    }

    let response = deserializer(message);

    return response;
}

function deserializeResponse(model: EventstreamRpcServiceModel, operationName: string, message: eventstream.Message) : any {
    return deserializeMessage(model, operationName, message, (operation : EventstreamRpcServiceModelOperation) => { return operation.responseShape;});
}

function deserializeInboundMessage(model: EventstreamRpcServiceModel, operationName: string, message: eventstream.Message) : any {
    return deserializeMessage(model, operationName, message, (operation : EventstreamRpcServiceModelOperation) => { return operation.inboundMessageShape;});
}

