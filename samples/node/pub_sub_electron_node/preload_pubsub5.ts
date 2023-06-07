
/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */
import {mqtt5, iot} from "aws-iot-device-sdk-v2";
import {ICrtError} from "aws-crt";
import {once} from "events";
import { toUtf8 } from '@aws-sdk/util-utf8-browser';
import * as args from "./settings"
import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld(
    'electron',
    {
      Mqtt5Connect: () => PubSub5(),
      Mqtt5Disconnect: () => PubSub5Disconnect(),
      Mqtt5PublishQoS1: () => PublishTestMessage()
    }
  )

function log (msg : string){
    console.log(msg);
    let consoleDiv = document.getElementById("console") as HTMLInputElement;
    let div = document.createElement('div')
    div.innerHTML = msg;
    consoleDiv?.appendChild(div);
}

function creatClientConfig() : mqtt5.Mqtt5ClientConfig {
    let builder : iot.AwsIotMqtt5ClientConfigBuilder | undefined = undefined;

    if (args.key_file_path && args.cert_file_path) {
        builder = iot.AwsIotMqtt5ClientConfigBuilder.newDirectMqttBuilderWithMtlsFromPath(
            args.endpoint,
            args.cert_file_path,
            args.key_file_path
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
        clientId: "test-client"
    });

    return builder.build();
}

let client :mqtt5.Mqtt5Client | null;
let qos0_topic = "test/topic/qos0";
let qos1_topic = "test/topic/qos1";


function createClient(args: any) : mqtt5.Mqtt5Client {

    let config : mqtt5.Mqtt5ClientConfig = creatClientConfig();

    log("Creating client for " + config.hostName);
    client = new mqtt5.Mqtt5Client(config);

    client.on('error', (error: ICrtError) => {
        log("Error event: " + error.toString());
    });

    client.on("messageReceived",(eventData: mqtt5.MessageReceivedEvent) : void => {
        log("Message Received event: " + JSON.stringify(eventData.message));
        if (eventData.message.payload) {
            log("  with payload: " + toUtf8(new Uint8Array(eventData.message.payload as ArrayBuffer)));
        }
    } );

    client.on('attemptingConnect', (eventData: mqtt5.AttemptingConnectEvent) => {
        log("Attempting Connect event");
    });

    client.on('connectionSuccess', (eventData: mqtt5.ConnectionSuccessEvent) => {
        log("Connection Success event");
        log("Connack: " + JSON.stringify(eventData.connack));
        log("Settings: " + JSON.stringify(eventData.settings));
    });

    client.on('connectionFailure', (eventData: mqtt5.ConnectionFailureEvent) => {
        log("Connection failure event: " + eventData.error.toString());
        if (eventData.connack) {
            log("Connack: " + JSON.stringify(eventData.connack));
        }
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

async function runSample(args : any) {

    try{

        let client : mqtt5.Mqtt5Client = createClient(args);

        const connectionSuccess = once(client, "connectionSuccess");

        client.start();
        await connectionSuccess;

        const suback = await client.subscribe({
            subscriptions: [
                { qos: mqtt5.QoS.AtLeastOnce, topicFilter: qos1_topic },
                { qos: mqtt5.QoS.AtMostOnce, topicFilter: qos0_topic }
            ]
        });
        log('Suback result: ' + JSON.stringify(suback));

        const qos0PublishResult = await client.publish({
            qos: mqtt5.QoS.AtMostOnce,
            topicName: qos0_topic,
            payload: JSON.stringify("This is a qos 0 payload"),
            userProperties: [
                {name: "test", value: "userproperty"}
            ]
        });
        log('QoS 0 Publish result: ' + JSON.stringify(qos0PublishResult));

        const qos1PublishResult = await client.publish({
            qos: mqtt5.QoS.AtLeastOnce,
            topicName: qos1_topic,
            payload: JSON.stringify("This is a qos 1 payload")
        });
        log('QoS 1 Publish result: ' + JSON.stringify(qos1PublishResult));
    }
    catch(error)
    {
        log("Client failed: " + error)
    }

}

export const PubSub5 = async () => {
    if(client !=null)
    {
        log("Client is already started.");
        return;
    }
    // make it wait as long as possible once the promise completes we'll turn it off.
    const timer = setTimeout(() => {}, 2147483647);

    await runSample(args);

    clearTimeout(timer);
}


async function PubSub5Disconnect(){
    if(client == null)
    {
        log("Client is not started.")
        return;
    }

    const stopped = once(client, "stopped");
    client.stop();
    await stopped;
    client.close();
    client = null;
}



async function PublishTestMessage(){
    if(client == null)
    {
        log("Client is not started.")
        return;
    }

    const qos1PublishResult = await client.publish({
        qos: mqtt5.QoS.AtLeastOnce,
        topicName: qos1_topic,
        payload: JSON.stringify("This is a qos 1 payload")
    });
    log('QoS 1 Publish result: ' + JSON.stringify(qos1PublishResult));
}