/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */

import {eventstream_rpc, greengrasscoreipc} from 'aws-iot-device-sdk-v2';
import {once} from "events";
import {toUtf8} from "@aws-sdk/util-utf8-browser";

type Args = { [index: string]: any };

const yargs = require('yargs');

yargs.command('*', false, (yargs: any) => {
}, main).parse();

async function main(argv: Args) {
    try {
        let client : greengrasscoreipc.Client = greengrasscoreipc.createClient();

        await client.connect();

        // set up a streaming operation that logs incoming MQTT messages for a topic
        await client.subscribeToIoTCore({
            topicName: "hello/world",
            qos: greengrasscoreipc.model.QOS.AT_LEAST_ONCE
        }).on("message", (message: greengrasscoreipc.model.IoTCoreMessage) => {
            if (message.message) {
                console.log(`Message received on topic '${message.message.topicName}': '${toUtf8(new Uint8Array(message.message.payload as ArrayBuffer))}'`);
            }
        }).activate();

        // periodically publish MQTT messages to the topic, indefinitely
        setInterval(async () => {
            await client.publishToIoTCore({
                topicName: "hello/world",
                payload: "Hello from a component!",
                qos : greengrasscoreipc.model.QOS.AT_LEAST_ONCE
            });
        }, 10000);

        // run until the connection shuts down for any reason
        await once(client, greengrasscoreipc.Client.DISCONNECTION);

        client.close();
    } catch (err) {
        console.log("Aw shucks: " + (err as eventstream_rpc.RpcError) .toString());
    }
}
