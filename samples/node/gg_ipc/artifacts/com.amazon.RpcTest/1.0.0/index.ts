/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */

import {eventstream_rpc, greengrasscoreipc} from 'aws-iot-device-sdk-v2';
import {once} from "events";
import {toUtf8} from "@aws-sdk/util-utf8-browser";

type Args = { [index: string]: any };

const yargs = require('yargs');

const common_args = require('../util/cli_args');

yargs.command('*', false, (yargs: any) => {
    common_args.add_topic_message_arguments(yargs);
}, main).parse();

async function main(argv: Args) {
    try {
        console.log("topic: " + argv.topic);
        let client : greengrasscoreipc.Client = greengrasscoreipc.createClient();

        await client.connect();

        await client.subscribeToIoTCore({
            topicName: "hello/world",
            qos: greengrasscoreipc.model.QOS.AT_LEAST_ONCE
        }).on("message", (message: greengrasscoreipc.model.IoTCoreMessage) => {
            if (message.message) {
                console.log(`Message received on topic '${message.message.topicName}': '${toUtf8(new Uint8Array(message.message.payload as ArrayBuffer))}'`);
            }
        }).activate();

        setInterval(async () => {
            await client.publishToIoTCore({
                topicName: "hello/world",
                payload: "Hello from a component!",
                qos : greengrasscoreipc.model.QOS.AT_LEAST_ONCE
            });
        }, 10000);

        await once(client, greengrasscoreipc.Client.DISCONNECTION);

        await client.close();
    } catch (err) {
        console.log("Aw shucks: " + (err as eventstream_rpc.RpcError) .toString());
    }
}
