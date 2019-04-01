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
import * as mqtt from "aws-crt/mqtt";
import { TextDecoder } from "util";

export class IotShadowError extends Error {
    constructor(message?: string, payload?: DataView) {
        // 'Error' breaks JS prototype chain when instantiated
        super(message);

        // restore prototype chain
        const myProto = new.target.prototype;
        if (Object.setPrototypeOf) { Object.setPrototypeOf(this, myProto); }
        else { this.__proto__ = myProto; }

        this.payload = payload;
    }

    payload?: DataView;
}

export class IotShadowClient {

    constructor(connection: mqtt.Connection) {
        this.connection = connection;
        this.decoder = new TextDecoder('utf-8');
    }

    async subscribeToUpdateShadowRejected(
        request: model.UpdateShadowSubscriptionRequest,
        qos: mqtt.QoS,
        messageHandler: (error?: IotShadowError, response?: model.ErrorResponse) => void)
        : Promise<mqtt.MqttSubscribeRequest> {

        let topic: string = "$aws/things/{thingName}/shadow/update/rejected";
        topic = topic.replace("{thingName}", request.thingName);
        const on_message = (topic: string, payload: DataView) => {
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

    async publishUpdateShadow(
        request: model.UpdateShadowRequest,
        qos: mqtt.QoS)
        : Promise<mqtt.MqttRequest> {

        let topic: string = "$aws/things/{thingName}/shadow/update";
        topic = topic.replace("{thingName}", request.thingName);
        return this.connection.publish(topic, JSON.stringify(request), qos);
    }

    async publishGetShadow(
        request: model.GetShadowRequest,
        qos: mqtt.QoS)
        : Promise<mqtt.MqttRequest> {

        let topic: string = "$aws/things/{thingName}/shadow/get";
        topic = topic.replace("{thingName}", request.thingName);
        return this.connection.publish(topic, JSON.stringify(request), qos);
    }

    async subscribeToShadowDeltaUpdatedEvents(
        request: model.ShadowDeltaUpdatedSubscriptionRequest,
        qos: mqtt.QoS,
        messageHandler: (error?: IotShadowError, response?: model.ShadowDeltaUpdatedEvent) => void)
        : Promise<mqtt.MqttSubscribeRequest> {

        let topic: string = "$aws/things/{thingName}/shadow/update/delta";
        topic = topic.replace("{thingName}", request.thingName);
        const on_message = (topic: string, payload: DataView) => {
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

    async subscribeToUpdateShadowAccepted(
        request: model.UpdateShadowSubscriptionRequest,
        qos: mqtt.QoS,
        messageHandler: (error?: IotShadowError, response?: model.UpdateShadowResponse) => void)
        : Promise<mqtt.MqttSubscribeRequest> {

        let topic: string = "$aws/things/{thingName}/shadow/update/accepted";
        topic = topic.replace("{thingName}", request.thingName);
        const on_message = (topic: string, payload: DataView) => {
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

    async publishDeleteShadow(
        request: model.DeleteShadowRequest,
        qos: mqtt.QoS)
        : Promise<mqtt.MqttRequest> {

        let topic: string = "$aws/things/{thingName}/shadow/delete";
        topic = topic.replace("{thingName}", request.thingName);
        return this.connection.publish(topic, JSON.stringify(request), qos);
    }

    async subscribeToDeleteShadowAccepted(
        request: model.DeleteShadowSubscriptionRequest,
        qos: mqtt.QoS,
        messageHandler: (error?: IotShadowError, response?: model.DeleteShadowResponse) => void)
        : Promise<mqtt.MqttSubscribeRequest> {

        let topic: string = "$aws/things/{thingName}/shadow/delete/accepted";
        topic = topic.replace("{thingName}", request.thingName);
        const on_message = (topic: string, payload: DataView) => {
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

    async subscribeToGetShadowAccepted(
        request: model.GetShadowSubscriptionRequest,
        qos: mqtt.QoS,
        messageHandler: (error?: IotShadowError, response?: model.GetShadowResponse) => void)
        : Promise<mqtt.MqttSubscribeRequest> {

        let topic: string = "$aws/things/{thingName}/shadow/get/accepted";
        topic = topic.replace("{thingName}", request.thingName);
        const on_message = (topic: string, payload: DataView) => {
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

    async subscribeToShadowUpdatedEvents(
        request: model.ShadowUpdatedSubscriptionRequest,
        qos: mqtt.QoS,
        messageHandler: (error?: IotShadowError, response?: model.ShadowUpdatedEvent) => void)
        : Promise<mqtt.MqttSubscribeRequest> {

        let topic: string = "$aws/things/{thingName}/shadow/update/documents";
        topic = topic.replace("{thingName}", request.thingName);
        const on_message = (topic: string, payload: DataView) => {
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

    async subscribeToDeleteShadowRejected(
        request: model.DeleteShadowSubscriptionRequest,
        qos: mqtt.QoS,
        messageHandler: (error?: IotShadowError, response?: model.ErrorResponse) => void)
        : Promise<mqtt.MqttSubscribeRequest> {

        let topic: string = "$aws/things/{thingName}/shadow/delete/rejected";
        topic = topic.replace("{thingName}", request.thingName);
        const on_message = (topic: string, payload: DataView) => {
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

    async subscribeToGetShadowRejected(
        request: model.GetShadowSubscriptionRequest,
        qos: mqtt.QoS,
        messageHandler: (error?: IotShadowError, response?: model.ErrorResponse) => void)
        : Promise<mqtt.MqttSubscribeRequest> {

        let topic: string = "$aws/things/{thingName}/shadow/get/rejected";
        topic = topic.replace("{thingName}", request.thingName);
        const on_message = (topic: string, payload: DataView) => {
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

}
