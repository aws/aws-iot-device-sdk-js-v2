# MQTT5 PKCS11 PubSub

[**Return to main sample list**](../../README.md)
*__Jump To:__*
* [Introduction](#introduction)
* [Requirements](#requirements)
* [How To Run](#how-to-run)
* [Additional Information](#additional-information)

## Introduction
This sample uses the
[Message Broker](https://docs.aws.amazon.com/iot/latest/developerguide/iot-message-broker.html)
for AWS IoT to send and receive messages through an MQTT connection using MQTT5 with PKCS#11 for certificate and private key operations.

You can read more about MQTT5 for the JavaScript IoT Device SDK V2 in the [MQTT5 user guide](https://github.com/awslabs/aws-crt-nodejs/blob/main/MQTT5-UserGuide.md).

## Requirements

This sample assumes you have the required AWS IoT resources available and a PKCS#11 compatible hardware security module (HSM) or software token. Information about AWS IoT can be found [HERE](https://docs.aws.amazon.com/iot/latest/developerguide/what-is-aws-iot.html) and instructions on creating AWS IoT resources (AWS IoT Policy, Device Certificate, Private Key) can be found [HERE](https://docs.aws.amazon.com/iot/latest/developerguide/create-iot-resources.html).

**NOTE: This configuration only works on Unix devices.**

Your IoT Core Thing's [Policy](https://docs.aws.amazon.com/iot/latest/developerguide/iot-policies.html) must provide privileges for this sample to connect, subscribe, publish, and receive. Below is a sample policy that can be used on your IoT Core Thing that will allow this sample to run as intended.

<details>
<summary>(see sample policy)</summary>
<pre>
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "iot:Publish",
        "iot:Receive"
      ],
      "Resource": [
        "arn:aws:iot:<b>region</b>:<b>account</b>:topic/test/topic"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "iot:Subscribe"
      ],
      "Resource": [
        "arn:aws:iot:<b>region</b>:<b>account</b>:topicfilter/test/topic"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "iot:Connect"
      ],
      "Resource": [
        "arn:aws:iot:<b>region</b>:<b>account</b>:client/mqtt5-sample-*"
      ]
    }
  ]
}
</pre>

Replace with the following with the data from your AWS account:
* `<region>`: The AWS IoT Core region where you created your AWS IoT Core thing you wish to use with this sample. For example `us-east-1`.
* `<account>`: Your AWS IoT Core account ID. This is the set of numbers in the top right next to your AWS account name when using the AWS IoT Core website.

Note that in a real application, you may want to avoid the use of wildcards in your ClientID or use them selectively. Please follow best practices when working with AWS on production applications using the SDK. Also, for the purposes of this sample, please make sure your policy allows a client ID of `mqtt5-sample-*` to connect or use `--client_id <client ID here>` to send the client ID your policy supports.

</details>

## How to run

To Run this sample from the `samples/node/mqtt/mqtt5_pkcs11` folder, use the following command:

```sh
node index.js \
  --endpoint <AWS IoT endpoint> \
  --cert <Path to certificate file> \
  --pkcs11_lib <Path to PKCS#11 library> \
  --pin <User PIN>
```
If you would like to see what optional arguments are available, use the `--help` argument:
``` sh
node index.js --help
```

will result in the following output:
```
Options:
  --endpoint, -e    IoT endpoint hostname                      [string] [required]
  --cert, -c        Path to the certificate file to use during mTLS connection
                    establishment                              [string] [required]
  --pkcs11_lib, -l  Path to PKCS#11 Library                   [string] [required]
  --pin, -p         User PIN for logging into PKCS#11 token   [string] [required]
  --token_label, -t Label of the PKCS#11 token to use (optional)       [string]
  --slot_id, -s     Slot ID containing the PKCS#11 token to use (optional)
                                                                        [number]
  --key_label, -k   Label of private key on the PKCS#11 token (optional)
                                                                        [string]
  --client_id, -C   Client ID              [string] [default: "mqtt5-sample-<uuid>"]
  --topic, -T       Topic                      [string] [default: "test/topic"]
  --message, -m     Message payload [string] [default: "Hello from mqtt5 sample"]
  --count, -n       Messages to publish (0 = infinite)        [number] [default: 5]
  --help            Show help                                           [boolean]
```

The sample will not run without the required arguments and will notify you of missing arguments.

## Additional Information
Additional help with the MQTT5 Client can be found in the [MQTT5 Userguide](https://github.com/awslabs/aws-crt-nodejs/blob/main/MQTT5-UserGuide.md). This guide will provide more details on MQTT5 operations, lifecycle events, connection methods, and other useful information.