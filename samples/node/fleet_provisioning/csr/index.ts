/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */

import { iotidentity } from 'aws-iot-device-sdk-v2';
import { once } from "events"
import fs from "fs";

type Args = { [index: string]: any };
const yargs = require('yargs');

// The relative path is '../../../util/cli_args' from here, but the compiled javascript file gets put one level
// deeper inside the 'dist' folder
const common_args = require('../../../../util/cli_args');

yargs.command('*', false, (yargs: any) => {
    common_args.add_direct_connection_establishment_arguments(yargs);
    yargs
        .option('csr_file', {
            alias: 'csr',
            description: '<path>: Path to a CSR file in PEM format.',
            type: 'string',
            required: true
        })
        .option('template_name', {
            alias: 't',
            description: 'Template Name.',
            type: 'string',
            required: true
        })
        .option('template_parameters', {
            alias: 'tp',
            description: '<json>: Template parameters json.',
            type: 'string',
            required: false
        })
}, main).parse();

async function main(argv: Args) {
    common_args.apply_sample_arguments(argv);

    const csr: string = fs.readFileSync(argv.csr_file, 'utf8');

    console.log("Connecting...");
    let protocolClient = common_args.build_mqtt5_client_from_cli_args(argv);
    let identityClient = iotidentity.IotIdentityClientv2.newFromMqtt5(protocolClient, {
        maxRequestResponseSubscriptions: 2,
        maxStreamingSubscriptions: 0,
        operationTimeoutInSeconds: 60
    });

    const connectionSuccess = once(protocolClient, "connectionSuccess");
    protocolClient.start();

    await connectionSuccess;
    console.log("Connected!");

    let createCertificateFromCsrResponse = await identityClient.createCertificateFromCsr({
        certificateSigningRequest: csr
    });
    console.log(`CreateCertificateFromCsr Response: ${JSON.stringify(createCertificateFromCsrResponse)}`);

    let registerThingRequest : iotidentity.model.RegisterThingRequest = {
        templateName: argv.template_name,
        certificateOwnershipToken: createCertificateFromCsrResponse.certificateOwnershipToken,
    };

    if (argv.template_parameters) {
        registerThingRequest.parameters = JSON.parse(argv.template_parameters);
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
