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

import { MqttClient, IClientOptions, ISubscriptionGrant, IUnsubackPacket } from "mqtt";
import { AsyncClient } from "async-mqtt";
import * as WebsocketUtils from "./ws";
import * as io from "./io";
import * as trie from "./trie";

type WebsocketOptions = WebsocketUtils.WebsocketOptions;
type AWSCredentials = WebsocketUtils.AWSCredentials;

export interface ConnectionConfig {
    client_id: string;
    host_name: string;
    connect_timeout: number;
    port: number;
    clean_session?: boolean;
    keep_alive?: number;
    timeout?: number;
    will?: string;
    username?: string;
    password?: string;
    tls_ctx?: io.ClientTlsContext;
    websocket?: WebsocketOptions;
    credentials?: AWSCredentials;
}

export class AwsIotMqttConnectionConfigBuilder {
    private params: ConnectionConfig
    private tls_ctx_options?: io.TlsContextOptions

    private constructor() {
        this.params = {
            client_id: '',
            host_name: '',
            connect_timeout: 3000,
            port: io.is_alpn_available() ? 443 : 8883,
            clean_session: false,
            keep_alive: undefined,
            will: undefined,
            username: '?SDK=NodeJSv2&Version=0.2.0',
            password: undefined,
            tls_ctx: undefined,
            websocket: {},
        };
    }

    static new_mtls_builder_from_path(cert_path: string, key_path: string) {
        let builder = new AwsIotMqttConnectionConfigBuilder();
        builder.tls_ctx_options = io.TlsContextOptions.create_client_with_mtls(cert_path, key_path);

        if (io.is_alpn_available()) {
            builder.tls_ctx_options.alpn_list = 'x-amzn-mqtt-ca';
        }

        return builder;
    }

    static new_builder_for_websocket() {
        let builder = new AwsIotMqttConnectionConfigBuilder();
        return builder;
    }

    with_certificate_authority_from_path(ca_path?: string, ca_file?: string) {
        if (this.tls_ctx_options !== undefined) {
            this.tls_ctx_options.override_default_trust_store(ca_path, ca_file);
        }

        return this;
    }

    with_endpoint(endpoint: string) {
        this.params.host_name = endpoint;
        return this;
    }

    with_client_id(client_id: string) {
        this.params.client_id = client_id;
        return this;
    }

    with_clean_session(clean_session: boolean) {
        this.params.clean_session = clean_session;
        return this;
    }

    with_use_websockets() {
        if (this.tls_ctx_options !== undefined) {
            this.tls_ctx_options.alpn_list = undefined;
            this.params.port = 443;
        }

        return this;
    }

    with_keep_alive_seconds(keep_alive: number) {
        this.params.keep_alive = keep_alive;
        return this;
    }

    with_timeout_ms(timeout_ms: number) {
        this.params.timeout = timeout_ms;
        return this;
    }

    with_will(will: string) {
        this.params.will = will;
        return this;
    }

    with_connect_timeout_ms(timeout: number) {
        this.params.connect_timeout = timeout;
        return this;
    }

    with_websocket_headers(headers: { [index: string]: string }) {
        this.params.websocket = {
            headers: headers
        };
        return this;
    }

    with_credentials(aws_region: string, aws_access_id: string, aws_secret_key: string, aws_sts_token: string | undefined) {
        this.params.credentials = {
            aws_region: aws_region,
            aws_access_id: aws_access_id,
            aws_secret_key: aws_secret_key,
            aws_sts_token: aws_sts_token,
        };
        return this;
    }

    build() {
        if (this.params.client_id === undefined || this.params.host_name === undefined) {
            throw 'client_id and endpoint are required';
        }

        return this.params;
    }
}

export class Client {
    constructor(bootstrap?: io.ClientBootstrap, tls_ctx?: io.ClientTlsContext) {

    }

    new_connection(
        config: ConnectionConfig,
        on_connection_interrupted?: (error_code: number) => void,
        on_connection_resumed?: (return_code: number, session_present: boolean) => void) {
        return new Connection(this, config, on_connection_interrupted, on_connection_resumed);
    }

    native_handle(): any {
        return undefined;
    }
}

export enum QoS {
    AtMostOnce = 0,
    AtLeastOnce = 1,
    ExactlyOnce = 2,
}

export interface MqttRequest {
    packet_id: number;
}

export interface MqttSubscribeRequest extends MqttRequest {
    topic: string;
    qos: QoS;
    error_code: number;
}

type SubscriptionCallback = (topic: string, payload: ArrayBuffer) => void;

class TopicTrie extends trie.Trie<SubscriptionCallback> {
    constructor() {
        super('/');
    }

    protected find_node(key: string, op: trie.TrieOp) {
        const parts = this.split_key(key);
        let current = this.root;
        let parent = undefined;
        for (const part in parts) {
            let child = current.children.get(part);
            if (!child) {
                child = current.children.get('#');
                if (child) {
                    return child;
                }

                child = current.children.get('+');
            }
            if (!child) {
                if (op == trie.TrieOp.Insert) {
                    current.children.set(part, child = new trie.Node(part));
                }
                else {
                    return undefined;
                }
            }
            parent = current;
            current = child;
        }
        if (parent && op == trie.TrieOp.Delete) {
            parent.children.delete(current.key!);
        }
        return current;
    }
}

type Payload = string | Object | DataView;

export class Connection {
    private connection: AsyncClient;
    private subscriptions = new TopicTrie();

    private create_websocket_stream = (client: MqttClient) => {
        return WebsocketUtils.create_websocket_stream(this.config);
    }

    private transform_websocket_url = (url: string, options: IClientOptions, client: MqttClient) => {
        return WebsocketUtils.transform_websocket_url(url, this.config);
    }

    constructor(readonly client: Client,
        private config: ConnectionConfig,
        private on_connection_interrupted?: (error_code: number) => void,
        private on_connection_resumed?: (return_code: number, session_present: boolean) => void) {
        
        this.connection = new AsyncClient(new MqttClient(
            this.create_websocket_stream,
            {
                keepalive: this.config.keep_alive,
                clientId: this.config.client_id,
                connectTimeout: this.config.connect_timeout,
                clean: this.config.clean_session,
                username: this.config.username,
                password: this.config.password,
                reconnectPeriod: 0,
                will: this.config.will ? {
                    topic: "will",
                    payload: this.config.will,
                    qos: 1,
                    retain: false,
                } : undefined,
                transformWsUrl: (config.websocket || {}).protocol != 'wss-custom-auth' ? this.transform_websocket_url : undefined
            }
        ));
    }

    close() {
        if (this.connection.connected) {
            this.connection.end();
        }
    }

    private on_online = (session_present: boolean) => {
        if (this.on_connection_resumed) {
            this.on_connection_resumed(0, session_present);
        }
    }

    private on_offline = () => {
        if (this.on_connection_interrupted) {
            this.on_connection_interrupted(-1);
        }
    }

    private on_disconnected = () => {
        if (this.on_connection_interrupted) {
            this.on_connection_interrupted(0);
        }
    }

    private on_message = (topic: string, payload: Buffer, packet: any) => {
        const callback = this.subscriptions.find(topic);
        if (callback) {
            callback(topic, payload);
        }
    }

    async connect() {
        return new Promise<boolean>((resolve, reject) => {
            try {
                this.connection.on('connect',
                    (connack: { sessionPresent: boolean, rc: number }) => {
                        resolve(connack.sessionPresent);
                        this.on_online(connack.sessionPresent);
                    }
                );
                this.connection.on('error',
                    (error: string) => {
                        reject(`Failed to connect: error=${error}`);
                    }
                );
                this.connection.on('message', this.on_message);
                this.connection.on('offline', this.on_offline);
                this.connection.on('end', this.on_disconnected);
            } catch (e) {
                reject(e);
            }
        });
    }

    async reconnect() {
        return this.connect();
    }

    async publish(topic: string, payload: Payload, qos: QoS, retain: boolean = false) {
        let payload_data: string = payload.toString();
        if (typeof payload === 'object') {
            // Convert payload to JSON string
            payload_data = JSON.stringify(payload);
        }

        return this.connection.publish(topic, payload_data, { qos: qos, retain: retain }).then((value) => {
            return { packet_id: value.messageId };
        });
    }

    async subscribe(topic: string, qos: QoS, on_message: (topic: string, payload: ArrayBuffer) => void) {
        this.subscriptions.insert(topic, on_message);
        return this.connection.subscribe(topic, { qos: qos }).then((value: ISubscriptionGrant[]) => {
            return { topic: value[0].topic, qos: value[0].qos };
        });
    }

    async unsubscribe(topic: string) {
        this.subscriptions.remove(topic);
        this.connection.unsubscribe(topic).then((value: IUnsubackPacket) => {
            return { packet_id: value.messageId };
        });
    }

    async disconnect() {
        return this.connection.end();
    }

    native_handle(): any {
        return undefined;
    }
}
