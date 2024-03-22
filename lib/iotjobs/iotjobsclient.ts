/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 *
 * This file is generated
 */

/**
 * @packageDocumentation
 * @module jobs
 */

import * as model from "./model";
import { mqtt, mqtt5 } from "aws-crt";
import { toUtf8 } from "@aws-sdk/util-utf8-browser"
import * as service_client_mqtt_adapter from "../service_client_mqtt_adapter";

export { model };

/**
 * Error subclass for IotJobs service errors
 *
 * @category IotJobs
 */
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

/**
 * The AWS IoT jobs service can be used to define a set of remote operations that are sent to and executed on one or more devices connected to AWS IoT.
 *
 * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/jobs-api.html#jobs-mqtt-api
 *
 * @category IotJobs
 */
export class IotJobsClient {

    // @ts-ignore
    private mqttAdapter: service_client_mqtt_adapter.IServiceClientMqttAdapter;

    private static INVALID_PAYLOAD_PARSING_ERROR = "Invalid/unknown error parsing payload into response";

    private static createClientError(err: any, payload: ArrayBuffer) : IotJobsError {
        if (err instanceof Error) {
            return new IotJobsError(err.message, payload);
        } else {
            return new IotJobsError( IotJobsClient.INVALID_PAYLOAD_PARSING_ERROR, payload);
        }
    }

    constructor(connection?: mqtt.MqttClientConnection) {
        if (connection !== undefined) {
           this.mqttAdapter = new service_client_mqtt_adapter.ServiceClientMqtt311Adapter(connection);
        }
    }

    /**
     * Creates a new IotJobsClient that uses the SDK Mqtt5 client internally.
     *
     * The pre-existing constructor that is bound to the MQTT311 client makes this awkward since we
     * must support
     *
     * ```
     * new IotJobsClient(mqtt311connection);
     * ```
     *
     * for backwards compatibility, but still want to be able to inject an MQTT5 client as well.
     *
     * @param client the MQTT5 client to use with this service client
     *
     * @returns a new IotJobsClient instance
     */
    static newFromMqtt5Client(client: mqtt5.Mqtt5Client) : IotJobsClient {
        let serviceClient: IotJobsClient = new IotJobsClient();
        serviceClient.mqttAdapter = new service_client_mqtt_adapter.ServiceClientMqtt5Adapter(client);

        return serviceClient;
    }

    /**
     * Gets detailed information about a job execution.
     *
     * If the device is offline, the PUBLISH packet will be sent once the connection resumes.
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/jobs-api.html#mqtt-describejobexecution
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
     * @category IotJobs
     */
    async publishDescribeJobExecution(
        request: model.DescribeJobExecutionRequest,
        qos: mqtt.QoS)
        : Promise<mqtt.MqttRequest> {

        let topic: string = "$aws/things/{thingName}/jobs/{jobId}/get";
        topic = topic.replace("{thingName}", request.thingName);
        topic = topic.replace("{jobId}", request.jobId);
        return this.mqttAdapter.publish(topic, JSON.stringify(request), qos);
    }

    /**
     * Gets the list of all jobs for a thing that are not in a terminal state.
     *
     * If the device is offline, the PUBLISH packet will be sent once the connection resumes.
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/jobs-api.html#mqtt-getpendingjobexecutions
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
     * @category IotJobs
     */
    async publishGetPendingJobExecutions(
        request: model.GetPendingJobExecutionsRequest,
        qos: mqtt.QoS)
        : Promise<mqtt.MqttRequest> {

        let topic: string = "$aws/things/{thingName}/jobs/get";
        topic = topic.replace("{thingName}", request.thingName);
        return this.mqttAdapter.publish(topic, JSON.stringify(request), qos);
    }

    /**
     * Gets and starts the next pending job execution for a thing (status IN_PROGRESS or QUEUED).
     *
     * If the device is offline, the PUBLISH packet will be sent once the connection resumes.
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/jobs-api.html#mqtt-startnextpendingjobexecution
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
     * @category IotJobs
     */
    async publishStartNextPendingJobExecution(
        request: model.StartNextPendingJobExecutionRequest,
        qos: mqtt.QoS)
        : Promise<mqtt.MqttRequest> {

        let topic: string = "$aws/things/{thingName}/jobs/start-next";
        topic = topic.replace("{thingName}", request.thingName);
        return this.mqttAdapter.publish(topic, JSON.stringify(request), qos);
    }

    /**
     * Updates the status of a job execution. You can optionally create a step timer by setting a value for the stepTimeoutInMinutes property. If you don't update the value of this property by running UpdateJobExecution again, the job execution times out when the step timer expires.
     *
     * If the device is offline, the PUBLISH packet will be sent once the connection resumes.
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/jobs-api.html#mqtt-updatejobexecution
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
     * @category IotJobs
     */
    async publishUpdateJobExecution(
        request: model.UpdateJobExecutionRequest,
        qos: mqtt.QoS)
        : Promise<mqtt.MqttRequest> {

        let topic: string = "$aws/things/{thingName}/jobs/{jobId}/update";
        topic = topic.replace("{thingName}", request.thingName);
        topic = topic.replace("{jobId}", request.jobId);
        return this.mqttAdapter.publish(topic, JSON.stringify(request), qos);
    }

    /**
     * Subscribes to the accepted topic for the DescribeJobExecution operation
     *
     *
     * subscribeToDescribeJobExecutionAccepted may be called while the device is offline, though the async
     * operation cannot complete successfully until the connection resumes.
     *
     * Once subscribed, `messageHandler` is invoked each time a message matching
     * the `topic` is received. It is possible for such messages to arrive before
     * the SUBACK is received.
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/jobs-api.html#mqtt-describejobexecution
     *
     * @param request Subscription request configuration
     * @param qos Maximum requested QoS that server may use when sending messages to the client.
     *            The server may grant a lower QoS in the SUBACK
     * @param messageHandler Callback invoked when message or error is received from the server.
     * @returns Promise which returns a `mqtt.MqttSubscribeRequest` which will contain the
     *          result of the SUBSCRIBE. The Promise resolves when a SUBACK is returned
     *          from the server or is rejected when an exception occurs.
     *
     * @category IotJobs
     */
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
                const payload_text = toUtf8(new Uint8Array(payload));
                response = JSON.parse(payload_text) as model.DescribeJobExecutionResponse;
            } catch (err) {
                error = IotJobsClient.createClientError(err, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.mqttAdapter.subscribe(topic, qos, on_message);
    }

    /**
     * Subscribes to the rejected topic for the DescribeJobExecution operation
     *
     *
     * subscribeToDescribeJobExecutionRejected may be called while the device is offline, though the async
     * operation cannot complete successfully until the connection resumes.
     *
     * Once subscribed, `messageHandler` is invoked each time a message matching
     * the `topic` is received. It is possible for such messages to arrive before
     * the SUBACK is received.
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/jobs-api.html#mqtt-describejobexecution
     *
     * @param request Subscription request configuration
     * @param qos Maximum requested QoS that server may use when sending messages to the client.
     *            The server may grant a lower QoS in the SUBACK
     * @param messageHandler Callback invoked when message or error is received from the server.
     * @returns Promise which returns a `mqtt.MqttSubscribeRequest` which will contain the
     *          result of the SUBSCRIBE. The Promise resolves when a SUBACK is returned
     *          from the server or is rejected when an exception occurs.
     *
     * @category IotJobs
     */
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
                const payload_text = toUtf8(new Uint8Array(payload));
                response = JSON.parse(payload_text) as model.RejectedErrorResponse;
            } catch (err) {
                error = IotJobsClient.createClientError(err, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.mqttAdapter.subscribe(topic, qos, on_message);
    }

    /**
     * Subscribes to the accepted topic for the GetPendingJobsExecutions operation
     *
     *
     * subscribeToGetPendingJobExecutionsAccepted may be called while the device is offline, though the async
     * operation cannot complete successfully until the connection resumes.
     *
     * Once subscribed, `messageHandler` is invoked each time a message matching
     * the `topic` is received. It is possible for such messages to arrive before
     * the SUBACK is received.
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/jobs-api.html#mqtt-getpendingjobexecutions
     *
     * @param request Subscription request configuration
     * @param qos Maximum requested QoS that server may use when sending messages to the client.
     *            The server may grant a lower QoS in the SUBACK
     * @param messageHandler Callback invoked when message or error is received from the server.
     * @returns Promise which returns a `mqtt.MqttSubscribeRequest` which will contain the
     *          result of the SUBSCRIBE. The Promise resolves when a SUBACK is returned
     *          from the server or is rejected when an exception occurs.
     *
     * @category IotJobs
     */
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
                const payload_text = toUtf8(new Uint8Array(payload));
                response = JSON.parse(payload_text) as model.GetPendingJobExecutionsResponse;
            } catch (err) {
                error = IotJobsClient.createClientError(err, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.mqttAdapter.subscribe(topic, qos, on_message);
    }

    /**
     * Subscribes to the rejected topic for the GetPendingJobsExecutions operation
     *
     *
     * subscribeToGetPendingJobExecutionsRejected may be called while the device is offline, though the async
     * operation cannot complete successfully until the connection resumes.
     *
     * Once subscribed, `messageHandler` is invoked each time a message matching
     * the `topic` is received. It is possible for such messages to arrive before
     * the SUBACK is received.
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/jobs-api.html#mqtt-getpendingjobexecutions
     *
     * @param request Subscription request configuration
     * @param qos Maximum requested QoS that server may use when sending messages to the client.
     *            The server may grant a lower QoS in the SUBACK
     * @param messageHandler Callback invoked when message or error is received from the server.
     * @returns Promise which returns a `mqtt.MqttSubscribeRequest` which will contain the
     *          result of the SUBSCRIBE. The Promise resolves when a SUBACK is returned
     *          from the server or is rejected when an exception occurs.
     *
     * @category IotJobs
     */
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
                const payload_text = toUtf8(new Uint8Array(payload));
                response = JSON.parse(payload_text) as model.RejectedErrorResponse;
            } catch (err) {
                error = IotJobsClient.createClientError(err, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.mqttAdapter.subscribe(topic, qos, on_message);
    }

    /**
     * Subscribes to JobExecutionsChanged notifications for a given IoT thing.
     *
     *
     * subscribeToJobExecutionsChangedEvents may be called while the device is offline, though the async
     * operation cannot complete successfully until the connection resumes.
     *
     * Once subscribed, `messageHandler` is invoked each time a message matching
     * the `topic` is received. It is possible for such messages to arrive before
     * the SUBACK is received.
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/jobs-api.html#mqtt-jobexecutionschanged
     *
     * @param request Subscription request configuration
     * @param qos Maximum requested QoS that server may use when sending messages to the client.
     *            The server may grant a lower QoS in the SUBACK
     * @param messageHandler Callback invoked when message or error is received from the server.
     * @returns Promise which returns a `mqtt.MqttSubscribeRequest` which will contain the
     *          result of the SUBSCRIBE. The Promise resolves when a SUBACK is returned
     *          from the server or is rejected when an exception occurs.
     *
     * @category IotJobs
     */
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
                const payload_text = toUtf8(new Uint8Array(payload));
                response = JSON.parse(payload_text) as model.JobExecutionsChangedEvent;
            } catch (err) {
                error = IotJobsClient.createClientError(err, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.mqttAdapter.subscribe(topic, qos, on_message);
    }

    /**
     * 
     *
     *
     * subscribeToNextJobExecutionChangedEvents may be called while the device is offline, though the async
     * operation cannot complete successfully until the connection resumes.
     *
     * Once subscribed, `messageHandler` is invoked each time a message matching
     * the `topic` is received. It is possible for such messages to arrive before
     * the SUBACK is received.
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/jobs-api.html#mqtt-nextjobexecutionchanged
     *
     * @param request Subscription request configuration
     * @param qos Maximum requested QoS that server may use when sending messages to the client.
     *            The server may grant a lower QoS in the SUBACK
     * @param messageHandler Callback invoked when message or error is received from the server.
     * @returns Promise which returns a `mqtt.MqttSubscribeRequest` which will contain the
     *          result of the SUBSCRIBE. The Promise resolves when a SUBACK is returned
     *          from the server or is rejected when an exception occurs.
     *
     * @category IotJobs
     */
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
                const payload_text = toUtf8(new Uint8Array(payload));
                response = JSON.parse(payload_text) as model.NextJobExecutionChangedEvent;
            } catch (err) {
                error = IotJobsClient.createClientError(err, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.mqttAdapter.subscribe(topic, qos, on_message);
    }

    /**
     * Subscribes to the accepted topic for the StartNextPendingJobExecution operation
     *
     *
     * subscribeToStartNextPendingJobExecutionAccepted may be called while the device is offline, though the async
     * operation cannot complete successfully until the connection resumes.
     *
     * Once subscribed, `messageHandler` is invoked each time a message matching
     * the `topic` is received. It is possible for such messages to arrive before
     * the SUBACK is received.
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/jobs-api.html#mqtt-startnextpendingjobexecution
     *
     * @param request Subscription request configuration
     * @param qos Maximum requested QoS that server may use when sending messages to the client.
     *            The server may grant a lower QoS in the SUBACK
     * @param messageHandler Callback invoked when message or error is received from the server.
     * @returns Promise which returns a `mqtt.MqttSubscribeRequest` which will contain the
     *          result of the SUBSCRIBE. The Promise resolves when a SUBACK is returned
     *          from the server or is rejected when an exception occurs.
     *
     * @category IotJobs
     */
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
                const payload_text = toUtf8(new Uint8Array(payload));
                response = JSON.parse(payload_text) as model.StartNextJobExecutionResponse;
            } catch (err) {
                error = IotJobsClient.createClientError(err, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.mqttAdapter.subscribe(topic, qos, on_message);
    }

    /**
     * Subscribes to the rejected topic for the StartNextPendingJobExecution operation
     *
     *
     * subscribeToStartNextPendingJobExecutionRejected may be called while the device is offline, though the async
     * operation cannot complete successfully until the connection resumes.
     *
     * Once subscribed, `messageHandler` is invoked each time a message matching
     * the `topic` is received. It is possible for such messages to arrive before
     * the SUBACK is received.
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/jobs-api.html#mqtt-startnextpendingjobexecution
     *
     * @param request Subscription request configuration
     * @param qos Maximum requested QoS that server may use when sending messages to the client.
     *            The server may grant a lower QoS in the SUBACK
     * @param messageHandler Callback invoked when message or error is received from the server.
     * @returns Promise which returns a `mqtt.MqttSubscribeRequest` which will contain the
     *          result of the SUBSCRIBE. The Promise resolves when a SUBACK is returned
     *          from the server or is rejected when an exception occurs.
     *
     * @category IotJobs
     */
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
                const payload_text = toUtf8(new Uint8Array(payload));
                response = JSON.parse(payload_text) as model.RejectedErrorResponse;
            } catch (err) {
                error = IotJobsClient.createClientError(err, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.mqttAdapter.subscribe(topic, qos, on_message);
    }

    /**
     * Subscribes to the accepted topic for the UpdateJobExecution operation
     *
     *
     * subscribeToUpdateJobExecutionAccepted may be called while the device is offline, though the async
     * operation cannot complete successfully until the connection resumes.
     *
     * Once subscribed, `messageHandler` is invoked each time a message matching
     * the `topic` is received. It is possible for such messages to arrive before
     * the SUBACK is received.
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/jobs-api.html#mqtt-updatejobexecution
     *
     * @param request Subscription request configuration
     * @param qos Maximum requested QoS that server may use when sending messages to the client.
     *            The server may grant a lower QoS in the SUBACK
     * @param messageHandler Callback invoked when message or error is received from the server.
     * @returns Promise which returns a `mqtt.MqttSubscribeRequest` which will contain the
     *          result of the SUBSCRIBE. The Promise resolves when a SUBACK is returned
     *          from the server or is rejected when an exception occurs.
     *
     * @category IotJobs
     */
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
                const payload_text = toUtf8(new Uint8Array(payload));
                response = JSON.parse(payload_text) as model.UpdateJobExecutionResponse;
            } catch (err) {
                error = IotJobsClient.createClientError(err, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.mqttAdapter.subscribe(topic, qos, on_message);
    }

    /**
     * Subscribes to the rejected topic for the UpdateJobExecution operation
     *
     *
     * subscribeToUpdateJobExecutionRejected may be called while the device is offline, though the async
     * operation cannot complete successfully until the connection resumes.
     *
     * Once subscribed, `messageHandler` is invoked each time a message matching
     * the `topic` is received. It is possible for such messages to arrive before
     * the SUBACK is received.
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/jobs-api.html#mqtt-updatejobexecution
     *
     * @param request Subscription request configuration
     * @param qos Maximum requested QoS that server may use when sending messages to the client.
     *            The server may grant a lower QoS in the SUBACK
     * @param messageHandler Callback invoked when message or error is received from the server.
     * @returns Promise which returns a `mqtt.MqttSubscribeRequest` which will contain the
     *          result of the SUBSCRIBE. The Promise resolves when a SUBACK is returned
     *          from the server or is rejected when an exception occurs.
     *
     * @category IotJobs
     */
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
                const payload_text = toUtf8(new Uint8Array(payload));
                response = JSON.parse(payload_text) as model.RejectedErrorResponse;
            } catch (err) {
                error = IotJobsClient.createClientError(err, payload);
            }
            finally {
                messageHandler(error, response);
            }
        }

        return this.mqttAdapter.subscribe(topic, qos, on_message);
    }

}
