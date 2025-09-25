# Sample Applications for the AWS IoT Device SDK for JavaScript v2
This directory contains sample applications for [aws-iot-device-sdk-js-v2](../README.md)

## Table of Contents
### Node
* [Node Samples](#node-samples)
    * [MQTT5 Client Samples](#mqtt5-client-samples)
    * [Service Client Samples](#service-client-samples)
* [Instructions](#instructions)
* [Enable Logging](#enable-logging-in-node-samples)
* [Installing Via NPM](#installing-via-npm)

### Browser
* Browser Samples
    * [MQTT5 Sample](./browser/pub_sub_mqtt5/README.md)
        * [MQTT over Websockets with Sigv4 authentication](./browser/pub_sub_mqtt5/README.md#mqtt-over-websockets-with-sigv4-authentication)
        * [MQTT over Websockets with Custom Authentication](./browser/pub_sub_mqtt5/README.md#mqtt-over-websockets-with-custom-authentication)
    * [React Sample](./browser/react_sample/README.md)

## Node Samples
### MQTT5 Client Samples
##### MQTT5 is the recommended MQTT Client. Additional infomration and usage instructions can be found in the [MQTT5 User Guide](https://github.com/awslabs/aws-crt-nodejs/blob/main/MQTT5-UserGuide.md). The samples below will create an MQTT5 client, connect using the selected method, subscribe to a topic, publish to the topic, and then disconnect.
| MQTT5 Client Sample | Description |
|--------|-------------|
| [X509-based mutual TLS](./node/mqtt/mqtt5_x509/README.md) | Demonstrates connecting to AWS IoT Core using X.509 certificates and private keys.
| [Websockets with Sigv4 authentication](./node/mqtt/mqtt5_aws_websocket/README.md) | Shows how to authenticate over websockets using AWS Signature Version 4 credentials. |
| [AWS Signed Custom Authorizer Lambda Function](./node/mqtt/mqtt5_custom_auth_signed/README.md) | Example of connecting with a signed Lambda-backed custom authorizer.
| [AWS Unsigned Custom Authorizer Lambda Function](./node/mqtt/mqtt5_custom_auth_unsigned/) | Example of connecting with an unsigned Lambda-backed custom authorizer.
| [PKCS11](./node/mqtt/mqtt5_pkcs11/README.md) | Demonstrates connecting using a hardware security module (HSM) or smartcard with PKCS#11. |
| [Electron](./node/pub_sub_electron_node/README.md) | Sample using Electron.
| [Other Connection Methods](https://github.com/awslabs/aws-crt-nodejs/blob/main/MQTT5-UserGuide.md) | More connection methods are available for review in the MQTT5 Userguide


### Service Client Samples
##### AWS offers a number of IoT related services using MQTT. The samples below demonstrate how to use the service clients provided by the SDK to interact with those services.
| Service Client Sample | Description |
|--------|-------------|
| [Shadow](./node/service_clients/shadow/README.md) | Manage and sync device state using the IoT Device Shadow service. |
| [Jobs](./node/service_clients/jobs/README.md) | Receive and execute remote operations sent from the Jobs service. |
| [Basic Fleet Provisioning](./node/service_clients/fleet_provisioning/basic/README.md) | Provision a device using the Fleet Provisioning template. |
| [CSR Fleet Provisioning](./node/service_clients/fleet_provisioning/csr/README.md) | Demonstrates CSR-based device certificate provisioning. |


### Instructions 
Node samples can be installed from the sample directory using the command:
```sh
npm install
```
And then run using the command:
```sh
node dist/index.js <arguments>
```

All NodeJS samples will show their options by passing in `--help`.
``` sh
node dist/index.js --help
```
Which will result in output showing all of the options that can be passed in at the command line, along with descriptions of what each does and whether they are optional or not.

### Enable logging in Node samples

To enable logging in the NodeJS samples, add the following code to the sample:

``` js
const level = parseInt(io.LogLevel["ERROR"]);
io.enable_logging(level);
```

Note that the following log levels are available: `TRACE`, `DEBUG`, `INFO`, `WARN`, `ERROR`, `FATAL`, and `NONE`. Once the code is added, logs will be printed to the console that then can be examined and shared to help debug issues.

### Installing via NPM

If you are installing via npm instead of building from source, please make the following change to the package.json under each sample.

From:
``` json
    "dependencies": {
        "aws-iot-device-sdk-v2": "file:../../..",
        "yargs": "^14.0.0"
    }
```
To:
``` json
    "dependencies": {
        "aws-iot-device-sdk-v2":  "<latest released version eg: ^1.3.0>",
        "yargs": "^14.0.0"
    }
```