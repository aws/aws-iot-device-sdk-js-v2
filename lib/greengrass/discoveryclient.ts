/* Copyright 2010-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
*
* Licensed under the Apache License, Version 2.0 (the "License").
* You may not use this file except in compliance with the License.
* A copy of the License is located at
*
*  http://aws.amazon.com/apache2.0
*
* or in the "license" file accompanying this file. This file is distributed
* on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
* express or implied. See the License for the specific language governing
* permissions and limitations under the License.
*/

import { io, http, CrtError } from 'aws-crt';
import { TextDecoder } from 'util';
import * as model  from './model';
export { model };

export class DiscoveryError extends Error {
    constructor(message: string, readonly response_code?: number) {
        super(message);
    }
}

export class DiscoveryClient {
    private connection_manager: http.HttpClientConnectionManager;
    private endpoint: string;
    constructor(
        readonly bootstrap: io.ClientBootstrap,
        private socket_options: io.SocketOptions,
        private tls_ctx: io.ClientTlsContext,
        readonly region: string
    ) {
        this.endpoint = `greengrass-ats.iot.${region}.amazonaws.com`;
        this.connection_manager = new http.HttpClientConnectionManager(
            this.bootstrap,
            this.endpoint,
            io.is_alpn_available() ? 443: 8443,
            4,
            16 * 1024,
            this.socket_options,
            this.tls_ctx
        );
    }

    discover(thing_name: string) : Promise<model.DiscoverResponse> {
        return new Promise(async (resolve, reject) => {
            this.connection_manager.acquire()
                .then((connection) => {
                    const request = new http.HttpRequest(
                        'GET', `/greengrass/discover/thing/${thing_name}`,
                        undefined, new http.HttpHeaders([['host', this.endpoint]]));
                    const stream = connection.request(request);
                    let response = '';
                    const decoder = new TextDecoder('utf8');
                    stream.on('response', (status_code, headers) => {
                        if (status_code != 200) {
                            reject(new DiscoveryError(`Discovery failed (headers: ${headers})`, status_code));
                        }
                    });
                    stream.on('data', (body_data) => {
                        response += decoder.decode(body_data);
                    });
                    stream.on('end', () => {
                        const json = JSON.parse(response);
                        const discover_response = model.DiscoverResponse.from_json(json);
                        resolve(discover_response);
                    });
                    stream.on('error', (error) => {
                        reject(new DiscoveryError(error.toString()));
                    });
                })
                .catch((reason) => {
                    reject(new CrtError(reason))
                });
        });
    }
}
