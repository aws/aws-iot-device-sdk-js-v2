/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */

import * as eventstream_rpc from './eventstream_rpc';
import { eventstream } from 'aws-crt';

// jest.setTimeout(10000);

// test stuff

export interface Pair {
    key? : string,

    value? : string
}

export interface Product {
    name? : string,

    price? : number
}

export interface MessageData {
    stringMessage? : string,

    booleanMessage?: boolean,

    timeMessage?: number,

    documentMessage?: { [key: string] : any },

    enumMessage?: string,

    blobMessage?: eventstream.Payload,

    stringListMessage?: string[],

    keyValuePairList?: Pair[],

    stringToValue?: { [key: string] : Product }
}

export interface EchoMessageRequest {
    message?: MessageData
}

export interface EchoMessageResponse {
    message?: MessageData
}

export class HandWrittenEchoClient {
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

    async echoTestMessage(request : EchoMessageRequest) : Promise<EchoMessageResponse> {
        return new Promise<EchoMessageResponse>((resolve, reject) => {
           reject();
        });
    }
}
