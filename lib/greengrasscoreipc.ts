/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */

/**
 * @packageDocumentation
 * @module greengrasscoreipc
 * @mergeTarget
 */

import * as greengrasscoreipc from "./greengrasscoreipc/client";
import * as eventstream_rpc from "./eventstream_rpc";
import {eventstream, io} from "aws-crt";

export * from "./greengrasscoreipc/client";

/**
 * @return a default client configuration that can be used to connect to the Greengrass RPC service over
 *  domain sockets.
 */
export function createDefaultClientConfig() : eventstream_rpc.RpcClientConfig {
    let envHostName : string | undefined = process.env.AWS_GG_NUCLEUS_DOMAIN_SOCKET_FILEPATH_FOR_COMPONENT;
    let envAuthToken : string | undefined = process.env.SVCUID;

    return {
        hostName: (envHostName) ? envHostName : "",
        port: 0,
        socketOptions: new io.SocketOptions(io.SocketType.STREAM, io.SocketDomain.LOCAL),
        connectTransform: async (options: eventstream_rpc.RpcMessageTransformationOptions) => {
            let connectMessage : eventstream.Message = options.message;

            if (envAuthToken) {
                connectMessage.payload = JSON.stringify({
                    authToken: envAuthToken
                });
            }

            return connectMessage;
        }
    };
}

/**
 * Creates a new greengrass RPC client, using environment variables to guide configuration as needed
 *
 * @param config optional RPC configuration.  If not provided, a default configuration will be created.
 */
export function createClient(config?: eventstream_rpc.RpcClientConfig) : greengrasscoreipc.Client {
    if (!config) {
        config = createDefaultClientConfig();
    }

    eventstream_rpc.validateRpcClientConfig(config);

    return new greengrasscoreipc.Client(config);
}
