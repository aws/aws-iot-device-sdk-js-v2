# Sample Applications for the AWS IoT Device SDK for JavaScript v2
## MQTT5 Samples
#### MQTT5 is the recommended MQTT Client. It has many benefits over MQTT311 outlined in the [MQTT5 User Guide](https://github.com/awslabs/aws-crt-nodejs/blob/main/MQTT5-UserGuide.md)
* **Node**
    * [Node: MQTT5 Pub/Sub](./node/pub_sub_mqtt5/README.md)
        * [Direct MQTT with X509-based mutual TLS](./node/pub_sub_mqtt5/README.md#direct-mqtt-with-x509-based-mutual-tls)
        * [MQTT over Websockets with Sigv4 authentication](./node/pub_sub_mqtt5/README.md#mqtt-over-websockets-with-sigv4-authentication)
        * [Direct MQTT with Custom Authentication](./node/pub_sub_mqtt5/README.md#direct-mqtt-with-custom-authentication)
        * [Direct MQTT with PKCS11](./node/pub_sub_mqtt5/README.md#direct-mqtt-with-pkcs11-method)
        * [Direct MQTT with PKCS12](./node/pub_sub_mqtt5/README.md#direct-mqtt-with-pkcs12-method)
    * [Node: MQTT5 Pub/Sub with Electron](./node/pub_sub_electron_node/README.md)
    * [Node: MQTT5 Shared Subscription](./node/shared_subscription/README.md)
* **Browser**
    * [Browser: MQTT5 Pub/Sub](./browser/pub_sub_mqtt5/README.md)
        * [MQTT over Websockets with Sigv4 authentication](./browser/pub_sub_mqtt5/README.md#mqtt-over-websockets-with-sigv4-authentication)
        * [MQTT over Websockets with Custom Authentication](./browser/pub_sub_mqtt5/README.md#mqtt-over-websockets-with-custom-authentication)
    * [Browser: MQTT5 Pub/Sub with React](./browser/react_sample/README.md)
    * [Browser: MQTT5 Shared Subscription](./browser/shared_subscription/README.md)
## MQTT311 Samples
* **Node**
    * [Pub/Sub](./node/pub_sub/README.md)
    * [Pub/Sub JS](./node/pub_sub_js/README.md)
    * [Basic Connect](./node/basic_connect/README.md)
    * [Websocket Connect](./node/websocket_connect/README.md)
    * [PKCS#11 Connect](./node/pkcs11_connect/README.md)
    * [PKCS#12 Connect](./node/pkcs12_connect/README.md)
    * [Windows Cert Connect](./node/windows_cert_connect/README.md)
    * [Custom Authorizer Connect](./node/custom_authorizer_connect/README.md)
    * [Cognito Connect](./node/cognito_connect/README.md)
    * [X509 Connect](./node/x509_connect/README.md)
    * [Shadow](./node/shadow/README.md)
    * [Fleet Provisioning](./node/fleet_provisioning/README.md)
    * [Jobs](./node/jobs/README.md)
    * [Basic Discovery](./node/basic_discovery/README.md)
* **Browser**
    * [Pub/Sub](./browser/pub_sub/README.md)
    * [Custom Authorizer Connect](./browser/custom_authorizer_connect/README.md)
    * [Cognito Connect](./browser/pub_sub/README.md)

### Sample help in Node samples

All NodeJS samples will show their options by passing in `--help`. For example:

``` sh
# from the node/pub_sub folder
npm install
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