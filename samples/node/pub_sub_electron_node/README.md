# Node: MQTT5 PubSub Electron

[**Return to main sample list**](../../README.md)

This sample uses the
[Message Broker](https://docs.aws.amazon.com/iot/latest/developerguide/iot-message-broker.html)
for AWS IoT to send and receive messages through an MQTT connection using MQTT5.

MQTT5 introduces additional features and enhancements that improve the development experience with MQTT. You can read more about MQTT5 in the Java V2 SDK by checking out the [MQTT5 user guide](https://github.com/awslabs/aws-crt-nodejs/blob/main/MQTT5-UserGuide.md).

Note: MQTT5 support is currently in **developer preview**. We encourage feedback at all times, but feedback during the preview window is especially valuable in shaping the final product. During the preview period we may make backwards-incompatible changes to the public API, but in general, this is something we will try our best to avoid.

## Requirements

The sample is built with typescript@5^ and Electron@19. Please note the SDK currently does not support Electron20+.
Node14 is recommended to run the sample.


## IoT Core Policy
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
        "arn:aws:iot:<b>region</b>:<b>account</b>:topic/test/topic/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "iot:Subscribe"
      ],
      "Resource": [
        "arn:aws:iot:<b>region</b>:<b>account</b>:topicfilter/test/topic/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "iot:Connect"
      ],
      "Resource": [
        "arn:aws:iot:<b>region</b>:<b>account</b>:client/*"
      ]
    }
  ]
}
</pre>

Replace with the following with the data from your AWS account:
* `<region>`: The AWS IoT Core region where you created your AWS IoT Core thing you wish to use with this sample. For example `us-east-1`.
* `<account>`: Your AWS IoT Core account ID. This is the set of numbers in the top right next to your AWS account name when using the AWS IoT Core website.

Note that in a real application, you may want to avoid the use of wildcards in your ClientID or use them selectively. Please follow best practices when working with AWS on production applications using the SDK. Also, for the purposes of this sample, please make sure your policy allows a client ID of `test-*` to connect or use `--client_id <client ID here>` to send the client ID your policy supports.

</details>

## How to run

### Direct MQTT via mTLS

To Run this sample using a direct MQTT5 connection with a key and certificate, go to the `node/pub_sub_electron_node` folder.
1. Setup your credential. You need to fill in the credentials in the `node/pub_sub_electron_node/settings.ts` with your AWS endpoint, certificate file path, private key file path.

2. Install node packages
``` sh
npm install
```

3. Build and Run
```sh
npm run build
npm run start
```

### Websockets

To Run this sample using Websockets, go to the `node/pub_sub_electron_node` folder.
1. Setup your credential. You will need to set your AWS credentials in your environment variables or local files. See the [authorizing direct AWS](https://docs.aws.amazon.com/iot/latest/developerguide/authorizing-direct-aws.html) page for documentation on how to get the AWS credentials, which then you can set to the `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AWS_SESSION_TOKEN` environment variables.

2. Setup `settings.ts`. You will need setup the `region` and `endpoint` in `settings.ts` to setup the e

3. Install node packages
```sh
npm install
```

4. Build and Run
```sh
npm run build
npm run start
```

## Electron Q&A
### Warning: `objc[79765]: Class WebSwapCGLLayer is implemented in both ` ?

This is an issue running Electron on MacOS. The API has a name duplication for "WebSwapCGLLayer". The warning should not affect your development. The issue is fixed by Electron in v22. Unfortunately, our SDK currently only supports Electron@19 and below.

More info: https://github.com/electron/electron/issues/33685

### How to debug with Dev Tools
You can open dev tool using the following API:
```
  win.webContents.openDevTools()
```

### SyntaxError: Unexpected token '?'
Please check your dependency and Node version. If the error is not from your code, it is most likely your dependency is using a different version of node. As the nullish coalescing operator (??) is introduced in Node14, using Node14+ would help.

### N-API call failed: napi_create_external_arraybuffer( env, data_buffer->buffer, data_buffer->len, s_finalize_external_binary_byte_buf, data_buffer, &napi_binary).
Electron removed support for `napi_create_external_arraybuffer` since Electron@20. You can find more information from the Electron community here: https://github.com/electron/electron/issues/35801. There is no solid solution for the issue right now. Our team is actively working on resolving it.

### Why does the SDK not support Electron@20+
Same as the above question.
