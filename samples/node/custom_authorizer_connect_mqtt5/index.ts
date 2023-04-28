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
    .option('custom_auth_username', {
        description: '<str>: The username for the custom authorizer.',
        type: 'string',
        required: false
    })
    .option('custom_auth_authorizer_name', {
        description: '<str>: The name of the custom authorizer in AWS IoT Core.',
        type: 'string',
        required: false
    })
    .option('custom_auth_authorizer_signature', {
        description: '<str>: The signature of the custom authorizer in AWS IoT Core.',
        type: 'string',
        required: false
    })
    .option('custom_auth_password', {
        description: '<str>: The password of the custom authorizer.',
        type: 'string',
        required: false
    })
    .option('custom_auth_token_key_name', {
        description: '<str>: The token key name for the custom authorizer.',
        type: 'string',
        required: false
    })
    .option('custom_auth_token_value', {
        description: '<str>: The token value for the custom authorizer.',
        type: 'string',
        required: false
    })
}, main).parse();

function creatClientConfig(args : any) : mqtt5.Mqtt5ClientConfig {
    let builder : iot.AwsIotMqtt5ClientConfigBuilder | undefined = undefined;

    builder = iot.AwsIotMqtt5ClientConfigBuilder.newWebsocketMqttBuilderWithCustomAuth(
        args.endpoint,
        {
            authorizerName : args.custom_auth_authorizer_name,
            username: args.custom_auth_username,
            password: args.custom_auth_password,
            tokenSignature: args.custom_auth_authorizer_signature,
            tokenKeyName : args.custom_auth_token_key_name,
            tokenValue : args.custom_auth_token_value
        }
    )
    builder.withConnectProperties({
        keepAliveIntervalSeconds: 1200
    });
    return builder.build();
}

function createClient(args: any) : mqtt5.Mqtt5Client {

    let config : mqtt5.Mqtt5ClientConfig = creatClientConfig(args);

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

