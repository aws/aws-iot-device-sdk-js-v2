# MQTT5 Custom Auth Signed PubSub

[**Return to main sample list**](../../README.md)

*__Jump To:__*
* [Introduction](#introduction)
* [Requirements](#requirements)
* [How To Run](#how-to-run)
* [Additional Information](#additional-information)

## Introduction

You will need to setup your Custom Authorizer so the Lambda function returns a policy document. See [this page on the documentation](https://docs.aws.amazon.com/iot/latest/developerguide/config-custom-auth.html) for more details and example return result. You can customize this lambda function as needed for your application to provide your own security measures based on the needs of your application.

The policy [Policy](https://docs.aws.amazon.com/iot/latest/developerguide/iot-policies.html) provided by your Custom Authorizer Lambda must provide iot connect, subscribe, publish, and receive privileges for this sample to run successfully.

Below is a sample policy that provides the necessary privileges.

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

Your custom authorizer must be configured to accept token-based authentication with signature validation.

## How to run

To Run this sample from the `samples/node/mqtt/mqtt5_custom_auth_signed` folder, use the following command:

```sh
npm install
node dist/index.js \
  --endpoint <AWS IoT endpoint> \
  --authorizer_name <custom authorizer name> \
  --auth_signature <signature> \
  --auth_token_key_name <token key name> \
  --auth_token_key_value <token key value>
```
If you would like to see what optional arguments are available, use the `--help` argument:
``` sh
node dist/index.js --help
```

will result in the following output:
```
Options:
      --version               Show version number                      [boolean]
  -e, --endpoint              IoT endpoint hostname          [string] [required]
  -a, --authorizer_name       The name of the custom authorizer to connect to
                              invoke                         [string] [required]
  -s, --auth_signature        Custom authorizer signature    [string] [required]
  -k, --auth_token_key_name   Authorizer token key name      [string] [required]
  -v, --auth_token_key_value  Authorizer token key value     [string] [required]
  -u, --auth_username         The name to send when connecting through the
                              custom authorizer (optional)              [string]
  -p, --auth_password         The password to send when connecting through a
                              custom authorizer (optional)              [string]
  -C, --client_id             Client ID
                                     [string] [default: "mqtt5-sample-0460e726"]
  -t, --topic                 Topic             [string] [default: "test/topic"]
  -m, --message               Message payload
                                   [string] [default: "Hello from mqtt5 sample"]
  -n, --count                 Messages to publish (0 = infinite)
                                                           [number] [default: 5]
      --help                  Show help                                [boolean]
```

The sample will not run without the required arguments and will notify you of missing arguments.

## Additional Information
Additional help with the MQTT5 Client can be found in the [MQTT5 Userguide](https://github.com/awslabs/aws-crt-nodejs/blob/main/MQTT5-UserGuide.md). This guide will provide more details on MQTT5 operations, lifecycle events, connection methods, and other useful information.

## ⚠️ Usage disclaimer

These code examples interact with services that may incur charges to your AWS account. For more information, see [AWS Pricing](https://aws.amazon.com/pricing/).

Additionally, example code might theoretically modify or delete existing AWS resources. As a matter of due diligence, do the following:

- Be aware of the resources that these examples create or delete.
- Be aware of the costs that might be charged to your account as a result.
- Back up your important data.