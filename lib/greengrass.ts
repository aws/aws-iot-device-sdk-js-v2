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

import { io, http } from 'aws-crt';
import { isArray } from 'util';

export class DiscoveryError extends Error {
    constructor(message: string, readonly response_code?: number) {
        super(message);
    }
}

export class ConnectivityInfo {
    private constructor(
        readonly id: string,
        readonly host_address: string,
        readonly port: number,
        readonly metadata: any) {

    }

    static from_json(json: any) {
        return new ConnectivityInfo(
            json.Id,
            json.HostAddress,
            json.PortNumber,
            json.Metadata
        )
    }
}

export class GGCore {
    private constructor(
        readonly thing_arn: string,
        readonly connectivity: ConnectivityInfo[]) {
        
    }

    static from_json(json: any) {
        const connectivity: ConnectivityInfo[] = [];
        if (json.Connectivity && isArray(json.Connectivity)) {
            json.Connectivity.forEach((payload: any) => {
                connectivity.push(ConnectivityInfo.from_json(payload));
            });
        }
        return new GGCore(
            json.thingArn,
            connectivity
        );
    }
}

export class GGGroup {
    private constructor(
        readonly gg_group_id: string,
        readonly cores: GGCore[] = [],
        readonly certificate_authorities: string[] = []) {
        
    }

    static from_json(json: any) {
        const cores: GGCore[] = [];
        if (json.Cores && isArray(json.Cores)) {
            json.Cores.forEach((payload: any) => {
                cores.push(GGCore.from_json(payload));
            });
        }
        return new GGGroup(
            json.GGGroupId,
            cores,
            json.CAs
        )
    }
}

export class DiscoverResponse {
    private constructor(
        readonly gg_groups: GGGroup[] = []) {
        
    }

    static from_json(json: any) {
        const groups: GGGroup[] = [];
        if (json.GGGroups && isArray(json.GGGroups)) {
            json.GGGroups.forEach((payload: any) => {
                groups.push(GGGroup.from_json(payload));
            });
        }
        return new DiscoverResponse(groups);
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
            8443,
            4,
            16 * 1024,
            this.socket_options,
            this.tls_ctx
        );
    }

    discover(thing_name: string) {
        return new Promise(async (resolve, reject) => {
            const connection = await this.connection_manager.acquire();
            const request = new http.HttpRequest('GET', `/greengrass/discover/thing/${thing_name}`, [['host', this.endpoint]]);
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
                const discover_response = DiscoverResponse.from_json(json);
                resolve(discover_response);
            });
            stream.on('error', (error) => {
                reject(new DiscoveryError(error.toString()));
            })
        });
    }
}
