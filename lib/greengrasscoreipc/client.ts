/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */


/**
 * @packageDocumentation
 * @module greengrasscoreipc
 * @mergeTarget
 */

import * as model from "./model"
import * as model_utils from "./model_utils";
import * as eventstream_rpc from "../eventstream_rpc";

export {model};

export class Client {

    private rpcClient : eventstream_rpc.RpcClient;

    private serviceModel : eventstream_rpc.EventstreamRpcServiceModel;

    constructor(config: eventstream_rpc.RpcClientConfig) {
        this.serviceModel = model_utils.makeServiceModel();
        this.rpcClient = eventstream_rpc.RpcClient.new(config);
    }

    async connect() : Promise<void> {
        await this.rpcClient.connect();
    }

    close() : void {
        this.rpcClient.close();
    }


    async authorizeClientDeviceAction(request : model.AuthorizeClientDeviceActionRequest, options?: eventstream_rpc.OperationOptions) : Promise<model.AuthorizeClientDeviceActionResponse> {
        let operationConfig : eventstream_rpc.OperationConfig = {
            name: "aws.greengrass#AuthorizeClientDeviceAction",
            client: this.rpcClient,
            options: (options) ? options : {}
        };

        let operation : eventstream_rpc.RequestResponseOperation<model.AuthorizeClientDeviceActionRequest, model.AuthorizeClientDeviceActionResponse> =
            new eventstream_rpc.RequestResponseOperation<model.AuthorizeClientDeviceActionRequest, model.AuthorizeClientDeviceActionResponse>(operationConfig, this.serviceModel);

        return await operation.activate(request);
    }

    async createDebugPassword(request : model.CreateDebugPasswordRequest, options?: eventstream_rpc.OperationOptions) : Promise<model.CreateDebugPasswordResponse> {
        let operationConfig : eventstream_rpc.OperationConfig = {
            name: "aws.greengrass#CreateDebugPassword",
            client: this.rpcClient,
            options: (options) ? options : {}
        };

        let operation : eventstream_rpc.RequestResponseOperation<model.CreateDebugPasswordRequest, model.CreateDebugPasswordResponse> =
            new eventstream_rpc.RequestResponseOperation<model.CreateDebugPasswordRequest, model.CreateDebugPasswordResponse>(operationConfig, this.serviceModel);

        return await operation.activate(request);
    }

    async createLocalDeployment(request : model.CreateLocalDeploymentRequest, options?: eventstream_rpc.OperationOptions) : Promise<model.CreateLocalDeploymentResponse> {
        let operationConfig : eventstream_rpc.OperationConfig = {
            name: "aws.greengrass#CreateLocalDeployment",
            client: this.rpcClient,
            options: (options) ? options : {}
        };

        let operation : eventstream_rpc.RequestResponseOperation<model.CreateLocalDeploymentRequest, model.CreateLocalDeploymentResponse> =
            new eventstream_rpc.RequestResponseOperation<model.CreateLocalDeploymentRequest, model.CreateLocalDeploymentResponse>(operationConfig, this.serviceModel);

        return await operation.activate(request);
    }

    async deferComponentUpdate(request : model.DeferComponentUpdateRequest, options?: eventstream_rpc.OperationOptions) : Promise<model.DeferComponentUpdateResponse> {
        let operationConfig : eventstream_rpc.OperationConfig = {
            name: "aws.greengrass#DeferComponentUpdate",
            client: this.rpcClient,
            options: (options) ? options : {}
        };

        let operation : eventstream_rpc.RequestResponseOperation<model.DeferComponentUpdateRequest, model.DeferComponentUpdateResponse> =
            new eventstream_rpc.RequestResponseOperation<model.DeferComponentUpdateRequest, model.DeferComponentUpdateResponse>(operationConfig, this.serviceModel);

        return await operation.activate(request);
    }

    async deleteThingShadow(request : model.DeleteThingShadowRequest, options?: eventstream_rpc.OperationOptions) : Promise<model.DeleteThingShadowResponse> {
        let operationConfig : eventstream_rpc.OperationConfig = {
            name: "aws.greengrass#DeleteThingShadow",
            client: this.rpcClient,
            options: (options) ? options : {}
        };

        let operation : eventstream_rpc.RequestResponseOperation<model.DeleteThingShadowRequest, model.DeleteThingShadowResponse> =
            new eventstream_rpc.RequestResponseOperation<model.DeleteThingShadowRequest, model.DeleteThingShadowResponse>(operationConfig, this.serviceModel);

        return await operation.activate(request);
    }

    async getClientDeviceAuthToken(request : model.GetClientDeviceAuthTokenRequest, options?: eventstream_rpc.OperationOptions) : Promise<model.GetClientDeviceAuthTokenResponse> {
        let operationConfig : eventstream_rpc.OperationConfig = {
            name: "aws.greengrass#GetClientDeviceAuthToken",
            client: this.rpcClient,
            options: (options) ? options : {}
        };

        let operation : eventstream_rpc.RequestResponseOperation<model.GetClientDeviceAuthTokenRequest, model.GetClientDeviceAuthTokenResponse> =
            new eventstream_rpc.RequestResponseOperation<model.GetClientDeviceAuthTokenRequest, model.GetClientDeviceAuthTokenResponse>(operationConfig, this.serviceModel);

        return await operation.activate(request);
    }

    async getComponentDetails(request : model.GetComponentDetailsRequest, options?: eventstream_rpc.OperationOptions) : Promise<model.GetComponentDetailsResponse> {
        let operationConfig : eventstream_rpc.OperationConfig = {
            name: "aws.greengrass#GetComponentDetails",
            client: this.rpcClient,
            options: (options) ? options : {}
        };

        let operation : eventstream_rpc.RequestResponseOperation<model.GetComponentDetailsRequest, model.GetComponentDetailsResponse> =
            new eventstream_rpc.RequestResponseOperation<model.GetComponentDetailsRequest, model.GetComponentDetailsResponse>(operationConfig, this.serviceModel);

        return await operation.activate(request);
    }

    async getConfiguration(request : model.GetConfigurationRequest, options?: eventstream_rpc.OperationOptions) : Promise<model.GetConfigurationResponse> {
        let operationConfig : eventstream_rpc.OperationConfig = {
            name: "aws.greengrass#GetConfiguration",
            client: this.rpcClient,
            options: (options) ? options : {}
        };

        let operation : eventstream_rpc.RequestResponseOperation<model.GetConfigurationRequest, model.GetConfigurationResponse> =
            new eventstream_rpc.RequestResponseOperation<model.GetConfigurationRequest, model.GetConfigurationResponse>(operationConfig, this.serviceModel);

        return await operation.activate(request);
    }

    async getLocalDeploymentStatus(request : model.GetLocalDeploymentStatusRequest, options?: eventstream_rpc.OperationOptions) : Promise<model.GetLocalDeploymentStatusResponse> {
        let operationConfig : eventstream_rpc.OperationConfig = {
            name: "aws.greengrass#GetLocalDeploymentStatus",
            client: this.rpcClient,
            options: (options) ? options : {}
        };

        let operation : eventstream_rpc.RequestResponseOperation<model.GetLocalDeploymentStatusRequest, model.GetLocalDeploymentStatusResponse> =
            new eventstream_rpc.RequestResponseOperation<model.GetLocalDeploymentStatusRequest, model.GetLocalDeploymentStatusResponse>(operationConfig, this.serviceModel);

        return await operation.activate(request);
    }

    async getSecretValue(request : model.GetSecretValueRequest, options?: eventstream_rpc.OperationOptions) : Promise<model.GetSecretValueResponse> {
        let operationConfig : eventstream_rpc.OperationConfig = {
            name: "aws.greengrass#GetSecretValue",
            client: this.rpcClient,
            options: (options) ? options : {}
        };

        let operation : eventstream_rpc.RequestResponseOperation<model.GetSecretValueRequest, model.GetSecretValueResponse> =
            new eventstream_rpc.RequestResponseOperation<model.GetSecretValueRequest, model.GetSecretValueResponse>(operationConfig, this.serviceModel);

        return await operation.activate(request);
    }

    async getThingShadow(request : model.GetThingShadowRequest, options?: eventstream_rpc.OperationOptions) : Promise<model.GetThingShadowResponse> {
        let operationConfig : eventstream_rpc.OperationConfig = {
            name: "aws.greengrass#GetThingShadow",
            client: this.rpcClient,
            options: (options) ? options : {}
        };

        let operation : eventstream_rpc.RequestResponseOperation<model.GetThingShadowRequest, model.GetThingShadowResponse> =
            new eventstream_rpc.RequestResponseOperation<model.GetThingShadowRequest, model.GetThingShadowResponse>(operationConfig, this.serviceModel);

        return await operation.activate(request);
    }

    async listComponents(request : model.ListComponentsRequest, options?: eventstream_rpc.OperationOptions) : Promise<model.ListComponentsResponse> {
        let operationConfig : eventstream_rpc.OperationConfig = {
            name: "aws.greengrass#ListComponents",
            client: this.rpcClient,
            options: (options) ? options : {}
        };

        let operation : eventstream_rpc.RequestResponseOperation<model.ListComponentsRequest, model.ListComponentsResponse> =
            new eventstream_rpc.RequestResponseOperation<model.ListComponentsRequest, model.ListComponentsResponse>(operationConfig, this.serviceModel);

        return await operation.activate(request);
    }

    async listLocalDeployments(request : model.ListLocalDeploymentsRequest, options?: eventstream_rpc.OperationOptions) : Promise<model.ListLocalDeploymentsResponse> {
        let operationConfig : eventstream_rpc.OperationConfig = {
            name: "aws.greengrass#ListLocalDeployments",
            client: this.rpcClient,
            options: (options) ? options : {}
        };

        let operation : eventstream_rpc.RequestResponseOperation<model.ListLocalDeploymentsRequest, model.ListLocalDeploymentsResponse> =
            new eventstream_rpc.RequestResponseOperation<model.ListLocalDeploymentsRequest, model.ListLocalDeploymentsResponse>(operationConfig, this.serviceModel);

        return await operation.activate(request);
    }

    async listNamedShadowsForThing(request : model.ListNamedShadowsForThingRequest, options?: eventstream_rpc.OperationOptions) : Promise<model.ListNamedShadowsForThingResponse> {
        let operationConfig : eventstream_rpc.OperationConfig = {
            name: "aws.greengrass#ListNamedShadowsForThing",
            client: this.rpcClient,
            options: (options) ? options : {}
        };

        let operation : eventstream_rpc.RequestResponseOperation<model.ListNamedShadowsForThingRequest, model.ListNamedShadowsForThingResponse> =
            new eventstream_rpc.RequestResponseOperation<model.ListNamedShadowsForThingRequest, model.ListNamedShadowsForThingResponse>(operationConfig, this.serviceModel);

        return await operation.activate(request);
    }

    async pauseComponent(request : model.PauseComponentRequest, options?: eventstream_rpc.OperationOptions) : Promise<model.PauseComponentResponse> {
        let operationConfig : eventstream_rpc.OperationConfig = {
            name: "aws.greengrass#PauseComponent",
            client: this.rpcClient,
            options: (options) ? options : {}
        };

        let operation : eventstream_rpc.RequestResponseOperation<model.PauseComponentRequest, model.PauseComponentResponse> =
            new eventstream_rpc.RequestResponseOperation<model.PauseComponentRequest, model.PauseComponentResponse>(operationConfig, this.serviceModel);

        return await operation.activate(request);
    }

    async publishToIoTCore(request : model.PublishToIoTCoreRequest, options?: eventstream_rpc.OperationOptions) : Promise<model.PublishToIoTCoreResponse> {
        let operationConfig : eventstream_rpc.OperationConfig = {
            name: "aws.greengrass#PublishToIoTCore",
            client: this.rpcClient,
            options: (options) ? options : {}
        };

        let operation : eventstream_rpc.RequestResponseOperation<model.PublishToIoTCoreRequest, model.PublishToIoTCoreResponse> =
            new eventstream_rpc.RequestResponseOperation<model.PublishToIoTCoreRequest, model.PublishToIoTCoreResponse>(operationConfig, this.serviceModel);

        return await operation.activate(request);
    }

    async publishToTopic(request : model.PublishToTopicRequest, options?: eventstream_rpc.OperationOptions) : Promise<model.PublishToTopicResponse> {
        let operationConfig : eventstream_rpc.OperationConfig = {
            name: "aws.greengrass#PublishToTopic",
            client: this.rpcClient,
            options: (options) ? options : {}
        };

        let operation : eventstream_rpc.RequestResponseOperation<model.PublishToTopicRequest, model.PublishToTopicResponse> =
            new eventstream_rpc.RequestResponseOperation<model.PublishToTopicRequest, model.PublishToTopicResponse>(operationConfig, this.serviceModel);

        return await operation.activate(request);
    }

    async putComponentMetric(request : model.PutComponentMetricRequest, options?: eventstream_rpc.OperationOptions) : Promise<model.PutComponentMetricResponse> {
        let operationConfig : eventstream_rpc.OperationConfig = {
            name: "aws.greengrass#PutComponentMetric",
            client: this.rpcClient,
            options: (options) ? options : {}
        };

        let operation : eventstream_rpc.RequestResponseOperation<model.PutComponentMetricRequest, model.PutComponentMetricResponse> =
            new eventstream_rpc.RequestResponseOperation<model.PutComponentMetricRequest, model.PutComponentMetricResponse>(operationConfig, this.serviceModel);

        return await operation.activate(request);
    }

    async restartComponent(request : model.RestartComponentRequest, options?: eventstream_rpc.OperationOptions) : Promise<model.RestartComponentResponse> {
        let operationConfig : eventstream_rpc.OperationConfig = {
            name: "aws.greengrass#RestartComponent",
            client: this.rpcClient,
            options: (options) ? options : {}
        };

        let operation : eventstream_rpc.RequestResponseOperation<model.RestartComponentRequest, model.RestartComponentResponse> =
            new eventstream_rpc.RequestResponseOperation<model.RestartComponentRequest, model.RestartComponentResponse>(operationConfig, this.serviceModel);

        return await operation.activate(request);
    }

    async resumeComponent(request : model.ResumeComponentRequest, options?: eventstream_rpc.OperationOptions) : Promise<model.ResumeComponentResponse> {
        let operationConfig : eventstream_rpc.OperationConfig = {
            name: "aws.greengrass#ResumeComponent",
            client: this.rpcClient,
            options: (options) ? options : {}
        };

        let operation : eventstream_rpc.RequestResponseOperation<model.ResumeComponentRequest, model.ResumeComponentResponse> =
            new eventstream_rpc.RequestResponseOperation<model.ResumeComponentRequest, model.ResumeComponentResponse>(operationConfig, this.serviceModel);

        return await operation.activate(request);
    }

    async sendConfigurationValidityReport(request : model.SendConfigurationValidityReportRequest, options?: eventstream_rpc.OperationOptions) : Promise<model.SendConfigurationValidityReportResponse> {
        let operationConfig : eventstream_rpc.OperationConfig = {
            name: "aws.greengrass#SendConfigurationValidityReport",
            client: this.rpcClient,
            options: (options) ? options : {}
        };

        let operation : eventstream_rpc.RequestResponseOperation<model.SendConfigurationValidityReportRequest, model.SendConfigurationValidityReportResponse> =
            new eventstream_rpc.RequestResponseOperation<model.SendConfigurationValidityReportRequest, model.SendConfigurationValidityReportResponse>(operationConfig, this.serviceModel);

        return await operation.activate(request);
    }

    async stopComponent(request : model.StopComponentRequest, options?: eventstream_rpc.OperationOptions) : Promise<model.StopComponentResponse> {
        let operationConfig : eventstream_rpc.OperationConfig = {
            name: "aws.greengrass#StopComponent",
            client: this.rpcClient,
            options: (options) ? options : {}
        };

        let operation : eventstream_rpc.RequestResponseOperation<model.StopComponentRequest, model.StopComponentResponse> =
            new eventstream_rpc.RequestResponseOperation<model.StopComponentRequest, model.StopComponentResponse>(operationConfig, this.serviceModel);

        return await operation.activate(request);
    }


    subscribeToCertificateUpdates(request : model.SubscribeToCertificateUpdatesRequest, options?: eventstream_rpc.OperationOptions) : eventstream_rpc.StreamingOperation<model.SubscribeToCertificateUpdatesRequest, model.SubscribeToCertificateUpdatesResponse, void, model.CertificateUpdateEvent> {
        let operationConfig : eventstream_rpc.OperationConfig = {
            name: "aws.greengrass#SubscribeToCertificateUpdates",
            client: this.rpcClient,
            options: (options) ? options : {}
        };

        return new eventstream_rpc.StreamingOperation<model.SubscribeToCertificateUpdatesRequest, model.SubscribeToCertificateUpdatesResponse, void, model.CertificateUpdateEvent>(request, operationConfig, this.serviceModel);
    }


    subscribeToComponentUpdates(request : model.SubscribeToComponentUpdatesRequest, options?: eventstream_rpc.OperationOptions) : eventstream_rpc.StreamingOperation<model.SubscribeToComponentUpdatesRequest, model.SubscribeToComponentUpdatesResponse, void, model.ComponentUpdatePolicyEvents> {
        let operationConfig : eventstream_rpc.OperationConfig = {
            name: "aws.greengrass#SubscribeToComponentUpdates",
            client: this.rpcClient,
            options: (options) ? options : {}
        };

        return new eventstream_rpc.StreamingOperation<model.SubscribeToComponentUpdatesRequest, model.SubscribeToComponentUpdatesResponse, void, model.ComponentUpdatePolicyEvents>(request, operationConfig, this.serviceModel);
    }


    subscribeToConfigurationUpdate(request : model.SubscribeToConfigurationUpdateRequest, options?: eventstream_rpc.OperationOptions) : eventstream_rpc.StreamingOperation<model.SubscribeToConfigurationUpdateRequest, model.SubscribeToConfigurationUpdateResponse, void, model.ConfigurationUpdateEvents> {
        let operationConfig : eventstream_rpc.OperationConfig = {
            name: "aws.greengrass#SubscribeToConfigurationUpdate",
            client: this.rpcClient,
            options: (options) ? options : {}
        };

        return new eventstream_rpc.StreamingOperation<model.SubscribeToConfigurationUpdateRequest, model.SubscribeToConfigurationUpdateResponse, void, model.ConfigurationUpdateEvents>(request, operationConfig, this.serviceModel);
    }


    subscribeToIoTCore(request : model.SubscribeToIoTCoreRequest, options?: eventstream_rpc.OperationOptions) : eventstream_rpc.StreamingOperation<model.SubscribeToIoTCoreRequest, model.SubscribeToIoTCoreResponse, void, model.IoTCoreMessage> {
        let operationConfig : eventstream_rpc.OperationConfig = {
            name: "aws.greengrass#SubscribeToIoTCore",
            client: this.rpcClient,
            options: (options) ? options : {}
        };

        return new eventstream_rpc.StreamingOperation<model.SubscribeToIoTCoreRequest, model.SubscribeToIoTCoreResponse, void, model.IoTCoreMessage>(request, operationConfig, this.serviceModel);
    }


    subscribeToTopic(request : model.SubscribeToTopicRequest, options?: eventstream_rpc.OperationOptions) : eventstream_rpc.StreamingOperation<model.SubscribeToTopicRequest, model.SubscribeToTopicResponse, void, model.SubscriptionResponseMessage> {
        let operationConfig : eventstream_rpc.OperationConfig = {
            name: "aws.greengrass#SubscribeToTopic",
            client: this.rpcClient,
            options: (options) ? options : {}
        };

        return new eventstream_rpc.StreamingOperation<model.SubscribeToTopicRequest, model.SubscribeToTopicResponse, void, model.SubscriptionResponseMessage>(request, operationConfig, this.serviceModel);
    }


    subscribeToValidateConfigurationUpdates(request : model.SubscribeToValidateConfigurationUpdatesRequest, options?: eventstream_rpc.OperationOptions) : eventstream_rpc.StreamingOperation<model.SubscribeToValidateConfigurationUpdatesRequest, model.SubscribeToValidateConfigurationUpdatesResponse, void, model.ValidateConfigurationUpdateEvents> {
        let operationConfig : eventstream_rpc.OperationConfig = {
            name: "aws.greengrass#SubscribeToValidateConfigurationUpdates",
            client: this.rpcClient,
            options: (options) ? options : {}
        };

        return new eventstream_rpc.StreamingOperation<model.SubscribeToValidateConfigurationUpdatesRequest, model.SubscribeToValidateConfigurationUpdatesResponse, void, model.ValidateConfigurationUpdateEvents>(request, operationConfig, this.serviceModel);
    }

    async updateConfiguration(request : model.UpdateConfigurationRequest, options?: eventstream_rpc.OperationOptions) : Promise<model.UpdateConfigurationResponse> {
        let operationConfig : eventstream_rpc.OperationConfig = {
            name: "aws.greengrass#UpdateConfiguration",
            client: this.rpcClient,
            options: (options) ? options : {}
        };

        let operation : eventstream_rpc.RequestResponseOperation<model.UpdateConfigurationRequest, model.UpdateConfigurationResponse> =
            new eventstream_rpc.RequestResponseOperation<model.UpdateConfigurationRequest, model.UpdateConfigurationResponse>(operationConfig, this.serviceModel);

        return await operation.activate(request);
    }

    async updateState(request : model.UpdateStateRequest, options?: eventstream_rpc.OperationOptions) : Promise<model.UpdateStateResponse> {
        let operationConfig : eventstream_rpc.OperationConfig = {
            name: "aws.greengrass#UpdateState",
            client: this.rpcClient,
            options: (options) ? options : {}
        };

        let operation : eventstream_rpc.RequestResponseOperation<model.UpdateStateRequest, model.UpdateStateResponse> =
            new eventstream_rpc.RequestResponseOperation<model.UpdateStateRequest, model.UpdateStateResponse>(operationConfig, this.serviceModel);

        return await operation.activate(request);
    }

    async updateThingShadow(request : model.UpdateThingShadowRequest, options?: eventstream_rpc.OperationOptions) : Promise<model.UpdateThingShadowResponse> {
        let operationConfig : eventstream_rpc.OperationConfig = {
            name: "aws.greengrass#UpdateThingShadow",
            client: this.rpcClient,
            options: (options) ? options : {}
        };

        let operation : eventstream_rpc.RequestResponseOperation<model.UpdateThingShadowRequest, model.UpdateThingShadowResponse> =
            new eventstream_rpc.RequestResponseOperation<model.UpdateThingShadowRequest, model.UpdateThingShadowResponse>(operationConfig, this.serviceModel);

        return await operation.activate(request);
    }

    async validateAuthorizationToken(request : model.ValidateAuthorizationTokenRequest, options?: eventstream_rpc.OperationOptions) : Promise<model.ValidateAuthorizationTokenResponse> {
        let operationConfig : eventstream_rpc.OperationConfig = {
            name: "aws.greengrass#ValidateAuthorizationToken",
            client: this.rpcClient,
            options: (options) ? options : {}
        };

        let operation : eventstream_rpc.RequestResponseOperation<model.ValidateAuthorizationTokenRequest, model.ValidateAuthorizationTokenResponse> =
            new eventstream_rpc.RequestResponseOperation<model.ValidateAuthorizationTokenRequest, model.ValidateAuthorizationTokenResponse>(operationConfig, this.serviceModel);

        return await operation.activate(request);
    }

    async verifyClientDeviceIdentity(request : model.VerifyClientDeviceIdentityRequest, options?: eventstream_rpc.OperationOptions) : Promise<model.VerifyClientDeviceIdentityResponse> {
        let operationConfig : eventstream_rpc.OperationConfig = {
            name: "aws.greengrass#VerifyClientDeviceIdentity",
            client: this.rpcClient,
            options: (options) ? options : {}
        };

        let operation : eventstream_rpc.RequestResponseOperation<model.VerifyClientDeviceIdentityRequest, model.VerifyClientDeviceIdentityResponse> =
            new eventstream_rpc.RequestResponseOperation<model.VerifyClientDeviceIdentityRequest, model.VerifyClientDeviceIdentityResponse>(operationConfig, this.serviceModel);

        return await operation.activate(request);
    }
}
