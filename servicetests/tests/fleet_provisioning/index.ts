/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */

import { iot, mqtt, mqtt5, iotidentity } from 'aws-iot-device-sdk-v2';
import { once } from "events"

type Args = { [index: string]: any };
const fs = require('fs')
const yargs = require('yargs');

yargs.command('*', false, (yargs: any) => {
    yargs.option('endpoint', {
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
    .option('region', {
        alias: 'r',
        description: 'AWS region to establish a websocket connection to.',
        type: 'string',
        required: false
    })
    .option('client_id', {
        alias: 'C',
        description: 'Client ID for MQTT connection.',
        type: 'string',
        required: false
    })
    .option('csr', {
        description: '<path>: Path to a CSR file in PEM format.',
        type: 'string',
        required: false
    })
    .option('template_name', {
        description: 'Template Name.',
        type: 'string',
        required: true
    })
    .option('template_parameters', {
        description: '<json>: Template parameters json.',
        type: 'string',
        required: false
    })
    .option('mqtt_version', {
        description: 'MQTT version to use (3 or 5). Default is 5.',
        type: 'number',
        required: false,
        default: 5
    })
}, main).parse();


async function execute_keys(identity: iotidentity.IotIdentityClient, argv: Args) {
    return new Promise(async (resolve, reject) => {
        try {
            function keysAccepted(error?: iotidentity.IotIdentityError, response?: iotidentity.model.CreateKeysAndCertificateResponse) {
                if (response) {
                    console.log("Got CreateKeysAndCertificateResponse");
                }

                if (error || !response) {
                    console.log("Error occurred..");
                    reject(error);
                } else {
                    resolve(response.certificateOwnershipToken);
                }
            }

            function keysRejected(error?: iotidentity.IotIdentityError, response?: iotidentity.model.ErrorResponse) {
                if (response) {
                    console.log("CreateKeysAndCertificate ErrorResponse for " +
                        " statusCode=:" + response.statusCode +
                        " errorCode=:" + response.errorCode +
                        " errorMessage=:" + response.errorMessage);
                }
                if (error) {
                    console.log("Error occurred..");
                }
                reject(error);
            }

            console.log("Subscribing to CreateKeysAndCertificate Accepted and Rejected topics..");

            const keysSubRequest: iotidentity.model.CreateKeysAndCertificateSubscriptionRequest = {};

            await identity.subscribeToCreateKeysAndCertificateAccepted(
                keysSubRequest,
                mqtt5.QoS.AtLeastOnce,
                (error, response) => keysAccepted(error, response));

            await identity.subscribeToCreateKeysAndCertificateRejected(
                keysSubRequest,
                mqtt5.QoS.AtLeastOnce,
                (error, response) => keysRejected(error, response));

            console.log("Publishing to CreateKeysAndCertificate topic..");
            const keysRequest: iotidentity.model.CreateKeysAndCertificateRequest = { toJSON() { return {}; } };

            await identity.publishCreateKeysAndCertificate(
                keysRequest,
                mqtt5.QoS.AtLeastOnce);
        }
        catch (error) {
            reject(error);
        }
    });
}

async function execute_register_thing(identity: iotidentity.IotIdentityClient, token: string, argv: Args) {
    return new Promise<void>(async (resolve, reject) => {
        try {
            function registerAccepted(error?: iotidentity.IotIdentityError, response?: iotidentity.model.RegisterThingResponse) {
                if (response) {
                    console.log("RegisterThingResponse for thingName=" + response.thingName);
                }

                if (error) {
                    console.log("Error occurred..");
                }
                resolve();
            }

            function registerRejected(error?: iotidentity.IotIdentityError, response?: iotidentity.model.ErrorResponse) {
                if (response) {
                    console.log("RegisterThing ErrorResponse for " +
                        "statusCode=:" + response.statusCode +
                        "errorCode=:" + response.errorCode +
                        "errorMessage=:" + response.errorMessage);
                }
                if (error) {
                    console.log("Error occurred..");
                }
                resolve();
            }

            console.log("Subscribing to RegisterThing Accepted and Rejected topics..");
            const registerThingSubRequest: iotidentity.model.RegisterThingSubscriptionRequest = { templateName: argv.template_name };
            await identity.subscribeToRegisterThingAccepted(
                registerThingSubRequest,
                mqtt5.QoS.AtLeastOnce,
                (error, response) => registerAccepted(error, response));

            await identity.subscribeToRegisterThingRejected(
                registerThingSubRequest,
                mqtt5.QoS.AtLeastOnce,
                (error, response) => registerRejected(error, response));

            console.log("Publishing to RegisterThing topic: " + argv.template_parameters);
            const map: { [key: string]: string } = JSON.parse(argv.template_parameters);

            const registerThing: iotidentity.model.RegisterThingRequest = { parameters: map, templateName: argv.template_name, certificateOwnershipToken: token };
            await identity.publishRegisterThing(
                registerThing,
                mqtt5.QoS.AtLeastOnce);
        }
        catch (error) {
            reject(error);
        }
    });
}

async function execute_csr(identity: iotidentity.IotIdentityClient, argv: Args) {
    return new Promise(async (resolve, reject) => {
        try {
            function csrAccepted(error?: iotidentity.IotIdentityError, response?: iotidentity.model.CreateCertificateFromCsrResponse) {
                if (response) {
                    console.log("Got CreateCertificateFromCsrResponse");
                }

                if (error || !response) {
                    console.log("Error occurred..");
                    reject(error);
                } else {
                    resolve(response.certificateOwnershipToken);
                }
            }

            function csrRejected(error?: iotidentity.IotIdentityError, response?: iotidentity.model.ErrorResponse) {
                if (response) {
                    console.log("CreateCertificateFromCsr ErrorResponse for " +
                        "statusCode=:" + response.statusCode +
                        " errorCode=:" + response.errorCode +
                        " errorMessage=:" + response.errorMessage);
                }
                if (error) {
                    console.log("Error occurred..");
                }
                reject(error);
            }

            let csr: string = "";
            try {
                csr = fs.readFileSync(argv.csr, 'utf8');
            } catch (e) {
                if (e instanceof Error) {
                    console.log('Error reading CSR PEM file:', e.stack);
                }
            }
            console.log("Subscribing to CreateCertificateFromCsr Accepted and Rejected topics..");

            const csrSubRequest: iotidentity.model.CreateCertificateFromCsrSubscriptionRequest = {};

            await identity.subscribeToCreateCertificateFromCsrAccepted(
                csrSubRequest,
                mqtt5.QoS.AtLeastOnce,
                (error, response) => csrAccepted(error, response));

            await identity.subscribeToCreateCertificateFromCsrRejected(
                csrSubRequest,
                mqtt5.QoS.AtLeastOnce,
                (error, response) => csrRejected(error, response));

            console.log("Publishing to CreateCertficateFromCsr topic..");

            const csrRequest: iotidentity.model.CreateCertificateFromCsrRequest = { certificateSigningRequest: csr };
            await identity.publishCreateCertificateFromCsr(
                csrRequest,
                mqtt5.QoS.AtLeastOnce);
        }
        catch (error) {
            reject(error);
        }
    });
}

function createConnection(args: any): mqtt.MqttClientConnection {
    const config = iot.AwsIotMqttConnectionConfigBuilder.new_mtls_builder_from_path(
        args.cert,
        args.key
    )
    .with_endpoint(args.endpoint)
    .with_clean_session(false)
    .with_client_id(args.client_id || "test-" + Math.floor(Math.random() * 100000000))
    .build();
    
    const client = new mqtt.MqttClient();
    return client.new_connection(config);
}

function createMqtt5Client(args: any): mqtt5.Mqtt5Client {
    const builder = iot.AwsIotMqtt5ClientConfigBuilder.newDirectMqttBuilderWithMtlsFromPath(
        args.endpoint,
        args.cert,
        args.key
    );
    
    builder.withConnectProperties({
        clientId: args.client_id || "test-" + Math.floor(Math.random() * 100000000),
        keepAliveIntervalSeconds: 1200
    });
    
    return new mqtt5.Mqtt5Client(builder.build());
}

async function main(argv: any) {
    let connection: mqtt.MqttClientConnection | undefined;
    let client5: mqtt5.Mqtt5Client | undefined;
    let identity: iotidentity.IotIdentityClient;
    let timer: NodeJS.Timeout;

    console.log("Connecting...");
    if (argv.mqtt_version == 5) {
        client5 = createMqtt5Client(argv);
        identity = iotidentity.IotIdentityClient.newFromMqtt5Client(client5);

        const connectionSuccess = once(client5, "connectionSuccess");
        client5.start();

        // force node to wait 60 seconds before killing itself, promises do not keep node alive
        timer = setTimeout(() => { }, 60 * 1000);
        await connectionSuccess;
        console.log("Connected with Mqtt5 Client!");
    } else {
        connection = createConnection(argv);
        identity = new iotidentity.IotIdentityClient(connection);

        // force node to wait 60 seconds before killing itself, promises do not keep node alive
        timer = setTimeout(() => { }, 60 * 1000);
        await connection.connect()
        console.log("Connected with Mqtt3 Client!");
    }


    if (argv.csr) {
        // Csr workflow
        let token = await execute_csr(identity, argv);
        await execute_register_thing(identity, token as string, argv);
    } else {
        // Keys workflow
        let token = await execute_keys(identity, argv);
        await execute_register_thing(identity, token as string, argv);
    }

    console.log("Disconnecting...");
    if (connection) {
        await connection.disconnect();
    } else if (client5) {
        let stopped = once(client5, "stopped");
        client5.stop();
        await stopped;
        client5.close();
    }
    console.log("Disconnected");
    // Allow node to die if the promise above resolved
    clearTimeout(timer);
}