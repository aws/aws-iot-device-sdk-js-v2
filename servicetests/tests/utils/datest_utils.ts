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
import { env } from 'process';
const awscrt = require('aws-crt');
const iot = awscrt.iot;
const mqtt = awscrt.mqtt;

export const enum TestType {
    CONNECT,
    SUB_PUB,
    SHADOW
  }

/*
 * Gather Environment variable
 */
export var endpoint = env.DA_ENDPOINT
export var certificatePath = env.DA_CERTI
export var keyPath = env.DA_KEY
export var topic = env.DA_TOPIC
export var thing_name = env.DA_THING_NAME
export var shadowProperty = env.DA_SHADOW_PROPERTY
export var shadowValue = env.DA_SHADOW_VALUE_SET
export var client_id = "test-" + Math.floor(Math.random() * 100000000)

/**
 * Validate if the environment variables are set.
 */
function validate_vars(type : TestType)
{
    if (!(endpoint && certificatePath && keyPath))
        return false

    if (!topic && type == TestType.SUB_PUB)
        return false

    if (!(thing_name && shadowProperty && shadowValue) && type == TestType.SHADOW)
        return false
    
    return true
}

/*
 * Build a direct mqtt connection using mtls, (http) proxy optional
 */
function build_direct_mqtt_connection() {
    let config_builder = iot.AwsIotMqttConnectionConfigBuilder.new_mtls_builder_from_path(certificatePath, keyPath);

    config_builder.with_clean_session(false);
    config_builder.with_client_id(client_id);
    config_builder.with_endpoint(endpoint);
    const config = config_builder.build();

    const client = new mqtt.MqttClient();
    return client.new_connection(config);
}


exports.build_direct_mqtt_connection = build_direct_mqtt_connection;
exports.validate_vars = validate_vars;
