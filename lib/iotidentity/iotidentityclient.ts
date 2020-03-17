/* Copyright 2010-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
*
* Licensed under the Apache License, Version 2.0 (the "License").
* You may not use this file except in compliance with the License.
* A copy of the License is located at
*
*  http://aws.amazon.com/apache2.0
*
* or in the "license" file accompanying this file. This file is distributed
* on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
* express or implied. See the License for the specific language governing
* permissions and limitations under the License.

* This file is generated
*/

import * as model from "./model";
import { mqtt } from "aws-crt";
import { TextDecoder } from "util";
export { model };

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

export class IotIdentityClient {

    private connection: mqtt.MqttClientConnection;
    private decoder: TextDecoder;

    constructor(connection: mqtt.MqttClientConnection) {
        this.connection = connection;
        this.decoder = new TextDecoder('utf-8');
    }

    async publishCreateKeysAndCertificate(
        request: model.CreateKeysAndCertificateRequest,
        qos: mqtt.QoS)
        : Promise<mqtt.MqttRequest> {

        let topic: string = "$aws/certificates/create/json";
        return this.connection.publish(topic, "", qos);
    }

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

    async publishRegisterThing(
        request: model.RegisterThingRequest,
        qos: mqtt.QoS)
        : Promise<mqtt.MqttRequest> {

        let topic: string = "$aws/provisioning-templates/{templateName}/provision/json";
        topic = topic.replace("{templateName}", request.templateName);
        return this.connection.publish(topic, JSON.stringify(request), qos);
    }

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

    async publishCreateCertificateFromCsr(
        request: model.CreateCertificateFromCsrRequest,
        qos: mqtt.QoS)
        : Promise<mqtt.MqttRequest> {

        let topic: string = "$aws/certificates/create-from-csr/json";
        return this.connection.publish(topic, JSON.stringify(request), qos);
    }

}
