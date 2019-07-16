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

import * as MQTT from "async-mqtt";
import * as io from "./io";

export interface ConnectionConfig {
    client_id: string;
    host_name: string;
    connect_timeout: number;
    port: number;
    use_websocket?: boolean;
    clean_session?: boolean;
    keep_alive?: number;
    timeout?: number;
    will?: string;
    username?: string;
    password?: string;
    alpn_list?: string;
}

export class AwsIotMqttConnectionConfigBuilder {
    private params: ConnectionConfig;

    private constructor() {
        this.params = {
            client_id: '',
            host_name: '',
            connect_timeout: 3000,
            port: 443,
            use_websocket: false,
            clean_session: false,
            keep_alive: undefined,
            will: undefined,
            username: '?SDK=JSv2&Version=0.1.0',
            password: undefined,
            alpn_list: 'x-amzn-mqtt-ca',
        };
    }

    static new_mtls_builder_from_path(cert_path: string, key_path: string) {
        let builder = new AwsIotMqttConnectionConfigBuilder();
        return builder;
    }

    with_certificate_authority_from_path(ca_path?: null | undefined, ca_file?: string) {
        throw new Error("Not implemented");

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
        this.params.use_websocket = true;
        this.params.port = 443;
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

    build() {
        if (this.params.client_id === undefined || this.params.host_name === undefined) {
            throw 'client_id and endpoint are required';
        }

        return this.params;
    }
}

export class Client {
    private bootstrap: io.ClientBootstrap;
    private tls_ctx?: io.ClientTlsContext;

    constructor(bootstrap: io.ClientBootstrap, tls_ctx?: io.ClientTlsContext) {
        this.bootstrap = bootstrap;
        this.tls_ctx = tls_ctx;
    }

    new_connection(config: ConnectionConfig) {
        return new Connection(this, config);
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

type Payload = string | Object | DataView;

export class Connection {
    readonly client: Client;
    private encoder: TextEncoder;
    private config: ConnectionConfig

    constructor(client: Client, config: ConnectionConfig, on_connection_interrupted?: (error_code: number) => void, on_connection_resumed?: (return_code: number, session_present: boolean) => void) {
        this.client = client;
        this.config = config;
        this.encoder = new TextEncoder();
    }

    close() {
        
    }

    async connect() {
        return new Promise<boolean>((resolve, reject) => {

            function on_connect(error_code: number, return_code: number, session_present: boolean) {
                console.log("on_connect ec:", error_code);
                if (error_code == 0 && return_code == 0) {
                    resolve(session_present);
                } else if (error_code != 0) {
                    reject("Failed to connect: " + io.error_code_to_string(error_code));
                } else {
                    reject("Server rejected connection.");
                }
            }

            try {
                /*  crt_native.mqtt_client_connection_connect(
                    this.native_handle(),
                    this.config.client_id,
                    this.config.host_name,
                    this.config.port,
                    this.config.tls_ctx ? this.config.tls_ctx.native_handle() : null,
                    this.config.connect_timeout,
                    this.config.keep_alive,
                    this.config.timeout,
                    this.config.will,
                    this.config.username,
                    this.config.password,
                    this.config.use_websocket,
                    this.config.clean_session,
                    on_connect,
                );*/
            } catch (e) {
                reject(e);
            }
        });
    }

    async reconnect() {
        return new Promise<boolean>((resolve, reject) => {

            function on_connect(error_code: number, return_code: number, session_present: boolean) {
                if (error_code == 0 && return_code == 0) {
                    resolve(session_present);
                } else if (error_code != 0) {
                    reject("Failed to connect: " + io.error_code_to_string(error_code));
                } else {
                    reject("Server rejected connection.");
                }
            }

            try {
                //crt_native.mqtt_client_connection_reconnect(this.native_handle(), on_connect);
            } catch (e) {
                reject(e);
            }
        });
    }

    async publish(topic: string, payload: Payload, qos: QoS, retain: boolean = false) {
        return new Promise<MqttRequest>((resolve, reject) => {

            let payload_data: DataView | undefined = undefined;
            if (payload instanceof DataView) {
                // If payload is already dataview, just use it
                payload_data = payload;
            } else {
                if (typeof payload === 'object') {
                    // Convert payload to JSON string, next if block will turn it into a DataView.
                    payload = JSON.stringify(payload);
                }

                if (typeof payload === 'string') {
                    // Encode the string as UTF-8
                    payload_data = new DataView(this.encoder.encode(payload).buffer);
                } else {
                    return reject(new TypeError("payload parameter must be a string, object, or DataView."));
                }
            }

            function on_publish(packet_id: number, error_code: number) {
                if (error_code == 0) {
                    resolve({ packet_id });
                } else {
                    reject("Failed to publish: " + io.error_code_to_string(error_code));
                }
            }

            try {
                //crt_native.mqtt_client_connection_publish(this.native_handle(), topic, payload_data, qos, retain, on_publish);
            } catch (e) {
                reject(e);
            }
        });
    }

    async subscribe(topic: string, qos: QoS, on_message: (topic: string, payload: ArrayBuffer) => void) {
        return new Promise<MqttSubscribeRequest>((resolve, reject) => {

            function on_suback(packet_id: number, topic: string, qos: QoS, error_code: number) {
                if (error_code == 0) {
                    resolve({ packet_id, topic, qos, error_code });
                } else {
                    reject("Failed to subscribe: " + io.error_code_to_string(error_code));
                }
            }

            try {
                //crt_native.mqtt_client_connection_subscribe(this.native_handle(), topic, qos, on_message, on_suback);
            } catch (e) {
                reject(e);
            }
        });
    }

    async unsubscribe(topic: string) {
        return new Promise<MqttRequest>((resolve, reject) => {

            function on_unsuback(packet_id: number, error_code: number) {
                if (error_code == 0) {
                    resolve({ packet_id });
                } else {
                    reject("Failed to unsubscribe: " + io.error_code_to_string(error_code));
                }
            }

            try {
                //crt_native.mqtt_client_connection_unsubscribe(this.native_handle(), topic, on_unsuback);
            } catch (e) {
                reject(e);
            }
        });
    }

    async disconnect() {
        return new Promise<void>((resolve, reject) => {

            function on_disconnect() {
                resolve();
            }

            try {
                // crt_native.mqtt_client_connection_disconnect(
                //     this.native_handle(),
                //     on_disconnect,
                // );
            } catch (e) {
                reject(e);
            }
        });
    }

    native_handle(): any {
        return undefined;
    }
}
