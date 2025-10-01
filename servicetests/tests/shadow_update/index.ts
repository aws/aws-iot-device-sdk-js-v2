/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */

import { mqtt, mqtt5, iot, iotshadow } from 'aws-iot-device-sdk-v2';
import {once} from "events";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

type Args = { [index: string]: any };
const yargs = require('yargs');

yargs.command('*', false, (yargs: any) => {
    yargs.option('endpoint', {
        alias: 'e',
        description: 'Your AWS IoT custom endpoint, not including a port.',
        type: 'string',
        required: true
    })
    .option('cert', {
        alias: 'c',
        description: '<path>: File path to a PEM encoded certificate to use with mTLS.',
        type: 'string',
        required: false
    })
    .option('key', {
        alias: 'k',
        description: '<path>: File path to a PEM encoded private key that matches cert.',
        type: 'string',
        required: false
    })
    .option('region', {
        alias: 'r',
        description: 'AWS region to establish a websocket connection to.',
        type: 'string',
        required: false
    })
    .option('client_id', {
        alias: 'C',
        description: 'Client ID for MQTT connection.',
        type: 'string',
        required: false
    })
    .option('shadow_property', {
        alias: 'p',
        description: 'Name of property in shadow to keep in sync',
        type: 'string',
        default: 'color'
    })
    .option('shadow_value', {
        alias: 'u',
        description: 'Value for shadow property',
        type: 'string',
        default: 'on'
    })
    .option('shadow_name', {
        alias: 'N',
        description: 'Use named shadow with specified name',
        type: 'string'
    })
    .option('thing_name', {
        alias: 'n',
        description: 'The name assigned to your IoT Thing',
        type: 'string',
        default: 'name'
    })
    .option('mqtt_version', {
        description: 'MQTT version to use (3 or 5). Default is 5.',
        type: 'number',
        required: false,
        default: 5
    })
}, main).parse();


function change_shadow_value(shadow: iotshadow.IotShadowClient, argv: Args, new_value?: object) {
    return new Promise(async (resolve, reject) => {
        try {
            if (typeof new_value !== 'undefined') {
                var updateShadow: iotshadow.model.UpdateShadowRequest = {
                    state: {
                        desired: new_value,
                        reported: new_value
                    },
                    thingName: argv.thing_name
                };

                await shadow.publishUpdateShadow(
                    updateShadow,
                    mqtt.QoS.AtLeastOnce)

                console.log("Update request published.");
            }
        }
        catch (error) {
            console.log("Failed to publish update request.")
            reject(error);
        }
        resolve(true)
    });
}

function change_named_shadow_value(shadow: iotshadow.IotShadowClient, argv: Args, new_value?: object) {
    return new Promise(async (resolve, reject) => {
        try {
            if (typeof new_value !== 'undefined') {
                var updateNamedShadow: iotshadow.model.UpdateNamedShadowRequest = {
                    state: {
                        desired: new_value,
                        reported: new_value
                    },
                    thingName: argv.thing_name,
                    shadowName: argv.shadow_name
                };

                await shadow.publishUpdateNamedShadow(
                    updateNamedShadow,
                    mqtt.QoS.AtLeastOnce)

                console.log("Update request published.");
            }
        }
        catch (error) {
            console.log("Failed to publish update request.")
            reject(error);
        }
        resolve(true)
    });
}

function createConnection(args: any): mqtt.MqttClientConnection {
    let config_builder: iot.AwsIotMqttConnectionConfigBuilder;

    if (args.key && args.cert) {
        config_builder = iot.AwsIotMqttConnectionConfigBuilder.new_mtls_builder_from_path(
            args.cert,
            args.key
        );
    } else {
        config_builder = iot.AwsIotMqttConnectionConfigBuilder.new_with_websockets({
            region: args.region || 'us-east-1'
        });
    }

    config_builder.with_clean_session(false);
    config_builder.with_client_id(args.client_id || "test-" + Math.floor(Math.random() * 100000000));
    config_builder.with_endpoint(args.endpoint);
    
    const config = config_builder.build();
    const client = new mqtt.MqttClient();
    return client.new_connection(config);
}

function createMqtt5Client(args: any): mqtt5.Mqtt5Client {
    let builder: iot.AwsIotMqtt5ClientConfigBuilder;

    if (args.key && args.cert) {
        builder = iot.AwsIotMqtt5ClientConfigBuilder.newDirectMqttBuilderWithMtlsFromPath(
            args.endpoint,
            args.cert,
            args.key
        );
    } else {
        builder = iot.AwsIotMqtt5ClientConfigBuilder.newWebsocketMqttBuilderWithSigv4Auth(
            args.endpoint,
            { region: args.region || 'us-east-1' }
        );
    }

    builder.withConnectProperties({
        clientId: args.client_id || "test-" + Math.floor(Math.random() * 100000000),
        keepAliveIntervalSeconds: 1200
    });

    return new mqtt5.Mqtt5Client(builder.build());
}

async function main(argv: Args) {
    let connection: mqtt.MqttClientConnection | undefined;
    let client5: mqtt5.Mqtt5Client | undefined;
    let shadow: iotshadow.IotShadowClient;

    console.log("Connecting...");
    if (argv.mqtt_version == 5) {
        client5 = createMqtt5Client(argv);
        shadow = iotshadow.IotShadowClient.newFromMqtt5Client(client5);

        const connectionSuccess = once(client5, "connectionSuccess");
        client5.start();
        await connectionSuccess;
        console.log("Connected with Mqtt5 Client...");
    } else {
        connection = createConnection(argv);
        shadow = new iotshadow.IotShadowClient(connection);

        await connection.connect();
        console.log("Connected with Mqtt3 Client...");
    }

    try {
        let data_to_send: any = {}
        data_to_send[argv.shadow_property] = argv.shadow_value
        if (argv.shadow_name) {
            console.log("Use named shadow")
            await change_named_shadow_value(shadow, argv, data_to_send);
        } else {
            console.log("Use classic shadow")
            await change_shadow_value(shadow, argv, data_to_send);
        }
    } catch (error) {
        console.log(error);
    }

    console.log("Disconnecting..");

    if (connection) {
        await connection.disconnect();
    } else if (client5) {
        let stopped = once(client5, "stopped");
        client5.stop();
        await stopped;
        client5.close();
    }

    // force node to wait a second before quitting to finish any promises
    await sleep(1000);
    console.log("Disconnected");
    // Quit NodeJS
    process.exit(0);
}
