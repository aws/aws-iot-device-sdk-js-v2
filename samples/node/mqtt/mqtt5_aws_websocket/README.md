# MQTT5 AWS Websocket PubSub

[**Return to main sample list**](../../README.md)
*__Jump To:__*
* [Introduction](#introduction)
* [Requirements](#requirements)
* [How To Run](#how-to-run)
* [Additional Information](#additional-information)

## Introduction
This sample uses the
[Message Broker](https://docs.aws.amazon.com/iot/latest/developerguide/iot-message-broker.html)
for AWS IoT to send and receive messages through an MQTT connection using MQTT5 over websockets with AWS SigV4 authentication.

You can read more about MQTT5 for the JavaScript IoT Device SDK V2 in the [MQTT5 user guide](https://github.com/awslabs/aws-crt-nodejs/blob/main/MQTT5-UserGuide.md).

## Requirements

This sample assumes you have AWS credentials configured (via AWS CLI, environment variables, or IAM role). The credentials must have permissions to connect to AWS IoT Core.

Your AWS credentials must have the following IAM permissions:
* `iot:Connect` - to connect to AWS IoT Core
* `iot:Publish` - to publish messages to topics
* `iot:Subscribe` - to subscribe to topic filters
* `iot:Receive` - to receive messages from subscribed topics

<details>
<summary>(see sample IAM policy)</summary>
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
* `<region>`: The AWS IoT Core region where you want to connect. For example `us-east-1`.
* `<account>`: Your AWS account ID.

</details>

## How to run

To Run this sample from the `samples/node/mqtt/aws_websocket` folder, use the following command:

```sh
node index.js \
  --endpoint <AWS IoT endpoint> \
  --signing_region <AWS region>
```
If you would like to see what optional arguments are available, use the `--help` argument:
``` sh
node index.js --help
```

will result in the following output:
```
Options:
  --endpoint, -e       IoT endpoint hostname                   [string] [required]
  --signing_region, -r Signing region for websocket connection [string] [required]
  --client_id, -C      Client ID              [string] [default: "mqtt5-sample-<uuid>"]
  --topic, -t          Topic                      [string] [default: "test/topic"]
  --message, -m        Message payload [string] [default: "Hello from mqtt5 sample"]
  --count, -n          Messages to publish (0 = infinite)      [number] [default: 5]
  --help               Show help                                           [boolean]
```

The sample will not run without the required arguments and will notify you of missing arguments.

## Additional Information
Additional help with the MQTT5 Client can be found in the [MQTT5 Userguide](https://github.com/awslabs/aws-crt-nodejs/blob/main/MQTT5-UserGuide.md). This guide will provide more details on MQTT5 operations, lifecycle events, connection methods, and other useful information.