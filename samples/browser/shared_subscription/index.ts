/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */

import {mqtt5, auth, iot} from "aws-iot-device-sdk-v2";
import jquery = require("jquery");
import {once} from "events";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { CognitoIdentityCredentials } from "@aws-sdk/credential-provider-cognito-identity/dist-types/fromCognitoIdentity"
// @ts-ignore
import Settings = require('./settings');
import {toUtf8} from "@aws-sdk/util-utf8-browser";

const $: JQueryStatic = jquery;

function log(msg: string) {
    let now = new Date();
    $('#console').append(`<pre>${now.toString()}: ${msg}</pre>`);
}

// AWSCognitoCredentialOptions. The credentials options used to create AWSCongnitoCredentialProvider.
interface AWSCognitoCredentialOptions
{
    IdentityPoolId : string,
    Region: string
}

// AWSCognitoCredentialsProvider. The AWSCognitoCredentialsProvider implements AWS.CognitoIdentityCredentials.
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

// For the purposes of this sample, we need to associate certain variables with a particular MQTT5 client
// and to do so we use this class to hold all the data for a particular client used in the sample.
class SampleMqtt5Client {
    client? : mqtt5.Mqtt5Client;
    name? : string;

    // Sets up the MQTT5 sample client using direct MQTT5 via mTLS with the passed input data.
    public setupMqtt5Client(
        provider: AWSCognitoCredentialsProvider,
        input_endpoint : string, input_region: string, input_clientId : string, input_clientName : string)
    {
        this.name = input_clientName;

        let wsConfig : iot.WebsocketSigv4Config = {
            credentialsProvider: provider,
            region: input_region
        }
        let builder: iot.AwsIotMqtt5ClientConfigBuilder = iot.AwsIotMqtt5ClientConfigBuilder.newWebsocketMqttBuilderWithSigv4Auth(
            input_endpoint,
            wsConfig
        )
        builder.withConnectProperties({
            clientId: input_clientId,
            keepAliveIntervalSeconds: 120
        })
        this.client = new mqtt5.Mqtt5Client(builder.build());

        // Invoked when the client has an error
        this.client.on('error', (error) => {
            log("[" + this.name + "] Error: " + error.toString());
        });

        // Invoked when the client gets a message/publish on a subscribed topic
        this.client.on("messageReceived",(eventData: mqtt5.MessageReceivedEvent) : void => {
            log("[" + this.name + "]: Received a publish");
            if (eventData.message.topicName) {
                log("\tPublish received on topic: " + eventData.message.topicName);
            }
            if (eventData.message.payload) {
                log("\tMessage: " + toUtf8(new Uint8Array(eventData.message.payload as ArrayBuffer)));
            }
        });

        // Invoked when the client connects successfully to the endpoint
        this.client.on('connectionSuccess', (eventData: mqtt5.ConnectionSuccessEvent) => {
            log("[" + this.name + "]: Connection success");
        });

        // Invoked when the client fails to connect to the endpoint
        this.client.on('connectionFailure', (eventData: mqtt5.ConnectionFailureEvent) => {
            log("[" + this.name + "]: Connection failed with error: " + eventData.error.toString());
        });

        // Invoked when the client becomes disconnected
        this.client.on('disconnection', (eventData: mqtt5.DisconnectionEvent) => {
            log("[" + this.name + "]: Disconnected");

            if (eventData.disconnect) {
                if (eventData.disconnect.reasonCode == mqtt5.DisconnectReasonCode.SharedSubscriptionsNotSupported) {
                    log(
                        "[" + this.name + "]: Shared Subscriptions not supported!" +
                        "\nThis sample will not work unless the endpoint being connected to has Shared Subscriptions support.");
                }
            }
        });

        // Invoked when the client stops
        this.client.on('stopped', (eventData: mqtt5.StoppedEvent) => {
            log("[" + this.name + "]: Stopped");
        });
    }

    // Helper function to make sample code a little cleaner
    public async startClient() {
        const connectionSuccess = once(this.client as mqtt5.Mqtt5Client, "connectionSuccess");
        this.client?.start();
        await connectionSuccess;
    }

    // Helper function to make sample code a little cleaner
    public async stopClient() {
        const stopped = once(this.client as mqtt5.Mqtt5Client, "stopped");
        this.client?.stop();
        await stopped;
    }
}

async function runSample() {

    // Pull data from the command line
    let input_endpoint : string = Settings.AWS_IOT_ENDPOINT;
    let input_region : string = Settings.AWS_REGION;
    let input_clientId : string = Settings.INPUT_CLIENT_ID;
    let input_topic : string = Settings.INPUT_TOPIC;
    let input_count : number = Settings.INPUT_COUNT;
    let input_message : string = Settings.INPUT_MESSAGE;
    let input_groupIdentifier : string = Settings.INPUT_GROUP_IDENTIFIER;
    let input_cognitoIdentityPoolId = Settings.AWS_COGNITO_IDENTITY_POOL_ID;
    // Construct the shared topic
    let input_shared_topic : string = "$share/" + input_groupIdentifier + "/" + input_topic;

    /** Set up the credentialsProvider */
    const provider = new AWSCognitoCredentialsProvider({
        IdentityPoolId: input_cognitoIdentityPoolId,
        Region: input_region});
    /** Make sure the credential provider fetched before setup the connection */
    await provider.refreshCredentials();

    // Create the MQTT5 clients: one publisher and two subscribers
    let publisher : SampleMqtt5Client = new SampleMqtt5Client()
    publisher.setupMqtt5Client(provider, input_endpoint, input_region, input_clientId + "1", "Publisher");
    let subscriber_one : SampleMqtt5Client = new SampleMqtt5Client()
    subscriber_one.setupMqtt5Client(provider, input_endpoint, input_region, input_clientId + "2", "Subscriber One");
    let subscriber_two : SampleMqtt5Client = new SampleMqtt5Client()
    subscriber_two.setupMqtt5Client(provider, input_endpoint, input_region, input_clientId + "3", "Subscriber Two");

    try
    {
        // Connect all the clients
        await publisher.startClient();
        await subscriber_one.startClient();
        await subscriber_two.startClient();

        // Subscribe to the shared topic on the two subscribers
        await subscriber_one.client?.subscribe({subscriptions: [{qos: mqtt5.QoS.AtLeastOnce, topicFilter: input_shared_topic }]});
        log("[" + subscriber_one.name + "]: Subscribed to topic '" + input_topic + "' in shared subscription group '" + input_groupIdentifier + "'.");
        log("[" + subscriber_one.name + "]: Full subscribed topic is '" + input_shared_topic + "'.");
        await subscriber_two.client?.subscribe({subscriptions: [{qos: mqtt5.QoS.AtLeastOnce, topicFilter: input_shared_topic }]});
        log("[" + subscriber_two.name + "]: Subscribed to topic '" + input_topic + "' in shared subscription group '" + input_groupIdentifier + "'.");
        log("[" + subscriber_two.name + "]: Full subscribed topic is '" + input_shared_topic + "'.");

        // Publish using the publisher client
        let publishPacket : mqtt5.PublishPacket = {
            qos: mqtt5.QoS.AtLeastOnce,
            topicName: input_topic,
            payload: input_message
        };
        if (input_count > 0) {
            let count = 0;
            while (count++ < input_count) {
                publishPacket.payload = input_message + ": " + count;
                await publisher.client?.publish(publishPacket);
                log("[" + publisher.name + "]: Published");
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            // Wait 5 seconds to let the last publish go out before unsubscribing.
            await new Promise(resolve => setTimeout(resolve, 5000));
        } else {
            log("Skipping publishing messages due to message count being zero...");
        }

        // Unsubscribe from the shared topic on the two subscribers
        await subscriber_one.client?.unsubscribe({topicFilters: [ input_shared_topic ]});
        log("[" + subscriber_one.name + "]: Unsubscribed to topic '" + input_topic + "' in shared subscription group '" + input_groupIdentifier + "'.");
        log("[" + subscriber_one.name + "]: Full unsubscribed topic is '" + input_shared_topic + "'.");
        await subscriber_two.client?.unsubscribe({topicFilters: [ input_shared_topic ]});
        log("[" + subscriber_two.name + "]: Unsubscribed to topic '" + input_topic + "' in shared subscription group '" + input_groupIdentifier + "'.");
        log("[" + subscriber_two.name + "]: Full unsubscribed topic is '" + input_shared_topic + "'.");

        // Disconnect all the clients
        await publisher.stopClient();
        await subscriber_one.stopClient();
        await subscriber_two.stopClient();
    }
    finally {
        // Close all the clients
        publisher.client?.close();
        subscriber_one.client?.close();
        subscriber_two.client?.close();
        log("Sample Complete!");
    }
}

async function main(){
    await runSample();
    log('Leaving');
}

$(document).ready(() => {
    main();
});
