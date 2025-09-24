/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */

import { iotidentity, mqtt5, iot } from 'aws-iot-device-sdk-v2';
import { once } from "events"
import { v4 as uuidv4 } from 'uuid';

const TIMEOUT = 100000;

// --------------------------------- ARGUMENT PARSING -----------------------------------------
const args = require('yargs')
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
        default: `fleet-provisioning-${uuidv4().substring(0, 8)}`
    })
    .option('template_name', {
        alias: 't',
        description: 'Template Name',
        type: 'string',
        required: true
    })
    .option('template_parameters', {
        alias: 'tp',
        description: '<json>: Template parameters json',
        type: 'string',
        required: false
    })
    .help()
    .argv;

// --------------------------------- ARGUMENT PARSING END -----------------------------------------

async function main() {
    console.log("Connecting...");
    
    // Create MQTT5 client using mutual TLS via X509 Certificate and Private Key
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
    const protocolClient = new mqtt5.Mqtt5Client(config);
    
    let identityClient = iotidentity.IotIdentityClientv2.newFromMqtt5(protocolClient, {
        maxRequestResponseSubscriptions: 2,
        maxStreamingSubscriptions: 0,
        operationTimeoutInSeconds: 60
    });

    const connectionSuccess = once(protocolClient, "connectionSuccess");
    protocolClient.start();

    await Promise.race([
        connectionSuccess,
        new Promise((_, reject) => setTimeout(() => reject(new Error("Connection timeout")), TIMEOUT))
    ]);
    console.log("Connected!");

    let createKeysResponse = await identityClient.createKeysAndCertificate({});
    console.log(`CreateKeysAndCertificate Response: ${JSON.stringify(createKeysResponse)}`);

    let registerThingRequest : iotidentity.model.RegisterThingRequest = {
        templateName: args.template_name,
        certificateOwnershipToken: createKeysResponse.certificateOwnershipToken,
    };

    if (args.template_parameters) {
        registerThingRequest.parameters = JSON.parse(args.template_parameters);
    }

    let registerThingResponse = await identityClient.registerThing(registerThingRequest);
    console.log(`RegisterThing Response: ${JSON.stringify(registerThingResponse)}`);

    identityClient.close();

    console.log("Disconnecting...");

    let stopped = once(protocolClient, "stopped");
    protocolClient.stop();
    await stopped;

    console.log("Disconnected");
    process.exit(0);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
