# MQTT5 X509 PubSub - TypeScript

[**Return to main sample list**](../../README.md)

*__Jump To:__*
* [Introduction](#introduction)
* [Requirements](#requirements)
* [How To Run](#how-to-run)
* [Additional Information](#additional-information)

## Introduction
This sample uses the
[Message Broker](https://docs.aws.amazon.com/iot/latest/developerguide/iot-message-broker.html)
for AWS IoT to send and receive messages through an MQTT connection using MQTT5.

This is the **TypeScript version** of the JavaScript sample found in `samples/node/mqtt/mqtt5_x509`.

You can read more about MQTT5 for the JavaScript IoT Device SDK V2 in the [MQTT5 user guide](https://github.com/awslabs/aws-crt-nodejs/blob/main/MQTT5-UserGuide.md).

## Requirements

This sample assumes you have the required AWS IoT resources available. Information about AWS IoT can be found [HERE](https://docs.aws.amazon.com/iot/latest/developerguide/what-is-aws-iot.html) and instructions on creating AWS IoT resources (AWS IoT Policy, Device Certificate, Private Key) can be found [HERE](https://docs.aws.amazon.com/iot/latest/developerguide/create-iot-resources.html).

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

### Prerequisites
- Node.js v14+
- TypeScript (installed as dev dependency)

### Installation and Running

To run this sample from the `samples/node/mqtt/mqtt5_x509_ts` folder:

1. Install dependencies:
```sh
npm install
```

2. Run using npm script (builds and runs):
```sh
npm start -- \
  --endpoint <AWS IoT endpoint> \
  --cert <Path to certificate file> \
  --key <Path to private key file>
```

3. Or build and run manually:
```sh
npm run build
node dist/index.js \
  --endpoint <AWS IoT endpoint> \
  --cert <Path to certificate file> \
  --key <Path to private key file>
```

4. For development with ts-node:
```sh
npm run dev -- \
  --endpoint <AWS IoT endpoint> \
  --cert <Path to certificate file> \
  --key <Path to private key file>
```

### Command Line Options

If you would like to see what optional arguments are available, use the `--help` argument:
```sh
npm start -- --help
```

This will show all available options including:
- `--endpoint` (required): IoT endpoint hostname
- `--cert` (required): Path to certificate file
- `--key` (required): Path to private key file
- `--client_id`: Client ID (default: auto-generated)
- `--topic`: Topic name (default: "test/topic")
- `--message`: Message payload (default: "Hello from mqtt5 sample")
- `--count`: Number of messages to publish (default: 5, 0 = infinite)

## TypeScript Features

This TypeScript version includes:
- **Type Safety**: Full TypeScript type annotations for better development experience
- **Interface Definitions**: Proper typing for command line arguments
- **Event Type Safety**: Typed event handlers for MQTT5 client events
- **Build Process**: Compilation to JavaScript with source maps
- **Development Mode**: Direct TypeScript execution with ts-node

## Additional Information
Additional help with the MQTT5 Client can be found in the [MQTT5 Userguide](https://github.com/awslabs/aws-crt-nodejs/blob/main/MQTT5-UserGuide.md). This guide will provide more details on MQTT5 operations, lifecycle events, connection methods, and other useful information.

## ⚠️ Usage disclaimer

These code examples interact with services that may incur charges to your AWS account. For more information, see [AWS Pricing](https://aws.amazon.com/pricing/).

Additionally, example code might theoretically modify or delete existing AWS resources. As a matter of due diligence, do the following:

- Be aware of the resources that these examples create or delete.
- Be aware of the costs that might be charged to your account as a result.
- Back up your important data.