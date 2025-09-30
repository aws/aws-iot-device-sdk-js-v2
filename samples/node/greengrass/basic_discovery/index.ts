/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */

import { mqtt, io, iot, greengrass } from 'aws-iot-device-sdk-v2';
import { TextDecoder } from 'util';

// --------------------------------- ARGUMENT PARSING -----------------------------------------
const args = require('yargs')
    .option('ca_file', {
        alias: 'r',
        description: '<path>: path to a Root CA certificate file in PEM format (optional, system trust store used by default)',
        type: 'string',
        required: false
    })
    .option('cert', {
        alias: 'c',
        description: '<path>: path to a PEM encoded certificate to use with mTLS',
        type: 'string',
        required: true
    })
    .option('key', {
        alias: 'k',
        description: '<path>: Path to a PEM encoded private key that matches cert',
        type: 'string',
        required: true
    })
    .option('thing_name', {
        alias: 'T',
        description: 'Targeted Thing name',
        type: 'string',
        required: true
    })
    .option('topic', {
        alias: 't',
        description: 'Topic to publish/subscribe to',
        type: 'string',
        default: 'test/topic'
    })
    .option('message', {
        alias: 'M',
        description: 'Message to publish',
        type: 'string',
        default: 'Hello World!'
    })
    .option('count', {
        alias: 'n',
        description: 'Number of messages to publish',
        type: 'number',
        default: 10
    })
    .option('mode', {
        alias: 'm',
        description: 'Mode options: [publish, subscribe, both] (optional)',
        type: 'string',
        default: 'both',
        choices: ['publish', 'subscribe', 'both']
    })
    .option('region', {
        description: 'AWS Region',
        type: 'string',
        required: true
    })
    .option('print_discover_resp_only', {
        description: 'Only print the response from Greengrass discovery (optional)',
        type: 'boolean',
        default: false
    })
    .option('is_ci', {
        description: 'Adjusts sample to output/run in CI mode (optional)',
        type: 'boolean',
        default: false
    })
    .option('verbose', {
        alias: 'v',
        description: 'Verbose logging level',
        type: 'string',
        default: 'none'
    })
    .help()
    .argv;

// --------------------------------- ARGUMENT PARSING END -----------------------------------------

function firstResolved<T>(promises: Promise<T>[]) {
    let rejects: Error[] = [];
    return new Promise<T>((resolve, reject) => {
        promises.forEach((promise) => {
            promise
                .then((value) => {
                    resolve(value)
                })
                .catch((error) => {
                    rejects.push(error);
                    if (rejects.length == promises.length) {
                        reject(rejects);
                    }
                });
        });
    });
}

async function connect_to_iot(mqtt_client: mqtt.MqttClient, discovery_response: greengrass.model.DiscoverResponse) {
    return new Promise<mqtt.MqttClientConnection>((resolve, reject) => {
        const start_connections = () => {
            let attempted_cores: string[] = [];
            let connections: Promise<mqtt.MqttClientConnection>[] = [];
            for (const gg_group of discovery_response.gg_groups) {
                for (const core of gg_group.cores) {
                    attempted_cores.push(core.thing_arn.toString());
                    for (const endpoint of core.connectivity) {
                        const mqtt_config = iot.AwsIotMqttConnectionConfigBuilder.new_mtls_builder_from_path(args.cert, args.key)
                            .with_certificate_authority(gg_group.certificate_authorities[0])
                            .with_client_id(args.thing_name)
                            .with_clean_session(false)
                            .with_socket_options(new io.SocketOptions(io.SocketType.STREAM, io.SocketDomain.IPV4, 3000))
                            .build();
                        mqtt_config.host_name = endpoint.host_address;
                        mqtt_config.port = endpoint.port;
                        console.log(`Trying endpoint=${JSON.stringify(endpoint)}`);
                        const mqtt_connection = mqtt_client.new_connection(mqtt_config);
                        mqtt_connection.on('error', (error) => {
                            console.warn(`Connection to endpoint=${JSON.stringify(endpoint)} failed: ${error}`);
                        });
                        connections.push(mqtt_connection.connect().then((session_present) => {
                            console.log(`Connected to endpoint=${JSON.stringify(endpoint)}`);
                            return mqtt_connection;
                        }));
                    }
                }
            }

            return connections;
        }

        const mqtt_connections = start_connections();
        firstResolved(mqtt_connections)
            .then((connection) => {
                resolve(connection);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

async function execute_session(connection: mqtt.MqttClientConnection) {
    console.log("execute_session: topic is " + args.topic);
    return new Promise<void>(async (resolve, reject) => {
        try {
            let published = false;
            let subscribed = false;
            const decoder = new TextDecoder('utf8');
            if (args.mode == 'both' || args.mode == 'subscribe') {
                const on_publish = (topic: string, payload: ArrayBuffer, dup: boolean, qos: mqtt.QoS, retain: boolean) => {
                    const json = decoder.decode(payload);
                    console.log(`Publish received. topic:"${topic}" dup:${dup} qos:${qos} retain:${retain}`);
                    console.log(json);
                    const message = JSON.parse(json);
                    if (message.sequence == args.count) {
                        subscribed = true;
                        if (subscribed && published) {
                            resolve();
                        }
                    }
                }
                await connection.subscribe(args.topic, mqtt.QoS.AtLeastOnce, on_publish);
            }
            else {
                subscribed = true;
            }

            if (args.mode == 'both' || args.mode == 'publish') {
                let published_counts = 0;
                for (let op_idx = 0; op_idx < args.count; ++op_idx) {
                    const publish = async () => {
                        const msg = {
                            message: args.message,
                            sequence: op_idx + 1,
                        };
                        const json = JSON.stringify(msg);
                        console.log("execute_session: publishing...");
                        connection.publish(args.topic, json, mqtt.QoS.AtLeastOnce).then(() => {
                            ++published_counts;
                            if (published_counts == args.count) {
                                published = true;
                                if (subscribed && published) {
                                    resolve();
                                }
                            }
                        });
                    }
                    setTimeout(publish, op_idx * 1000);
                }
            }
            else {
                published = true;
            }
        }
        catch (error) {
            reject(error);
        }
    });
}

async function main() {
    if (args.verbose && args.verbose != 'none') {
        const level: io.LogLevel = parseInt(io.LogLevel[args.verbose.toUpperCase()]);
        io.enable_logging(level);
    }

    const client_bootstrap = new io.ClientBootstrap();
    const socket_options = new io.SocketOptions(io.SocketType.STREAM, io.SocketDomain.IPV4, 3000);
    const tls_options = new io.TlsContextOptions();
    if (args.ca_file) {
        tls_options.override_default_trust_store_from_path(undefined, args.ca_file);
    }
    tls_options.certificate_filepath = args.cert;
    tls_options.private_key_filepath = args.key;
    if (io.is_alpn_available()) {
        tls_options.alpn_list.push('x-amzn-http-ca');
    }
    const tls_ctx = new io.ClientTlsContext(tls_options);
    const discovery = new greengrass.DiscoveryClient(client_bootstrap, socket_options, tls_ctx, args.region);

    // force node to wait 60 seconds before killing itself, promises do not keep node alive
    const timer = setTimeout(() => { }, 60 * 1000);

    console.log("Starting discovery for thing " + args.thing_name);

    await discovery.discover(args.thing_name)
        .then(async (discovery_response: greengrass.model.DiscoverResponse) => {
            console.log("Discovery Response:");

            if (args.is_ci != true) {
                console.log(JSON.stringify(discovery_response));
            } else {
                console.log("Received a greengrass discovery result! Not showing result in CI for possible data sensitivity.");
            }

            if (args.print_discover_resp_only) {
                process.exit(0);
            }

            const mqtt_client = new mqtt.MqttClient(client_bootstrap);
            return connect_to_iot(mqtt_client, discovery_response);
        }).then(async (connection) => {
            await execute_session(connection);
            console.log("Disconnecting...");
            return connection.disconnect();
        }).then(() => {
            console.log('Complete!');
        })
        .catch((reason) => {
            console.log(`DISCOVERY SAMPLE FAILED: ${JSON.stringify(reason)}`);
            process.exit(1);
        });

    // Allow node to die if the promise above resolved
    clearTimeout(timer);
    process.exit(0);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
