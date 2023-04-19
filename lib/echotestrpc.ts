/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */

/**
 * @packageDocumentation
 * @module echotestrpc
 * @mergeTarget
 */

import * as echotestrpc from "./echotestrpc/client";
import * as eventstream_rpc from "./eventstream_rpc";
import {eventstream} from "aws-crt";

export * from "./echotestrpc/client";

/**
 * Creates a new EchoTest RPC client
 *
 * @param config RPC client configuration
 */
export function createClient(config: eventstream_rpc.RpcClientConfig) : echotestrpc.Client {
    eventstream_rpc.validateRpcClientConfig(config);

    let echoConfig : eventstream_rpc.RpcClientConfig = {
        hostName: config.hostName,
        port: config.port,
        connectTransform: async (options: eventstream_rpc.RpcMessageTransformationOptions) => {
            let connectMessage : eventstream.Message = options.message;

            if (!connectMessage.headers) {
                connectMessage.headers = [];
            }

            connectMessage.headers.push(
                eventstream.Header.newString('client-name', 'accepted.testy_mc_testerson')
            );

            return connectMessage;
        }
    };

    return new echotestrpc.Client(echoConfig);
}
