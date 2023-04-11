/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */

/**
 * @packageDocumentation
 * @module echo_rpc
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

    async echoMessage(request : model.EchoMessageRequest, options?: eventstream_rpc.OperationOptions) : Promise<model.EchoMessageResponse> {
        let operationConfig : eventstream_rpc.OperationConfig = {
            name: "awstest#EchoMessage",
            client: this.rpcClient,
            options: (options) ? options : {}
        };

        let operation : eventstream_rpc.RequestResponseOperation<model.EchoMessageRequest, model.EchoMessageResponse> =
            new eventstream_rpc.RequestResponseOperation<model.EchoMessageRequest, model.EchoMessageResponse>(operationConfig, this.serviceModel);

        return await operation.activate(request);
    }

    async causeServiceError(request : model.CauseServiceErrorRequest, options?: eventstream_rpc.OperationOptions) : Promise<model.CauseServiceErrorResponse> {
        let operationConfig : eventstream_rpc.OperationConfig = {
            name: "awstest#CauseServiceError",
            client: this.rpcClient,
            options: (options) ? options : {}
        };

        let operation : eventstream_rpc.RequestResponseOperation<model.CauseServiceErrorRequest, model.CauseServiceErrorResponse> =
            new eventstream_rpc.RequestResponseOperation<model.CauseServiceErrorRequest, model.CauseServiceErrorResponse>(operationConfig, this.serviceModel);

        return await operation.activate(request);
    }

    async getAllCustomers(request : model.GetAllCustomersRequest, options?: eventstream_rpc.OperationOptions) : Promise<model.GetAllCustomersResponse> {
        let operationConfig : eventstream_rpc.OperationConfig = {
            name: "awstest#GetAllCustomers",
            client: this.rpcClient,
            options: (options) ? options : {}
        };

        let operation : eventstream_rpc.RequestResponseOperation<model.GetAllCustomersRequest, model.GetAllCustomersResponse> =
            new eventstream_rpc.RequestResponseOperation<model.GetAllCustomersRequest, model.GetAllCustomersResponse>(operationConfig, this.serviceModel);

        return await operation.activate(request);
    }

    async getAllProducts(request : model.GetAllProductsRequest, options?: eventstream_rpc.OperationOptions) : Promise<model.GetAllProductsResponse> {
        let operationConfig : eventstream_rpc.OperationConfig = {
            name: "awstest#GetAllProducts",
            client: this.rpcClient,
            options: (options) ? options : {}
        };

        let operation : eventstream_rpc.RequestResponseOperation<model.GetAllProductsRequest, model.GetAllProductsResponse> =
            new eventstream_rpc.RequestResponseOperation<model.GetAllProductsRequest, model.GetAllProductsResponse>(operationConfig, this.serviceModel);

        return await operation.activate(request);
    }

    echoStreamMessages(request : model.EchoStreamingRequest, options?: eventstream_rpc.OperationOptions) : eventstream_rpc.StreamingOperation<model.EchoStreamingRequest, model.EchoStreamingResponse, model.EchoStreamingMessage, model.EchoStreamingMessage> {
        let operationConfig : eventstream_rpc.OperationConfig = {
            name: "awstest#EchoStreamMessages",
            client: this.rpcClient,
            options: (options) ? options : {}
        };

        let operation : eventstream_rpc.StreamingOperation<model.EchoStreamingRequest, model.EchoStreamingResponse, model.EchoStreamingMessage, model.EchoStreamingMessage> =
            new eventstream_rpc.StreamingOperation<model.EchoStreamingRequest, model.EchoStreamingResponse, model.EchoStreamingMessage, model.EchoStreamingMessage>(request, operationConfig, this.serviceModel);

        return operation;
    }

    causeStreamServiceToError(request : model.EchoStreamingRequest, options?: eventstream_rpc.OperationOptions) : eventstream_rpc.StreamingOperation<model.EchoStreamingRequest, model.EchoStreamingResponse, model.EchoStreamingMessage, model.EchoStreamingMessage> {
        let operationConfig : eventstream_rpc.OperationConfig = {
            name: "awstest#CauseStreamServiceToError",
            client: this.rpcClient,
            options: (options) ? options : {}
        };

        let operation : eventstream_rpc.StreamingOperation<model.EchoStreamingRequest, model.EchoStreamingResponse, model.EchoStreamingMessage, model.EchoStreamingMessage> =
            new eventstream_rpc.StreamingOperation<model.EchoStreamingRequest, model.EchoStreamingResponse, model.EchoStreamingMessage, model.EchoStreamingMessage>(request, operationConfig, this.serviceModel);

        return operation;
    }
}
