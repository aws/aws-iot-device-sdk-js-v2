/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */

import {EventEmitter} from "events";
import {CrtError, mqtt_request_response} from "aws-crt";
import * as mqtt_request_response_utils from "./mqtt_request_response_utils";

export interface IncomingPublishEvent<T> {
    message: T
}

/**
 * Signature for a handler that listens to incoming publish events.
 */
export type IncomingPublishListener<T> = (eventData: IncomingPublishEvent<T>) => void;

export interface IncomingPublishErrorEvent {
    payload: ArrayBuffer,

    error: ServiceError,
}

/**
 * Signature for a handler that listens to incoming publish error events
 */
export type IncomingPublishErrorListener = (eventData: IncomingPublishErrorEvent) => void;

export type SubscriptionStatusEventListener = mqtt_request_response.SubscriptionStatusListener;

export class StreamingOperation<EventType> extends EventEmitter {
    private operation: mqtt_request_response.StreamingOperationBase;
    private deserializer: mqtt_request_response_utils.MessageDeserializer;

    private constructor(config: mqtt_request_response_utils.StreamingOperationConfig) {
        super();

        // validate
        let streamingOperationModel = config.serviceModel.streamingOperations.get(config.operationName);
        if (!streamingOperationModel) {
            throw new CrtError("NYI");
        }

        let validator = config.serviceModel.shapeValidators.get(streamingOperationModel.inputShapeName);
        if (!validator) {
            throw new CrtError("NYI");
        }

        validator(config.modelConfig);

        let streamOptions : mqtt_request_response.StreamingOperationOptions = {
            subscriptionTopicFilter: streamingOperationModel.subscriptionGenerator(config.modelConfig),
        };

        // create native operation
        this.deserializer = streamingOperationModel.deserializer;
        this.operation = config.client.createStream(streamOptions);

        this.operation.addListener(mqtt_request_response.StreamingOperationBase.SUBSCRIPTION_STATUS, this.onSubscriptionStatusChanged.bind(this));
        this.operation.addListener(mqtt_request_response.StreamingOperationBase.INCOMING_PUBLISH, this.onIncomingPublish.bind(this));
    }

    static create<EventType>(config: mqtt_request_response_utils.StreamingOperationConfig) : StreamingOperation<EventType> {
        let operation = new StreamingOperation<EventType>(config);

        return operation;
    }

    open() {
        this.operation.open();
    }

    close() {
        this.operation.close();
    }

    /**
     * Event emitted when the stream's subscription status changes.
     *
     * Listener type: {@link mqtt_request_response.SubscriptionStatusListener}
     *
     * @event
     */
    static SUBSCRIPTION_STATUS : string = 'subscriptionStatus';

    /**
     * Event emitted when a stream message is received
     *
     * Listener type: {@link IncomingPublishListener}
     *
     * @event
     */
    static INCOMING_PUBLISH : string = 'incomingPublish';

    /**
     * Event emitted when a stream message is received but handling it resulted in an error
     *
     * Listener type: {@link IncomingPublishErrorListener}
     *
     * @event
     */
    static INCOMING_PUBLISH_ERROR : string = 'incomingPublishError';

    on(event: 'subscriptionStatus', listener: mqtt_request_response.SubscriptionStatusListener): this;

    on(event: 'incomingPublish', listener: IncomingPublishListener<EventType>): this;

    on(event: 'incomingPublishError', listener: IncomingPublishErrorListener): this;

    on(event: string | symbol, listener: (...args: any[]) => void): this {
        super.on(event, listener);
        return this;
    }

    private onSubscriptionStatusChanged(eventData: mqtt_request_response.SubscriptionStatusEvent) : void {
        setImmediate(async () => {
            this.emit(StreamingOperation.SUBSCRIPTION_STATUS, eventData);
        })
    }

    private onIncomingPublish(eventData: mqtt_request_response.IncomingPublishEvent) : void {
        try {
            let message = this.deserializer(eventData.payload);

            setImmediate(async () => {
                this.emit(StreamingOperation.INCOMING_PUBLISH, {
                    message: message,
                });
            });
        } catch (error) {
            let serviceError = mqtt_request_response_utils.createServiceError((error as Error).toString());

            setImmediate(async () => {
                this.emit(StreamingOperation.INCOMING_PUBLISH_ERROR, {
                    payload: eventData.payload,
                    error: serviceError,
                });
            });
        }
    }
}


/**
 * @internal
 */
interface ServiceErrorOptions {
    description: string;

    internalError?: CrtError;

    modeledError?: any;
}


export class ServiceError extends Error {

    /** Optional inner/triggering error that can contain additional context. */
    readonly internalError?: CrtError;

    /** Optional service-specific modelled error data */
    readonly modeledError?: any;

    /** @internal */
    constructor(options: ServiceErrorOptions) {
        super(options.description);

        if (options.internalError) {
            this.internalError = options.internalError;
        }
        if (options.modeledError) {
            this.modeledError = options.modeledError;
        }
    }
}

