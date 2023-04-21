/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */

import {mqtt5, iot} from "aws-iot-device-sdk-v2";
import {ICrtError} from "aws-crt";
import {once} from "events";
import { toUtf8 } from '@aws-sdk/util-utf8-browser';

// The relative path is '../../util/cli_args' from here, but the compiled javascript file gets put one level
// deeper inside the 'dist' folder
const common_args = require('../../../util/cli_args');

type Args = { [index: string]: any };
const yargs = require('yargs');

// For the purposes of this sample, we need to associate certain variables with a particular MQTT5 client
// and to do so we use this class to hold all the data for a particular client used in the sample.
class SampleMqtt5Client {
    client? : mqtt5.Mqtt5Client;
    name? : string;

    // Sets up the MQTT5 sample client using direct MQTT5 via mTLS with the passed input data.
    public setupMqtt5Client(
        input_endpoint : string, input_cert : string, input_key : string, input_ca : string,
        input_clientId : string, input_clientName : string, input_isCi : boolean)
    {
        this.name = input_clientName;

        let builder : iot.AwsIotMqtt5ClientConfigBuilder = iot.AwsIotMqtt5ClientConfigBuilder.newDirectMqttBuilderWithMtlsFromPath(
            input_endpoint,
            input_cert,
            input_key
        );
        builder.withConnectProperties({
            keepAliveIntervalSeconds: 1200,
            clientId: input_clientId
        });
        if (input_ca != null && input_ca != undefined) {
            builder.withCertificateAuthorityFromPath(undefined, input_ca);
        }
        this.client = new mqtt5.Mqtt5Client(builder.build());

        // Invoked when the client has an error
        this.client.on('error', (error: ICrtError) => {
            console.log("[" + this.name + "] Error: " + error.toString());
        });

        // Invoked when the client gets a message/publish on a subscribed topic
        this.client.on("messageReceived",(eventData: mqtt5.MessageReceivedEvent) : void => {
            console.log("[" + this.name + "]: Received a publish");
            if (eventData.message.topicName) {
                console.log("\tPublish received on topic: " + eventData.message.topicName);
            }
            if (eventData.message.payload) {
                console.log("\tMessage: " + toUtf8(new Uint8Array(eventData.message.payload as ArrayBuffer)));
            }
        });

        // Invoked when the client connects successfully to the endpoint
        this.client.on('connectionSuccess', (eventData: mqtt5.ConnectionSuccessEvent) => {
            console.log("[" + this.name + "]: Connection success");
        });

        // Invoked when the client fails to connect to the endpoint
        this.client.on('connectionFailure', (eventData: mqtt5.ConnectionFailureEvent) => {
            console.log("[" + this.name + "]: Connection failed with error: " + eventData.error.toString());
        });

        // Invoked when the client becomes disconnected
        this.client.on('disconnection', (eventData: mqtt5.DisconnectionEvent) => {
            console.log("[" + this.name + "]: Disconnected");

            if (eventData.disconnect) {
                if (eventData.disconnect.reasonCode == mqtt5.DisconnectReasonCode.SharedSubscriptionsNotSupported) {
                    console.log("[" + this.name + "]: Shared Subscriptions not supported. Stopping sample...");
                    process.exit(-1);
                }
            }
        });

        // Invoked when the client stops
        this.client.on('stopped', (eventData: mqtt5.StoppedEvent) => {
            console.log("[" + this.name + "]: Stopped");
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

async function runSample(args : any) {

    // Pull data from the command line
    let input_endpoint : string = args.endpoint;
    let input_cert : string = args.cert;
    let input_key : string = args.key;
    let input_ca : string = args.ca_file;
    let input_clientId : string = args.client_id;
    let input_count : number = args.count;
    let input_topic : string = args.topic;
    let input_message : string = args.message;
    let input_groupIdentifier : string = args.group_identifier;
    let input_isCi : boolean = args.is_ci != undefined && args.is_ci != null && args.is_ci == true;

    // Ensure data was pulled from the command line or is set to default values
    if (input_count == null || input_count == undefined) {
        input_count = 10;
    }
    if (input_clientId == null || input_clientId == undefined) {
        input_clientId = "test-" + Math.floor(Math.random() * 100000000)
    }
    if (input_topic == null || input_topic == undefined) {
        input_topic = "test/topic";
    }
    if (input_message == null || input_message == undefined) {
        input_message = "Hello World!";
    }
    if (input_groupIdentifier == null || input_groupIdentifier == undefined) {
        input_groupIdentifier = "javascript-sample";
    }

    // If this is CI, append a UUID to the topic
    if (input_isCi == true) {
        input_topic += "/" + Math.floor(Math.random() * 100000000);
    }

    // Construct the shared topic
    let input_shared_topic : string = "$share/" + input_groupIdentifier + "/" + input_topic;

    // Create the MQTT5 clients: one publisher and two subscribers
    let publisher : SampleMqtt5Client = new SampleMqtt5Client()
    publisher.setupMqtt5Client(
        input_endpoint, input_cert, input_key, input_ca, input_clientId + "1", "Publisher", input_isCi);
    let subscriber_one : SampleMqtt5Client = new SampleMqtt5Client()
    subscriber_one.setupMqtt5Client(
        input_endpoint, input_cert, input_key, input_ca, input_clientId + "2", "Subscriber One", input_isCi);
    let subscriber_two : SampleMqtt5Client = new SampleMqtt5Client()
    subscriber_two.setupMqtt5Client(
        input_endpoint, input_cert, input_key, input_ca, input_clientId + "3", "Subscriber Two", input_isCi);

    try
    {
        // Connect all the clients
        await publisher.startClient();
        await subscriber_one.startClient();
        await subscriber_two.startClient();

        // Subscribe to the shared topic on the two subscribers
        await subscriber_one.client?.subscribe({subscriptions: [{qos: mqtt5.QoS.AtLeastOnce, topicFilter: input_shared_topic }]});
        console.log("[" + subscriber_one.name + "]: Subscribed to topic '" + input_topic + "' in shared subscription group '" + input_groupIdentifier + "'.");
        console.log("[" + subscriber_one.name + "]: Full subscribed topic is '" + input_shared_topic + "'.");
        await subscriber_two.client?.subscribe({subscriptions: [{qos: mqtt5.QoS.AtLeastOnce, topicFilter: input_shared_topic }]});
        console.log("[" + subscriber_two.name + "]: Subscribed to topic '" + input_topic + "' in shared subscription group '" + input_groupIdentifier + "'.");
        console.log("[" + subscriber_two.name + "]: Full subscribed topic is '" + input_shared_topic + "'.");

        // Publish using the publisher client
        let publishPacket : mqtt5.PublishPacket = {
            qos: mqtt5.QoS.AtLeastOnce,
            topicName: input_topic,
            payload: input_message
        };
        if (input_count > 0) {
            let count = 0;
            while (count++ < input_count) {
                publishPacket.payload = JSON.stringify(input_message + ": " + count);
                await publisher.client?.publish(publishPacket);
                console.log("[" + publisher.name + "]: Published");
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            // Wait 5 seconds to let the last publish go out before unsubscribing
            await new Promise(resolve => setTimeout(resolve, 5000));
        } else {
            console.log("Skipping publishing messages due to message count being zero...");
        }

        // Unsubscribe from the shared topic on the two subscribers
        await subscriber_one.client?.unsubscribe({topicFilters: [ input_shared_topic ]});
        console.log("[" + subscriber_one.name + "]: Unsubscribed to topic '" + input_topic + "' in shared subscription group '" + input_groupIdentifier + "'.");
        console.log("[" + subscriber_one.name + "]: Full unsubscribed topic is '" + input_shared_topic + "'.");
        await subscriber_two.client?.unsubscribe({topicFilters: [ input_shared_topic ]});
        console.log("[" + subscriber_two.name + "]: Unsubscribed to topic '" + input_topic + "' in shared subscription group '" + input_groupIdentifier + "'.");
        console.log("[" + subscriber_two.name + "]: Full unsubscribed topic is '" + input_shared_topic + "'.");

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
    }
    console.log("Complete!");
}

/* Register command line arguments */
yargs.command('*', false, (yargs: any) => {
    common_args.add_universal_arguments(yargs);
    common_args.add_common_mqtt_arguments(yargs);
    common_args.add_direct_tls_connect_arguments(yargs);
    yargs.option('count', {
        description: '<number>: The number of messages to publish (optional, default=10)',
        type: 'int',
        required: false,
        default: 10
    })
    .option('group_identifier', {
        description: '<string>: The group identifier to use in the shared subscription (optional, default=javascript-sample)',
        type: 'string',
        required: false,
        default: 'javascript-sample'
    })
}, main).parse();

async function main(args : Args){
    // make it wait as long as possible once the promise completes we'll turn it off.
    const timer = setTimeout(() => {}, 2147483647);
    await runSample(args);
    clearTimeout(timer);
    process.exit(0);
}

