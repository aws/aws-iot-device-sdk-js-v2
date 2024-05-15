/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 *
 * This file is generated
 */

import {mqtt, mqtt5} from 'aws-crt';
import {mqtt_request_response as mqtt_rr_internal} from 'aws-crt';
import * as mqtt_request_response from '../mqtt_request_response';
import * as mqtt_request_response_utils from '../mqtt_request_response_utils';
import * as model from './model';
import * as clientv2_utils from './clientv2_utils';


export class IotShadowClientv2 {
    private rrClient : mqtt_rr_internal.RequestResponseClient;
    private serviceModel : mqtt_request_response_utils.RequestResponseServiceModel;

    private constructor(rrClient: mqtt_rr_internal.RequestResponseClient) {
        this.rrClient = rrClient;
        this.serviceModel = clientv2_utils.makeServiceModel();
    }

    static new_from_mqtt311(protocolClient: mqtt.MqttClientConnection, options: mqtt_rr_internal.RequestResponseClientOptions) : IotShadowClientv2 {
        let rrClient = mqtt_rr_internal.RequestResponseClient.newFromMqtt311(protocolClient, options);
        let client = new IotShadowClientv2(rrClient);

        return client;
    }

    static newFromMqtt5(protocolClient: mqtt5.Mqtt5Client, options: mqtt_rr_internal.RequestResponseClientOptions) : IotShadowClientv2 {
        let rrClient = mqtt_rr_internal.RequestResponseClient.newFromMqtt5(protocolClient, options);
        let client = new IotShadowClientv2(rrClient);

        return client;
    }

    close() {
        this.rrClient.close();
    }

    private createRequestResponseConfig(operationName: string, request: any) : mqtt_request_response_utils.RequestResponseOperationConfig {
        return {
            operationName: operationName,
            serviceModel: this.serviceModel,
            client: this.rrClient,
            request: request
        };
    }

    private createStreamingOperationConfig(operationName: string, config: any) : mqtt_request_response_utils.StreamingOperationConfig {
        return {
            operationName: operationName,
            serviceModel: this.serviceModel,
            client: this.rrClient,
            modelConfig: config,
        };
    }

    async deleteNamedShadow(request: model.DeleteNamedShadowRequest) : Promise<model.DeleteShadowResponse> {
        let rrConfig = this.createRequestResponseConfig("DeleteNamedShadow", request);
        return await mqtt_request_response_utils.doRequestResponse<model.GetShadowResponse>(rrConfig);
    }

    async getNamedShadow(request: model.GetNamedShadowRequest) : Promise<model.GetShadowResponse> {
        let rrConfig = this.createRequestResponseConfig("GetNamedShadow", request);
        return await mqtt_request_response_utils.doRequestResponse<model.GetShadowResponse>(rrConfig);
    }

    async updateNamedShadow(request: model.UpdateNamedShadowRequest) : Promise<model.UpdateShadowResponse> {
        let rrConfig = this.createRequestResponseConfig("UpdateNamedShadow", request);
        return await mqtt_request_response_utils.doRequestResponse<model.UpdateShadowResponse>(rrConfig);
    }

    createNamedShadowDeltaUpdatedStream(config: model.NamedShadowDeltaUpdatedSubscriptionRequest) : mqtt_request_response.StreamingOperation<model.ShadowDeltaUpdatedEvent> {
        let streamingOperationConfig = this.createStreamingOperationConfig("createNamedShadowDeltaUpdatedEventStream", config);
        return mqtt_request_response.StreamingOperation.create(streamingOperationConfig);
    }

    createNamedShadowUpdatedStream(config: model.NamedShadowUpdatedSubscriptionRequest) : mqtt_request_response.StreamingOperation<model.ShadowUpdatedEvent> {
        let streamingOperationConfig = this.createStreamingOperationConfig("createNamedShadowUpdatedEventStream", config);
        return mqtt_request_response.StreamingOperation.create(streamingOperationConfig);
    }
}



