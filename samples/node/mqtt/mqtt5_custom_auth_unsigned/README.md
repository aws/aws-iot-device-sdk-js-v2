# MQTT5 Custom Auth Unsigned PubSub

[**Return to main sample list**](../../README.md)
*__Jump To:__*
* [Introduction](#introduction)
* [Requirements](#requirements)
* [How To Run](#how-to-run)
* [Additional Information](#additional-information)

## Introduction
This sample uses the
[Message Broker](https://docs.aws.amazon.com/iot/latest/developerguide/iot-message-broker.html)
for AWS IoT to send and receive messages through an MQTT connection using MQTT5 with a custom authorizer for authentication.

You can read more about MQTT5 for the JavaScript IoT Device SDK V2 in the [MQTT5 user guide](https://github.com/awslabs/aws-crt-nodejs/blob/main/MQTT5-UserGuide.md).

## Requirements

This sample assumes you have a custom authorizer configured in AWS IoT Core. Information about custom authorizers can be found [HERE](https://docs.aws.amazon.com/iot/latest/developerguide/custom-authentication.html).

Your custom authorizer must be configured to accept username and password authentication without token signing.

## How to run

To Run this sample from the `samples/node/mqtt/mqtt5_custom_auth_unsigned` folder, use the following command:

```sh
node index.js \
  --endpoint <AWS IoT endpoint> \
  --authorizer_name <custom authorizer name> \
  --auth_username <username> \
  --auth_password <password>
```
If you would like to see what optional arguments are available, use the `--help` argument:
``` sh
node index.js --help
```

will result in the following output:
```
Options:
  --endpoint, -e        IoT endpoint hostname                   [string] [required]
  --authorizer_name, -a The name of the custom authorizer to connect to invoke
                                                               [string] [required]
  --auth_username, -u   The name to send when connecting through the custom
                        authorizer                             [string] [required]
  --auth_password, -p   The password to send when connecting through a custom
                        authorizer                             [string] [required]
  --client_id, -C       Client ID              [string] [default: "mqtt5-sample-<uuid>"]
  --topic, -t           Topic                      [string] [default: "test/topic"]
  --message, -m         Message payload [string] [default: "Hello from mqtt5 sample"]
  --count, -n           Messages to publish (0 = infinite)      [number] [default: 5]
  --help                Show help                                           [boolean]
```

The sample will not run without the required arguments and will notify you of missing arguments.

## Additional Information
Additional help with the MQTT5 Client can be found in the [MQTT5 Userguide](https://github.com/awslabs/aws-crt-nodejs/blob/main/MQTT5-UserGuide.md). This guide will provide more details on MQTT5 operations, lifecycle events, connection methods, and other useful information.