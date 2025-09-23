/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */

const { mqtt5, iot } = require("aws-iot-device-sdk-v2");
const { once } = require("events");
const yargs = require('yargs');
const { v4: uuidv4 } = require('uuid');

const TIMEOUT = 100000;

// --------------------------------- ARGUMENT PARSING -----------------------------------------
const args = yargs
    .option('endpoint', {
        alias: 'e',
        description: 'IoT endpoint hostname',
        type: 'string',
        required: true
    })
    .option('authorizer_name', {
        alias: 'a',
        description: 'The name of the custom authorizer to connect to invoke',
        type: 'string',
        required: true
    })
    .option('auth_signature', {
        alias: 's',
        description: 'Custom authorizer signature',
        type: 'string',
        required: true
    })
    .option('auth_token_key_name', {
        alias: 'k',
        description: 'Authorizer token key name',
        type: 'string',
        required: true
    })
    .option('auth_token_key_value', {
        alias: 'v',
        description: 'Authorizer token key value',
        type: 'string',
        required: true
    })
    .option('auth_username', {
        alias: 'u',
        description: 'The name to send when connecting through the custom authorizer (optional)',
        type: 'string',
        required: false
    })
    .option('auth_password', {
        alias: 'p',
        description: 'The password to send when connecting through a custom authorizer (optional)',
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

// --------------------------------- ARGUMENT PARSING END -----------------------------------------

async function runSample() {
    console.log("\nStarting MQTT5 Custom Auth Signed PubSub Sample\n");
    
    let receivedCount = 0;

    // Create MQTT5 Client with a custom authorizer
    console.log("==== Creating MQTT5 Client ====\n");
    const builder = iot.AwsIotMqtt5ClientConfigBuilder.newDirectMqttBuilderWithCustomAuth(
        args.endpoint,
        {
            authorizerName: args.authorizer_name,
            authorizerSignature: args.auth_signature,
            tokenKeyName: args.auth_token_key_name,
            tokenValue: args.auth_token_key_value,
            username: args.auth_username,
            password: args.auth_password
        }
    );

    builder.withConnectProperties({
        clientId: args.client_id,
        keepAliveIntervalSeconds: 1200
    });

    const config = builder.build();
    const client = new mqtt5.Mqtt5Client(config);

    // Event handler for when any message is received
    client.on('messageReceived', (eventData) => {
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
    client.on('connectionSuccess', (eventData) => {
        console.log(`Lifecycle Connection Success with reason code: ${eventData.connack.reasonCode}\n`);
    });

    // Event handler for lifecycle event Connection Failure
    client.on('connectionFailure', (eventData) => {
        console.log(`Lifecycle Connection Failure with exception: ${eventData.error}`);
    });

    // Event handler for lifecycle event Disconnection
    client.on('disconnection', (eventData) => {
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

    if (receivedCount < args.count) {
        const receivedAll = once(client, "receivedAll");
        await Promise.race([
            receivedAll,
            new Promise(resolve => setTimeout(resolve, 5000))
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
        new Promise((_, reject) => setTimeout(() => reject(new Error("Stop timeout")), TIMEOUT))
    ]);

    console.log("==== Client Stopped! ====");
    client.close();
}

runSample().then(() => {
    process.exit(0);
}).catch((error) => {
    console.error(error);
    process.exit(1);
});