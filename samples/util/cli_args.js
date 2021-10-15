/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */

/*
 * The 'aws-iot-device-sdk-v2' module exports the same set of mqtt/http/io primitives as the crt, but
 * it is not importable from this file based on js module resolution rules (because this file is sitting off
 * in shared la-la-land) which walk up the directory tree from the file itself.
 *
 * So use the aws-crt interfaces directly, but a real application that was rooted in a single place could
 * naturally use something like
 *
 * const iotsdk = require('aws-iot-device-sdk-v2')
 * const auth = iotsdk.auth;
 * etc...
 *
 */
const awscrt = require('aws-crt');
const auth = awscrt.auth;
const http = awscrt.http;
const io = awscrt.io;
const iot = awscrt.iot;
const mqtt = awscrt.mqtt;

/*
 * Arguments that control how the sample should establish its mqtt connection(s).
 */
function add_connection_establishment_arguments(yargs) {
    yargs
        .option('endpoint', {
            alias: 'e',
            description: "Your AWS IoT custom endpoint, not including a port. "  +
                "Ex: \"abcd123456wxyz-ats.iot.us-east-1.amazonaws.com\"",
            type: 'string',
            required: true
        })
        .option('ca_file', {
            alias: 'r',
            description: 'File path to a Root CA certificate file in PEM format.',
            type: 'string',
            required: false
        })
        .option('cert', {
            alias: 'c',
            description: 'File path to a PEM encoded certificate to use with mTLS',
            type: 'string',
            required: false
        })
        .option('key', {
            alias: 'k',
            description: 'File path to a PEM encoded private key that matches cert.',
            type: 'string',
            required: false
        })
        .option('client_id', {
            alias: 'C',
            description: 'Client ID for MQTT connection.',
            type: 'string',
            required: false
        })
        .option('use_websocket', {
            alias: 'W',
            default: false,
            description: 'To use a websocket instead of raw mqtt. If you specify this option you must set a region ' +
                'for signing (signing_region) that matches your endpoint.',
            type: 'boolean',
            required: false
        })
        .option('signing_region', {
            alias: 's',
            default: 'us-east-1',
            description: 'If you specify --use_websocket, this ' +
                'is the region that will be used for computing the Sigv4 signature.  This region must match the' +
                'AWS region in your endpoint.',
            type: 'string',
            required: false
        })
        .option('proxy_host', {
            alias: 'H',
            description: 'Hostname of the proxy to connect to',
            type: 'string',
            required: false
        })
        .option('proxy_port', {
            alias: 'P',
            default: 8080,
            description: 'Port of the proxy to connect to.',
            type: 'number',
            required: false
        })
        .option('verbosity', {
            alias: 'v',
            description: 'The amount of detail in the logging output of the sample.',
            type: 'string',
            default: 'none',
            choices: ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'none']
        })
        .help()
        .alias('help', 'h')
        .showHelpOnFail(false)
}

/*
 * Arguments specific to the pub sub style samples.  We have multiple.
 */
function add_pub_sub_arguments(yargs) {
    yargs
        .option('topic', {
            alias: 't',
            description: 'Topic to publish to',
            type: 'string',
            default: 'test/topic'
        })
        .option('count', {
            alias: 'n',
            default: 10,
            description: 'Number of messages to publish/receive before exiting. ' +
                'Specify 0 to run forever.',
            type: 'number',
            required: false
        })
        .option('message', {
            alias: 'M',
            description: 'Message to publish.',
            type: 'string',
            default: 'Hello world!'
        })
}

/*
 * Handles any non-specific arguments that are relevant to all samples
 */
function apply_sample_arguments(argv) {
    if (argv.verbosity != 'none') {
        const level = parseInt(io.LogLevel[argv.verbosity.toUpperCase()]);
        io.enable_logging(level);
    }
}

/*
 * A set of simple connection builder functions intended to cover a variety of scenarios/configurations.
 *
 * There is plenty of redundant code across these functions, but in this case we are trying to show, stand-alone and
 * top-to-bottom, all the steps needed to establish an mqtt connection for each scenario.
 *
 * ToDo : Add a connection builder for custom auth case
 * ToDo : Add a connection builder showing x509 provider usage.  Pre-req: x509 provider binding.
 * ToDo : Add a connection builder for websockets using cognito and the Aws SDK for JS (or implement and bind
 *        a cognito provider).
 */

/*
 * Build an mqtt connection using websockets, (http) proxy optional.
 */
function build_websocket_mqtt_connection_from_args(argv) {
    let config_builder = iot.AwsIotMqttConnectionConfigBuilder.new_with_websockets({
        region: argv.signing_region,
        credentials_provider: auth.AwsCredentialsProvider.newDefault()
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

/*
 * Build a direct mqtt connection using mtls, (http) proxy optional
 */
function build_direct_mqtt_connection_from_args(argv) {
    let config_builder = iot.AwsIotMqttConnectionConfigBuilder.new_mtls_builder_from_path(argv.cert, argv.key);

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

/*
 * Uses all of the connection-relevant arguments to create an mqtt connection as desired.
 */
function build_connection_from_cli_args(argv) {
    /*
     * Only basic websocket and direct mqtt connections for now.  Later add custom authorizer and x509 support.
     */
    if (argv.use_websocket) {
        return build_websocket_mqtt_connection_from_args(argv);
    } else {
        return build_direct_mqtt_connection_from_args(argv);
    }
}

exports.add_connection_establishment_arguments = add_connection_establishment_arguments;
exports.add_pub_sub_arguments = add_pub_sub_arguments;
exports.apply_sample_arguments = apply_sample_arguments;
exports.build_connection_from_cli_args = build_connection_from_cli_args;
