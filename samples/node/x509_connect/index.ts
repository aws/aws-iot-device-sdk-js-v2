/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */

import { mqtt } from 'aws-iot-device-sdk-v2';
import { iot } from 'aws-iot-device-sdk-v2';
import { http } from 'aws-iot-device-sdk-v2';
import { auth } from 'aws-iot-device-sdk-v2';
import { io } from 'aws-iot-device-sdk-v2';

type Args = { [index: string]: any };

const yargs = require('yargs');

// The relative path is '../../util/cli_args' from here, but the compiled javascript file gets put one level
// deeper inside the 'dist' folder
const common_args = require('../../../util/cli_args');

yargs.command('*', false, (yargs: any) => {
    yargs.usage("Connect using X509.");
    common_args.add_universal_arguments(yargs);
    common_args.add_common_mqtt_arguments(yargs);
    common_args.add_common_websocket_arguments(yargs, true);
    common_args.add_x509_arguments(yargs);
    common_args.add_proxy_arguments(yargs);
}, main).parse();

// Creates and returns a MQTT connection using a websockets and X509
function build_connection(argv: Args): mqtt.MqttClientConnection {

    let x509_tls_ctx_opt = new io.TlsContextOptions();
    x509_tls_ctx_opt.certificate_filepath = argv.x509_cert;
    x509_tls_ctx_opt.private_key_filepath = argv.x509_key;
    if (argv.x509_ca_file) {
        x509_tls_ctx_opt.ca_filepath = argv.x509_ca_file;
    }
    let x509_client_tls_ctx = new io.ClientTlsContext(x509_tls_ctx_opt);

    let x509_config = {
        endpoint: argv.x509_endpoint,
        thing_name: argv.x509_thing_name,
        role_alias: argv.x509_role_alias,
        tlsContext: x509_client_tls_ctx,
    };
    let x509_credentials_provider = auth.AwsCredentialsProvider.newX509(x509_config)

    let config_builder = iot.AwsIotMqttConnectionConfigBuilder.new_with_websockets({
        region: argv.signing_region,
        credentials_provider: x509_credentials_provider
    });

    if (argv.proxy_host) {
        config_builder.with_http_proxy_options(new http.HttpProxyOptions(argv.proxy_host, argv.proxy_port));
    }

    if (argv.ca_file != null) {
        config_builder.with_certificate_authority_from_path(undefined, argv.ca_file);
    }

    config_builder.with_clean_session(false);
    config_builder.with_client_id(argv.client_id || "test-" + Math.floor(Math.random() * 100000000));
    config_builder.with_endpoint(argv.endpoint);
    const config = config_builder.build();

    const client = new mqtt.MqttClient();
    return client.new_connection(config);
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
