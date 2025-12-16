/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */

import { mqtt5, iot } from "aws-iot-device-sdk-v2";
import { once } from "events";
import yargs from "yargs";
import { v4 as uuidv4 } from "uuid";

const TIMEOUT = 100000;

// --------------------------------- ARGUMENT PARSING -----------------------------------------
const args = yargs
    .option('endpoint', {
        alias: 'e',
        description: 'IoT endpoint hostname',
        type: 'string',
        required: true
    })
    .option('cert', {
        alias: 'c',
        description: 'Path to the certificate file to use during mTLS connection establishment',
        type: 'string',
        required: true
    })
    .option('pkcs11_lib', {
        alias: 'l',
        description: 'Path to PKCS#11 Library',
        type: 'string',
        required: true
    })
    .option('pin', {
        alias: 'p',
        description: 'User PIN for logging into PKCS#11 token',
        type: 'string',
        required: true
    })
    .option('token_label', {
        alias: 't',
        description: 'Label of the PKCS#11 token to use (optional)',
        type: 'string',
        required: false
    })
    .option('slot_id', {
        alias: 's',
        description: 'Slot ID containing the PKCS#11 token to use (optional)',
        type: 'number',
        required: false
    })
    .option('key_label', {
        alias: 'k',
        description: 'Label of private key on the PKCS#11 token (optional)',
        type: 'string',
        required: false
    })
    .option('client_id', {
        alias: 'C',
        description: 'Client ID',
        type: 'string',
        default: `mqtt5-sample-${uuidv4().substring(0, 8)}`
    })
    .option('topic', {
        alias: 'T',
        description: 'Topic',
        type: 'string',
        default: 'test/topic'
    })
    .option('message', {
        alias: 'm',
        description: 'Message payload',
        type: 'string',
        default: 'Hello from mqtt5 sample'
    })
    .option('count', {
        alias: 'n',
        description: 'Messages to publish (0 = infinite)',
        type: 'number',
        default: 5
    })
    .help()
    .argv;

// --------------------------------- ARGUMENT PARSING END -----------------------------------------

async function runSample() {
    console.log("\nStarting MQTT5 PKCS11 PubSub Sample\n");
    
    let receivedCount = 0;

    console.log(`Loading PKCS#11 library '${args.pkcs11_lib}' ...`);
    const pkcs11Lib = new io.Pkcs11Lib(args.pkcs11_lib, io.Pkcs11Lib.InitializeFinalizeBehavior.STRICT);
    console.log("Loaded!");

    // Create MQTT5 client using PKCS#11
    console.log("==== Creating MQTT5 Client ====\n");
    const pkcs11Options = {
        pkcs11Lib: pkcs11Lib,
        userPin: args.pin,
        slotId: args.slot_id,
        tokenLabel: args.token_label,
        privateKeyObjectLabel: args.key_label
    };

    const builder = iot.AwsIotMqtt5ClientConfigBuilder.newDirectMqttBuilderWithMtlsFromPkcs11(
        args.endpoint,
        pkcs11Options
    );

    builder.withConnectProperties({
        clientId: args.client_id,
        keepAliveIntervalSeconds: 1200
    });

    const config = builder.build();
    const client = new mqtt5.Mqtt5Client(config);

    // Event handler for when any message is received
    client.on('messageReceived', (eventData: mqtt5.MessageReceivedEvent) => {
        const message = eventData.message;
        const payload = message.payload ? Buffer.from(message.payload).toString('utf-8') : '';
        console.log(`==== Received message from topic '${message.topicName}': ${payload} ====\n`);
        
        receivedCount++;
        if (receivedCount === args.count) {
            setImmediate(() => client.emit('receivedAll'));
        }
    });

    // Event handler for lifecycle event Stopped
    client.on('stopped', () => {
        console.log("Lifecycle Stopped\n");
    });

    // Event handler for lifecycle event Attempting Connect
    client.on('attemptingConnect', () => {
        console.log(`Lifecycle Connection Attempt\nConnecting to endpoint: '${args.endpoint}' with client ID '${args.client_id}'`);
    });

    // Event handler for lifecycle event Connection Success
    client.on('connectionSuccess', (eventData: mqtt5.ConnectionSuccessEvent) => {
        console.log(`Lifecycle Connection Success with reason code: ${eventData.connack.reasonCode}\n`);
    });

    // Event handler for lifecycle event Connection Failure
    client.on('connectionFailure', (eventData: mqtt5.ConnectionFailureEvent) => {
        console.log(`Lifecycle Connection Failure with exception: ${eventData.error}`);
    });

    // Event handler for lifecycle event Disconnection
    client.on('disconnection', (eventData: mqtt5.DisconnectionEvent) => {
        const reasonCode = eventData.disconnect ? eventData.disconnect.reasonCode : 'None';
        console.log(`Lifecycle Disconnected with reason code: ${reasonCode}`);
    });

    // Start the client, instructing the client to desire a connected state. The client will try to 
    // establish a connection with the provided settings. If the client is disconnected while in this 
    // state it will attempt to reconnect automatically.
    console.log("==== Starting client ====");
    client.start();

    const connectionSuccess = once(client, "connectionSuccess");
    await Promise.race([
        connectionSuccess,
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Connection timeout")), TIMEOUT))
    ]);

    console.log(`==== Subscribing to topic '${args.topic}' ====`);
    const suback = await client.subscribe({
        subscriptions: [{
            topicFilter: args.topic,
            qos: mqtt5.QoS.AtLeastOnce
        }]
    });
    console.log(`Suback received with reason code: ${suback.reasonCodes}\n`);

    if (args.count === 0) {
        console.log("==== Sending messages until program killed ====\n");
    } else {
        console.log(`==== Sending ${args.count} message(s) ====\n`);
    }

    let publishCount = 1;

    while (publishCount <= args.count || args.count === 0) {
        const message = `${args.message} [${publishCount}]`;
        console.log(`Publishing message to topic '${args.topic}': ${message}`);
        
        const publishResult = await client.publish({
            topicName: args.topic,
            payload: message,
            qos: mqtt5.QoS.AtLeastOnce
        });
        console.log(`PubAck received with ${publishResult?.reasonCode}\n`);
        
        await new Promise<void>(resolve => setTimeout(resolve, 1500));
        publishCount++;
    }

    if (receivedCount < args.count) {
        const receivedAll = once(client, "receivedAll");
        await Promise.race([
            receivedAll,
            new Promise<void>(resolve => setTimeout(resolve, 5000))
        ]);
    }
    console.log(`${receivedCount} message(s) received.\n`);

    console.log(`==== Unsubscribing from topic '${args.topic}' ====`);
    const unsuback = await client.unsubscribe({
        topicFilters: [args.topic]
    });
    console.log(`Unsubscribed with ${unsuback.reasonCodes}\n`);

    // Stop the client. Instructs the client to disconnect and remain in a disconnected state.
    console.log("==== Stopping Client ====");
    const stopped = once(client, "stopped");
    client.stop();
    
    await Promise.race([
        stopped,
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Stop timeout")), TIMEOUT))
    ]);

    console.log("==== Client Stopped! ====");
    client.close();
}

runSample().then(() => {
    process.exit(0);
}).catch((error: Error) => {
    console.error(error);
    process.exit(1);
});