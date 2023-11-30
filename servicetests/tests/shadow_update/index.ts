/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */

import { mqtt, iotshadow } from 'aws-iot-device-sdk-v2';
import {once} from "events";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

type Args = { [index: string]: any };
const yargs = require('yargs');

// The relative path is '../../../samples/util/cli_args' from here, but the compiled javascript file gets put one level
// deeper inside the 'dist' folder
const common_args = require('../../../../samples/util/cli_args');

yargs.command('*', false, (yargs: any) => {
    common_args.add_direct_connection_establishment_arguments(yargs);
    common_args.add_shadow_arguments(yargs);
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

async function main(argv: Args) {
    common_args.apply_sample_arguments(argv);

    var connection;
    var client5;
    var shadow;

    console.log("Connecting...");
    if (argv.mqtt_version == 5) {   // Build the mqtt5 client
        client5 = common_args.build_mqtt5_client_from_cli_args(argv);
        shadow = iotshadow.IotShadowClient.newFromMqtt5Client(client5);

        const connectionSuccess = once(client5, "connectionSuccess");
        client5.start();
        await connectionSuccess;
        console.log("Connected with Mqtt5 Client...");
    } else {            // Build the mqtt3 based connection
        connection = common_args.build_connection_from_cli_args(argv);
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
    } else {
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
