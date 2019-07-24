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

import { ConnectionConfig } from "./mqtt";
import WebsocketStream = require("websocket-stream");
import * as Crypto from "crypto-js";

export interface WebsocketOptions {
    headers?: { [index: string]: string };
    protocol?: string;
}

export interface AWSCredentials {
    aws_region?: string,
    aws_access_id: string,
    aws_secret_key: string,
    aws_sts_token?: string
}

function zero_pad(n: number) {
    return (n > 9) ? n : '0' + n.toString();
}

function canonical_time() {
    const now = new Date();
    return `${now.getUTCFullYear()}${zero_pad(now.getUTCMonth() + 1)}${zero_pad(now.getUTCDate())}T` +
        `${zero_pad(now.getUTCHours())}${zero_pad(now.getUTCMinutes())}${zero_pad(now.getUTCSeconds())}Z`;
}

function canonical_day(time : string = canonical_time()) {
    return time.substring(0, time.indexOf('T'));
}

function make_signing_key(credentials: AWSCredentials, day: string, service_name: string) {
    const hash_opts = { asBytes: true };
    let hash = Crypto.HmacSHA256(day, 'AWS4' + credentials.aws_secret_key, hash_opts);
    hash = Crypto.HmacSHA256(credentials.aws_region || '', hash, hash_opts);
    hash = Crypto.HmacSHA256(service_name, hash, hash_opts);
    hash = Crypto.HmacSHA256('aws4_request', hash, hash_opts);
    return hash;
}

function sign_url(method: string,
    url: URL,
    credentials: AWSCredentials,
    service_name: string,
    time: string = canonical_time(),
    day: string = canonical_day(time),
    payload: string = '') {
    
    const signed_headers = 'host';
    const canonical_headers = `host:${url.hostname.toLowerCase()}\n`;
    const payload_hash = Crypto.SHA256(payload, { asBytes: true });
    const canonical_params = url.search.replace(new RegExp('^\\?'), '');
    const canonical_request = `${method}\n${url.pathname}\n${canonical_params}\n${canonical_headers}\n${signed_headers}\n${payload_hash}`;
    const canonical_request_hash = Crypto.SHA256(canonical_request, { asBytes: true });
    const signature_raw = `AWS4-HMAC-SHA256\n${time}\n${day}/${credentials.aws_region}/${service_name}/aws4_request\n${canonical_request_hash}`;
    const signing_key = make_signing_key(credentials, day, service_name);
    const signature = Crypto.HmacSHA256(signature_raw, signing_key, { asBytes: true });
    let query_params = `${url.search}&X-Amz-Signature=${signature}`;
    if (credentials.aws_sts_token) {
        query_params += `&X-Amz-Security-Token=${encodeURIComponent(credentials.aws_sts_token)}`;
    }
    const signed_url = `${url.protocol}${url.hostname}${url.pathname}${query_params}`;
    return signed_url;
}

function create_websocket_url(config: ConnectionConfig) {
    const time = canonical_time();
    const day = canonical_day(time);
    const path = '/mqtt';
    const protocol = (config.websocket || {}).protocol || 'wss';
    if (protocol === 'wss') {
        const service_name = 'iotdevicegateway';
        const credentials = config.credentials!;
        const query_params = `X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=${credentials.aws_access_id}` +
            `%2F${day}%2F${credentials.aws_region}%2F${service_name}%2Faws4_request&X-Amz-Date=${time}&X-Amz-SignedHeaders=host`;
        const url = new URL(`wss://${config.host_name}${path}?${query_params}`);
        return sign_url('GET', url, credentials, service_name, time, day);
    }
    else if (protocol === 'wss-custom-auth') {
        return `wss://${config.host_name}/${path}`
    }
    throw new URIError(`Invalid protocol requested: ${protocol}`);
}

export function transform_websocket_url(original_url: string, config: ConnectionConfig) {
    const url = create_websocket_url(config);
    return url;
}

export function create_websocket_stream(config: ConnectionConfig) {
    const url = create_websocket_url(config);
    return WebsocketStream(url, ['mqttv3.1'], config.websocket);
}

