# Sample Applications for the AWS IoT Device SDK for JavaScript v2

* [Node: MQTT5 Pub/Sub](./node/pub_sub_mqtt5/README.md)
* [Browser: MQTT5 Pub/Sub](./browser/pub_sub_mqtt5/README.md)
* [Node: Pub/Sub](./node/pub_sub/README.md)
* [Pub/Sub JS](./node/pub_sub_js/README.md)
* [Browser: Pub/Sub](./browser/pub_sub/README.md)
* [Browser: Pub/Sub Minified](./browser/pub_sub_minified/README.md)
* [Node: MQTT5 Shared Subscription](./node/shared_subscription/README.md)
* [Browser: MQTT5 Shared Subscription](./browser/shared_subscription/README.md)
* [Node: Basic Connect](./node/basic_connect/README.md)
* [Node: Websocket Connect](./node/websocket_connect/README.md)
* [Node: PKCS#11 Connect](./node/pkcs11_connect/README.md)
* [Node: PKCS#12 Connect](./node/pkcs12_connect/README.md)
* [Node: Windows Cert Connect](./node/windows_cert_connect/README.md)
* [Node: Custom Authorizer Connect](./node/custom_authorizer_connect/README.md)
* [Browser: Custom Authorizer Connect](./browser/custom_authorizer_connect/README.md)
* [Node: Cognito Connect](./node/cognito_connect/README.md)
* [Browser: Cognito Connect](./browser/pub_sub/README.md)
* [Node: X509 Connect](./node/x509_connect/README.md)
* [Node: Shadow](./node/shadow/README.md)
* [Node: Fleet Provisioning](./node/fleet_provisioning/README.md)
* [Node: Jobs](./node/jobs/README.md)
* [Node: Basic Discovery](./node/basic_discovery/README.md)

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
