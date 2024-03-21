/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 *
 * This file is generated
 */

/**
 * @packageDocumentation
 * @module shadow
 */

import * as model from "./model";
import { mqtt, mqtt5 } from "aws-crt";
import { toUtf8 } from "@aws-sdk/util-utf8-browser"
import * as service_client_mqtt_adapter from "../service_client_mqtt_adapter";

export { model };

/**
 * Error subclass for IotShadow service errors
 *
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
 * The AWS IoT Device Shadow service adds shadows to AWS IoT thing objects. Shadows are a simple data store for device properties and state.  Shadows can make a device’s state available to apps and other services whether the device is connected to AWS IoT or not.
 *
 * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/device-shadow-mqtt.html
 *
 * @category IotShadow
 */
export class IotShadowClient {

    // @ts-ignore
    private mqttAdapter: service_client_mqtt_adapter.IServiceClientMqttAdapter;

    private static INVALID_PAYLOAD_PARSING_ERROR = "Invalid/unknown error parsing payload into response";

    private static createClientError(err: any, payload: ArrayBuffer) : IotShadowError {
        if (err instanceof Error) {
            return new IotShadowError(err.message, payload);
        } else {
            return new IotShadowError( IotShadowClient.INVALID_PAYLOAD_PARSING_ERROR, payload);
        }
    }

    constructor(connection?: mqtt.MqttClientConnection) {
        if (connection !== undefined) {
           this.mqttAdapter = new service_client_mqtt_adapter.ServiceClientMqtt311Adapter(connection);
        }
    }

    /**
     * Creates a new IotShadowClient that uses the SDK Mqtt5 client internally.
     *
     * The pre-existing constructor that is bound to the MQTT311 client makes this awkward since we
     * must support
     *
     * ```
     * new IotShadowClient(mqtt311connection);
     * ```
     *
     * for backwards compatibility, but still want to be able to inject an MQTT5 client as well.
     *
     * @param client the MQTT5 client to use with this service client
     *
     * @returns a new IotShadowClient instance
     */
    static newFromMqtt5Client(client: mqtt5.Mqtt5Client) : IotShadowClient {
        let serviceClient: IotShadowClient = new IotShadowClient();
        serviceClient.mqttAdapter = new service_client_mqtt_adapter.ServiceClientMqtt5Adapter(client);

        return serviceClient;
    }

    /**
     * Deletes a named shadow for an AWS IoT thing.
     *
     * If the device is offline, the PUBLISH packet will be sent once the connection resumes.
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/device-shadow-mqtt.html#delete-pub-sub-topic
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
        topic = topic.replace("{thingName}", request.thingName);
        topic = topic.replace("{shadowName}", request.shadowName);
        return this.mqttAdapter.publish(topic, JSON.stringify(request), qos);
    }

    /**
     * Deletes the (classic) shadow for an AWS IoT thing.
     *
     * If the device is offline, the PUBLISH packet will be sent once the connection resumes.
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/device-shadow-mqtt.html#delete-pub-sub-topic
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
        return this.mqttAdapter.publish(topic, JSON.stringify(request), qos);
    }

    /**
     * Gets a named shadow for an AWS IoT thing.
     *
     * If the device is offline, the PUBLISH packet will be sent once the connection resumes.
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/device-shadow-mqtt.html#get-pub-sub-topic
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
        topic = topic.replace("{thingName}", request.thingName);
        topic = topic.replace("{shadowName}", request.shadowName);
        return this.mqttAdapter.publish(topic, JSON.stringify(request), qos);
    }

    /**
     * Gets the (classic) shadow for an AWS IoT thing.
     *
     * If the device is offline, the PUBLISH packet will be sent once the connection resumes.
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/device-shadow-mqtt.html#get-pub-sub-topic
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
        return this.mqttAdapter.publish(topic, JSON.stringify(request), qos);
    }

    /**
     * Update a named shadow for a device.
     *
     * If the device is offline, the PUBLISH packet will be sent once the connection resumes.
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/device-shadow-mqtt.html#update-pub-sub-topic
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
        topic = topic.replace("{thingName}", request.thingName);
        topic = topic.replace("{shadowName}", request.shadowName);
        return this.mqttAdapter.publish(topic, JSON.stringify(request), qos);
    }

    /**
     * Update a device's (classic) shadow.
     *
     * If the device is offline, the PUBLISH packet will be sent once the connection resumes.
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/device-shadow-mqtt.html#update-pub-sub-topic
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
        return this.mqttAdapter.publish(topic, JSON.stringify(request), qos);
    }

    /**
     * Subscribes to the accepted topic for the DeleteNamedShadow operation.
     *
     *
     * subscribeToDeleteNamedShadowAccepted may be called while the device is offline, though the async
     * operation cannot complete successfully until the connection resumes.
     *
     * Once subscribed, `messageHandler` is invoked each time a message matching
     * the `topic` is received. It is possible for such messages to arrive before
     * the SUBACK is received.
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/device-shadow-mqtt.html#delete-accepted-pub-sub-topic
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
                const payload_text = toUtf8(new Uint8Array(payload));
                response = JSON.parse(payload_text) as model.DeleteShadowResponse;
            } catch (err) {
                error = IotShadowClient.createClientError(err, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.mqttAdapter.subscribe(topic, qos, on_message);
    }

    /**
     * Subscribes to the rejected topic for the DeleteNamedShadow operation.
     *
     *
     * subscribeToDeleteNamedShadowRejected may be called while the device is offline, though the async
     * operation cannot complete successfully until the connection resumes.
     *
     * Once subscribed, `messageHandler` is invoked each time a message matching
     * the `topic` is received. It is possible for such messages to arrive before
     * the SUBACK is received.
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/device-shadow-mqtt.html#delete-rejected-pub-sub-topic
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
                const payload_text = toUtf8(new Uint8Array(payload));
                response = JSON.parse(payload_text) as model.ErrorResponse;
            } catch (err) {
                error = IotShadowClient.createClientError(err, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.mqttAdapter.subscribe(topic, qos, on_message);
    }

    /**
     * Subscribes to the accepted topic for the DeleteShadow operation
     *
     *
     * subscribeToDeleteShadowAccepted may be called while the device is offline, though the async
     * operation cannot complete successfully until the connection resumes.
     *
     * Once subscribed, `messageHandler` is invoked each time a message matching
     * the `topic` is received. It is possible for such messages to arrive before
     * the SUBACK is received.
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/device-shadow-mqtt.html#delete-accepted-pub-sub-topic
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
                const payload_text = toUtf8(new Uint8Array(payload));
                response = JSON.parse(payload_text) as model.DeleteShadowResponse;
            } catch (err) {
                error = IotShadowClient.createClientError(err, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.mqttAdapter.subscribe(topic, qos, on_message);
    }

    /**
     * Subscribes to the rejected topic for the DeleteShadow operation
     *
     *
     * subscribeToDeleteShadowRejected may be called while the device is offline, though the async
     * operation cannot complete successfully until the connection resumes.
     *
     * Once subscribed, `messageHandler` is invoked each time a message matching
     * the `topic` is received. It is possible for such messages to arrive before
     * the SUBACK is received.
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/device-shadow-mqtt.html#delete-rejected-pub-sub-topic
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
                const payload_text = toUtf8(new Uint8Array(payload));
                response = JSON.parse(payload_text) as model.ErrorResponse;
            } catch (err) {
                error = IotShadowClient.createClientError(err, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.mqttAdapter.subscribe(topic, qos, on_message);
    }

    /**
     * Subscribes to the accepted topic for the GetNamedShadow operation.
     *
     *
     * subscribeToGetNamedShadowAccepted may be called while the device is offline, though the async
     * operation cannot complete successfully until the connection resumes.
     *
     * Once subscribed, `messageHandler` is invoked each time a message matching
     * the `topic` is received. It is possible for such messages to arrive before
     * the SUBACK is received.
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/device-shadow-mqtt.html#get-accepted-pub-sub-topic
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
                const payload_text = toUtf8(new Uint8Array(payload));
                response = JSON.parse(payload_text) as model.GetShadowResponse;
            } catch (err) {
                error = IotShadowClient.createClientError(err, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.mqttAdapter.subscribe(topic, qos, on_message);
    }

    /**
     * Subscribes to the rejected topic for the GetNamedShadow operation.
     *
     *
     * subscribeToGetNamedShadowRejected may be called while the device is offline, though the async
     * operation cannot complete successfully until the connection resumes.
     *
     * Once subscribed, `messageHandler` is invoked each time a message matching
     * the `topic` is received. It is possible for such messages to arrive before
     * the SUBACK is received.
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/device-shadow-mqtt.html#get-rejected-pub-sub-topic
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
                const payload_text = toUtf8(new Uint8Array(payload));
                response = JSON.parse(payload_text) as model.ErrorResponse;
            } catch (err) {
                error = IotShadowClient.createClientError(err, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.mqttAdapter.subscribe(topic, qos, on_message);
    }

    /**
     * Subscribes to the accepted topic for the GetShadow operation.
     *
     *
     * subscribeToGetShadowAccepted may be called while the device is offline, though the async
     * operation cannot complete successfully until the connection resumes.
     *
     * Once subscribed, `messageHandler` is invoked each time a message matching
     * the `topic` is received. It is possible for such messages to arrive before
     * the SUBACK is received.
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/device-shadow-mqtt.html#get-accepted-pub-sub-topic
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
                const payload_text = toUtf8(new Uint8Array(payload));
                response = JSON.parse(payload_text) as model.GetShadowResponse;
            } catch (err) {
                error = IotShadowClient.createClientError(err, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.mqttAdapter.subscribe(topic, qos, on_message);
    }

    /**
     * Subscribes to the rejected topic for the GetShadow operation.
     *
     *
     * subscribeToGetShadowRejected may be called while the device is offline, though the async
     * operation cannot complete successfully until the connection resumes.
     *
     * Once subscribed, `messageHandler` is invoked each time a message matching
     * the `topic` is received. It is possible for such messages to arrive before
     * the SUBACK is received.
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/device-shadow-mqtt.html#get-rejected-pub-sub-topic
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
                const payload_text = toUtf8(new Uint8Array(payload));
                response = JSON.parse(payload_text) as model.ErrorResponse;
            } catch (err) {
                error = IotShadowClient.createClientError(err, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.mqttAdapter.subscribe(topic, qos, on_message);
    }

    /**
     * Subscribe to NamedShadowDelta events for a named shadow of an AWS IoT thing.
     *
     *
     * subscribeToNamedShadowDeltaUpdatedEvents may be called while the device is offline, though the async
     * operation cannot complete successfully until the connection resumes.
     *
     * Once subscribed, `messageHandler` is invoked each time a message matching
     * the `topic` is received. It is possible for such messages to arrive before
     * the SUBACK is received.
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/device-shadow-mqtt.html#update-delta-pub-sub-topic
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
                const payload_text = toUtf8(new Uint8Array(payload));
                response = JSON.parse(payload_text) as model.ShadowDeltaUpdatedEvent;
            } catch (err) {
                error = IotShadowClient.createClientError(err, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.mqttAdapter.subscribe(topic, qos, on_message);
    }

    /**
     * Subscribe to ShadowUpdated events for a named shadow of an AWS IoT thing.
     *
     *
     * subscribeToNamedShadowUpdatedEvents may be called while the device is offline, though the async
     * operation cannot complete successfully until the connection resumes.
     *
     * Once subscribed, `messageHandler` is invoked each time a message matching
     * the `topic` is received. It is possible for such messages to arrive before
     * the SUBACK is received.
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/device-shadow-mqtt.html#update-documents-pub-sub-topic
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
        topic = topic.replace("{thingName}", request.thingName);
        topic = topic.replace("{shadowName}", request.shadowName);
        const on_message = (topic: string, payload: ArrayBuffer) => {
            let response: model.ShadowUpdatedEvent | undefined;
            let error: IotShadowError | undefined;
            try {
                const payload_text = toUtf8(new Uint8Array(payload));
                response = JSON.parse(payload_text) as model.ShadowUpdatedEvent;
            } catch (err) {
                error = IotShadowClient.createClientError(err, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.mqttAdapter.subscribe(topic, qos, on_message);
    }

    /**
     * Subscribe to ShadowDelta events for the (classic) shadow of an AWS IoT thing.
     *
     *
     * subscribeToShadowDeltaUpdatedEvents may be called while the device is offline, though the async
     * operation cannot complete successfully until the connection resumes.
     *
     * Once subscribed, `messageHandler` is invoked each time a message matching
     * the `topic` is received. It is possible for such messages to arrive before
     * the SUBACK is received.
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/device-shadow-mqtt.html#update-delta-pub-sub-topic
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
                const payload_text = toUtf8(new Uint8Array(payload));
                response = JSON.parse(payload_text) as model.ShadowDeltaUpdatedEvent;
            } catch (err) {
                error = IotShadowClient.createClientError(err, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.mqttAdapter.subscribe(topic, qos, on_message);
    }

    /**
     * Subscribe to ShadowUpdated events for the (classic) shadow of an AWS IoT thing.
     *
     *
     * subscribeToShadowUpdatedEvents may be called while the device is offline, though the async
     * operation cannot complete successfully until the connection resumes.
     *
     * Once subscribed, `messageHandler` is invoked each time a message matching
     * the `topic` is received. It is possible for such messages to arrive before
     * the SUBACK is received.
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/device-shadow-mqtt.html#update-documents-pub-sub-topic
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
                const payload_text = toUtf8(new Uint8Array(payload));
                response = JSON.parse(payload_text) as model.ShadowUpdatedEvent;
            } catch (err) {
                error = IotShadowClient.createClientError(err, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.mqttAdapter.subscribe(topic, qos, on_message);
    }

    /**
     * Subscribes to the accepted topic for the UpdateNamedShadow operation
     *
     *
     * subscribeToUpdateNamedShadowAccepted may be called while the device is offline, though the async
     * operation cannot complete successfully until the connection resumes.
     *
     * Once subscribed, `messageHandler` is invoked each time a message matching
     * the `topic` is received. It is possible for such messages to arrive before
     * the SUBACK is received.
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/device-shadow-mqtt.html#update-accepted-pub-sub-topic
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
                const payload_text = toUtf8(new Uint8Array(payload));
                response = JSON.parse(payload_text) as model.UpdateShadowResponse;
            } catch (err) {
                error = IotShadowClient.createClientError(err, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.mqttAdapter.subscribe(topic, qos, on_message);
    }

    /**
     * Subscribes to the rejected topic for the UpdateNamedShadow operation
     *
     *
     * subscribeToUpdateNamedShadowRejected may be called while the device is offline, though the async
     * operation cannot complete successfully until the connection resumes.
     *
     * Once subscribed, `messageHandler` is invoked each time a message matching
     * the `topic` is received. It is possible for such messages to arrive before
     * the SUBACK is received.
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/device-shadow-mqtt.html#update-rejected-pub-sub-topic
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
                const payload_text = toUtf8(new Uint8Array(payload));
                response = JSON.parse(payload_text) as model.ErrorResponse;
            } catch (err) {
                error = IotShadowClient.createClientError(err, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.mqttAdapter.subscribe(topic, qos, on_message);
    }

    /**
     * Subscribes to the accepted topic for the UpdateShadow operation
     *
     *
     * subscribeToUpdateShadowAccepted may be called while the device is offline, though the async
     * operation cannot complete successfully until the connection resumes.
     *
     * Once subscribed, `messageHandler` is invoked each time a message matching
     * the `topic` is received. It is possible for such messages to arrive before
     * the SUBACK is received.
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/device-shadow-mqtt.html#update-accepted-pub-sub-topic
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
                const payload_text = toUtf8(new Uint8Array(payload));
                response = JSON.parse(payload_text) as model.UpdateShadowResponse;
            } catch (err) {
                error = IotShadowClient.createClientError(err, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.mqttAdapter.subscribe(topic, qos, on_message);
    }

    /**
     * Subscribes to the rejected topic for the UpdateShadow operation
     *
     *
     * subscribeToUpdateShadowRejected may be called while the device is offline, though the async
     * operation cannot complete successfully until the connection resumes.
     *
     * Once subscribed, `messageHandler` is invoked each time a message matching
     * the `topic` is received. It is possible for such messages to arrive before
     * the SUBACK is received.
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/device-shadow-mqtt.html#update-rejected-pub-sub-topic
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
                const payload_text = toUtf8(new Uint8Array(payload));
                response = JSON.parse(payload_text) as model.ErrorResponse;
            } catch (err) {
                error = IotShadowClient.createClientError(err, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.mqttAdapter.subscribe(topic, qos, on_message);
    }

}
