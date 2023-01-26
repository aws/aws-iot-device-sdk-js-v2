/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */

import { mqtt } from 'aws-iot-device-sdk-v2';
import { TextDecoder } from 'util';

type Args = { [index: string]: any };

const yargs = require('yargs');

// The relative path is '../../util/cli_args' from here, but the compiled javascript file gets put one level
// deeper inside the 'dist' folder
const common_args = require('../../../util/cli_args');

yargs.command('*', false, (yargs: any) => {
    common_args.add_direct_connection_establishment_arguments(yargs);
    common_args.add_topic_message_arguments(yargs);
}, main).parse();

async function execute_session(connection: mqtt.MqttClientConnection, argv: Args) {
    return new Promise<void>(async (resolve, reject) => {
        try {
            let published = false;
            let subscribed = false;
            const decoder = new TextDecoder('utf8');
            const on_publish = async (topic: string, payload: ArrayBuffer, dup: boolean, qos: mqtt.QoS, retain: boolean) => {
                const json = decoder.decode(payload);
                console.log(`Publish received. topic:"${topic}" dup:${dup} qos:${qos} retain:${retain}`);
                console.log(json);
                const message = JSON.parse(json);
                if (message.sequence == argv.count) {
                    subscribed = true;
                    if (subscribed && published) {
                        resolve();
                    }
                }
            }

            await connection.subscribe(argv.topic, mqtt.QoS.AtLeastOnce, on_publish);
            let published_counts = 0;
            for (let op_idx = 0; op_idx < argv.count; ++op_idx) {
                const publish = async () => {
                    const msg = {
                        message: argv.message,
                        sequence: op_idx + 1,
                    };
                    const json = JSON.stringify(msg);
                    connection.publish(argv.topic, json, mqtt.QoS.AtLeastOnce).then(() => {
                        ++published_counts;
                        if (published_counts == argv.count) {
                            published = true;
                            if (subscribed && published) {
                                resolve();
                            }
                        }
                    })
                }
                setTimeout(publish, op_idx * 1000);
            }
        }
        catch (error) {
            reject(error);
        }
    });
}

async function main(argv: Args) {
    common_args.apply_sample_arguments(argv);

    const connection = common_args.build_connection_from_cli_args(argv);

    // force node to wait 60 seconds before killing itself, promises do not keep node alive
    // ToDo: we can get rid of this but it requires a refactor of the native connection binding that includes
    //    pinning the libuv event loop while the connection is active or potentially active.
    const timer = setInterval(() => { }, 60 * 1000);

    await connection.connect()
    await execute_session(connection, argv)
    await connection.disconnect()

    // Allow node to die if the promise above resolved
    clearTimeout(timer);
}
