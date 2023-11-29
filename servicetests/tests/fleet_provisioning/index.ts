/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */

import { mqtt, iotidentity } from 'aws-iot-device-sdk-v2';
import { once } from "events"

type Args = { [index: string]: any };
const fs = require('fs')
const yargs = require('yargs');

// The relative path is '../../../samples/util/cli_args' from here, but the compiled javascript file gets put one level
// deeper inside the 'dist' folder
const common_args = require('../../../../samples/util/cli_args');

yargs.command('*', false, (yargs: any) => {
    common_args.add_direct_connection_establishment_arguments(yargs);
    yargs
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
                mqtt.QoS.AtLeastOnce,
                (error, response) => keysAccepted(error, response));

            await identity.subscribeToCreateKeysAndCertificateRejected(
                keysSubRequest,
                mqtt.QoS.AtLeastOnce,
                (error, response) => keysRejected(error, response));

            console.log("Publishing to CreateKeysAndCertificate topic..");
            const keysRequest: iotidentity.model.CreateKeysAndCertificateRequest = { toJSON() { return {}; } };

            await identity.publishCreateKeysAndCertificate(
                keysRequest,
                mqtt.QoS.AtLeastOnce);
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
                mqtt.QoS.AtLeastOnce,
                (error, response) => registerAccepted(error, response));

            await identity.subscribeToRegisterThingRejected(
                registerThingSubRequest,
                mqtt.QoS.AtLeastOnce,
                (error, response) => registerRejected(error, response));

            console.log("Publishing to RegisterThing topic: " + argv.template_parameters);
            const map: { [key: string]: string } = JSON.parse(argv.template_parameters);

            const registerThing: iotidentity.model.RegisterThingRequest = { parameters: map, templateName: argv.template_name, certificateOwnershipToken: token };
            await identity.publishRegisterThing(
                registerThing,
                mqtt.QoS.AtLeastOnce);
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
                mqtt.QoS.AtLeastOnce,
                (error, response) => csrAccepted(error, response));

            await identity.subscribeToCreateCertificateFromCsrRejected(
                csrSubRequest,
                mqtt.QoS.AtLeastOnce,
                (error, response) => csrRejected(error, response));

            console.log("Publishing to CreateCertficateFromCsr topic..");

            const csrRequest: iotidentity.model.CreateCertificateFromCsrRequest = { certificateSigningRequest: csr };
            await identity.publishCreateCertificateFromCsr(
                csrRequest,
                mqtt.QoS.AtLeastOnce);
        }
        catch (error) {
            reject(error);
        }
    });
}

async function main(argv: Args) {
    common_args.apply_sample_arguments(argv);

    var connection;
    var client5;
    var identity;
    var timer;

    console.log("Connecting...");
    if (argv.mqtt_version == 5) {
        client5 = common_args.build_mqtt5_client_from_cli_args(argv);
        identity = iotidentity.IotIdentityClient.newFromMqtt5Client(client5);

        const connectionSuccess = once(client5, "connectionSuccess");
        client5.start();

        // force node to wait 60 seconds before killing itself, promises do not keep node alive
        timer = setTimeout(() => { }, 60 * 1000);
        await connectionSuccess;
        console.log("Connected with Mqtt5 Client!");
    } else {
        connection = common_args.build_connection_from_cli_args(argv);
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
    } else {
        let stopped = once(client5, "stopped");
        client5.stop();
        await stopped;
        client5.close();
    }
    console.log("Disconnected");
    // Allow node to die if the promise above resolved
    clearTimeout(timer);
}
