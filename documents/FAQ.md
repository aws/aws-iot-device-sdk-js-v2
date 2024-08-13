# Frequently Asked Questions

*__Jump To:__*
* [Where should I start](#where-should-i-start)
* [How do I enable logging](#how-do-i-enable-logging)
* [I keep getting AWS_ERROR_MQTT_UNEXPECTED_HANGUP](#i-keep-getting-aws_error_mqtt_unexpected_hangup)
* [Mac-Only TLS Behavior](#mac-only-tls-behavior)
* [How do debug in VSCode?](#how-do-debug-in-vscode)
* [What certificates do I need?](#what-certificates-do-i-need)
* [I would like to build a browser application and got error "Property does not exist on type 'typeof import("\<path\>/node_modules/aws-crt/dist/**native**/*")](#browser-error)
* [Vercel/pkg Support](#vercel/pkg-support)
* [I still have more questions about this sdk?](#i-still-have-more-questions-about-this-sdk)

### Where should I start?

If you are just getting started make sure you [install this sdk](https://github.com/aws/aws-iot-device-sdk-js-v2#installation) and then build and run the basic PubSub in [node](https://github.com/aws/aws-iot-device-sdk-js-v2/tree/main/samples/node/pub_sub_mqtt5) or in the [browser](https://github.com/aws/aws-iot-device-sdk-js-v2/tree/main/samples/browser/pub_sub_mqtt5)

### How do I enable logging?

``` js
const level = parseInt(io.LogLevel["ERROR"]);
io.enable_logging(level);
```
You can also enable [CloudWatch logging](https://docs.aws.amazon.com/iot/latest/developerguide/cloud-watch-logs.html) for IoT which will provide you with additional information that is not available on the client side sdk.

### I keep getting AWS_ERROR_MQTT_UNEXPECTED_HANGUP

This could be many different things but it most likely is a policy issue. Start with using a super permissive IAM policy called AWSIOTFullAccess which looks like this:

``` json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "iot:*"
            ],
            "Resource": "*"
        }
    ]
}
```

After getting it working make sure to only allow the actions and resources that you need. More info about IoT IAM policies can be found [here](https://docs.aws.amazon.com/iot/latest/developerguide/security_iam_service-with-iam.html).

### Mac-Only TLS Behavior

Please note that on Mac, once a private key is used with a certificate, that certificate-key pair is imported into the Mac Keychain.  All subsequent uses of that certificate will use the stored private key and ignore anything passed in programmatically.  Beginning in v1.7.3, when a stored private key from the Keychain is used, the following will be logged at the "info" log level:

```
static: certificate has an existing certificate-key pair that was previously imported into the Keychain.  Using key from Keychain instead of the one provided.
```

### How do debug in VSCode?

Here is an example launch.json file to run the pubsub sample
 ``` json
 {
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "pub_sub",
            "skipFiles": [
                "<node_internals>/**"
            ],
            "program": "${workspaceFolder}/samples/node/pub_sub/dist/index.js",
            "args": [
                "--endpoint", "<account-number>-ats.iot.<region>.amazonaws.com",
                "--ca_file", "<path to root-CA>",
                "--cert", "<path to cert>",
                "--key", "<path to key>",
                "--client-id", "test-client"
            ]
        }
    ]
}
```

### What certificates do I need?

* You can download pre-generated certificates from the AWS console (this is the simplest and is recommended for testing)
* You can also generate your own certificates to fit your specific use case. You can find documentation for that [here](https://docs.aws.amazon.com/iot/latest/developerguide/x509-client-certs.html) and [here](https://iot-device-management.workshop.aws/en/provisioning-options.html)
* Certificates that you will need to run the samples
    * Root CA Certificates
        * Download the root CA certificate file that corresponds to the type of data endpoint and cipher suite you're using (You most likely want Amazon Root CA 1)
        * Generated and provided by Amazon. You can download it [here](https://www.amazontrust.com/repository/) or download it when getting the other certificates from the AWS console
        * When using samples it can look like this: `--ca_file root-CA.crt`
    * Device certificate
        * Intermediate device certificate that is used to generate the key below
        * When using samples it can look like this: `--cert abcde12345-certificate.pem.crt`
    * Key files
        * You should have generated/downloaded private and public keys that will be used to verify that communications are coming from you
        * When using samples you only need the private key and it will look like this: `--key abcde12345-private.pem.key`


### I would like to build a browser application and got error "Property does not exist on type 'typeof import("\<path\>/node_modules/aws-crt/dist/**native**/*") <a name="browser-error"></a>

The aws-iot-device-sdk-v2 library consists of two parts, [node(native)](https://aws.github.io/aws-iot-device-sdk-js-v2/node/index.html) and [browser](https://aws.github.io/aws-iot-device-sdk-js-v2/browser/index.html). The library will access the **native** API by default. You can configure the path in the `tsconfig.json` file to ensure that the app utilizes the **browser** API.

To set up the path in tsconfig.json, you can add a mapping for the library module that specifies the desired path for the browser API. Here's an example:

`tsconfig.json`:
```
    "paths": {
    "aws-iot-device-sdk-v2": ["node_modules/aws-iot-device-sdk-v2/dist/browser"]
    },
```
### Vercel/pkg Support

#### Uncaught Error: A dynamic link library (DLL) initialization routine failed. \\?\<library path>
The vercel/pkg is a tool to package your Node.js project into an executable that can be run on devices without Node.js installed. You can find instructions at https://github.com/vercel/pkg.
If the DLL load failure issue happened on windows with Vercel/pkg, please try the latest version. The issue should be fixed in v1.19.1.
The library `aws-iot-device-sdk-v2` depends on the native modules `aws-crt`. When vercel/pkg package the node project, it would renamed node.exe into the generated single executable. In such case, the symbols needed by native modules `aws-crt` are exported by the renamed executable instead of node.exe. In order to load native modules on Windows, the library need to install a delay-load hook to redirect the reference to use the loading executable. A windows delay load is required here.


### I still have more questions about this sdk?

* [Here](https://docs.aws.amazon.com/iot/latest/developerguide/what-is-aws-iot.html) are the AWS IoT Core docs for more details about IoT Core
* [Here](https://docs.aws.amazon.com/greengrass/v2/developerguide/what-is-iot-greengrass.html) are the AWS IoT Greengrass v2 docs for more details about greengrass
* [Discussion](https://github.com/aws/aws-iot-device-sdk-js-v2/discussions) questions are also a great way to ask other questions about this sdk.
* [Open an issue](https://github.com/aws/aws-iot-device-sdk-js-v2/issues) if you find a bug or have a feature request
