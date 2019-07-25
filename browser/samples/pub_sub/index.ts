/* Copyright 2010-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
*
* Licensed under the Apache License, Version 2.0 (the "License").
* You may not use this file except in compliance with the License.
* A copy of the License is located at
*
*  http://aws.amazon.com/apache2.0
*
* or in the "license" file accompanying this file. This file is distributed
* on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
* express or implied. See the License for the specific language governing
* permissions and limitations under the License.
*/

import { mqtt } from "aws-iot-device-sdk-js-v2";
import * as AWS from "aws-sdk";
import Config = require('./config');
import jquery = require("jquery");
const $: JQueryStatic = jquery;

function log(msg: string) {
    $('#console').append(`<pre>${msg}</pre>`);
}

async function fetch_credentials() {
    return new Promise<AWS.CognitoIdentityCredentials>((resolve, reject) => {
        AWS.config.region = Config.AWS_REGION;
        const credentials = AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: Config.AWS_COGNITO_POOL_ID
        });
        log('Fetching Cognito credentials');
        credentials.refresh((err: any) => {
            if (err) {
                log(`Error fetching cognito credentials: ${err}`);
                reject(`Error fetching cognito credentials: ${err}`);
            }
            log('Cognito credentials refreshed');
            resolve(credentials);
        });
    });
}

async function connect_websocket(credentials: AWS.CognitoIdentityCredentials) {
    return new Promise<mqtt.Connection>((resolve, reject) => {
        let config = mqtt.AwsIotMqttConnectionConfigBuilder.new_builder_for_websocket()
            .with_clean_session(true)
            .with_client_id(`pub_sub_sample(${new Date()})`)
            .with_endpoint(Config.AWS_IOT_ENDPOINT)
            .with_credentials(Config.AWS_REGION, credentials.accessKeyId, credentials.secretAccessKey, credentials.sessionToken)
            .with_use_websockets()
            .build();

        log('Connecting websocket...');
        const client = new mqtt.Client();

        function on_connection_resumed(return_code: number, session_present: boolean) {
            log(`Connected: existing session: ${session_present}`);
        }

        function on_connection_interrupted(error_code: number) {
            if (error_code) {
                log(`Connection interrupted: error=${error_code}`);
            } else {
                log('Disconnected');
            }
        }

        const connection = client.new_connection(config, on_connection_interrupted, on_connection_resumed);
        connection.connect().then((session_present) => {
            resolve(connection);
        }).catch((reason) => {
            reject(reason);
        });
    });
    
}

async function main() {
    fetch_credentials()
    .then(connect_websocket)
    .then((connection) => {
        connection.subscribe('/test/me/senpai', mqtt.QoS.AtLeastOnce, (topic, payload) => {
            const decoder = new TextDecoder('utf8');
            let message = decoder.decode(payload);
            log(`Message recieved: topic=${topic} message=${message}`);
            connection.disconnect();
        })
        .then((subscription) => {
            return connection.publish(subscription.topic, 'NOTICE ME', subscription.qos);
        }); 
    })
    .catch((reason) => {
        log(`Error while connecting: ${reason}`);
    });
}

$(document).ready(() => {
    main();
});

