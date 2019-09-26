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

import { http, mqtt, io, iot } from 'aws-crt';
import { DiscoveryClient } from 'aws-iot-device-sdk';
import { exists } from 'fs';

type Args = { [index: string]: any };

const yargs = require('yargs');
yargs.command('*', false, (yargs: any) => {
    yargs.option('ca_file', {
            alias: 'r',
            description: 'FILE: path to a Root CA certficate file in PEM format.',
            type: 'string'
        })
        .option('cert', {
            alias: 'c',
            description: 'FILE: path to a PEM encoded certificate to use with mTLS',
            type: 'string'
        })
        .option('key', {
            alias: 'k',
            description: 'FILE: Path to a PEM encoded private key that matches cert.',
            type: 'string'
        })
        .option('thing_name', {
            alias: 'n',
            description: 'STRING: Targeted Thing name.',
            type: 'string'
        })
        .option('topic', {
            alias: 't',
            description: 'STRING: Targeted topic',
            type: 'string',
            default: 'sdk/test/NodeJSv2'
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

async function main(argv: Args) {
    const client_bootstrap = new io.ClientBootstrap();
    const socket_options = new io.SocketOptions(io.SocketType.STREAM, io.SocketDomain.IPV4, 3000);
    const tls_options = new io.TlsContextOptions();
    tls_options.override_default_trust_store(undefined, argv.ca_file);
    const tls_ctx = new io.ClientTlsContext(tls_options);
    const discovery = new DiscoveryClient(client_bootstrap, socket_options, tls_ctx, argv.region);

    const discovery_response = await discovery.discover(argv.thing_name);
    if (argv.print_discover_resp_only) {
        console.log(discovery_response);
        process.exit(0);
    }

    const mqtt_config = iot.AwsIotMqttConnectionConfigBuilder.new_mtls_builder_from_path(argv.cert, argv.key)
        .with_certificate_authority_from_path(argv.ca_file)
        .with_client_id(argv.thing_name)
        .with_clean_session(false)
        .build();
    const mqtt_client = new mqtt.MqttClient(client_bootstrap);
    let attempted_cores: string[] = [];
    const connect = async () => {
        for (const gg_group of discovery_response.gg_groups) {
            for (const core of gg_group.cores) {
                attempted_cores.push(core.thing_arn.toString());
                for (const endpoint of core.connectivity) {
                    mqtt_config.host_name = endpoint.host_address;
                    mqtt_config.port = endpoint.port;
                    const mqtt_connection = mqtt_client.new_connection(mqtt_config);
                    try {
                        await mqtt_connection.connect();
                        return mqtt_connection;
                    }
                    catch (err) {
                        continue;
                    }
                }
            }
        }
        console.log(`All connection attempts failed, cores: ${attempted_cores.join(', ')}`);
        process.exit(-1);
        throw new Error('Failed');
    }

    const mqtt_connection = await connect();
    
    try {
        if (argv.mode == 'both' || argv.mode == 'subscribe') {
            const decoder = new TextDecoder('utf8');
            const on_publish = (topic: string, payload: ArrayBuffer) => {
                console.log(`Publish received on topic ${topic}`);
                console.log(decoder.decode(payload));
            }
            await mqtt_connection.subscribe(argv.topic, mqtt.QoS.AtMostOnce, on_publish);
        }

        if (argv.mode == 'both' || argv.mode == 'publish') {
            for (let op_idx = 0; op_idx < argv.max_pub_ops; ++op_idx) {
                const publish = async () => {
                    const msg = {
                        message: argv.message,
                        sequence: op_idx,
                    };
                    const json = JSON.stringify(msg);
                    await mqtt_connection.publish(argv.topic, json, mqtt.QoS.AtMostOnce);
                }
                setTimeout(publish, op_idx * 1000);
            }
        }
    }
    catch (error) {
        console.log(`MQTT error: ${error}`);
        process.exit(-2);
    }    
}
