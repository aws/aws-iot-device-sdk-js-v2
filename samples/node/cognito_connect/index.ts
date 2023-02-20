/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */

import { mqtt, iot, http, auth} from 'aws-iot-device-sdk-v2';
type Args = { [index: string]: any };

const yargs = require('yargs');


// The relative path is '../../util/cli_args' from here, but the compiled javascript file gets put one level
// deeper inside the 'dist' folder
const common_args = require('../../../util/cli_args');

yargs.command('*', false, (yargs: any) => {
    yargs.usage("Connect using a Cognito identity.");
    common_args.add_universal_arguments(yargs);
    common_args.add_common_mqtt_arguments(yargs);
    common_args.add_common_websocket_arguments(yargs, true);
    common_args.add_cognito_arguments(yargs);
    common_args.add_proxy_arguments(yargs);
}, main).parse();

// Creates and returns a websocket MQTT connection using Cognito to authenticate
function build_connection(argv: Args): mqtt.MqttClientConnection {
    /**
     * Note: This sample assumes that you are using a Cognito identity in the same region as you pass to "--signing_region".
     * If not, you may need to adjust the Cognito endpoint. See https://docs.aws.amazon.com/general/latest/gr/cognito_identity.html
     * for all Cognito region endpoints.
     */
    let cognito_endpoint = "cognito-identity." + argv.signing_region + ".amazonaws.com";

    let cognito_credentials : iot.WebsocketConfig = {
        region: argv.signing_region,
        credentials_provider: auth.AwsCredentialsProvider.newCognito({
            endpoint: cognito_endpoint,
            identity: argv.cognito_identity
        })
    }
    let config_builder = iot.AwsIotMqttConnectionConfigBuilder.new_websocket_builder(cognito_credentials);

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
