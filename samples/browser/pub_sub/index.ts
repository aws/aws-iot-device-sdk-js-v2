/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */

import { mqtt, iot, auth } from "aws-iot-device-sdk-v2";
import * as AWS from "aws-sdk";
const Settings = require("./settings");
const $ = require("jquery");

function log(msg: string) {
  $("#console").append(`<pre>${msg}</pre>`);
}


/**
* AWSCognitoCredentialOptions. The credentials options used to create AWSCongnitoCredentialProvider.
*/
interface AWSCognitoCredentialOptions
{
  IdentityPoolId : string,
  Region: string
}

/**
* AWSCognitoCredentialsProvider. The AWSCognitoCredentialsProvider implements AWS.CognitoIdentityCredentials.
*
*/
export class AWSCognitoCredentialsProvider extends auth.CredentialsProvider{
  private options: AWSCognitoCredentialOptions;
  private source_provider : AWS.CognitoIdentityCredentials;
  private aws_credentials : auth.AWSCredentials;
  constructor(options: AWSCognitoCredentialOptions, expire_interval_in_ms? : number)
  {
    super();
    this.options = options;
    AWS.config.region = options.Region;
    this.source_provider = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: options.IdentityPoolId
    });
    this.aws_credentials = 
    {
        aws_region: options.Region,
        aws_access_id : this.source_provider.accessKeyId,
        aws_secret_key: this.source_provider.secretAccessKey,
        aws_sts_token: this.source_provider.sessionToken
    }

    setInterval(async ()=>{
        await this.refreshCredentialAsync();
    },expire_interval_in_ms?? 3600*1000);
  }

  getCredentials(){
      return this.aws_credentials;
  }

  async refreshCredentialAsync()
  {
    return new Promise<AWSCognitoCredentialsProvider>((resolve, reject) => {
        this.source_provider.get((err)=>{
            if(err)
            {
                reject("Failed to get cognito credentials.")
            }
            else
            {
                this.aws_credentials.aws_access_id = this.source_provider.accessKeyId;
                this.aws_credentials.aws_secret_key = this.source_provider.secretAccessKey;
                this.aws_credentials.aws_sts_token = this.source_provider.sessionToken;
                this.aws_credentials.aws_region = this.options.Region;
                resolve(this);
            }
        });
    });
  }
}

async function connect_websocket(provider: auth.CredentialsProvider) {
  return new Promise<mqtt.MqttClientConnection>((resolve, reject) => {
    let config = iot.AwsIotMqttConnectionConfigBuilder.new_builder_for_websocket()
        .with_clean_session(true)
        .with_client_id(`pub_sub_sample(${new Date()})`)
        .with_endpoint(Settings.AWS_IOT_ENDPOINT)
        .with_credential_provider(provider)
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
  /** Set up the credentialsProvider */
  const provider = new AWSCognitoCredentialsProvider({
          IdentityPoolId: Settings.AWS_COGNITO_IDENTITY_POOL_ID, 
          Region: Settings.AWS_REGION});
  /** Make sure the credential provider fetched before setup the connection */
  await provider.refreshCredentialAsync();


  connect_websocket(provider)
  .then((connection) => {
      connection
        .subscribe(
          "/test/me/senpai",
          mqtt.QoS.AtLeastOnce,
          (topic, payload, dup, qos, retain) => {
            const decoder = new TextDecoder("utf8");
            let message = decoder.decode(new Uint8Array(payload));
            log(`Message received: topic=${topic} message=${message}`);
            /** The sample is used to demo long-running web service. 
             * Uncomment the following line to see how disconnect behaves.*/
            // connection.disconnect();
          }
        )
        .then((subscription) => {
          log(`start publish`)
          var msg_count = 0;
          connection.publish(subscription.topic, `NOTICE ME {${msg_count}}`, subscription.qos);
          /** The sample is used to demo long-running web service. The sample will keep publishing the message every minute.*/
          setInterval( ()=>{
            msg_count++;
            const msg = `NOTICE ME {${msg_count}}`;
            connection.publish(subscription.topic, msg, subscription.qos);
          }, 60000);
        });
    })
    .catch((reason) => {
      log(`Error while connecting: ${reason}`);
    });
}

main();
