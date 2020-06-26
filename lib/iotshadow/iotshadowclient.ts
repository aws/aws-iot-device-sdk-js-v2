/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */

import * as model from "./model";
import { mqtt } from "aws-crt";
import { TextDecoder } from "util";
export { model };

/**
 * @module aws-iot-device-sdk
 * @category IotShadow
 */
export class IotShadowError extends Error {

    public prototype: any; // Hack to get around TS not knowing about prototypes

    constructor(message?: string, readonly payload?: mqtt.Payload) {
        // 'Error' breaks JS prototype chain when instantiated
        super(message);

        // restore prototype chain
        const myProto = new.target.prototype;
        if (Object.setPrototypeOf) { Object.setPrototypeOf(this, myProto); }
        else { this.prototype = myProto; }
    }
}

/**
 * API Documentation: https://docs.aws.amazon.com/iot/latest/developerguide/device-shadow-mqtt.html
 *
 * @module aws-iot-device-sdk
 * @category IotShadow
 */
export class IotShadowClient {

    private decoder = new TextDecoder('utf-8');

    constructor(private connection: mqtt.MqttClientConnection) {
    }

    /**
     * API Documentation: https://docs.aws.amazon.com/iot/latest/developerguide/device-shadow-mqtt.html#update-rejected-pub-sub-topic
     *
     * Subscribe to UpdateShadowRejected messages
     *
     * subscribeToUpdateShadowRejected may be called while the device is offline, though the async
     * operation cannot complete successfully until the connection resumes.
     *
     * Once subscribed, `messageHandler` is invoked each time a message matching
     * the `topic` is received. It is possible for such messages to arrive before
     * the SUBACK is received.
     *
     * @param request Subscription request configuration
     * @param qos Maximum requested QoS that server may use when sending messages to the client.
     *            The server may grant a lower QoS in the SUBACK
     * @param messageHandler Callback invoked when message or error is received from the server.
     * @returns Promise which returns a `mqtt.MqttSubscribeRequest` which will contain the
     *          result of the SUBSCRIBE. The Promise resolves when a SUBACK is returned
     *          from the server or is rejected when an exception occurs.
     *
     * @category IotShadow
     */
    async subscribeToUpdateShadowRejected(
        request: model.UpdateShadowSubscriptionRequest,
        qos: mqtt.QoS,
        messageHandler: (error?: IotShadowError, response?: model.ErrorResponse) => void)
        : Promise<mqtt.MqttSubscribeRequest> {

        let topic: string = "$aws/things/{thingName}/shadow/update/rejected";
        topic = topic.replace("{thingName}", request.thingName);
        const on_message = (topic: string, payload: ArrayBuffer) => {
            let response: model.ErrorResponse | undefined;
            let error: IotShadowError | undefined;
            try {
                const payload_text = this.decoder.decode(payload);
                response = JSON.parse(payload_text) as model.ErrorResponse;
            } catch (err) {
                error = new IotShadowError(err.message, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.connection.subscribe(topic, qos, on_message);
    }

    /**
     * API Documentation: https://docs.aws.amazon.com/iot/latest/developerguide/device-shadow-mqtt.html#update-delta-pub-sub-topic
     *
     * Subscribe to ShadowDeltaUpdatedEvents messages
     *
     * subscribeToShadowDeltaUpdatedEvents may be called while the device is offline, though the async
     * operation cannot complete successfully until the connection resumes.
     *
     * Once subscribed, `messageHandler` is invoked each time a message matching
     * the `topic` is received. It is possible for such messages to arrive before
     * the SUBACK is received.
     *
     * @param request Subscription request configuration
     * @param qos Maximum requested QoS that server may use when sending messages to the client.
     *            The server may grant a lower QoS in the SUBACK
     * @param messageHandler Callback invoked when message or error is received from the server.
     * @returns Promise which returns a `mqtt.MqttSubscribeRequest` which will contain the
     *          result of the SUBSCRIBE. The Promise resolves when a SUBACK is returned
     *          from the server or is rejected when an exception occurs.
     *
     * @category IotShadow
     */
    async subscribeToShadowDeltaUpdatedEvents(
        request: model.ShadowDeltaUpdatedSubscriptionRequest,
        qos: mqtt.QoS,
        messageHandler: (error?: IotShadowError, response?: model.ShadowDeltaUpdatedEvent) => void)
        : Promise<mqtt.MqttSubscribeRequest> {

        let topic: string = "$aws/things/{thingName}/shadow/update/delta";
        topic = topic.replace("{thingName}", request.thingName);
        const on_message = (topic: string, payload: ArrayBuffer) => {
            let response: model.ShadowDeltaUpdatedEvent | undefined;
            let error: IotShadowError | undefined;
            try {
                const payload_text = this.decoder.decode(payload);
                response = JSON.parse(payload_text) as model.ShadowDeltaUpdatedEvent;
            } catch (err) {
                error = new IotShadowError(err.message, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.connection.subscribe(topic, qos, on_message);
    }

    /**
     * API Documentation: https://docs.aws.amazon.com/iot/latest/developerguide/device-shadow-mqtt.html#get-rejected-pub-sub-topic
     *
     * Subscribe to GetNamedShadowRejected messages
     *
     * subscribeToGetNamedShadowRejected may be called while the device is offline, though the async
     * operation cannot complete successfully until the connection resumes.
     *
     * Once subscribed, `messageHandler` is invoked each time a message matching
     * the `topic` is received. It is possible for such messages to arrive before
     * the SUBACK is received.
     *
     * @param request Subscription request configuration
     * @param qos Maximum requested QoS that server may use when sending messages to the client.
     *            The server may grant a lower QoS in the SUBACK
     * @param messageHandler Callback invoked when message or error is received from the server.
     * @returns Promise which returns a `mqtt.MqttSubscribeRequest` which will contain the
     *          result of the SUBSCRIBE. The Promise resolves when a SUBACK is returned
     *          from the server or is rejected when an exception occurs.
     *
     * @category IotShadow
     */
    async subscribeToGetNamedShadowRejected(
        request: model.GetNamedShadowSubscriptionRequest,
        qos: mqtt.QoS,
        messageHandler: (error?: IotShadowError, response?: model.ErrorResponse) => void)
        : Promise<mqtt.MqttSubscribeRequest> {

        let topic: string = "$aws/things/{thingName}/shadow/name/{shadowName}/get/rejected";
        topic = topic.replace("{thingName}", request.thingName);
        topic = topic.replace("{shadowName}", request.shadowName);
        const on_message = (topic: string, payload: ArrayBuffer) => {
            let response: model.ErrorResponse | undefined;
            let error: IotShadowError | undefined;
            try {
                const payload_text = this.decoder.decode(payload);
                response = JSON.parse(payload_text) as model.ErrorResponse;
            } catch (err) {
                error = new IotShadowError(err.message, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.connection.subscribe(topic, qos, on_message);
    }

    /**
     * API Documentation: https://docs.aws.amazon.com/iot/latest/developerguide/device-shadow-mqtt.html#delete-rejected-pub-sub-topic
     *
     * Subscribe to DeleteNamedShadowRejected messages
     *
     * subscribeToDeleteNamedShadowRejected may be called while the device is offline, though the async
     * operation cannot complete successfully until the connection resumes.
     *
     * Once subscribed, `messageHandler` is invoked each time a message matching
     * the `topic` is received. It is possible for such messages to arrive before
     * the SUBACK is received.
     *
     * @param request Subscription request configuration
     * @param qos Maximum requested QoS that server may use when sending messages to the client.
     *            The server may grant a lower QoS in the SUBACK
     * @param messageHandler Callback invoked when message or error is received from the server.
     * @returns Promise which returns a `mqtt.MqttSubscribeRequest` which will contain the
     *          result of the SUBSCRIBE. The Promise resolves when a SUBACK is returned
     *          from the server or is rejected when an exception occurs.
     *
     * @category IotShadow
     */
    async subscribeToDeleteNamedShadowRejected(
        request: model.DeleteNamedShadowSubscriptionRequest,
        qos: mqtt.QoS,
        messageHandler: (error?: IotShadowError, response?: model.ErrorResponse) => void)
        : Promise<mqtt.MqttSubscribeRequest> {

        let topic: string = "$aws/things/{thingName}/shadow/name/{shadowName}/delete/rejected";
        topic = topic.replace("{thingName}", request.thingName);
        topic = topic.replace("{shadowName}", request.shadowName);
        const on_message = (topic: string, payload: ArrayBuffer) => {
            let response: model.ErrorResponse | undefined;
            let error: IotShadowError | undefined;
            try {
                const payload_text = this.decoder.decode(payload);
                response = JSON.parse(payload_text) as model.ErrorResponse;
            } catch (err) {
                error = new IotShadowError(err.message, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.connection.subscribe(topic, qos, on_message);
    }

    /**
     * API Documentation: https://docs.aws.amazon.com/iot/latest/developerguide/device-shadow-mqtt.html#delete-pub-sub-topic
     * Publish DeleteShadow message
     * If the device is offline, the PUBLISH packet will be sent once the connection resumes.
     *
     * @param request Message to be serialized and sent
     * @param qos Quality of Service for delivering this message
     * @returns Promise which returns a `mqtt.MqttRequest` which will contain the packet id of
     *          the PUBLISH packet.
     *
     * * For QoS 0, completes as soon as the packet is sent.
     * * For QoS 1, completes when PUBACK is received.
     * * QoS 2 is not supported by AWS IoT.
     *
     * @category IotShadow
     */
    async publishDeleteShadow(
        request: model.DeleteShadowRequest,
        qos: mqtt.QoS)
        : Promise<mqtt.MqttRequest> {

        let topic: string = "$aws/things/{thingName}/shadow/delete";
        topic = topic.replace("{thingName}", request.thingName);
        return this.connection.publish(topic, JSON.stringify(request), qos);
    }

    /**
     * API Documentation: https://docs.aws.amazon.com/iot/latest/developerguide/device-shadow-mqtt.html#get-pub-sub-topic
     * Publish GetNamedShadow message
     * If the device is offline, the PUBLISH packet will be sent once the connection resumes.
     *
     * @param request Message to be serialized and sent
     * @param qos Quality of Service for delivering this message
     * @returns Promise which returns a `mqtt.MqttRequest` which will contain the packet id of
     *          the PUBLISH packet.
     *
     * * For QoS 0, completes as soon as the packet is sent.
     * * For QoS 1, completes when PUBACK is received.
     * * QoS 2 is not supported by AWS IoT.
     *
     * @category IotShadow
     */
    async publishGetNamedShadow(
        request: model.GetNamedShadowRequest,
        qos: mqtt.QoS)
        : Promise<mqtt.MqttRequest> {

        let topic: string = "$aws/things/{thingName}/shadow/name/{shadowName}/get";
        topic = topic.replace("{shadowName}", request.shadowName);
        topic = topic.replace("{thingName}", request.thingName);
        return this.connection.publish(topic, JSON.stringify(request), qos);
    }

    /**
     * API Documentation: https://docs.aws.amazon.com/iot/latest/developerguide/device-shadow-mqtt.html#delete-accepted-pub-sub-topic
     *
     * Subscribe to DeleteShadowAccepted messages
     *
     * subscribeToDeleteShadowAccepted may be called while the device is offline, though the async
     * operation cannot complete successfully until the connection resumes.
     *
     * Once subscribed, `messageHandler` is invoked each time a message matching
     * the `topic` is received. It is possible for such messages to arrive before
     * the SUBACK is received.
     *
     * @param request Subscription request configuration
     * @param qos Maximum requested QoS that server may use when sending messages to the client.
     *            The server may grant a lower QoS in the SUBACK
     * @param messageHandler Callback invoked when message or error is received from the server.
     * @returns Promise which returns a `mqtt.MqttSubscribeRequest` which will contain the
     *          result of the SUBSCRIBE. The Promise resolves when a SUBACK is returned
     *          from the server or is rejected when an exception occurs.
     *
     * @category IotShadow
     */
    async subscribeToDeleteShadowAccepted(
        request: model.DeleteShadowSubscriptionRequest,
        qos: mqtt.QoS,
        messageHandler: (error?: IotShadowError, response?: model.DeleteShadowResponse) => void)
        : Promise<mqtt.MqttSubscribeRequest> {

        let topic: string = "$aws/things/{thingName}/shadow/delete/accepted";
        topic = topic.replace("{thingName}", request.thingName);
        const on_message = (topic: string, payload: ArrayBuffer) => {
            let response: model.DeleteShadowResponse | undefined;
            let error: IotShadowError | undefined;
            try {
                const payload_text = this.decoder.decode(payload);
                response = JSON.parse(payload_text) as model.DeleteShadowResponse;
            } catch (err) {
                error = new IotShadowError(err.message, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.connection.subscribe(topic, qos, on_message);
    }

    /**
     * API Documentation: https://docs.aws.amazon.com/iot/latest/developerguide/device-shadow-mqtt.html#get-accepted-pub-sub-topic
     *
     * Subscribe to GetShadowAccepted messages
     *
     * subscribeToGetShadowAccepted may be called while the device is offline, though the async
     * operation cannot complete successfully until the connection resumes.
     *
     * Once subscribed, `messageHandler` is invoked each time a message matching
     * the `topic` is received. It is possible for such messages to arrive before
     * the SUBACK is received.
     *
     * @param request Subscription request configuration
     * @param qos Maximum requested QoS that server may use when sending messages to the client.
     *            The server may grant a lower QoS in the SUBACK
     * @param messageHandler Callback invoked when message or error is received from the server.
     * @returns Promise which returns a `mqtt.MqttSubscribeRequest` which will contain the
     *          result of the SUBSCRIBE. The Promise resolves when a SUBACK is returned
     *          from the server or is rejected when an exception occurs.
     *
     * @category IotShadow
     */
    async subscribeToGetShadowAccepted(
        request: model.GetShadowSubscriptionRequest,
        qos: mqtt.QoS,
        messageHandler: (error?: IotShadowError, response?: model.GetShadowResponse) => void)
        : Promise<mqtt.MqttSubscribeRequest> {

        let topic: string = "$aws/things/{thingName}/shadow/get/accepted";
        topic = topic.replace("{thingName}", request.thingName);
        const on_message = (topic: string, payload: ArrayBuffer) => {
            let response: model.GetShadowResponse | undefined;
            let error: IotShadowError | undefined;
            try {
                const payload_text = this.decoder.decode(payload);
                response = JSON.parse(payload_text) as model.GetShadowResponse;
            } catch (err) {
                error = new IotShadowError(err.message, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.connection.subscribe(topic, qos, on_message);
    }

    /**
     * API Documentation: https://docs.aws.amazon.com/iot/latest/developerguide/device-shadow-mqtt.html#get-accepted-pub-sub-topic
     *
     * Subscribe to GetNamedShadowAccepted messages
     *
     * subscribeToGetNamedShadowAccepted may be called while the device is offline, though the async
     * operation cannot complete successfully until the connection resumes.
     *
     * Once subscribed, `messageHandler` is invoked each time a message matching
     * the `topic` is received. It is possible for such messages to arrive before
     * the SUBACK is received.
     *
     * @param request Subscription request configuration
     * @param qos Maximum requested QoS that server may use when sending messages to the client.
     *            The server may grant a lower QoS in the SUBACK
     * @param messageHandler Callback invoked when message or error is received from the server.
     * @returns Promise which returns a `mqtt.MqttSubscribeRequest` which will contain the
     *          result of the SUBSCRIBE. The Promise resolves when a SUBACK is returned
     *          from the server or is rejected when an exception occurs.
     *
     * @category IotShadow
     */
    async subscribeToGetNamedShadowAccepted(
        request: model.GetNamedShadowSubscriptionRequest,
        qos: mqtt.QoS,
        messageHandler: (error?: IotShadowError, response?: model.GetShadowResponse) => void)
        : Promise<mqtt.MqttSubscribeRequest> {

        let topic: string = "$aws/things/{thingName}/shadow/name/{shadowName}/get/accepted";
        topic = topic.replace("{thingName}", request.thingName);
        topic = topic.replace("{shadowName}", request.shadowName);
        const on_message = (topic: string, payload: ArrayBuffer) => {
            let response: model.GetShadowResponse | undefined;
            let error: IotShadowError | undefined;
            try {
                const payload_text = this.decoder.decode(payload);
                response = JSON.parse(payload_text) as model.GetShadowResponse;
            } catch (err) {
                error = new IotShadowError(err.message, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.connection.subscribe(topic, qos, on_message);
    }

    /**
     * API Documentation: https://docs.aws.amazon.com/iot/latest/developerguide/device-shadow-mqtt.html#update-documents-pub-sub-topic
     *
     * Subscribe to NamedShadowUpdatedEvents messages
     *
     * subscribeToNamedShadowUpdatedEvents may be called while the device is offline, though the async
     * operation cannot complete successfully until the connection resumes.
     *
     * Once subscribed, `messageHandler` is invoked each time a message matching
     * the `topic` is received. It is possible for such messages to arrive before
     * the SUBACK is received.
     *
     * @param request Subscription request configuration
     * @param qos Maximum requested QoS that server may use when sending messages to the client.
     *            The server may grant a lower QoS in the SUBACK
     * @param messageHandler Callback invoked when message or error is received from the server.
     * @returns Promise which returns a `mqtt.MqttSubscribeRequest` which will contain the
     *          result of the SUBSCRIBE. The Promise resolves when a SUBACK is returned
     *          from the server or is rejected when an exception occurs.
     *
     * @category IotShadow
     */
    async subscribeToNamedShadowUpdatedEvents(
        request: model.NamedShadowUpdatedSubscriptionRequest,
        qos: mqtt.QoS,
        messageHandler: (error?: IotShadowError, response?: model.ShadowUpdatedEvent) => void)
        : Promise<mqtt.MqttSubscribeRequest> {

        let topic: string = "$aws/things/{thingName}/shadow/name/{shadowName}/update/documents";
        topic = topic.replace("{shadowName}", request.shadowName);
        topic = topic.replace("{thingName}", request.thingName);
        const on_message = (topic: string, payload: ArrayBuffer) => {
            let response: model.ShadowUpdatedEvent | undefined;
            let error: IotShadowError | undefined;
            try {
                const payload_text = this.decoder.decode(payload);
                response = JSON.parse(payload_text) as model.ShadowUpdatedEvent;
            } catch (err) {
                error = new IotShadowError(err.message, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.connection.subscribe(topic, qos, on_message);
    }

    /**
     * API Documentation: https://docs.aws.amazon.com/iot/latest/developerguide/device-shadow-mqtt.html#update-documents-pub-sub-topic
     *
     * Subscribe to ShadowUpdatedEvents messages
     *
     * subscribeToShadowUpdatedEvents may be called while the device is offline, though the async
     * operation cannot complete successfully until the connection resumes.
     *
     * Once subscribed, `messageHandler` is invoked each time a message matching
     * the `topic` is received. It is possible for such messages to arrive before
     * the SUBACK is received.
     *
     * @param request Subscription request configuration
     * @param qos Maximum requested QoS that server may use when sending messages to the client.
     *            The server may grant a lower QoS in the SUBACK
     * @param messageHandler Callback invoked when message or error is received from the server.
     * @returns Promise which returns a `mqtt.MqttSubscribeRequest` which will contain the
     *          result of the SUBSCRIBE. The Promise resolves when a SUBACK is returned
     *          from the server or is rejected when an exception occurs.
     *
     * @category IotShadow
     */
    async subscribeToShadowUpdatedEvents(
        request: model.ShadowUpdatedSubscriptionRequest,
        qos: mqtt.QoS,
        messageHandler: (error?: IotShadowError, response?: model.ShadowUpdatedEvent) => void)
        : Promise<mqtt.MqttSubscribeRequest> {

        let topic: string = "$aws/things/{thingName}/shadow/update/documents";
        topic = topic.replace("{thingName}", request.thingName);
        const on_message = (topic: string, payload: ArrayBuffer) => {
            let response: model.ShadowUpdatedEvent | undefined;
            let error: IotShadowError | undefined;
            try {
                const payload_text = this.decoder.decode(payload);
                response = JSON.parse(payload_text) as model.ShadowUpdatedEvent;
            } catch (err) {
                error = new IotShadowError(err.message, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.connection.subscribe(topic, qos, on_message);
    }

    /**
     * API Documentation: https://docs.aws.amazon.com/iot/latest/developerguide/device-shadow-mqtt.html#delete-pub-sub-topic
     * Publish DeleteNamedShadow message
     * If the device is offline, the PUBLISH packet will be sent once the connection resumes.
     *
     * @param request Message to be serialized and sent
     * @param qos Quality of Service for delivering this message
     * @returns Promise which returns a `mqtt.MqttRequest` which will contain the packet id of
     *          the PUBLISH packet.
     *
     * * For QoS 0, completes as soon as the packet is sent.
     * * For QoS 1, completes when PUBACK is received.
     * * QoS 2 is not supported by AWS IoT.
     *
     * @category IotShadow
     */
    async publishDeleteNamedShadow(
        request: model.DeleteNamedShadowRequest,
        qos: mqtt.QoS)
        : Promise<mqtt.MqttRequest> {

        let topic: string = "$aws/things/{thingName}/shadow/name/{shadowName}/delete";
        topic = topic.replace("{shadowName}", request.shadowName);
        topic = topic.replace("{thingName}", request.thingName);
        return this.connection.publish(topic, JSON.stringify(request), qos);
    }

    /**
     * API Documentation: https://docs.aws.amazon.com/iot/latest/developerguide/device-shadow-mqtt.html#delete-accepted-pub-sub-topic
     *
     * Subscribe to DeleteNamedShadowAccepted messages
     *
     * subscribeToDeleteNamedShadowAccepted may be called while the device is offline, though the async
     * operation cannot complete successfully until the connection resumes.
     *
     * Once subscribed, `messageHandler` is invoked each time a message matching
     * the `topic` is received. It is possible for such messages to arrive before
     * the SUBACK is received.
     *
     * @param request Subscription request configuration
     * @param qos Maximum requested QoS that server may use when sending messages to the client.
     *            The server may grant a lower QoS in the SUBACK
     * @param messageHandler Callback invoked when message or error is received from the server.
     * @returns Promise which returns a `mqtt.MqttSubscribeRequest` which will contain the
     *          result of the SUBSCRIBE. The Promise resolves when a SUBACK is returned
     *          from the server or is rejected when an exception occurs.
     *
     * @category IotShadow
     */
    async subscribeToDeleteNamedShadowAccepted(
        request: model.DeleteNamedShadowSubscriptionRequest,
        qos: mqtt.QoS,
        messageHandler: (error?: IotShadowError, response?: model.DeleteShadowResponse) => void)
        : Promise<mqtt.MqttSubscribeRequest> {

        let topic: string = "$aws/things/{thingName}/shadow/name/{shadowName}/delete/accepted";
        topic = topic.replace("{thingName}", request.thingName);
        topic = topic.replace("{shadowName}", request.shadowName);
        const on_message = (topic: string, payload: ArrayBuffer) => {
            let response: model.DeleteShadowResponse | undefined;
            let error: IotShadowError | undefined;
            try {
                const payload_text = this.decoder.decode(payload);
                response = JSON.parse(payload_text) as model.DeleteShadowResponse;
            } catch (err) {
                error = new IotShadowError(err.message, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.connection.subscribe(topic, qos, on_message);
    }

    /**
     * API Documentation: https://docs.aws.amazon.com/iot/latest/developerguide/device-shadow-mqtt.html#delete-rejected-pub-sub-topic
     *
     * Subscribe to DeleteShadowRejected messages
     *
     * subscribeToDeleteShadowRejected may be called while the device is offline, though the async
     * operation cannot complete successfully until the connection resumes.
     *
     * Once subscribed, `messageHandler` is invoked each time a message matching
     * the `topic` is received. It is possible for such messages to arrive before
     * the SUBACK is received.
     *
     * @param request Subscription request configuration
     * @param qos Maximum requested QoS that server may use when sending messages to the client.
     *            The server may grant a lower QoS in the SUBACK
     * @param messageHandler Callback invoked when message or error is received from the server.
     * @returns Promise which returns a `mqtt.MqttSubscribeRequest` which will contain the
     *          result of the SUBSCRIBE. The Promise resolves when a SUBACK is returned
     *          from the server or is rejected when an exception occurs.
     *
     * @category IotShadow
     */
    async subscribeToDeleteShadowRejected(
        request: model.DeleteShadowSubscriptionRequest,
        qos: mqtt.QoS,
        messageHandler: (error?: IotShadowError, response?: model.ErrorResponse) => void)
        : Promise<mqtt.MqttSubscribeRequest> {

        let topic: string = "$aws/things/{thingName}/shadow/delete/rejected";
        topic = topic.replace("{thingName}", request.thingName);
        const on_message = (topic: string, payload: ArrayBuffer) => {
            let response: model.ErrorResponse | undefined;
            let error: IotShadowError | undefined;
            try {
                const payload_text = this.decoder.decode(payload);
                response = JSON.parse(payload_text) as model.ErrorResponse;
            } catch (err) {
                error = new IotShadowError(err.message, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.connection.subscribe(topic, qos, on_message);
    }

    /**
     * API Documentation: https://docs.aws.amazon.com/iot/latest/developerguide/device-shadow-mqtt.html#get-rejected-pub-sub-topic
     *
     * Subscribe to GetShadowRejected messages
     *
     * subscribeToGetShadowRejected may be called while the device is offline, though the async
     * operation cannot complete successfully until the connection resumes.
     *
     * Once subscribed, `messageHandler` is invoked each time a message matching
     * the `topic` is received. It is possible for such messages to arrive before
     * the SUBACK is received.
     *
     * @param request Subscription request configuration
     * @param qos Maximum requested QoS that server may use when sending messages to the client.
     *            The server may grant a lower QoS in the SUBACK
     * @param messageHandler Callback invoked when message or error is received from the server.
     * @returns Promise which returns a `mqtt.MqttSubscribeRequest` which will contain the
     *          result of the SUBSCRIBE. The Promise resolves when a SUBACK is returned
     *          from the server or is rejected when an exception occurs.
     *
     * @category IotShadow
     */
    async subscribeToGetShadowRejected(
        request: model.GetShadowSubscriptionRequest,
        qos: mqtt.QoS,
        messageHandler: (error?: IotShadowError, response?: model.ErrorResponse) => void)
        : Promise<mqtt.MqttSubscribeRequest> {

        let topic: string = "$aws/things/{thingName}/shadow/get/rejected";
        topic = topic.replace("{thingName}", request.thingName);
        const on_message = (topic: string, payload: ArrayBuffer) => {
            let response: model.ErrorResponse | undefined;
            let error: IotShadowError | undefined;
            try {
                const payload_text = this.decoder.decode(payload);
                response = JSON.parse(payload_text) as model.ErrorResponse;
            } catch (err) {
                error = new IotShadowError(err.message, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.connection.subscribe(topic, qos, on_message);
    }

    /**
     * API Documentation: https://docs.aws.amazon.com/iot/latest/developerguide/device-shadow-mqtt.html#update-pub-sub-topic
     * Publish UpdateShadow message
     * If the device is offline, the PUBLISH packet will be sent once the connection resumes.
     *
     * @param request Message to be serialized and sent
     * @param qos Quality of Service for delivering this message
     * @returns Promise which returns a `mqtt.MqttRequest` which will contain the packet id of
     *          the PUBLISH packet.
     *
     * * For QoS 0, completes as soon as the packet is sent.
     * * For QoS 1, completes when PUBACK is received.
     * * QoS 2 is not supported by AWS IoT.
     *
     * @category IotShadow
     */
    async publishUpdateShadow(
        request: model.UpdateShadowRequest,
        qos: mqtt.QoS)
        : Promise<mqtt.MqttRequest> {

        let topic: string = "$aws/things/{thingName}/shadow/update";
        topic = topic.replace("{thingName}", request.thingName);
        return this.connection.publish(topic, JSON.stringify(request), qos);
    }

    /**
     * API Documentation: https://docs.aws.amazon.com/iot/latest/developerguide/device-shadow-mqtt.html#get-pub-sub-topic
     * Publish GetShadow message
     * If the device is offline, the PUBLISH packet will be sent once the connection resumes.
     *
     * @param request Message to be serialized and sent
     * @param qos Quality of Service for delivering this message
     * @returns Promise which returns a `mqtt.MqttRequest` which will contain the packet id of
     *          the PUBLISH packet.
     *
     * * For QoS 0, completes as soon as the packet is sent.
     * * For QoS 1, completes when PUBACK is received.
     * * QoS 2 is not supported by AWS IoT.
     *
     * @category IotShadow
     */
    async publishGetShadow(
        request: model.GetShadowRequest,
        qos: mqtt.QoS)
        : Promise<mqtt.MqttRequest> {

        let topic: string = "$aws/things/{thingName}/shadow/get";
        topic = topic.replace("{thingName}", request.thingName);
        return this.connection.publish(topic, JSON.stringify(request), qos);
    }

    /**
     * API Documentation: https://docs.aws.amazon.com/iot/latest/developerguide/device-shadow-mqtt.html#update-accepted-pub-sub-topic
     *
     * Subscribe to UpdateShadowAccepted messages
     *
     * subscribeToUpdateShadowAccepted may be called while the device is offline, though the async
     * operation cannot complete successfully until the connection resumes.
     *
     * Once subscribed, `messageHandler` is invoked each time a message matching
     * the `topic` is received. It is possible for such messages to arrive before
     * the SUBACK is received.
     *
     * @param request Subscription request configuration
     * @param qos Maximum requested QoS that server may use when sending messages to the client.
     *            The server may grant a lower QoS in the SUBACK
     * @param messageHandler Callback invoked when message or error is received from the server.
     * @returns Promise which returns a `mqtt.MqttSubscribeRequest` which will contain the
     *          result of the SUBSCRIBE. The Promise resolves when a SUBACK is returned
     *          from the server or is rejected when an exception occurs.
     *
     * @category IotShadow
     */
    async subscribeToUpdateShadowAccepted(
        request: model.UpdateShadowSubscriptionRequest,
        qos: mqtt.QoS,
        messageHandler: (error?: IotShadowError, response?: model.UpdateShadowResponse) => void)
        : Promise<mqtt.MqttSubscribeRequest> {

        let topic: string = "$aws/things/{thingName}/shadow/update/accepted";
        topic = topic.replace("{thingName}", request.thingName);
        const on_message = (topic: string, payload: ArrayBuffer) => {
            let response: model.UpdateShadowResponse | undefined;
            let error: IotShadowError | undefined;
            try {
                const payload_text = this.decoder.decode(payload);
                response = JSON.parse(payload_text) as model.UpdateShadowResponse;
            } catch (err) {
                error = new IotShadowError(err.message, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.connection.subscribe(topic, qos, on_message);
    }

    /**
     * API Documentation: https://docs.aws.amazon.com/iot/latest/developerguide/device-shadow-mqtt.html#update-rejected-pub-sub-topic
     *
     * Subscribe to UpdateNamedShadowRejected messages
     *
     * subscribeToUpdateNamedShadowRejected may be called while the device is offline, though the async
     * operation cannot complete successfully until the connection resumes.
     *
     * Once subscribed, `messageHandler` is invoked each time a message matching
     * the `topic` is received. It is possible for such messages to arrive before
     * the SUBACK is received.
     *
     * @param request Subscription request configuration
     * @param qos Maximum requested QoS that server may use when sending messages to the client.
     *            The server may grant a lower QoS in the SUBACK
     * @param messageHandler Callback invoked when message or error is received from the server.
     * @returns Promise which returns a `mqtt.MqttSubscribeRequest` which will contain the
     *          result of the SUBSCRIBE. The Promise resolves when a SUBACK is returned
     *          from the server or is rejected when an exception occurs.
     *
     * @category IotShadow
     */
    async subscribeToUpdateNamedShadowRejected(
        request: model.UpdateNamedShadowSubscriptionRequest,
        qos: mqtt.QoS,
        messageHandler: (error?: IotShadowError, response?: model.ErrorResponse) => void)
        : Promise<mqtt.MqttSubscribeRequest> {

        let topic: string = "$aws/things/{thingName}/shadow/name/{shadowName}/update/rejected";
        topic = topic.replace("{thingName}", request.thingName);
        topic = topic.replace("{shadowName}", request.shadowName);
        const on_message = (topic: string, payload: ArrayBuffer) => {
            let response: model.ErrorResponse | undefined;
            let error: IotShadowError | undefined;
            try {
                const payload_text = this.decoder.decode(payload);
                response = JSON.parse(payload_text) as model.ErrorResponse;
            } catch (err) {
                error = new IotShadowError(err.message, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.connection.subscribe(topic, qos, on_message);
    }

    /**
     * API Documentation: https://docs.aws.amazon.com/iot/latest/developerguide/device-shadow-mqtt.html#update-pub-sub-topic
     * Publish UpdateNamedShadow message
     * If the device is offline, the PUBLISH packet will be sent once the connection resumes.
     *
     * @param request Message to be serialized and sent
     * @param qos Quality of Service for delivering this message
     * @returns Promise which returns a `mqtt.MqttRequest` which will contain the packet id of
     *          the PUBLISH packet.
     *
     * * For QoS 0, completes as soon as the packet is sent.
     * * For QoS 1, completes when PUBACK is received.
     * * QoS 2 is not supported by AWS IoT.
     *
     * @category IotShadow
     */
    async publishUpdateNamedShadow(
        request: model.UpdateNamedShadowRequest,
        qos: mqtt.QoS)
        : Promise<mqtt.MqttRequest> {

        let topic: string = "$aws/things/{thingName}/shadow/name/{shadowName}/update";
        topic = topic.replace("{shadowName}", request.shadowName);
        topic = topic.replace("{thingName}", request.thingName);
        return this.connection.publish(topic, JSON.stringify(request), qos);
    }

    /**
     * API Documentation: https://docs.aws.amazon.com/iot/latest/developerguide/device-shadow-mqtt.html#update-delta-pub-sub-topic
     *
     * Subscribe to NamedShadowDeltaUpdatedEvents messages
     *
     * subscribeToNamedShadowDeltaUpdatedEvents may be called while the device is offline, though the async
     * operation cannot complete successfully until the connection resumes.
     *
     * Once subscribed, `messageHandler` is invoked each time a message matching
     * the `topic` is received. It is possible for such messages to arrive before
     * the SUBACK is received.
     *
     * @param request Subscription request configuration
     * @param qos Maximum requested QoS that server may use when sending messages to the client.
     *            The server may grant a lower QoS in the SUBACK
     * @param messageHandler Callback invoked when message or error is received from the server.
     * @returns Promise which returns a `mqtt.MqttSubscribeRequest` which will contain the
     *          result of the SUBSCRIBE. The Promise resolves when a SUBACK is returned
     *          from the server or is rejected when an exception occurs.
     *
     * @category IotShadow
     */
    async subscribeToNamedShadowDeltaUpdatedEvents(
        request: model.NamedShadowDeltaUpdatedSubscriptionRequest,
        qos: mqtt.QoS,
        messageHandler: (error?: IotShadowError, response?: model.ShadowDeltaUpdatedEvent) => void)
        : Promise<mqtt.MqttSubscribeRequest> {

        let topic: string = "$aws/things/{thingName}/shadow/name/{shadowName}/update/delta";
        topic = topic.replace("{thingName}", request.thingName);
        topic = topic.replace("{shadowName}", request.shadowName);
        const on_message = (topic: string, payload: ArrayBuffer) => {
            let response: model.ShadowDeltaUpdatedEvent | undefined;
            let error: IotShadowError | undefined;
            try {
                const payload_text = this.decoder.decode(payload);
                response = JSON.parse(payload_text) as model.ShadowDeltaUpdatedEvent;
            } catch (err) {
                error = new IotShadowError(err.message, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.connection.subscribe(topic, qos, on_message);
    }

    /**
     * API Documentation: https://docs.aws.amazon.com/iot/latest/developerguide/device-shadow-mqtt.html#update-accepted-pub-sub-topic
     *
     * Subscribe to UpdateNamedShadowAccepted messages
     *
     * subscribeToUpdateNamedShadowAccepted may be called while the device is offline, though the async
     * operation cannot complete successfully until the connection resumes.
     *
     * Once subscribed, `messageHandler` is invoked each time a message matching
     * the `topic` is received. It is possible for such messages to arrive before
     * the SUBACK is received.
     *
     * @param request Subscription request configuration
     * @param qos Maximum requested QoS that server may use when sending messages to the client.
     *            The server may grant a lower QoS in the SUBACK
     * @param messageHandler Callback invoked when message or error is received from the server.
     * @returns Promise which returns a `mqtt.MqttSubscribeRequest` which will contain the
     *          result of the SUBSCRIBE. The Promise resolves when a SUBACK is returned
     *          from the server or is rejected when an exception occurs.
     *
     * @category IotShadow
     */
    async subscribeToUpdateNamedShadowAccepted(
        request: model.UpdateNamedShadowSubscriptionRequest,
        qos: mqtt.QoS,
        messageHandler: (error?: IotShadowError, response?: model.UpdateShadowResponse) => void)
        : Promise<mqtt.MqttSubscribeRequest> {

        let topic: string = "$aws/things/{thingName}/shadow/name/{shadowName}/update/accepted";
        topic = topic.replace("{thingName}", request.thingName);
        topic = topic.replace("{shadowName}", request.shadowName);
        const on_message = (topic: string, payload: ArrayBuffer) => {
            let response: model.UpdateShadowResponse | undefined;
            let error: IotShadowError | undefined;
            try {
                const payload_text = this.decoder.decode(payload);
                response = JSON.parse(payload_text) as model.UpdateShadowResponse;
            } catch (err) {
                error = new IotShadowError(err.message, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.connection.subscribe(topic, qos, on_message);
    }

}
