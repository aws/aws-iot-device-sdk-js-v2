/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */

const iotsdk = require("aws-iot-device-sdk-v2");
const iot = iotsdk.iot;
const mqtt = iotsdk.mqtt;
const AWS = require("aws-sdk");
const Settings = require("./Settings");
const $ = require("jquery");

function log(msg) {
  $("#console").append(`<pre>${msg}</pre>`);
}

async function fetch_credentials() {
  return new Promise(async (resolve, reject) => {
    AWS.config.region = Settings.AWS_REGION;
    if (
      Settings.AWS_COGNITO_IDENTITY_POOL_ID !=
      "Optional: <your identity pool id>"
    ) {
      const credentials = (AWS.config.credentials =
        new AWS.CognitoIdentityCredentials({
          IdentityPoolId: Settings.AWS_COGNITO_IDENTITY_POOL_ID,
        }));
      log("Fetching Cognito credentials");
      credentials.refresh((err) => {
        if (err) {
          log(`Error fetching cognito credentials: ${err}`);
          reject(`Error fetching cognito credentials: ${err}`);
        }
        log("Cognito credentials refreshed");
        resolve(credentials);
      });
    } else {
      const credentials = (AWS.config.credentials = new AWS.Credentials({
        accessKeyId: Settings.AWS_STATIC_ACCESS_KEY,
        secretAccessKey: Settings.AWS_STATIC_SECRET_ACCESS_KEY,
        sessionToken:
          Settings.AWS_STATIC_ACCESS_TOKEN ==
          "Optional: <your static access token>"
            ? undefined
            : Settings.AWS_STATIC_ACCESS_TOKEN,
      }));
      resolve(credentials);
    }
  });
}

async function connect_websocket(credentials) {
  return new Promise((resolve, reject) => {
    let config =
      iot.AwsIotMqttConnectionConfigBuilder.new_builder_for_websocket()
        .with_clean_session(true)
        .with_client_id(`pub_sub_sample(${new Date()})`)
        .with_endpoint(Settings.AWS_IOT_ENDPOINT)
        .with_credentials(
          Settings.AWS_REGION,
          credentials.accessKeyId,
          credentials.secretAccessKey,
          credentials.sessionToken
        )
        .with_use_websockets()
        .with_keep_alive_seconds(30)
        .build();

    log("Connecting websocket...");
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

async function main() {
  fetch_credentials()
    .then(connect_websocket)
    .then((connection) => {
      connection
        .subscribe(
          "/test/me/senpai",
          mqtt.QoS.AtLeastOnce,
          (topic, payload, dup, qos, retain) => {
            const decoder = new TextDecoder("utf8");
            let message = decoder.decode(new Uint8Array(payload));
            log(`Message received: topic=${topic} message=${message}`);
            connection.disconnect();
          }
        )
        .then((subscription) => {
          return connection.publish(
            subscription.topic,
            "NOTICE ME",
            subscription.qos
          );
        });
    })
    .catch((reason) => {
      log(`Error while connecting: ${reason}`);
    });
}

main();
