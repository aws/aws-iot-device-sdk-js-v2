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

import {mqtt, mqtt5} from 'aws-crt';
import {mqtt_request_response as mqtt_rr_internal} from 'aws-crt';
import * as mqtt_request_response from '../mqtt_request_response';
import * as mqtt_request_response_utils from '../mqtt_request_response_utils';
import * as model from './model';
import * as v2utils from './v2utils';

/**
 * The AWS IoT jobs service can be used to define a set of remote operations that are sent to and executed on one or more devices connected to AWS IoT.
 *
 * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/jobs-api.html#jobs-mqtt-api
 *
 * @category IotJobs
 */
export class IotJobsClientv2 {
    private rrClient : mqtt_rr_internal.RequestResponseClient;
    private serviceModel : mqtt_request_response_utils.RequestResponseServiceModel;

    private constructor(rrClient: mqtt_rr_internal.RequestResponseClient) {
        this.rrClient = rrClient;
        this.serviceModel = v2utils.makeServiceModel();
    }

    /**
     * Creates a new service client that will use an SDK MQTT 311 client as transport.
     *
     * @param protocolClient the MQTT 311 client to use for transport
     * @param options additional service client configuration options
     *
     * @return a new service client
     *
     */
    static newFromMqtt311(protocolClient: mqtt.MqttClientConnection, options: mqtt_rr_internal.RequestResponseClientOptions) : IotJobsClientv2 {
        let rrClient = mqtt_rr_internal.RequestResponseClient.newFromMqtt311(protocolClient, options);
        return new IotJobsClientv2(rrClient);
    }

    /**
     * Creates a new service client that will use an SDK MQTT 5 client as transport.
     *
     * @param protocolClient the MQTT 5 client to use for transport
     * @param options additional service client configuration options
     *
     * @return a new service client
     *
     */
    static newFromMqtt5(protocolClient: mqtt5.Mqtt5Client, options: mqtt_rr_internal.RequestResponseClientOptions) : IotJobsClientv2 {
        let rrClient = mqtt_rr_internal.RequestResponseClient.newFromMqtt5(protocolClient, options);
        return new IotJobsClientv2(rrClient);
    }

    /**
     * Triggers cleanup of all resources associated with the service client.  Closing a client will fail
     * all incomplete requests and close all unclosed streaming operations.
     *
     * This must be called when finished with a client; otherwise, native resources will leak.
     */
    close() {
        this.rrClient.close();
    }

    /**
     * Gets detailed information about a job execution.
     *
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/jobs-api.html#mqtt-describejobexecution
     *
     * @param request operation to perform
     *
     * @returns Promise which resolves into the response to the request
     *
     * @category IotJobsV2
     */
    async describeJobExecution(request: model.DescribeJobExecutionRequest) : Promise<model.DescribeJobExecutionResponse> {

        let config = {
            operationName: "describeJobExecution",
            serviceModel: this.serviceModel,
            client: this.rrClient,
            request: request
        };

        return await mqtt_request_response_utils.doRequestResponse<model.DescribeJobExecutionResponse>(config);
    }

    /**
     * Gets the list of all jobs for a thing that are not in a terminal state.
     *
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/jobs-api.html#mqtt-getpendingjobexecutions
     *
     * @param request operation to perform
     *
     * @returns Promise which resolves into the response to the request
     *
     * @category IotJobsV2
     */
    async getPendingJobExecutions(request: model.GetPendingJobExecutionsRequest) : Promise<model.GetPendingJobExecutionsResponse> {

        let config = {
            operationName: "getPendingJobExecutions",
            serviceModel: this.serviceModel,
            client: this.rrClient,
            request: request
        };

        return await mqtt_request_response_utils.doRequestResponse<model.GetPendingJobExecutionsResponse>(config);
    }

    /**
     * Gets and starts the next pending job execution for a thing (status IN_PROGRESS or QUEUED).
     *
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/jobs-api.html#mqtt-startnextpendingjobexecution
     *
     * @param request operation to perform
     *
     * @returns Promise which resolves into the response to the request
     *
     * @category IotJobsV2
     */
    async startNextPendingJobExecution(request: model.StartNextPendingJobExecutionRequest) : Promise<model.StartNextJobExecutionResponse> {

        let config = {
            operationName: "startNextPendingJobExecution",
            serviceModel: this.serviceModel,
            client: this.rrClient,
            request: request
        };

        return await mqtt_request_response_utils.doRequestResponse<model.StartNextJobExecutionResponse>(config);
    }

    /**
     * Updates the status of a job execution. You can optionally create a step timer by setting a value for the stepTimeoutInMinutes property. If you don't update the value of this property by running UpdateJobExecution again, the job execution times out when the step timer expires.
     *
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/jobs-api.html#mqtt-updatejobexecution
     *
     * @param request operation to perform
     *
     * @returns Promise which resolves into the response to the request
     *
     * @category IotJobsV2
     */
    async updateJobExecution(request: model.UpdateJobExecutionRequest) : Promise<model.UpdateJobExecutionResponse> {

        let config = {
            operationName: "updateJobExecution",
            serviceModel: this.serviceModel,
            client: this.rrClient,
            request: request
        };

        return await mqtt_request_response_utils.doRequestResponse<model.UpdateJobExecutionResponse>(config);
    }

    /**
     * Creates a stream of JobExecutionsChanged notifications for a given IoT thing.
     *
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/jobs-api.html#mqtt-jobexecutionschanged
     *
     * @param config streaming operation configuration options
     *
     * @returns a streaming operation which will emit an event every time a message is received on the
     *    associated MQTT topic
     *
     * @category IotJobsV2
     */
    createJobExecutionsChangedStream(config: model.JobExecutionsChangedSubscriptionRequest)
        : mqtt_request_response.StreamingOperation<model.JobExecutionsChangedEvent> {

        let streamingOperationConfig : mqtt_request_response_utils.StreamingOperationConfig = {
            operationName: "createJobExecutionsChangedStream",
            serviceModel: this.serviceModel,
            client: this.rrClient,
            modelConfig: config,
        };

        return mqtt_request_response.StreamingOperation.create(streamingOperationConfig);
    }

    /**
     * 
     *
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/jobs-api.html#mqtt-nextjobexecutionchanged
     *
     * @param config streaming operation configuration options
     *
     * @returns a streaming operation which will emit an event every time a message is received on the
     *    associated MQTT topic
     *
     * @category IotJobsV2
     */
    createNextJobExecutionChangedStream(config: model.NextJobExecutionChangedSubscriptionRequest)
        : mqtt_request_response.StreamingOperation<model.NextJobExecutionChangedEvent> {

        let streamingOperationConfig : mqtt_request_response_utils.StreamingOperationConfig = {
            operationName: "createNextJobExecutionChangedStream",
            serviceModel: this.serviceModel,
            client: this.rrClient,
            modelConfig: config,
        };

        return mqtt_request_response.StreamingOperation.create(streamingOperationConfig);
    }

}
