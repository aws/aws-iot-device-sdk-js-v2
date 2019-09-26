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

export class IotJobsError extends Error {

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

export class IotJobsClient {

    private connection: mqtt.MqttClientConnection;
    private decoder: TextDecoder;

    constructor(connection: mqtt.MqttClientConnection) {
        this.connection = connection;
        this.decoder = new TextDecoder('utf-8');
    }

    async subscribeToJobExecutionsChangedEvents(
        request: model.JobExecutionsChangedSubscriptionRequest,
        qos: mqtt.QoS,
        messageHandler: (error?: IotJobsError, response?: model.JobExecutionsChangedEvent) => void)
        : Promise<mqtt.MqttSubscribeRequest> {

        let topic: string = "$aws/things/{thingName}/jobs/notify";
        topic = topic.replace("{thingName}", request.thingName);
        const on_message = (topic: string, payload: ArrayBuffer) => {
            let response: model.JobExecutionsChangedEvent | undefined;
            let error: IotJobsError | undefined;
            try {
                const payload_text = this.decoder.decode(payload);
                response = JSON.parse(payload_text) as model.JobExecutionsChangedEvent;
            } catch (err) {
                error = new IotJobsError(err.message, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.connection.subscribe(topic, qos, on_message);
    }

    async subscribeToStartNextPendingJobExecutionAccepted(
        request: model.StartNextPendingJobExecutionSubscriptionRequest,
        qos: mqtt.QoS,
        messageHandler: (error?: IotJobsError, response?: model.StartNextJobExecutionResponse) => void)
        : Promise<mqtt.MqttSubscribeRequest> {

        let topic: string = "$aws/things/{thingName}/jobs/start-next/accepted";
        topic = topic.replace("{thingName}", request.thingName);
        const on_message = (topic: string, payload: ArrayBuffer) => {
            let response: model.StartNextJobExecutionResponse | undefined;
            let error: IotJobsError | undefined;
            try {
                const payload_text = this.decoder.decode(payload);
                response = JSON.parse(payload_text) as model.StartNextJobExecutionResponse;
            } catch (err) {
                error = new IotJobsError(err.message, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.connection.subscribe(topic, qos, on_message);
    }

    async subscribeToDescribeJobExecutionRejected(
        request: model.DescribeJobExecutionSubscriptionRequest,
        qos: mqtt.QoS,
        messageHandler: (error?: IotJobsError, response?: model.RejectedErrorResponse) => void)
        : Promise<mqtt.MqttSubscribeRequest> {

        let topic: string = "$aws/things/{thingName}/jobs/{jobId}/get/rejected";
        topic = topic.replace("{thingName}", request.thingName);
        topic = topic.replace("{jobId}", request.jobId);
        const on_message = (topic: string, payload: ArrayBuffer) => {
            let response: model.RejectedErrorResponse | undefined;
            let error: IotJobsError | undefined;
            try {
                const payload_text = this.decoder.decode(payload);
                response = JSON.parse(payload_text) as model.RejectedErrorResponse;
            } catch (err) {
                error = new IotJobsError(err.message, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.connection.subscribe(topic, qos, on_message);
    }

    async subscribeToNextJobExecutionChangedEvents(
        request: model.NextJobExecutionChangedSubscriptionRequest,
        qos: mqtt.QoS,
        messageHandler: (error?: IotJobsError, response?: model.NextJobExecutionChangedEvent) => void)
        : Promise<mqtt.MqttSubscribeRequest> {

        let topic: string = "$aws/things/{thingName}/jobs/notify-next";
        topic = topic.replace("{thingName}", request.thingName);
        const on_message = (topic: string, payload: ArrayBuffer) => {
            let response: model.NextJobExecutionChangedEvent | undefined;
            let error: IotJobsError | undefined;
            try {
                const payload_text = this.decoder.decode(payload);
                response = JSON.parse(payload_text) as model.NextJobExecutionChangedEvent;
            } catch (err) {
                error = new IotJobsError(err.message, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.connection.subscribe(topic, qos, on_message);
    }

    async subscribeToUpdateJobExecutionRejected(
        request: model.UpdateJobExecutionSubscriptionRequest,
        qos: mqtt.QoS,
        messageHandler: (error?: IotJobsError, response?: model.RejectedErrorResponse) => void)
        : Promise<mqtt.MqttSubscribeRequest> {

        let topic: string = "$aws/things/{thingName}/jobs/{jobId}/update/rejected";
        topic = topic.replace("{thingName}", request.thingName);
        topic = topic.replace("{jobId}", request.jobId);
        const on_message = (topic: string, payload: ArrayBuffer) => {
            let response: model.RejectedErrorResponse | undefined;
            let error: IotJobsError | undefined;
            try {
                const payload_text = this.decoder.decode(payload);
                response = JSON.parse(payload_text) as model.RejectedErrorResponse;
            } catch (err) {
                error = new IotJobsError(err.message, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.connection.subscribe(topic, qos, on_message);
    }

    async subscribeToUpdateJobExecutionAccepted(
        request: model.UpdateJobExecutionSubscriptionRequest,
        qos: mqtt.QoS,
        messageHandler: (error?: IotJobsError, response?: model.UpdateJobExecutionResponse) => void)
        : Promise<mqtt.MqttSubscribeRequest> {

        let topic: string = "$aws/things/{thingName}/jobs/{jobId}/update/accepted";
        topic = topic.replace("{thingName}", request.thingName);
        topic = topic.replace("{jobId}", request.jobId);
        const on_message = (topic: string, payload: ArrayBuffer) => {
            let response: model.UpdateJobExecutionResponse | undefined;
            let error: IotJobsError | undefined;
            try {
                const payload_text = this.decoder.decode(payload);
                response = JSON.parse(payload_text) as model.UpdateJobExecutionResponse;
            } catch (err) {
                error = new IotJobsError(err.message, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.connection.subscribe(topic, qos, on_message);
    }

    async publishUpdateJobExecution(
        request: model.UpdateJobExecutionRequest,
        qos: mqtt.QoS)
        : Promise<mqtt.MqttRequest> {

        let topic: string = "$aws/things/{thingName}/jobs/{jobId}/update";
        topic = topic.replace("{thingName}", request.thingName);
        topic = topic.replace("{jobId}", request.jobId);
        return this.connection.publish(topic, JSON.stringify(request), qos);
    }

    async subscribeToDescribeJobExecutionAccepted(
        request: model.DescribeJobExecutionSubscriptionRequest,
        qos: mqtt.QoS,
        messageHandler: (error?: IotJobsError, response?: model.DescribeJobExecutionResponse) => void)
        : Promise<mqtt.MqttSubscribeRequest> {

        let topic: string = "$aws/things/{thingName}/jobs/{jobId}/get/accepted";
        topic = topic.replace("{thingName}", request.thingName);
        topic = topic.replace("{jobId}", request.jobId);
        const on_message = (topic: string, payload: ArrayBuffer) => {
            let response: model.DescribeJobExecutionResponse | undefined;
            let error: IotJobsError | undefined;
            try {
                const payload_text = this.decoder.decode(payload);
                response = JSON.parse(payload_text) as model.DescribeJobExecutionResponse;
            } catch (err) {
                error = new IotJobsError(err.message, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.connection.subscribe(topic, qos, on_message);
    }

    async publishGetPendingJobExecutions(
        request: model.GetPendingJobExecutionsRequest,
        qos: mqtt.QoS)
        : Promise<mqtt.MqttRequest> {

        let topic: string = "$aws/things/{thingName}/jobs/get";
        topic = topic.replace("{thingName}", request.thingName);
        return this.connection.publish(topic, JSON.stringify(request), qos);
    }

    async subscribeToGetPendingJobExecutionsAccepted(
        request: model.GetPendingJobExecutionsSubscriptionRequest,
        qos: mqtt.QoS,
        messageHandler: (error?: IotJobsError, response?: model.GetPendingJobExecutionsResponse) => void)
        : Promise<mqtt.MqttSubscribeRequest> {

        let topic: string = "$aws/things/{thingName}/jobs/get/accepted";
        topic = topic.replace("{thingName}", request.thingName);
        const on_message = (topic: string, payload: ArrayBuffer) => {
            let response: model.GetPendingJobExecutionsResponse | undefined;
            let error: IotJobsError | undefined;
            try {
                const payload_text = this.decoder.decode(payload);
                response = JSON.parse(payload_text) as model.GetPendingJobExecutionsResponse;
            } catch (err) {
                error = new IotJobsError(err.message, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.connection.subscribe(topic, qos, on_message);
    }

    async subscribeToStartNextPendingJobExecutionRejected(
        request: model.StartNextPendingJobExecutionSubscriptionRequest,
        qos: mqtt.QoS,
        messageHandler: (error?: IotJobsError, response?: model.RejectedErrorResponse) => void)
        : Promise<mqtt.MqttSubscribeRequest> {

        let topic: string = "$aws/things/{thingName}/jobs/start-next/rejected";
        topic = topic.replace("{thingName}", request.thingName);
        const on_message = (topic: string, payload: ArrayBuffer) => {
            let response: model.RejectedErrorResponse | undefined;
            let error: IotJobsError | undefined;
            try {
                const payload_text = this.decoder.decode(payload);
                response = JSON.parse(payload_text) as model.RejectedErrorResponse;
            } catch (err) {
                error = new IotJobsError(err.message, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.connection.subscribe(topic, qos, on_message);
    }

    async subscribeToGetPendingJobExecutionsRejected(
        request: model.GetPendingJobExecutionsSubscriptionRequest,
        qos: mqtt.QoS,
        messageHandler: (error?: IotJobsError, response?: model.RejectedErrorResponse) => void)
        : Promise<mqtt.MqttSubscribeRequest> {

        let topic: string = "$aws/things/{thingName}/jobs/get/rejected";
        topic = topic.replace("{thingName}", request.thingName);
        const on_message = (topic: string, payload: ArrayBuffer) => {
            let response: model.RejectedErrorResponse | undefined;
            let error: IotJobsError | undefined;
            try {
                const payload_text = this.decoder.decode(payload);
                response = JSON.parse(payload_text) as model.RejectedErrorResponse;
            } catch (err) {
                error = new IotJobsError(err.message, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.connection.subscribe(topic, qos, on_message);
    }

    async publishStartNextPendingJobExecution(
        request: model.StartNextPendingJobExecutionRequest,
        qos: mqtt.QoS)
        : Promise<mqtt.MqttRequest> {

        let topic: string = "$aws/things/{thingName}/jobs/start-next";
        topic = topic.replace("{thingName}", request.thingName);
        return this.connection.publish(topic, JSON.stringify(request), qos);
    }

    async publishDescribeJobExecution(
        request: model.DescribeJobExecutionRequest,
        qos: mqtt.QoS)
        : Promise<mqtt.MqttRequest> {

        let topic: string = "$aws/things/{thingName}/jobs/{jobId}/get";
        topic = topic.replace("{jobId}", request.jobId);
        topic = topic.replace("{thingName}", request.thingName);
        return this.connection.publish(topic, JSON.stringify(request), qos);
    }

}
