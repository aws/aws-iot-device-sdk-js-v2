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

import {mqtt, mqtt5} from 'aws-crt';
import {mqtt_request_response as mqtt_rr_internal} from 'aws-crt';
import * as mqtt_request_response from '../mqtt_request_response';
import * as mqtt_request_response_utils from '../mqtt_request_response_utils';
import * as model from './model';
import * as clientv2_utils from './v2utils';

/**
 * The AWS IoT Device Shadow service adds shadows to AWS IoT thing objects. Shadows are a simple data store for device properties and state.  Shadows can make a device’s state available to apps and other services whether the device is connected to AWS IoT or not.
 *
 * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/device-shadow-mqtt.html
 *
 * @category IotShadow
 */
export class IotShadowClientv2 {
    private rrClient : mqtt_rr_internal.RequestResponseClient;
    private serviceModel : mqtt_request_response_utils.RequestResponseServiceModel;

    private constructor(rrClient: mqtt_rr_internal.RequestResponseClient) {
        this.rrClient = rrClient;
        this.serviceModel = clientv2_utils.makeServiceModel();
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
    static newFromMqtt311(protocolClient: mqtt.MqttClientConnection, options: mqtt_rr_internal.RequestResponseClientOptions) : IotShadowClientv2 {
        let rrClient = mqtt_rr_internal.RequestResponseClient.newFromMqtt311(protocolClient, options);
        return new IotShadowClientv2(rrClient);
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
    static newFromMqtt5(protocolClient: mqtt5.Mqtt5Client, options: mqtt_rr_internal.RequestResponseClientOptions) : IotShadowClientv2 {
        let rrClient = mqtt_rr_internal.RequestResponseClient.newFromMqtt5(protocolClient, options);
        return new IotShadowClientv2(rrClient);
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
     * Deletes a named shadow for an AWS IoT thing.
     *
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/device-shadow-mqtt.html#delete-pub-sub-topic
     *
     * @param request operation to perform
     *
     * @returns Promise which resolves into the response to the request
     *
     * @category IotShadowV2
     */
    async deleteNamedShadow(request: model.DeleteNamedShadowRequest) : Promise<model.DeleteShadowResponse> {

        let config = {
            operationName: "deleteNamedShadow",
            serviceModel: this.serviceModel,
            client: this.rrClient,
            request: request
        };

        return await mqtt_request_response_utils.doRequestResponse<model.DeleteShadowResponse>(config);
    }

    /**
     * Deletes the (classic) shadow for an AWS IoT thing.
     *
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/device-shadow-mqtt.html#delete-pub-sub-topic
     *
     * @param request operation to perform
     *
     * @returns Promise which resolves into the response to the request
     *
     * @category IotShadowV2
     */
    async deleteShadow(request: model.DeleteShadowRequest) : Promise<model.DeleteShadowResponse> {

        let config = {
            operationName: "deleteShadow",
            serviceModel: this.serviceModel,
            client: this.rrClient,
            request: request
        };

        return await mqtt_request_response_utils.doRequestResponse<model.DeleteShadowResponse>(config);
    }

    /**
     * Gets a named shadow for an AWS IoT thing.
     *
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/device-shadow-mqtt.html#get-pub-sub-topic
     *
     * @param request operation to perform
     *
     * @returns Promise which resolves into the response to the request
     *
     * @category IotShadowV2
     */
    async getNamedShadow(request: model.GetNamedShadowRequest) : Promise<model.GetShadowResponse> {

        let config = {
            operationName: "getNamedShadow",
            serviceModel: this.serviceModel,
            client: this.rrClient,
            request: request
        };

        return await mqtt_request_response_utils.doRequestResponse<model.GetShadowResponse>(config);
    }

    /**
     * Gets the (classic) shadow for an AWS IoT thing.
     *
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/device-shadow-mqtt.html#get-pub-sub-topic
     *
     * @param request operation to perform
     *
     * @returns Promise which resolves into the response to the request
     *
     * @category IotShadowV2
     */
    async getShadow(request: model.GetShadowRequest) : Promise<model.GetShadowResponse> {

        let config = {
            operationName: "getShadow",
            serviceModel: this.serviceModel,
            client: this.rrClient,
            request: request
        };

        return await mqtt_request_response_utils.doRequestResponse<model.GetShadowResponse>(config);
    }

    /**
     * Update a named shadow for a device.
     *
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/device-shadow-mqtt.html#update-pub-sub-topic
     *
     * @param request operation to perform
     *
     * @returns Promise which resolves into the response to the request
     *
     * @category IotShadowV2
     */
    async updateNamedShadow(request: model.UpdateNamedShadowRequest) : Promise<model.UpdateShadowResponse> {

        let config = {
            operationName: "updateNamedShadow",
            serviceModel: this.serviceModel,
            client: this.rrClient,
            request: request
        };

        return await mqtt_request_response_utils.doRequestResponse<model.UpdateShadowResponse>(config);
    }

    /**
     * Update a device's (classic) shadow.
     *
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/device-shadow-mqtt.html#update-pub-sub-topic
     *
     * @param request operation to perform
     *
     * @returns Promise which resolves into the response to the request
     *
     * @category IotShadowV2
     */
    async updateShadow(request: model.UpdateShadowRequest) : Promise<model.UpdateShadowResponse> {

        let config = {
            operationName: "updateShadow",
            serviceModel: this.serviceModel,
            client: this.rrClient,
            request: request
        };

        return await mqtt_request_response_utils.doRequestResponse<model.UpdateShadowResponse>(config);
    }


    /**
     * Create a stream for NamedShadowDelta events for a named shadow of an AWS IoT thing.
     *
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/device-shadow-mqtt.html#update-delta-pub-sub-topic
     *
     * @param config streaming operation configuration options
     *
     * @returns a streaming operation which will emit an event every time a message is received on the
     *    associated MQTT topic
     *
     * @category IotShadowV2
     */
    createNamedShadowDeltaUpdatedStream(config: model.NamedShadowDeltaUpdatedSubscriptionRequest)
        : mqtt_request_response.StreamingOperation<model.ShadowDeltaUpdatedEvent> {

        let streamingOperationConfig : mqtt_request_response_utils.StreamingOperationConfig = {
            operationName: "createNamedShadowDeltaUpdatedStream",
            serviceModel: this.serviceModel,
            client: this.rrClient,
            modelConfig: config,
        };

        return mqtt_request_response.StreamingOperation.create(streamingOperationConfig);
    }

    /**
     * Create a stream for ShadowUpdated events for a named shadow of an AWS IoT thing.
     *
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/device-shadow-mqtt.html#update-documents-pub-sub-topic
     *
     * @param config streaming operation configuration options
     *
     * @returns a streaming operation which will emit an event every time a message is received on the
     *    associated MQTT topic
     *
     * @category IotShadowV2
     */
    createNamedShadowUpdatedStream(config: model.NamedShadowUpdatedSubscriptionRequest)
        : mqtt_request_response.StreamingOperation<model.ShadowUpdatedEvent> {

        let streamingOperationConfig : mqtt_request_response_utils.StreamingOperationConfig = {
            operationName: "createNamedShadowUpdatedStream",
            serviceModel: this.serviceModel,
            client: this.rrClient,
            modelConfig: config,
        };

        return mqtt_request_response.StreamingOperation.create(streamingOperationConfig);
    }

    /**
     * Create a stream for ShadowDelta events for the (classic) shadow of an AWS IoT thing.
     *
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/device-shadow-mqtt.html#update-delta-pub-sub-topic
     *
     * @param config streaming operation configuration options
     *
     * @returns a streaming operation which will emit an event every time a message is received on the
     *    associated MQTT topic
     *
     * @category IotShadowV2
     */
    createShadowDeltaUpdatedStream(config: model.ShadowDeltaUpdatedSubscriptionRequest)
        : mqtt_request_response.StreamingOperation<model.ShadowDeltaUpdatedEvent> {

        let streamingOperationConfig : mqtt_request_response_utils.StreamingOperationConfig = {
            operationName: "createShadowDeltaUpdatedStream",
            serviceModel: this.serviceModel,
            client: this.rrClient,
            modelConfig: config,
        };

        return mqtt_request_response.StreamingOperation.create(streamingOperationConfig);
    }

    /**
     * Create a stream for ShadowUpdated events for the (classic) shadow of an AWS IoT thing.
     *
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/device-shadow-mqtt.html#update-documents-pub-sub-topic
     *
     * @param config streaming operation configuration options
     *
     * @returns a streaming operation which will emit an event every time a message is received on the
     *    associated MQTT topic
     *
     * @category IotShadowV2
     */
    createShadowUpdatedStream(config: model.ShadowUpdatedSubscriptionRequest)
        : mqtt_request_response.StreamingOperation<model.ShadowUpdatedEvent> {

        let streamingOperationConfig : mqtt_request_response_utils.StreamingOperationConfig = {
            operationName: "createShadowUpdatedStream",
            serviceModel: this.serviceModel,
            client: this.rrClient,
            modelConfig: config,
        };

        return mqtt_request_response.StreamingOperation.create(streamingOperationConfig);
    }

}
