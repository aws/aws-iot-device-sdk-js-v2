"use strict";
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_crt_1 = require("aws-crt");
const iotidentity = __importStar(require("../../../dist/iotidentity/iotidentityclient.js"));
const yargs = require('yargs');
var token = "";
yargs.command('*', false, (yargs) => {
    yargs
        .option('endpoint', {
        alias: 'e',
        description: "Your AWS IoT custom endpoint, not including a port. " +
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
        required: false
    })
        .option('key', {
        alias: 'k',
        description: 'FILE: Path to a PEM encoded private key that matches cert.',
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
        required: false
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
        .showHelpOnFail(false);
}, main).parse();
function sleep(milliseconds) {
    console.log("Sleeping for " + milliseconds + " milliseconds...");
    let timeStart = new Date().getTime();
    while (true) {
        let elapsedTime = new Date().getTime() - timeStart;
        if (elapsedTime > milliseconds) {
            break;
        }
    }
}
/*
function createRegisterThingSubscriptionRequest(request: iotidentity.model.RegisterThingSubscriptionRequest) : {templateName: string;} {
    let newName = { templateName: ""};
    if (request.templateName) {
        newName.templateName = request.templateName;
    }
    return newName;
}
 */
/* function createRegisterThingRequest(request: iotidentity.model.RegisterThingRequest) : {
    parameters: {[key: string]: string};
    templateName: string;
    certificateOwnershipToken: string;
    }
    {
    let newName = { parameters: {}, templateName: "", certificateOwnershipToken: ""};
    if (request.templateName) {
        newName.templateName = request.templateName;
    }
    if (request.parameters) {
        newName.parameters = request.parameters;
    }
    if (request.certificateOwnershipToken) {
            newName.certificateOwnershipToken = request.certificateOwnershipToken;
        }
    return newName;
} */
function keysAccepted(error, response) {
    console.log("####I am here...");
    if (response) {
        console.log("CreateKeysAndCertificateResponse for certificateId=:" + response.certificateId);
        if (response.certificateOwnershipToken) {
            token = response.certificateOwnershipToken;
            console.log("Token=" + token);
        }
    }
    if (error) {
        console.log("Error occurred..");
    }
    return;
}
function keysRejected(error, response) {
    console.log("####I am here...");
    if (response) {
        console.log("CreateKeysAndCertificate ErrorResponse for " +
            "statusCode=:" + response.statusCode +
            "errorCode=:" + response.errorCode +
            "errorMessage=:" + response.errorMessage);
    }
    if (error) {
        console.log("Error occurred..");
    }
    return;
}
/* function registerAccepted(error?: iotidentity.IotIdentityError, response?: iotidentity.model.RegisterThingResponse) {
      console.log("####I am here...");
      if (response) {
                      console.log("RegisterThingResponse for thingName=:" + response.thingName);
                  }

      if (error) {
          console.log("Error occurred..");
      }
      return;
}

function registerRejected(error?: iotidentity.IotIdentityError, response?: iotidentity.model.ErrorResponse) {
      console.log("####I am here...");
     if (response) {
                      console.log("CreateKeysAndCertificate ErrorResponse for " +
                          "statusCode=:" + response.statusCode +
                          "errorCode=:" + response.errorCode +
                          "errorMessage=:" + response.errorMessage);
                  }
                  if (error) {
                            console.log("Error occurred..");
                        }
      return;
} */
function main(argv) {
    if (argv.verbose != 'none') {
        const level = parseInt(aws_crt_1.io.LogLevel[argv.verbosity.toUpperCase()]);
        aws_crt_1.io.enable_logging(level);
    }
    const client_bootstrap = new aws_crt_1.io.ClientBootstrap();
    let config_builder = null;
    if (argv.use_websocket) {
        let proxy_options = undefined;
        if (argv.proxy_host) {
            proxy_options = new aws_crt_1.http.HttpProxyOptions(argv.proxy_host, argv.proxy_port);
        }
        config_builder = aws_crt_1.iot.AwsIotMqttConnectionConfigBuilder.new_with_websockets({
            region: argv.signing_region,
            credentials_provider: aws_crt_1.auth.AwsCredentialsProvider.newDefault(client_bootstrap),
            proxy_options: proxy_options
        });
    }
    else {
        config_builder = aws_crt_1.iot.AwsIotMqttConnectionConfigBuilder.new_mtls_builder_from_path(argv.cert, argv.key);
    }
    if (argv.ca_file != null) {
        config_builder.with_certificate_authority_from_path(undefined, argv.ca_file);
    }
    config_builder.with_clean_session(false);
    config_builder.with_client_id(argv.client_id);
    config_builder.with_endpoint(argv.endpoint);
    // force node to wait 60 seconds before killing itself, promises do not keep node alive
    //const timer = setTimeout(() => {}, 60 * 1000);
    const config = config_builder.build();
    const client = new aws_crt_1.mqtt.MqttClient(client_bootstrap);
    const connection = client.new_connection(config);
    const identity = new iotidentity.IotIdentityClient(connection);
    connection.connect();
    //await execute_session(connection, argv)
    //Keys workflow
    console.log("Subscribing to CreateKeysAndCertificate Accepted and Rejected topics..");
    const keysSubRequest = {};
    identity.subscribeToCreateKeysAndCertificateAccepted(keysSubRequest, aws_crt_1.mqtt.QoS.AtLeastOnce, (error, response) => keysAccepted(error, response));
    identity.subscribeToCreateKeysAndCertificateRejected(keysSubRequest, aws_crt_1.mqtt.QoS.AtLeastOnce, (error, response) => keysRejected(error, response));
    console.log("Publishing to CreateKeysAndCertificate topic..");
    const keysRequest = {};
    identity.publishCreateKeysAndCertificate(JSON.stringify(keysRequest), aws_crt_1.mqtt.QoS.AtLeastOnce);
    /* console.log("Subscribing to RegisterThing Accepted and Rejected topics..");

    identity.subscribeToRegisterThingAccepted(
        iotidentity.model.CreateKeysAndCertificateRequest.from_json()({templateName: argv.template_name}),
        mqtt.QoS.AtLeastOnce,
        (error, response) => registerAccepted(error, response));

    identity.subscribeToCreateKeysAndCertificateRejected(
        createRegisterThingSubscriptionRequest({templateName: argv.template_name}),
        mqtt.QoS.AtLeastOnce,
        (error, response) => registerRejected(error, response));
 */
    sleep(8000);
    /*  console.log("Token=" + token);
     console.log("Publishing to RegisterThing topic..");
     let map: {[key: string]: string} = JSON.parse(argv.template_parameters);
 
     identity.publishRegisterThing(
             createRegisterThingRequest({parameters: map, templateName: argv.template_name, certificateOwnershipToken: token}),
             mqtt.QoS.AtLeastOnce);
 
 
     sleep(5000); */
    // Allow node to die if the promise above resolved
    //clearTimeout(timer);
}
//# sourceMappingURL=index.js.map