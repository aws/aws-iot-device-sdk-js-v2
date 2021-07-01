/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */

import { mqtt, io, iot, greengrass } from 'aws-iot-device-sdk-v2';
import { TextDecoder } from 'util';

type Args = { [index: string]: any };

const yargs = require('yargs');
yargs.command('*', false, (yargs: any) => {
    yargs.option('ca_file', {
            alias: 'r',
            description: 'FILE: path to a Root CA certficate file in PEM format.',
            type: 'string',
            required: true
        })
        .option('cert', {
            alias: 'c',
            description: 'FILE: path to a PEM encoded certificate to use with mTLS',
            type: 'string',
            required: true
        })
        .option('key', {
            alias: 'k',
            description: 'FILE: Path to a PEM encoded private key that matches cert.',
            type: 'string',
            required: true
        })
        .option('thing_name', {
            alias: 'n',
            description: 'STRING: Targeted Thing name.',
            type: 'string',
            required: true
        })
        .option('topic', {
            alias: 't',
            description: 'STRING: Targeted topic',
            type: 'string',
            default: 'test/topic'
        })
        .option('mode', {
            alias: 'm',
            description: 'STRING: [publish, subscribe, both]. Defaults to both',
            type: 'string',
            default: 'both',
            choices: ['publish', 'subscribe', 'both']
        })
        .option('message', {
            alias: 'M',
            description: 'STRING: Message to publish.',
            type: 'string',
            default: 'Hello world!'
        })
        .option('region', {
            description: 'STRING: AWS Region.',
            type: 'string',
            default: 'us-east-1'
        })
        .option('max_pub_ops', {
            description: 'NUMBER: Maximum number of publishes to send',
            type: 'number',
            default: 10
        })
        .option('print_discover_resp_only', {
            description: 'BOOLEAN: Only print the response from Greengrass discovery',
            type: 'boolean',
            default: false
        })
        .option('verbose', {
            alias: 'v',
            description: 'BOOLEAN: Verbose output',
            type: 'string',
            default: 'none',
            choices: ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'none']
        })
        .help()
        .alias('help', 'h')
        .showHelpOnFail(false)
}, main).parse();

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

async function connect_to_iot(mqtt_client: mqtt.MqttClient, argv: Args, discovery_response: greengrass.model.DiscoverResponse) {
    return new Promise<mqtt.MqttClientConnection>((resolve, reject) => {
        const start_connections = () => {
            let attempted_cores: string[] = [];
            let connections: Promise<mqtt.MqttClientConnection>[] = [];
            for (const gg_group of discovery_response.gg_groups) {
                for (const core of gg_group.cores) {
                    attempted_cores.push(core.thing_arn.toString());
                    for (const endpoint of core.connectivity) {
                        const mqtt_config = iot.AwsIotMqttConnectionConfigBuilder.new_mtls_builder_from_path(argv.cert, argv.key)
                            .with_certificate_authority(gg_group.certificate_authorities[0])
                            .with_client_id(argv.thing_name)
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

async function execute_session(connection: mqtt.MqttClientConnection, argv: Args) {
    return new Promise(async (resolve, reject) => {
        try {
            const decoder = new TextDecoder('utf8');
            if (argv.mode == 'both' || argv.mode == 'subscribe') {
                const on_publish = (topic: string, payload: ArrayBuffer, dup: boolean, qos: mqtt.QoS, retain: boolean) => {
                    const json = decoder.decode(payload);
                    console.log(`Publish received. topic:"${topic}" dup:${dup} qos:${qos} retain:${retain}`);
                    console.log(json);
                    const message = JSON.parse(json);
                    if (message.sequence == argv.max_pub_ops) {
                        resolve();
                    }
                }
                await connection.subscribe(argv.topic, mqtt.QoS.AtMostOnce, on_publish);
            }

            if (argv.mode == 'both' || argv.mode == 'publish') {
                for (let op_idx = 0; op_idx < argv.max_pub_ops; ++op_idx) {
                    const publish = async () => {
                        const msg = {
                            message: argv.message,
                            sequence: op_idx + 1,
                        };
                        const json = JSON.stringify(msg);
                        connection.publish(argv.topic, json, mqtt.QoS.AtMostOnce);
                    }
                    setTimeout(publish, op_idx * 1000);
                }
            }
        }
        catch (error) {
            reject(error);
        }
    });
}

async function main(argv: Args) {
    if (argv.verbose != 'none') {
        const level : io.LogLevel = parseInt(io.LogLevel[argv.verbose.toUpperCase()]);
        io.enable_logging(level);
    }

    const client_bootstrap = new io.ClientBootstrap();
    const socket_options = new io.SocketOptions(io.SocketType.STREAM, io.SocketDomain.IPV4, 3000);
    const tls_options = new io.TlsContextOptions();
    tls_options.override_default_trust_store_from_path(undefined, argv.ca_file);
    tls_options.certificate_filepath = argv.cert;
    tls_options.private_key_filepath = argv.key;
    if (io.is_alpn_available()) {
        tls_options.alpn_list.push('x-amzn-http-ca');
    }
    const tls_ctx = new io.ClientTlsContext(tls_options);
    const discovery = new greengrass.DiscoveryClient(client_bootstrap, socket_options, tls_ctx, argv.region);

    // force node to wait 60 seconds before killing itself, promises do not keep node alive
    const timer = setTimeout(() => {}, 60 * 1000);

    await discovery.discover(argv.thing_name)
        .then(async (discovery_response: greengrass.model.DiscoverResponse) => {
            console.log("Discovery Response:");
            console.log(JSON.stringify(discovery_response));
            if (argv.print_discover_resp_only) {
                process.exit(0);
            }

            const mqtt_client = new mqtt.MqttClient(client_bootstrap);
            return connect_to_iot(mqtt_client, argv, discovery_response);
        }).then(async (connection) => {
            await execute_session(connection, argv);
            return connection.disconnect();
        }).then(() => {
            console.log('Complete!');
        })
        .catch((reason) => {
            console.log(`DISCOVERY SAMPLE FAILED: ${reason}`);
        });

    // Allow node to die if the promise above resolved
    clearTimeout(timer);
}
