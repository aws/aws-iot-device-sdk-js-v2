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

    async echoTestMessage(request : model.EchoMessageRequest) : Promise<model.EchoMessageResponse> {
        return new Promise<model.EchoMessageResponse>((resolve, reject) => {
            reject();
        });
    }
}