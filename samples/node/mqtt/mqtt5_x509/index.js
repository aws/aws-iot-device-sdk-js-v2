/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */

const { mqtt5, iot } = require("aws-iot-device-sdk-v2");
const { once } = require("events");
const yargs = require('yargs');
const { v4: uuidv4 } = require('uuid');

const TIMEOUT = 100000;
let receivedCount = 0;

// Argument parsing
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
    .option('key', {
        alias: 'k',
        description: 'Path to the private key file to use during mTLS connection establishment',
        type: 'string',
        required: true
    })
    .option('client_id', {
        alias: 'C',
        description: 'Client ID',
        type: 'string',
        default: `mqtt5-sample-${uuidv4().substring(0, 8)}`
    })
    .option('topic', {
        alias: 't',
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

function createClient() {
    const builder = iot.AwsIotMqtt5ClientConfigBuilder.newDirectMqttBuilderWithMtlsFromPath(
        args.endpoint,
        args.cert,
        args.key
    );

    builder.withConnectProperties({
        clientId: args.client_id,
        keepAliveIntervalSeconds: 1200
    });

    const config = builder.build();
    const client = new mqtt5.Mqtt5Client(config);

    client.on('messageReceived', (eventData) => {
        const message = eventData.message;
        const payload = message.payload ? Buffer.from(message.payload).toString('utf-8') : '';
        console.log(`==== Received message from topic '${message.topicName}': ${payload} ====\n`);
        
        receivedCount++;
        if (receivedCount === args.count) {
            client.emit('receivedAll');
        }
    });

    client.on('stopped', () => {
        console.log("Lifecycle Stopped\n");
    });

    client.on('attemptingConnect', () => {
        console.log(`Lifecycle Connection Attempt\nConnecting to endpoint: '${args.endpoint}' with client ID '${args.client_id}'`);
    });

    client.on('connectionSuccess', (eventData) => {
        console.log(`Lifecycle Connection Success with reason code: ${eventData.connack.reasonCode}\n`);
    });

    client.on('connectionFailure', (eventData) => {
        console.log(`Lifecycle Connection Failure with exception: ${eventData.error}`);
    });

    client.on('disconnection', (eventData) => {
        const reasonCode = eventData.disconnect ? eventData.disconnect.reasonCode : 'None';
        console.log(`Lifecycle Disconnected with reason code: ${reasonCode}`);
    });

    return client;
}

async function runSample() {
    console.log("\nStarting MQTT5 X509 PubSub Sample\n");

    console.log("==== Creating MQTT5 Client ====\n");
    const client = createClient();

    console.log("==== Starting client ====");
    client.start();

    const connectionSuccess = once(client, "connectionSuccess");
    await Promise.race([
        connectionSuccess,
        new Promise((_, reject) => setTimeout(() => reject(new Error("Connection timeout")), TIMEOUT))
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
    const publishPromises = [];

    while (publishCount <= args.count || args.count === 0) {
        const message = `${args.message} [${publishCount}]`;
        console.log(`Publishing message to topic '${args.topic}': ${message}`);
        
        const publishResult = await client.publish({
            topicName: args.topic,
            payload: message,
            qos: mqtt5.QoS.AtLeastOnce
        });
        console.log(`PubAck received with ${publishResult.reasonCode}\n`);
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        publishCount++;
    }

    const receivedAll = once(client, "receivedAll");
    await Promise.race([
        receivedAll,
        new Promise(resolve => setTimeout(resolve, TIMEOUT))
    ]);
    console.log(`${receivedCount} message(s) received.\n`);

    console.log(`==== Unsubscribing from topic '${args.topic}' ====`);
    const unsuback = await client.unsubscribe({
        topicFilters: [args.topic]
    });
    console.log(`Unsubscribed with ${unsuback.reasonCodes}\n`);

    console.log("==== Stopping Client ====");
    const stopped = once(client, "stopped");
    client.stop();
    
    await Promise.race([
        stopped,
        new Promise((_, reject) => setTimeout(() => reject(new Error("Stop timeout")), TIMEOUT))
    ]);

    console.log("==== Client Stopped! ====");
    client.close();
}

runSample().catch(console.error);