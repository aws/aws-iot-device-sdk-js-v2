/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */

// const iotsdk = require("aws-iot-device-sdk-v2");
// const iot = iotsdk.browser.iot;
// const mqtt = iotsdk.browser.mqtt;
// const AWS = require("aws-sdk");
import { mqtt, iot } from "aws-iot-device-sdk-v2";
import * as AWS from "aws-sdk";
const Settings = require("./Settings");
const $ = require("jquery");

function log(msg: string) {
  $("#console").append(`<pre>${msg}</pre>`);
}

async function fetch_credentials() {
  return new Promise<AWS.CognitoIdentityCredentials>(async (resolve, reject) => {
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
        log(`Identity Expires: ${credentials.expireTime}`);
                      
        resolve(credentials);
      });
    }
  });
}

async function connect_websocket(credentials :  AWS.CognitoIdentityCredentials) {
  return new Promise<mqtt.MqttClientConnection>((resolve, reject) => {
    let config =
      iot.AwsIotMqttConnectionConfigBuilder.new_builder_for_websocket()
        .with_clean_session(true)
        .with_client_id(`pub_sub_sample(${new Date()})`)
        .with_endpoint(Settings.AWS_IOT_ENDPOINT)
        .with_credentials(
          Settings.AWS_REGION,
          credentials.accessKeyId,
          credentials.secretAccessKey,
          credentials.sessionToken,
          credentials, 
          function(provider: mqtt.AWSCredentials){
            return new Promise<mqtt.AWSCredentials>(function(resolve, reject)
            {
                provider.aws_provider.refresh((err : any) => {
                    if (err) {
                        reject(`Error fetching cognito credentials: ${err}`);
                    }
                    else
                    {
                        log('Cognito credentials refreshed.');
                        provider.aws_region = Settings.AWS_REGION;
                        provider.aws_access_id =  provider.aws_provider.accessKeyId;
                        provider.aws_secret_key =  provider.aws_provider.secretAccessKey;
                        provider.aws_sts_token = provider.aws_provider.sessionToken;
                        log(`Identity Expires: ${provider.aws_provider.expireTime}`);
                        resolve(provider);
                    }
                });
            });
        })
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
            //connection.disconnect();
          }
        )
        .then((subscription) => {
          setInterval( ()=>{
            connection.publish(subscription.topic, 'NOTICE ME', subscription.qos);
        }, 6000);
        });
    })
    .catch((reason) => {
      log(`Error while connecting: ${reason}`);
    });
}

main();
