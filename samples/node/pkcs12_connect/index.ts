/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */

import { mqtt } from 'aws-iot-device-sdk-v2';
import { iot } from 'aws-iot-device-sdk-v2';

type Args = { [index: string]: any };

const yargs = require('yargs');

// The relative path is '../../util/cli_args' from here, but the compiled javascript file gets put one level
// deeper inside the 'dist' folder
const common_args = require('../../../util/cli_args');

yargs.command('*', false, (yargs: any) => {
    yargs.usage("Connect using using a private key stored on a PKCS#11 device.");
    common_args.add_universal_arguments(yargs);
    common_args.add_common_mqtt_arguments(yargs);

    yargs
        .option('pkcs12_file', {
            description: "<path>: Path to PKCS#12 key.",
            type: 'string',
            required: true,
        })
        .option('pkcs12_password', {
            description: "<str> Password for PKCS12 key",
            type: 'string',
            required: true,
        })
}, main).parse();

// Creates and returns a MQTT connection using a PKCS11 credentials
function build_connection(argv: Args): mqtt.MqttClientConnection {
    const config_builder = iot.AwsIotMqttConnectionConfigBuilder
        .new_mtls_pkcs12_builder({
            pkcs12_file: argv.pkcs12_file,
            pkcs12_password: argv.pkcs12_password
        })
        .with_endpoint(argv.endpoint)
        .with_client_id(argv.client_id || `test-${Math.floor(Math.random() * 100000000)}`);

    if (argv.ca_file) {
        config_builder.with_certificate_authority_from_path(argv.ca_file);
    }

    const client = new mqtt.MqttClient()
    return client.new_connection(config_builder.build());
}

async function main(argv: Args) {
    common_args.apply_sample_arguments(argv);
    const connection = build_connection(argv);

    // force node to wait 20 seconds before killing itself, promises do not keep node alive
    // ToDo: we can get rid of this but it requires a refactor of the native connection binding that includes
    //    pinning the libuv event loop while the connection is active or potentially active.
    const timer = setInterval(() => { }, 20 * 1000);

    console.log("Connecting...");
    await connection.connect()
    console.log("Connection completed.");
    console.log("Disconnecting...");
    await connection.disconnect()
    console.log("Disconnect completed.");

    // Allow node to die if the promise above resolved
    clearTimeout(timer);
}
