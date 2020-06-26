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
 * @category IotIdentity
 */
export class IotIdentityError extends Error {

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
 * API Documentation: https://docs.aws.amazon.com/iot/latest/developerguide/provision-wo-cert.html
 *
 * @module aws-iot-device-sdk
 * @category IotIdentity
 */
export class IotIdentityClient {

    private decoder = new TextDecoder('utf-8');

    constructor(private connection: mqtt.MqttClientConnection) {
    }

    /**
     * API Documentation: https://docs.aws.amazon.com/iot/latest/developerguide/provision-wo-cert.html#fleet-provision-api
     * Publish CreateKeysAndCertificate message
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
     * @category IotIdentity
     */
    async publishCreateKeysAndCertificate(
        request: model.CreateKeysAndCertificateRequest,
        qos: mqtt.QoS)
        : Promise<mqtt.MqttRequest> {

        let topic: string = "$aws/certificates/create/json";
        return this.connection.publish(topic, JSON.stringify(request), qos);
    }

    /**
     * API Documentation: https://docs.aws.amazon.com/iot/latest/developerguide/provision-wo-cert.html#fleet-provision-api
     *
     * Subscribe to CreateKeysAndCertificateAccepted messages
     *
     * subscribeToCreateKeysAndCertificateAccepted may be called while the device is offline, though the async
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
     * @category IotIdentity
     */
    async subscribeToCreateKeysAndCertificateAccepted(
        request: model.CreateKeysAndCertificateSubscriptionRequest,
        qos: mqtt.QoS,
        messageHandler: (error?: IotIdentityError, response?: model.CreateKeysAndCertificateResponse) => void)
        : Promise<mqtt.MqttSubscribeRequest> {

        let topic: string = "$aws/certificates/create/json/accepted";
        const on_message = (topic: string, payload: ArrayBuffer) => {
            let response: model.CreateKeysAndCertificateResponse | undefined;
            let error: IotIdentityError | undefined;
            try {
                const payload_text = this.decoder.decode(payload);
                response = JSON.parse(payload_text) as model.CreateKeysAndCertificateResponse;
            } catch (err) {
                error = new IotIdentityError(err.message, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.connection.subscribe(topic, qos, on_message);
    }

    /**
     * API Documentation: https://docs.aws.amazon.com/iot/latest/developerguide/provision-wo-cert.html#fleet-provision-api
     *
     * Subscribe to CreateKeysAndCertificateRejected messages
     *
     * subscribeToCreateKeysAndCertificateRejected may be called while the device is offline, though the async
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
     * @category IotIdentity
     */
    async subscribeToCreateKeysAndCertificateRejected(
        request: model.CreateKeysAndCertificateSubscriptionRequest,
        qos: mqtt.QoS,
        messageHandler: (error?: IotIdentityError, response?: model.ErrorResponse) => void)
        : Promise<mqtt.MqttSubscribeRequest> {

        let topic: string = "$aws/certificates/create/json/rejected";
        const on_message = (topic: string, payload: ArrayBuffer) => {
            let response: model.ErrorResponse | undefined;
            let error: IotIdentityError | undefined;
            try {
                const payload_text = this.decoder.decode(payload);
                response = JSON.parse(payload_text) as model.ErrorResponse;
            } catch (err) {
                error = new IotIdentityError(err.message, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.connection.subscribe(topic, qos, on_message);
    }

    /**
     * API Documentation: https://docs.aws.amazon.com/iot/latest/developerguide/provision-wo-cert.html#fleet-provision-api
     *
     * Subscribe to RegisterThingRejected messages
     *
     * subscribeToRegisterThingRejected may be called while the device is offline, though the async
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
     * @category IotIdentity
     */
    async subscribeToRegisterThingRejected(
        request: model.RegisterThingSubscriptionRequest,
        qos: mqtt.QoS,
        messageHandler: (error?: IotIdentityError, response?: model.ErrorResponse) => void)
        : Promise<mqtt.MqttSubscribeRequest> {

        let topic: string = "$aws/provisioning-templates/{templateName}/provision/json/rejected";
        topic = topic.replace("{templateName}", request.templateName);
        const on_message = (topic: string, payload: ArrayBuffer) => {
            let response: model.ErrorResponse | undefined;
            let error: IotIdentityError | undefined;
            try {
                const payload_text = this.decoder.decode(payload);
                response = JSON.parse(payload_text) as model.ErrorResponse;
            } catch (err) {
                error = new IotIdentityError(err.message, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.connection.subscribe(topic, qos, on_message);
    }

    /**
     * API Documentation: https://docs.aws.amazon.com/iot/latest/developerguide/provision-wo-cert.html#fleet-provision-api
     *
     * Subscribe to CreateCertificateFromCsrAccepted messages
     *
     * subscribeToCreateCertificateFromCsrAccepted may be called while the device is offline, though the async
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
     * @category IotIdentity
     */
    async subscribeToCreateCertificateFromCsrAccepted(
        request: model.CreateCertificateFromCsrSubscriptionRequest,
        qos: mqtt.QoS,
        messageHandler: (error?: IotIdentityError, response?: model.CreateCertificateFromCsrResponse) => void)
        : Promise<mqtt.MqttSubscribeRequest> {

        let topic: string = "$aws/certificates/create-from-csr/json/accepted";
        const on_message = (topic: string, payload: ArrayBuffer) => {
            let response: model.CreateCertificateFromCsrResponse | undefined;
            let error: IotIdentityError | undefined;
            try {
                const payload_text = this.decoder.decode(payload);
                response = JSON.parse(payload_text) as model.CreateCertificateFromCsrResponse;
            } catch (err) {
                error = new IotIdentityError(err.message, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.connection.subscribe(topic, qos, on_message);
    }

    /**
     * API Documentation: https://docs.aws.amazon.com/iot/latest/developerguide/provision-wo-cert.html#fleet-provision-api
     * Publish RegisterThing message
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
     * @category IotIdentity
     */
    async publishRegisterThing(
        request: model.RegisterThingRequest,
        qos: mqtt.QoS)
        : Promise<mqtt.MqttRequest> {

        let topic: string = "$aws/provisioning-templates/{templateName}/provision/json";
        topic = topic.replace("{templateName}", request.templateName);
        return this.connection.publish(topic, JSON.stringify(request), qos);
    }

    /**
     * API Documentation: https://docs.aws.amazon.com/iot/latest/developerguide/provision-wo-cert.html#fleet-provision-api
     *
     * Subscribe to RegisterThingAccepted messages
     *
     * subscribeToRegisterThingAccepted may be called while the device is offline, though the async
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
     * @category IotIdentity
     */
    async subscribeToRegisterThingAccepted(
        request: model.RegisterThingSubscriptionRequest,
        qos: mqtt.QoS,
        messageHandler: (error?: IotIdentityError, response?: model.RegisterThingResponse) => void)
        : Promise<mqtt.MqttSubscribeRequest> {

        let topic: string = "$aws/provisioning-templates/{templateName}/provision/json/accepted";
        topic = topic.replace("{templateName}", request.templateName);
        const on_message = (topic: string, payload: ArrayBuffer) => {
            let response: model.RegisterThingResponse | undefined;
            let error: IotIdentityError | undefined;
            try {
                const payload_text = this.decoder.decode(payload);
                response = JSON.parse(payload_text) as model.RegisterThingResponse;
            } catch (err) {
                error = new IotIdentityError(err.message, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.connection.subscribe(topic, qos, on_message);
    }

    /**
     * API Documentation: https://docs.aws.amazon.com/iot/latest/developerguide/provision-wo-cert.html#fleet-provision-api
     *
     * Subscribe to CreateCertificateFromCsrRejected messages
     *
     * subscribeToCreateCertificateFromCsrRejected may be called while the device is offline, though the async
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
     * @category IotIdentity
     */
    async subscribeToCreateCertificateFromCsrRejected(
        request: model.CreateCertificateFromCsrSubscriptionRequest,
        qos: mqtt.QoS,
        messageHandler: (error?: IotIdentityError, response?: model.ErrorResponse) => void)
        : Promise<mqtt.MqttSubscribeRequest> {

        let topic: string = "$aws/certificates/create-from-csr/json/rejected";
        const on_message = (topic: string, payload: ArrayBuffer) => {
            let response: model.ErrorResponse | undefined;
            let error: IotIdentityError | undefined;
            try {
                const payload_text = this.decoder.decode(payload);
                response = JSON.parse(payload_text) as model.ErrorResponse;
            } catch (err) {
                error = new IotIdentityError(err.message, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.connection.subscribe(topic, qos, on_message);
    }

    /**
     * API Documentation: https://docs.aws.amazon.com/iot/latest/developerguide/provision-wo-cert.html#fleet-provision-api
     * Publish CreateCertificateFromCsr message
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
     * @category IotIdentity
     */
    async publishCreateCertificateFromCsr(
        request: model.CreateCertificateFromCsrRequest,
        qos: mqtt.QoS)
        : Promise<mqtt.MqttRequest> {

        let topic: string = "$aws/certificates/create-from-csr/json";
        return this.connection.publish(topic, JSON.stringify(request), qos);
    }

}
