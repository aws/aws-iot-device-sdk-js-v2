/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 *
 * This file is generated
 */

/**
 * @packageDocumentation
 * @module identity
 */

import * as model from "./model";
import { mqtt, mqtt5 } from "aws-crt";
import { toUtf8 } from "@aws-sdk/util-utf8-browser"
import * as service_client_mqtt_adapter from "../service_client_mqtt_adapter";

export { model };

/**
 * Error subclass for IotIdentity service errors
 *
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
 * An AWS IoT service that assists with provisioning a device and installing unique client certificates on it
 *
 * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/provision-wo-cert.html
 *
 * @category IotIdentity
 */
export class IotIdentityClient {

    // @ts-ignore
    private mqttAdapter: service_client_mqtt_adapter.IServiceClientMqttAdapter;

    private static INVALID_PAYLOAD_PARSING_ERROR = "Invalid/unknown error parsing payload into response";

    private static createClientError(err: any, payload: ArrayBuffer) : IotIdentityError {
        if (err instanceof Error) {
            return new IotIdentityError(err.message, payload);
        } else {
            return new IotIdentityError( IotIdentityClient.INVALID_PAYLOAD_PARSING_ERROR, payload);
        }
    }

    constructor(connection?: mqtt.MqttClientConnection) {
        if (connection !== undefined) {
           this.mqttAdapter = new service_client_mqtt_adapter.ServiceClientMqtt311Adapter(connection);
        }
    }

    /**
     * Creates a new IotIdentityClient that uses the SDK Mqtt5 client internally.
     *
     * The pre-existing constructor that is bound to the MQTT311 client makes this awkward since we
     * must support
     *
     * ```
     * new IotIdentityClient(mqtt311connection);
     * ```
     *
     * for backwards compatibility, but still want to be able to inject an MQTT5 client as well.
     *
     * @param client the MQTT5 client to use with this service client
     *
     * @returns a new IotIdentityClient instance
     */
    static newFromMqtt5Client(client: mqtt5.Mqtt5Client) : IotIdentityClient {
        let serviceClient: IotIdentityClient = new IotIdentityClient();
        serviceClient.mqttAdapter = new service_client_mqtt_adapter.ServiceClientMqtt5Adapter(client);

        return serviceClient;
    }

    /**
     * Creates a certificate from a certificate signing request (CSR). AWS IoT provides client certificates that are signed by the Amazon Root certificate authority (CA). The new certificate has a PENDING_ACTIVATION status. When you call RegisterThing to provision a thing with this certificate, the certificate status changes to ACTIVE or INACTIVE as described in the template.
     *
     * If the device is offline, the PUBLISH packet will be sent once the connection resumes.
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/provision-wo-cert.html#fleet-provision-api
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
        return this.mqttAdapter.publish(topic, JSON.stringify(request), qos);
    }

    /**
     * Creates new keys and a certificate. AWS IoT provides client certificates that are signed by the Amazon Root certificate authority (CA). The new certificate has a PENDING_ACTIVATION status. When you call RegisterThing to provision a thing with this certificate, the certificate status changes to ACTIVE or INACTIVE as described in the template.
     *
     * If the device is offline, the PUBLISH packet will be sent once the connection resumes.
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/provision-wo-cert.html#fleet-provision-api
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
        return this.mqttAdapter.publish(topic, JSON.stringify(request), qos);
    }

    /**
     * Provisions an AWS IoT thing using a pre-defined template.
     *
     * If the device is offline, the PUBLISH packet will be sent once the connection resumes.
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/provision-wo-cert.html#fleet-provision-api
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
        return this.mqttAdapter.publish(topic, JSON.stringify(request), qos);
    }

    /**
     * Subscribes to the accepted topic of the CreateCertificateFromCsr operation.
     *
     *
     * subscribeToCreateCertificateFromCsrAccepted may be called while the device is offline, though the async
     * operation cannot complete successfully until the connection resumes.
     *
     * Once subscribed, `messageHandler` is invoked each time a message matching
     * the `topic` is received. It is possible for such messages to arrive before
     * the SUBACK is received.
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/provision-wo-cert.html#fleet-provision-api
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
                const payload_text = toUtf8(new Uint8Array(payload));
                response = JSON.parse(payload_text) as model.CreateCertificateFromCsrResponse;
            } catch (err) {
                error = IotIdentityClient.createClientError(err, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.mqttAdapter.subscribe(topic, qos, on_message);
    }

    /**
     * Subscribes to the rejected topic of the CreateCertificateFromCsr operation.
     *
     *
     * subscribeToCreateCertificateFromCsrRejected may be called while the device is offline, though the async
     * operation cannot complete successfully until the connection resumes.
     *
     * Once subscribed, `messageHandler` is invoked each time a message matching
     * the `topic` is received. It is possible for such messages to arrive before
     * the SUBACK is received.
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/provision-wo-cert.html#fleet-provision-api
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
                const payload_text = toUtf8(new Uint8Array(payload));
                response = JSON.parse(payload_text) as model.ErrorResponse;
            } catch (err) {
                error = IotIdentityClient.createClientError(err, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.mqttAdapter.subscribe(topic, qos, on_message);
    }

    /**
     * Subscribes to the accepted topic of the CreateKeysAndCertificate operation.
     *
     *
     * subscribeToCreateKeysAndCertificateAccepted may be called while the device is offline, though the async
     * operation cannot complete successfully until the connection resumes.
     *
     * Once subscribed, `messageHandler` is invoked each time a message matching
     * the `topic` is received. It is possible for such messages to arrive before
     * the SUBACK is received.
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/provision-wo-cert.html#fleet-provision-api
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
                const payload_text = toUtf8(new Uint8Array(payload));
                response = JSON.parse(payload_text) as model.CreateKeysAndCertificateResponse;
            } catch (err) {
                error = IotIdentityClient.createClientError(err, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.mqttAdapter.subscribe(topic, qos, on_message);
    }

    /**
     * Subscribes to the rejected topic of the CreateKeysAndCertificate operation.
     *
     *
     * subscribeToCreateKeysAndCertificateRejected may be called while the device is offline, though the async
     * operation cannot complete successfully until the connection resumes.
     *
     * Once subscribed, `messageHandler` is invoked each time a message matching
     * the `topic` is received. It is possible for such messages to arrive before
     * the SUBACK is received.
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/provision-wo-cert.html#fleet-provision-api
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
                const payload_text = toUtf8(new Uint8Array(payload));
                response = JSON.parse(payload_text) as model.ErrorResponse;
            } catch (err) {
                error = IotIdentityClient.createClientError(err, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.mqttAdapter.subscribe(topic, qos, on_message);
    }

    /**
     * Subscribes to the accepted topic of the RegisterThing operation.
     *
     *
     * subscribeToRegisterThingAccepted may be called while the device is offline, though the async
     * operation cannot complete successfully until the connection resumes.
     *
     * Once subscribed, `messageHandler` is invoked each time a message matching
     * the `topic` is received. It is possible for such messages to arrive before
     * the SUBACK is received.
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/provision-wo-cert.html#fleet-provision-api
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
                const payload_text = toUtf8(new Uint8Array(payload));
                response = JSON.parse(payload_text) as model.RegisterThingResponse;
            } catch (err) {
                error = IotIdentityClient.createClientError(err, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.mqttAdapter.subscribe(topic, qos, on_message);
    }

    /**
     * Subscribes to the rejected topic of the RegisterThing operation.
     *
     *
     * subscribeToRegisterThingRejected may be called while the device is offline, though the async
     * operation cannot complete successfully until the connection resumes.
     *
     * Once subscribed, `messageHandler` is invoked each time a message matching
     * the `topic` is received. It is possible for such messages to arrive before
     * the SUBACK is received.
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/provision-wo-cert.html#fleet-provision-api
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
                const payload_text = toUtf8(new Uint8Array(payload));
                response = JSON.parse(payload_text) as model.ErrorResponse;
            } catch (err) {
                error = IotIdentityClient.createClientError(err, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.mqttAdapter.subscribe(topic, qos, on_message);
    }

}
