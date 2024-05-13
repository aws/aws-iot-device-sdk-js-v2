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

    async deleteNamedShadow(request: model.DeleteNamedShadowRequest) : Promise<model.DeleteShadowResponse> {
        let rrConfig : mqtt_request_response_utils.RequestResponseOperationConfig = {
            operationName: "DeleteNamedShadow",
            serviceModel: this.serviceModel,
            client: this.rrClient,
            request: request
        };

        return await mqtt_request_response_utils.doRequestResponse<model.GetShadowResponse>(rrConfig);
    }

    async getNamedShadow(request: model.GetNamedShadowRequest) : Promise<model.GetShadowResponse> {
        let rrConfig : mqtt_request_response_utils.RequestResponseOperationConfig = {
            operationName: "GetNamedShadow",
            serviceModel: this.serviceModel,
            client: this.rrClient,
            request: request
        };

        return await mqtt_request_response_utils.doRequestResponse<model.GetShadowResponse>(rrConfig);
    }

    createNamedShadowDeltaUpdatedStream(config: model.NamedShadowDeltaUpdatedSubscriptionRequest) : mqtt_request_response.StreamingOperation<model.ShadowDeltaUpdatedEvent> {
        let streamingOperationConfig : mqtt_request_response_utils.StreamingOperationConfig = {
            operationName: "createNamedShadowDeltaUpdatedEventStream",
            serviceModel: this.serviceModel,
            client: this.rrClient,
            modelConfig: config,
        };

        return mqtt_request_response.StreamingOperation.create(streamingOperationConfig);
    }

    createNamedShadowUpdatedStream(config: model.NamedShadowUpdatedSubscriptionRequest) : mqtt_request_response.StreamingOperation<model.ShadowUpdatedEvent> {
        let streamingOperationConfig : mqtt_request_response_utils.StreamingOperationConfig = {
            operationName: "createNamedShadowUpdatedEventStream",
            serviceModel: this.serviceModel,
            client: this.rrClient,
            modelConfig: config,
        };

        return mqtt_request_response.StreamingOperation.create(streamingOperationConfig);
    }
}



