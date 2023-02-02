/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */

/**
 * @packageDocumentation
 * @module greengrass
 * @mergeTarget
 */

import { io, http, CrtError } from 'aws-crt';
import { toUtf8 } from '@aws-sdk/util-utf8-browser';
import * as model from './model';
export { model };

/**
 * @category Greengrass
 */
export class DiscoveryError extends Error {
    constructor(message: string, readonly response_code?: number) {
        super(message);
    }
}

/**
 * Greengrass Discovery Client
 *
 * API Documentation: https://docs.aws.amazon.com/greengrass/latest/developerguide/gg-discover-api.html
 *
 * @category Greengrass
 */
export class DiscoveryClient {
    private connection_manager: http.HttpClientConnectionManager;
    private endpoint: string;

    /**
     *
     * @param bootstrap The `ClientBootstrap` to use to make an HTTP connection to the Greengrass service
     * @param socket_options `SocketOptions` for HTTP connection to the Greengrass service
     * @param tls_ctx TLS Options for the HTTP connection to Greengrass service
     * @param region Region to send Greengrass discovery requests to (ignored if gg_server_name is set)
     * @param gg_server_name Optional name of greengrass endpoint
     */
    constructor(
        readonly bootstrap: io.ClientBootstrap,
        private socket_options: io.SocketOptions,
        private tls_ctx: io.ClientTlsContext,
        readonly region: string,
        readonly gg_server_name: string = ""
    ) {
        //allow user to use special endpoints
        if (this.gg_server_name !== "") {
            this.endpoint = this.gg_server_name;
        } else {
            this.endpoint = `greengrass-ats.iot.${region}.amazonaws.com`;
        }

        this.connection_manager = new http.HttpClientConnectionManager(
            this.bootstrap,
            this.endpoint,
            io.is_alpn_available() ? 443 : 8443,
            4,
            16 * 1024,
            this.socket_options,
            new io.TlsConnectionOptions(this.tls_ctx, this.endpoint, io.is_alpn_available() ? ['x-amzn-http-ca'] : undefined)
        );
    }

    /**
     * Performs the discover API call for the supplied Thing, and returns any associated Greengrass
     * groups/cores/connection info.
     *
     * @param thing_name The name of your IoT Thing, as configured in the console for Greengrass
     */
    discover(thing_name: string): Promise<model.DiscoverResponse> {
        return new Promise(async (resolve, reject) => {
            this.connection_manager.acquire()
                .then((connection) => {
                    const request = new http.HttpRequest(
                        'GET', `/greengrass/discover/thing/${thing_name}`,
                        new http.HttpHeaders([['host', this.endpoint]]));
                    const stream = connection.request(request);
                    let response = '';
                    stream.on('response', (status_code, headers) => {
                        if (status_code != 200) {
                            reject(new DiscoveryError(`Discovery failed (headers: ${headers})`, status_code));
                        }
                    });
                    stream.on('data', (body_data) => {
                        response += toUtf8(new Uint8Array(body_data));
                    });
                    stream.on('end', () => {
                        const json = JSON.parse(response);
                        const discover_response = model.DiscoverResponse.from_json(json);
                        resolve(discover_response);
                    });
                    stream.on('error', (error) => {
                        reject(new DiscoveryError(error.toString()));
                    });
                    stream.activate();
                })
                .catch((reason) => {
                    reject(new CrtError(reason))
                });
        });
    }
}
