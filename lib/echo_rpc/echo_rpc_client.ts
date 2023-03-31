/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */

import * as model from "./model"
import * as eventstream_rpc from "../eventstream_rpc";

export class EchoRpcClient {
    private rpcClient : eventstream_rpc.RpcClient;

    constructor(config: eventstream_rpc.RpcClientConfig) {
        this.rpcClient = eventstream_rpc.RpcClient.new(config);
    }

    async connect() : Promise<void> {
        await this.rpcClient.connect();
    }

    close() : void {
        this.rpcClient.close();
    }

    async echoMessage(request : model.EchoMessageRequest, options?: eventstream_rpc.OperationOptions) : Promise<model.EchoMessageResponse> {
        return new Promise<model.EchoMessageResponse>(async (resolve, reject) => {
            try {
                let operationConfig : eventstream_rpc.OperationConfig = {
                    name: "awstest#EchoMessage",
                    client: this.rpcClient,
                    options: (options) ? options : {}
                };

                if (operationConfig.options.abortSignal) {
                    operationConfig.options.abortSignal.on('abort', () => reject(eventstream_rpc.createRpcError(eventstream_rpc.RpcErrorType.InterruptionError, "Operation aborted by user signal")));
                }

                let requestResponseConfig : eventstream_rpc.RequestResponseOperationConfig<model.EchoMessageRequest, model.EchoMessageResponse> = {
                    requestValidater: model.validateEchoMessageRequest,
                    requestSerializer: model.serializeEchoMessageRequestToEventstreamMessage,
                    responseDeserializer : model.deserializeEventstreamMessageToEchoMessageResponse
                };

                let operation : eventstream_rpc.RequestResponseOperation<model.EchoMessageRequest, model.EchoMessageResponse> =
                    new eventstream_rpc.RequestResponseOperation<model.EchoMessageRequest, model.EchoMessageResponse>(operationConfig, requestResponseConfig);

                let response : model.EchoMessageResponse = await operation.execute(request);

                resolve(response);
            } catch (err) {
                reject(err);
            }
        });
    }
}