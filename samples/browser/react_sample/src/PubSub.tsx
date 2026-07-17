/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */
import { useEffect} from 'react';
import { mqtt, iot, CrtError, auth } from "aws-iot-device-sdk-v2";
import AWS from "aws-sdk"
import {AWS_REGION, AWS_COGNITO_IDENTITY_POOL_ID, AWS_IOT_ENDPOINT} from './settings';
import jquery from "jquery";
const $: JQueryStatic = jquery;
function log(msg: string) {
    $('#message').append(`<pre>${msg}</pre>`);
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
            .with_endpoint(AWS_IOT_ENDPOINT)
            .with_credential_provider(provider)
            .with_use_websockets()
            .with_keep_alive_seconds(30)
            .build();

        log('Connecting websocket...');
        const client = new mqtt.MqttClient();
        log('new connection ...');
        const connection = client.new_connection(config);
        log('setup callbacks ...');
        connection.on('connect', (session_present) => {
            resolve(connection);
            log("connection started:")
        });
        connection.on('interrupt', (error: CrtError) => {
            log(`Connection interrupted: error=${error}`);
        });
        connection.on('resume', (return_code: number, session_present: boolean) => {
            log(`Resumed: rc: ${return_code} existing session: ${session_present}`)
        });
        connection.on('disconnect', () => {
            log('Disconnected');
        });
        connection.on('error', (error) => {
            reject(error);
        });
        log('connect...');
        connection.connect();
    });

}




function Mqtt311() {

    var connectionPromise : Promise<mqtt.MqttClientConnection>;
    var sample_msg_count = 0;
    var user_msg_count = 0;
    var test_topic = "/test/topic"

    async function PubSub() {
        /** Set up the credentialsProvider */
        const provider = new AWSCognitoCredentialsProvider({
                IdentityPoolId: AWS_COGNITO_IDENTITY_POOL_ID,
                Region: AWS_REGION});
        /** Make sure the credential provider fetched before setup the connection */
        await provider.refreshCredentialAsync();

        connectionPromise = connect_websocket(provider);

        connectionPromise.then((connection) => {
            log(`start subscribe`)
            connection.subscribe(test_topic, mqtt.QoS.AtLeastOnce, (topic, payload) => {
                const decoder = new TextDecoder('utf8');
                let message = decoder.decode(new Uint8Array(payload));
                log(`Message received: topic=\"${topic}\" message=\"${message}\"`);
            })
            .then((subscription) => {
                log(`start publish`)
                connection.publish(test_topic, `THE SAMPLE PUBLISHES A MESSAGE EVERY MINUTE {${sample_msg_count}}`, subscription.qos);
                /** The sample is used to demo long-running web service. The sample will keep publishing the message every minute.*/
                setInterval( ()=>{
                    sample_msg_count++;
                    const msg = `THE SAMPLE PUBLISHES A MESSAGE EVERY MINUTE {${sample_msg_count}}`;
                    connection.publish(test_topic, msg, subscription.qos);
                }, 60000);
            });
        })
        .catch((reason) => {
            log(`Error while connecting: ${reason}`);
        });
    }

    useEffect(() => {
      PubSub();//initial execution
    },[]);

    async function PublishMessage()
    {
        const msg = `BUTTON CLICKED {${user_msg_count}}`;
        connectionPromise.then((connection) => {
            connection.publish(test_topic, msg, mqtt.QoS.AtLeastOnce).catch((reason) => {
                log(`Error publishing: ${reason}`);
            });
        })
        user_msg_count++;
    }

    async function CloseConnection()
    {
      await connectionPromise.then((connection) => {
        connection.disconnect()
        .catch((reason) => {
            log(`Error publishing: ${reason}`);
        });
      });
    }

    return (
        <>
        <div>
            <button onClick={() => PublishMessage()}>Publish A Message</button>
        </div>
        <div>
            <button onClick={() => CloseConnection()}>Disconnect</button>
        </div>
        <div id="message">Mqtt311 Pub Sub Sample</div>
        </>
    );
}

export default Mqtt311;
