/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */
import {mqtt5, auth, iot} from "aws-iot-device-sdk-v2";
import {once} from "events";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { CognitoIdentityCredentials } from "@aws-sdk/credential-provider-cognito-identity/dist-types/fromCognitoIdentity"
import {toUtf8} from "@aws-sdk/util-utf8-browser";

// @ts-ignore
import {AWS_REGION, AWS_COGNITO_IDENTITY_POOL_ID, AWS_IOT_ENDPOINT} from './settings';
import jquery = require("jquery");
const $: JQueryStatic = jquery;


function log(msg: string) {
    let now = new Date();
    $('#console').append(`<pre>${now.toString()}: ${msg}</pre>`);
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
class AWSCognitoCredentialsProvider extends auth.CredentialsProvider{
    private options: AWSCognitoCredentialOptions;
    private cachedCredentials? : CognitoIdentityCredentials;

    constructor(options: AWSCognitoCredentialOptions, expire_interval_in_ms? : number)
    {
        super();
        this.options = options;

        setInterval(async ()=>{
            await this.refreshCredentials();
        },expire_interval_in_ms?? 3600*1000);
    }

    getCredentials() : auth.AWSCredentials {
        return {
            aws_access_id: this.cachedCredentials?.accessKeyId ?? "",
            aws_secret_key: this.cachedCredentials?.secretAccessKey ?? "",
            aws_sts_token: this.cachedCredentials?.sessionToken,
            aws_region: this.options.Region
        }
    }

    async refreshCredentials()  {
        log('Fetching Cognito credentials');
        this.cachedCredentials = await fromCognitoIdentityPool({
            // Required. The unique identifier for the identity pool from which an identity should be
            // retrieved or generated.
            identityPoolId: this.options.IdentityPoolId,
            clientConfig: { region: this.options.Region },
        })();
    }
}

function createClient(provider: AWSCognitoCredentialsProvider) : mqtt5.Mqtt5Client {

    let wsConfig : iot.WebsocketSigv4Config = {
        credentialsProvider: provider,
        region: AWS_REGION
    }

    let builder: iot.AwsIotMqtt5ClientConfigBuilder = iot.AwsIotMqtt5ClientConfigBuilder.newWebsocketMqttBuilderWithSigv4Auth(
        AWS_IOT_ENDPOINT,
        wsConfig
    )

    let client : mqtt5.Mqtt5Client = new mqtt5.Mqtt5Client(builder.build());

    client.on('error', (error) => {
        log("Error event: " + error.toString());
    });

    client.on("messageReceived",(eventData: mqtt5.MessageReceivedEvent) : void => {
        log("Message Received event: " + JSON.stringify(eventData.message));
        if (eventData.message.payload) {
            log("  with payload: " + toUtf8(eventData.message.payload as Buffer));
        }
    } );

    client.on('attemptingConnect', (eventData: mqtt5.AttemptingConnectEvent) => {
        log("Attempting Connect event");
    });

    client.on('connectionSuccess', (eventData: mqtt5.ConnectionSuccessEvent) => {
        log("Connection Success event");
        log ("Connack: " + JSON.stringify(eventData.connack));
        log ("Settings: " + JSON.stringify(eventData.settings));
    });

    client.on('connectionFailure', (eventData: mqtt5.ConnectionFailureEvent) => {
        log("Connection failure event: " + eventData.error.toString());
    });

    client.on('disconnection', (eventData: mqtt5.DisconnectionEvent) => {
        log("Disconnection event: " + eventData.error.toString());
        if (eventData.disconnect !== undefined) {
            log('Disconnect packet: ' + JSON.stringify(eventData.disconnect));
        }
    });

    client.on('stopped', (eventData: mqtt5.StoppedEvent) => {
        log("Stopped event");
    });

    return client;
}


export default class Mqtt5
{

    client : mqtt5.Mqtt5Client;
    user_msg_count : number;
    qos0Topic = "/test/qos0";
    qos1Topic = "/test/qos1";

    constructor()
    {
        this.user_msg_count = 0;
    }

    async testSuccessfulConnection() {

        /** Set up the credentialsProvider */
        const provider = new AWSCognitoCredentialsProvider({
            IdentityPoolId: AWS_COGNITO_IDENTITY_POOL_ID,
            Region: AWS_REGION});
        /** Make sure the credential provider fetched before setup the connection */
        await provider.refreshCredentials();

        this.client = createClient(provider);

        const attemptingConnect = once(this.client, "attemptingConnect");
        const connectionSuccess = once(this.client, "connectionSuccess");

        this.client.start();

        await attemptingConnect;
        await connectionSuccess;

        const suback = await this.client.subscribe({
            subscriptions: [
                { qos: mqtt5.QoS.AtLeastOnce, topicFilter: this.qos1Topic },
                { qos: mqtt5.QoS.AtMostOnce, topicFilter: this.qos0Topic }
            ]
        });
        log('Suback result: ' + JSON.stringify(suback));

        const qos0PublishResult = await this.client.publish({
            qos: mqtt5.QoS.AtMostOnce,
            topicName: this.qos0Topic,
            payload: "This is a qos 0 payload"
        });
        log('QoS 0 Publish result: ' + JSON.stringify(qos0PublishResult));

        const qos1PublishResult = await this.client.publish({
            qos: mqtt5.QoS.AtLeastOnce,
            topicName: this.qos1Topic,
            payload: "This is a qos 1 payload"
        });
        log('QoS 1 Publish result: ' + JSON.stringify(qos1PublishResult));

        let unsuback = await this.client.unsubscribe({
            topicFilters: [
                this.qos0Topic
            ]
        });
        log('Unsuback result: ' + JSON.stringify(unsuback));

    }

    async PublishMessage()
    {
        const msg = `BUTTON CLICKED {${this.user_msg_count}}`;
        const publishResult = await this.client.publish({
            qos: mqtt5.QoS.AtLeastOnce,
            topicName: this.qos1Topic,
            payload: msg
        })
        .then (() =>
        {
            log('Button Clicked, Publish result: ' + JSON.stringify(publishResult));
        })
        .catch((error) => {
            log(`Error publishing: ${error}`);
        });
        this.user_msg_count++;

    }

    async CloseConnection()
    {
        const disconnection = once(this.client, "disconnection");
        const stopped = once(this.client, "stopped");

        this.client.stop();

        await disconnection;
        await stopped;
    }
}
