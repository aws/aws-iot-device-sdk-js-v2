/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */

const iotsdk = require("aws-iot-device-sdk-v2");
const iot = iotsdk.iot;
const mqtt = iotsdk.mqtt;
const AWS = require("aws-sdk");
const Settings = require("./settings");
const $ = require("jquery");

function log(msg) {
    $("#console").append(`<pre>${msg}</pre>`);
}

async function connect_websocket() {
    return new Promise((resolve, reject) => {
        let config =
        iot.AwsIotMqttConnectionConfigBuilder.new_default_builder()
            .with_clean_session(true)
            .with_client_id(`custom_authorizer_connect_sample(${new Date()})`)
            .with_endpoint(Settings.AWS_IOT_ENDPOINT)
            .with_custom_authorizer(
                Settings.AWS_CUSTOM_AUTH_USERNAME == "Optional: <your username>" ? "" : Settings.AWS_CUSTOM_AUTH_USERNAME,
                Settings.AWS_CUSTOM_AUTH_AUTHORIZER_NAME == "Optional: <your authorizer name>" ? "" : Settings.AWS_CUSTOM_AUTH_AUTHORIZER_NAME,
                Settings.AWS_CUSTOM_AUTH_AUTHORIZER_PASSWORD == "Optional: <your authorizer password>" ? "" : Settings.AWS_CUSTOM_AUTH_AUTHORIZER_PASSWORD,
                Settings.AWS_CUSTOM_AUTH_PASSWORD == "Optional: <your password>" ? "" : Settings.AWS_CUSTOM_AUTH_PASSWORD,
            )
            .with_keep_alive_seconds(30)
            .build();

        log("Connecting custom authorizer...");
        const client = new mqtt.MqttClient();

        const connection = client.new_connection(config);
        connection.on("connect", (session_present) => {
            resolve(connection);
        });
        connection.on("interrupt", (error) => {
            log(`Connection interrupted: error=${error}`);
        });
        connection.on("resume", (return_code, session_present) => {
            log(`Resumed: rc: ${return_code} existing session: ${session_present}`);
        });
        connection.on("disconnect", () => {
            log("Disconnected");
        });
        connection.on("error", (error) => {
            reject(error);
        });
        connection.connect();
    });
}

async function main()
{
    connect_websocket()
    .then((connection) => {
        connection.subscribe(
            "test/topic", mqtt.QoS.AtLeastOnce,
            (topic, payload, dup, qos, retain) => {
                const decoder = new TextDecoder("utf8");
                let message = decoder.decode(new Uint8Array(payload));
                log(`Message received: topic=\"${topic}\" message=\"${message}\"`);
                connection.disconnect();
        })
        .then((subscription) => {
            return connection.publish(subscription.topic, "Hello World!", subscription.qos);
        });
    })
    .catch((reason) => {
        log(`Error while connecting: ${reason}`);
    });
}

main();
