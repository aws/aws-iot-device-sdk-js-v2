/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */

/**
 * This sample is similar to `samples/node/pub_sub_js` but the private key
 * for mutual TLS is stored on a PKCS#11 compatible smart card or
 * hardware security module (HSM).
 *
 * See `samples/README.md` for instructions on setting up your PKCS#11 device
 * to run this sample.
 *
 * WARNING: Unix only. Currently, TLS integration with PKCS#11 is only available on Unix devices.
 */

import { mqtt, io, iot } from 'aws-iot-device-sdk-v2';
import { TextDecoder } from 'util';

type Args = { [index: string]: any };

const yargs = require('yargs');
yargs.command('*', false, (yargs: any) => {
    yargs
        .usage("Connect using a private key stored on a PKCS#11 device.")
        .option('endpoint', {
            description: "Your AWS IoT custom endpoint, not including a port.\n" +
                "Ex: \"abcd123456wxyz-ats.iot.us-east-1.amazonaws.com\"",
            type: 'string',
            required: true,
        })
        .option('cert', {
            description: "<path>: Path to your certificate file in PEM format.",
            type: 'string',
            required: true,
        })
        .option('pkcs11_lib', {
            description: "<path> Path to PKCS#11 library.",
            type: 'string',
            required: true,
        })
        .option('pin', {
            description: "User PIN for logging into PKCS#11 token.",
            type: 'string',
            required: true,
        })
        .option('token_label', {
            description: "Label of PKCS#11 token.",
            type: 'string',
        })
        .option('slot_id', {
            description: "Slot ID containing PKCS#11 token.",
            type: 'number',
        })
        .option('key_label', {
            description: "Label of your private key on the PKCS#11 token.",
            type: 'string',
        })
        .option('ca_file', {
            description: "<path>: Path to a Root CA certificate file in PEM format (optional, system trust store used by default).",
            type: 'string',
        })
        .option('client_id', {
            description: "Client ID for MQTT connection.",
            type: 'string',
        })
        .option('topic', {
            description: "Topic to publish to (optional)",
            type: 'string',
            default: 'test/topic'
        })
        .option('count', {
            default: 10,
            description: "Number of messages to publish/receive before exiting. " +
                "Specify 0 to run forever (optional).",
            type: 'number',
        })
        .option('message', {
            description: "Message to publish (optional).",
            type: 'string',
            default: 'Hello world!'
        })
        .option('verbosity', {
            description: "The amount of detail in the logging output of the sample (optional).",
            type: 'string',
            choices: ['error', 'warn', 'info', 'debug', 'trace', 'none']
        })
        .help()
        .version(false)
        .showHelpOnFail(false)
}, main).parse();

function build_connection(argv: Args): mqtt.MqttClientConnection {
    console.log(`Loading PKCS#11 library "${argv.pkcs11_lib}" ...`);
    const pkcs11_lib = new io.Pkcs11Lib(argv.pkcs11_lib);
    console.log("Loaded.");

    const config_builder = iot.AwsIotMqttConnectionConfigBuilder
        .new_mtls_pkcs11_builder({
            pkcs11_lib: pkcs11_lib,
            user_pin: argv.pin,
            slot_id: argv.slot_id,
            token_label: argv.token_label,
            private_key_object_label: argv.key_label,
            cert_file_path: argv.cert
        })
        .with_endpoint(argv.endpoint)
        .with_client_id(argv.client_id || `test-${Math.floor(Math.random() * 100000000)}`);

    if (argv.ca_file) {
        config_builder.with_certificate_authority_from_path(argv.ca_file);
    }

    const client = new mqtt.MqttClient()
    return client.new_connection(config_builder.build());
}

async function execute_session(connection: mqtt.MqttClientConnection, argv: Args) {
    return new Promise<void>(async (resolve, reject) => {
        try {
            let published = false;
            let subscribed = false;
            const decoder = new TextDecoder('utf8');
            const on_msg_received = async (topic: string, payload: ArrayBuffer, dup: boolean, qos: mqtt.QoS, retain: boolean) => {
                const json = decoder.decode(payload);
                console.log(`Publish received. topic:"${topic}" dup:${dup} qos:${qos} retain:${retain}`);
                console.log(json);
                const message = JSON.parse(json);

                // resolve promise when last message received
                if (message.sequence == argv.count) {
                    console.log("All messages received.");
                    subscribed = true;
                    if (subscribed && published) {
                        resolve();
                    }
                }
            }

            console.log(`Subscribing to "${argv.topic}" ...`);
            await connection.subscribe(argv.topic, mqtt.QoS.AtLeastOnce, on_msg_received);
            console.log("Subscribed.");

            console.log(`Publishing to "${argv.topic}" ${argv.count || Infinity} times ...`);
            for (let op_idx = 0; op_idx < (argv.count || Infinity); ++op_idx) {
                const msg = {
                    message: argv.message,
                    sequence: op_idx + 1,
                };
                const json = JSON.stringify(msg);
                await connection.publish(argv.topic, json, mqtt.QoS.AtLeastOnce);

                // sleep a moment before next publish
                await new Promise(r => setTimeout(r, 1000));
            }

            console.log("All messages sent.");
            published = true;
            if (subscribed && published) {
                resolve();
            }
        }
        catch (error) {
            reject(error);
        }
    });
}

async function main(argv: Args) {
    if (argv.verbosity) {
        const log_level_key = argv.verbosity.toUpperCase() as keyof typeof io.LogLevel;
        io.enable_logging(io.LogLevel[log_level_key]);
    }

    const connection = build_connection(argv);

    // force node to wait 60 seconds before killing itself, promises do not keep node alive
    // ToDo: we can get rid of this but it requires a refactor of the native connection binding that includes
    //    pinning the libuv event loop while the connection is active or potentially active.
    const timer = setInterval(() => { }, 60 * 1000);

    console.log(`Connecting to "${argv.endpoint}" ...`);
    await connection.connect();
    console.log("Connected.");

    await execute_session(connection, argv);

    console.log("Disconnecting ...");
    await connection.disconnect();
    console.log("Disconnected.");

    // Allow node to die if the promise above resolved
    clearTimeout(timer);
}
