/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */

import { eventstream, io, CrtError } from 'aws-crt';
import { EventEmitter } from 'events';

export enum RpcErrorType {
    SerializationError,
    DeserializationError,
    ProtocolError,
    InternalError,
    ValidationError,
};

export interface RpcError {
    type: RpcErrorType;
    description?: string;
    innerError?: CrtError;
}

export type RpcErrorListener = (eventData: RpcError) => void;

type MessageTransformation = (message: eventstream.Message) => eventstream.Message;

interface RpcClientConfig {
    host: string;
    port: number;
    socketOptions?: io.SocketOptions;
    tlsCtx?: io.ClientTlsContext;

    connectTransform?: MessageTransformation;
};

enum ClientState {
    None,
    Connecting,
    Connected,
    Finished,
    Closed
};

class RpcClient extends EventEmitter {

    private state: ClientState;
    private connection: eventstream.Connection;
    private unclosedOperations? : Set<OperationBase>;

    private constructor(private config: RpcClientConfig) {
        super();
        this.unclosedOperations = new Set<OperationBase>();
        this.state = ClientState.None;

        let connectionOptions : eventstream.ClientConnectionOptions = {
            host: config.host,
            port: config.port,
            socketOptions: config.socketOptions,
            tlsCtx: config.tlsCtx
        };

        this.connection = new eventstream.Connection(connectionOptions);

        // set up connection event listeners
        this.connection.on(eventstream.ClientConnection.DISCONNECTION, (eventData: eventstream.DisconnectionEvent) => {
            if (this.state != ClientState.Closed) {
                this.state = ClientState.Finished;
            }

            setImmediate(() => this.emit(RpcClient.DISCONNECTION, eventData));
        });
    }

    static new(config: RpcClientConfig) : RpcClient {
        return new RpcClient(config);
    }

    connect() : Promise<void> {
        let connectPromise : Promise<void> = new Promise<void>(async (resolve, reject) => {
            if (this.state != ClientState.None) {
                reject(new CrtError("??"));
                return;
            }

            this.state = ClientState.Connecting;

            try {
                await this.connection.connect();

                // create, transform, and send the connect

                // wait for the conn ack

                this.state = ClientState.Connected;
                resolve();
            } catch (err) {
                this.state = ClientState.Finished;
                reject(err);
            }
        });

        return connectPromise;
    }

    isConnected() : boolean {
        return this.state == ClientState.Connected;
    }

    registerUnclosedOperation(operation: OperationBase) {
        if (!this.isConnected() || !this.unclosedOperations) {
            throw new CrtError("??");
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
            throw new CrtError("??");
        }

        return this.connection.newStream();
    }

    /**
     * Event emitted when the client is closed for any reason.
     *
     * Listener type: {@link DisconnectionListener}
     *
     * @event
     */
    static DISCONNECTION : string = 'disconnection';

    /**
     * Event emitted when an error occurs
     *
     * Listener type: {@link RpcErrorListener}
     *
     * @event
     */
    static ERROR : string = 'error';

    on(event: 'disconnection', listener: eventstream.DisconnectionListener): this;

    on(event: 'error', listener: RpcErrorListener): this;

    on(event: string | symbol, listener: (...args: any[]) => void): this {
        super.on(event, listener);
        return this;
    }
}

interface OperationConfig {
    name: string;
};

class OperationBase {

    constructor(private config: OperationConfig) {

    }

    close() {}

    getName() : string { return this.config.name; }
}

interface RequestResponseOperationConfig<RequestType, ResponseType> {
    requestValidater: (request: RequestType) => void;
    requestSerializer: (request: RequestType) => eventstream.Message;
    responseDeserializer: (message: eventstream.Message) => ResponseType;
}

class RequestResponseOperation<RequestType, ResponseType> extends OperationBase {

    constructor(baseConfig: OperationConfig, private config: RequestResponseOperationConfig<RequestType, ResponseType>) {
        super(baseConfig);
    }
}

interface StreamingOperationConfig<RequestType, ResponseType, MessageType> {
    requestValidater: (request: RequestType) => void;
    requestSerializer: (request: RequestType) => eventstream.Message;
    responseDeserializer: (message: eventstream.Message) => ResponseType;
    messageDeserializer: (message: eventstream.Message) => MessageType;
}

class StreamingOperation<RequestType, ResponseType, MessageType> extends OperationBase {
    constructor(baseConfig: OperationConfig, private config: StreamingOperationConfig<RequestType, ResponseType, MessageType>) {
        super(baseConfig);
    }
}