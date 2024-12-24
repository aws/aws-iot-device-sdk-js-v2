/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */

import {mqtt5, iot} from "aws-iot-device-sdk-v2";
import {ICrtError} from "aws-crt";
import {once} from "events";
import { toUtf8 } from '@aws-sdk/util-utf8-browser';

type Args = { [index: string]: any };

const yargs = require('yargs');

yargs.command('*', false, (yargs: any) => {
    yargs.option('endpoint', {
        alias: 'e',
        description: 'Your AWS IoT custom endpoint, not including a port.',
        type: 'string',
        required: true
    })
    .option('cert', {
        alias: 'c',
        description: '<path>: File path to a PEM encoded certificate to use with mTLS.',
        type: 'string',
        required: false
    })
    .option('key', {
        alias: 'k',
        description: '<path>: File path to a PEM encoded private key that matches cert.',
        type: 'string',
        required: false
    })
    .option('region', {
        alias: 'r',
        description: 'AWS region to establish a websocket connection to.  Only required if using websockets and a non-standard endpoint.',
        type: 'string',
        required: false
    })
}, main).parse();

function createClientConfig(args : any) : mqtt5.Mqtt5ClientConfig {
    let builder : iot.AwsIotMqtt5ClientConfigBuilder | undefined = undefined;

    if (args.key && args.cert) {
        builder = iot.AwsIotMqtt5ClientConfigBuilder.newDirectMqttBuilderWithMtlsFromPath(
            args.endpoint,
            args.cert,
            args.key
        );
    } else {
        let wsOptions : iot.WebsocketSigv4Config | undefined = undefined;
        if (args.region) {
            wsOptions = { region: args.region };
        }

        builder = iot.AwsIotMqtt5ClientConfigBuilder.newWebsocketMqttBuilderWithSigv4Auth(
            args.endpoint,
            // the region extraction logic does not work for gamma endpoint formats so pass in region manually
            wsOptions
        );
    }

    builder.withConnectProperties({
        keepAliveIntervalSeconds: 1200,
        clientId: 'sdk-nodejs-v2-pub-sub-mqtt5'
    });

    return builder.build();
}

function createClient(args: any) : mqtt5.Mqtt5Client {

    let config : mqtt5.Mqtt5ClientConfig = createClientConfig(args);

    console.log("Creating client for " + config.hostName);
    let client : mqtt5.Mqtt5Client = new mqtt5.Mqtt5Client(config);

    client.on('error', (error: ICrtError) => {
        console.log("Error event: " + error.toString());
    });

    client.on("messageReceived",(eventData: mqtt5.MessageReceivedEvent) : void => {
        console.log("Message Received event: " + JSON.stringify(eventData.message));
        if (eventData.message.payload) {
            console.log("  with payload: " + toUtf8(new Uint8Array(eventData.message.payload as ArrayBuffer)));
        }
    } );

    client.on('attemptingConnect', (eventData: mqtt5.AttemptingConnectEvent) => {
        console.log("Attempting Connect event");
    });

    client.on('connectionSuccess', (eventData: mqtt5.ConnectionSuccessEvent) => {
        console.log("Connection Success event");
        console.log ("Connack: " + JSON.stringify(eventData.connack));
        console.log ("Settings: " + JSON.stringify(eventData.settings));
    });

    client.on('connectionFailure', (eventData: mqtt5.ConnectionFailureEvent) => {
        console.log("Connection failure event: " + eventData.error.toString());
        if (eventData.connack) {
            console.log ("Connack: " + JSON.stringify(eventData.connack));
        }
    });

    client.on('disconnection', (eventData: mqtt5.DisconnectionEvent) => {
        console.log("Disconnection event: " + eventData.error.toString());
        if (eventData.disconnect !== undefined) {
            console.log('Disconnect packet: ' + JSON.stringify(eventData.disconnect));
        }
    });

    client.on('stopped', (eventData: mqtt5.StoppedEvent) => {
        console.log("Stopped event");
    });

    return client;
}

async function runSample(args : any) {

    let client : mqtt5.Mqtt5Client = createClient(args);

    const connectionSuccess = once(client, "connectionSuccess");

    client.start();

    await connectionSuccess;

    const suback = await client.subscribe({
        subscriptions: [
            { qos: mqtt5.QoS.AtLeastOnce, topicFilter: "hello/world/qos1" },
            { qos: mqtt5.QoS.AtMostOnce, topicFilter: "hello/world/qos0" }
        ]
    });
    console.log('Suback result: ' + JSON.stringify(suback));

    const qos0PublishResult = await client.publish({
        qos: mqtt5.QoS.AtMostOnce,
        topicName: "hello/world/qos0",
        payload: JSON.stringify("This is a qos 0 payload"),
        userProperties: [
            {name: "test", value: "userproperty"}
        ]
    });
    console.log('QoS 0 Publish result: ' + JSON.stringify(qos0PublishResult));

    const qos1PublishResult = await client.publish({
        qos: mqtt5.QoS.AtLeastOnce,
        topicName: "hello/world/qos1",
        payload: JSON.stringify("This is a qos 1 payload")
    });
    console.log('QoS 1 Publish result: ' + JSON.stringify(qos1PublishResult));

    let unsuback = await client.unsubscribe({
        topicFilters: [
            "hello/world/qos1"
        ]
    });
    console.log('Unsuback result: ' + JSON.stringify(unsuback));

    const stopped = once(client, "stopped");

    client.stop();

    await stopped;

    client.close();
}

async function main(args : Args){
    // make it wait as long as possible once the promise completes we'll turn it off.
    const timer = setTimeout(() => {}, 2147483647);

    await runSample(args);

    clearTimeout(timer);

    process.exit(0);
}

