/* Copyright 2010-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
*
* Licensed under the Apache License, Version 2.0 (the "License").
* You may not use this file except in compliance with the License.
* A copy of the License is located at
*
*  http://aws.amazon.com/apache2.0
*
* or in the "license" file accompanying this file. This file is distributed
* on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
* express or implied. See the License for the specific language governing
* permissions and limitations under the License.
*/

import { mqtt, auth, http, io, iot } from 'aws-crt';
import * as iotidentity  from '../../../dist/iotidentity/iotidentityclient.js';

type Args = { [index: string]: any };
const fs = require('fs')
const yargs = require('yargs');

yargs.command('*', false, (yargs: any) => {
    yargs
        .option('endpoint', {
            alias: 'e',
            description: "Your AWS IoT custom endpoint, not including a port. "  +
              "Ex: \"abcd123456wxyz-ats.iot.us-east-1.amazonaws.com\"",
            type: 'string',
            required: true
        })
        .option('ca_file', {
            alias: 'r',
            description: 'FILE: path to a Root CA certficate file in PEM format.',
            type: 'string',
            required: false
        })
        .option('cert', {
            alias: 'c',
            description: 'FILE: path to a PEM encoded certificate to use with mTLS',
            type: 'string',
            required: true
        })
        .option('key', {
            alias: 'k',
            description: 'FILE: Path to a PEM encoded private key that matches cert.',
            type: 'string',
            required: true
        })
        .option('csr_file', {
            alias: 'csr',
            description: 'FILE: Path to a CSR file in PEM format',
            type: 'string',
            required: false
        })
        .option('client_id', {
            alias: 'C',
            description: 'Client ID for MQTT connection.',
            type: 'string',
            default: 'samples-client-id'
        })
        .option('template_name', {
              alias: 't',
              description: 'STRING: Template Name',
              type: 'string',
              required: true
         })
         .option('template_parameters', {
              alias: 'tp',
              description: 'Template parameters json ',
              type: 'string',
              required: false
         })
        .option('use_websocket', {
            alias: 'W',
            default: false,
            description: 'To use a websocket instead of raw mqtt. If you ' +
            'specify this option you must specify a region for signing, you can also enable proxy mode.',
            type: 'boolean',
            required: false
        })
        .option('signing_region', {
            alias: 's',
            default: 'us-east-1',
            description: 'If you specify --use_websocket, this ' +
            'is the region that will be used for computing the Sigv4 signature',
            type: 'string',
            required: false
        })
        .option('proxy_host', {
            alias: 'H',
            description: 'Hostname for proxy to connect to. Note: if you use this feature, ' +
            'you will likely need to set --ca_file to the ca for your proxy.',
            type: 'string',
            required: false
        })
        .option('proxy_port', {
            alias: 'P',
            default: 8080,
            description: 'Port for proxy to connect to.',
            type: 'number',
            required: false
        })
        .option('verbosity', {
            alias: 'v',
            description: 'BOOLEAN: Verbose output',
            type: 'string',
            default: 'none',
            choices: ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'none']
        })
        .help()
        .alias('help', 'h')
        .showHelpOnFail(false)
}, main).parse();


async function execute_keys_session(identity: iotidentity.IotIdentityClient, argv: Args) {
    return new Promise(async (resolve, reject) => {
        try {
            var token: string = "";

            function keysAccepted(error?: iotidentity.IotIdentityError, response?: iotidentity.model.CreateKeysAndCertificateResponse) {
                if (response) {
                    console.log("CreateKeysAndCertificateResponse for certificateId=" + response.certificateId);
                    if (response.certificateOwnershipToken) {
                        token = response.certificateOwnershipToken;
                    }
                }

                if (error) {
                    console.log("Error occurred..");
                    reject(error);
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
                    reject(error);
                }
            }

             function registerAccepted(error?: iotidentity.IotIdentityError, response?: iotidentity.model.RegisterThingResponse) {
                  if (response) {
                        console.log("RegisterThingResponse for thingName=" + response.thingName);
                  }

                  if (error) {
                      console.log("Error occurred..");
                  }
                  return;
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
                 return;
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
            const keysRequest: iotidentity.model.CreateKeysAndCertificateRequest = {toJSON() {return {};}};

            await identity.publishCreateKeysAndCertificate(
                        keysRequest,
                        mqtt.QoS.AtLeastOnce);

            console.log("Subscribing to RegisterThing Accepted and Rejected topics..");
            const registerThingSubRequest: iotidentity.model.RegisterThingSubscriptionRequest = {templateName: argv.template_name};
            await identity.subscribeToRegisterThingAccepted(
                        registerThingSubRequest,
                        mqtt.QoS.AtLeastOnce,
                        (error, response) => registerAccepted(error, response));

            await identity.subscribeToRegisterThingRejected(
                        registerThingSubRequest,
                        mqtt.QoS.AtLeastOnce,
                        (error, response) => registerRejected(error, response));

            console.log("Publishing to RegisterThing topic..");
            const map: {[key: string]: string} = JSON.parse(argv.template_parameters);

            const registerThing: iotidentity.model.RegisterThingRequest = {parameters: map, templateName: argv.template_name, certificateOwnershipToken: token};
            await identity.publishRegisterThing(
                    registerThing,
                    mqtt.QoS.AtLeastOnce);
        }
        catch (error) {
            reject(error);
        }
    });
}

async function execute_csr_session(identity: iotidentity.IotIdentityClient, argv: Args) {
    return new Promise(async (resolve, reject) => {
        try {
            var token: string = "";

            function csrAccepted(error?: iotidentity.IotIdentityError, response?: iotidentity.model.CreateCertificateFromCsrResponse) {
                  if (response) {
                      console.log("CreateCertificateFromCsrResponse for certificateId=" + response.certificateId);
                      if (response.certificateOwnershipToken) {
                          token = response.certificateOwnershipToken;
                      }
                  }

                  if (error) {
                      console.log("Error occurred..");
                  }
                  return;
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
                  return;
            }

            function registerAccepted(error?: iotidentity.IotIdentityError, response?: iotidentity.model.RegisterThingResponse) {
                  if (response) {
                        console.log("RegisterThingResponse for thingName=" + response.thingName);
                  }

                  if (error) {
                      console.log("Error occurred..");
                  }
                  return;
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
                return;
            }

            let csr: string = "";
            try {
                csr = fs.readFileSync(argv.csr_file, 'utf8');
            } catch(e) {
                console.log('Error reading CSR PEM file:', e.stack);
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
            console.log("Subscribing to RegisterThing Accepted and Rejected topics..");

            const registerThingSubRequest: iotidentity.model.RegisterThingSubscriptionRequest = {templateName: argv.template_name};
            await identity.subscribeToRegisterThingAccepted(
                        registerThingSubRequest,
                        mqtt.QoS.AtLeastOnce,
                        (error, response) => registerAccepted(error, response));

            await identity.subscribeToCreateKeysAndCertificateRejected(
                        registerThingSubRequest,
                        mqtt.QoS.AtLeastOnce,
                        (error, response) => registerRejected(error, response));

            console.log("Publishing to RegisterThing topic..");
            const map: {[key: string]: string} = JSON.parse(argv.template_parameters);

            const registerThing: iotidentity.model.RegisterThingRequest = {parameters: map, templateName: argv.template_name, certificateOwnershipToken: token};
            await identity.publishRegisterThing(
                    registerThing,
                    mqtt.QoS.AtLeastOnce);
        }
        catch (error) {
            reject(error);
        }
    });
}

async function main(argv: Args) {
    if (argv.verbose != 'none') {
        const level : io.LogLevel = parseInt(io.LogLevel[argv.verbosity.toUpperCase()]);
        io.enable_logging(level);
    }

    const client_bootstrap = new io.ClientBootstrap();

    let config_builder = null;
    if(argv.use_websocket) {
        let proxy_options = undefined;
        if (argv.proxy_host) {
            proxy_options = new http.HttpProxyOptions(argv.proxy_host, argv.proxy_port);
        }

        config_builder = iot.AwsIotMqttConnectionConfigBuilder.new_with_websockets({
            region: argv.signing_region,
            credentials_provider: auth.AwsCredentialsProvider.newDefault(client_bootstrap),
            proxy_options: proxy_options
        });
    } else {
        config_builder = iot.AwsIotMqttConnectionConfigBuilder.new_mtls_builder_from_path(argv.cert, argv.key);
    }

    if (argv.ca_file != null) {
        config_builder.with_certificate_authority_from_path(undefined, argv.ca_file);
    }

    config_builder.with_clean_session(false);
    config_builder.with_client_id(argv.client_id);
    config_builder.with_endpoint(argv.endpoint);

    // force node to wait 60 seconds before killing itself, promises do not keep node alive
    const timer = setTimeout(() => {}, 60 * 1000);

    const config = config_builder.build();
    const client = new mqtt.MqttClient(client_bootstrap);
    const connection = client.new_connection(config);

    const identity = new iotidentity.IotIdentityClient(connection);

    await connection.connect();

    if (argv.csr_file) {
        //Csr workflow
        await execute_csr_session(identity, argv);
    } else {
        //Keys workflow
        await execute_keys_session(identity, argv);
    }

    // Allow node to die if the promise above resolved
    clearTimeout(timer);
}
