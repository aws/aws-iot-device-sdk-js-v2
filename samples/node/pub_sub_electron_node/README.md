# Node: MQTT5 PubSub Electron

[**Return to main sample list**](../../README.md)

# NOTE: The sample is affected by Electron vulnerability: https://debricked.com/vulnerability-database/vulnerability/CVE-2023-5217. Electron support would be updated in future versions.


This sample uses the
[Message Broker](https://docs.aws.amazon.com/iot/latest/developerguide/iot-message-broker.html)
for AWS IoT to send and receive messages through an MQTT connection using MQTT5.

MQTT5 introduces additional features and enhancements that improve the development experience with MQTT. You can read more about MQTT5 in the Java V2 SDK by checking out the [MQTT5 user guide](https://github.com/awslabs/aws-crt-nodejs/blob/main/MQTT5-UserGuide.md).

## Requirements

The sample is built with typescript@5^. Node14+ would be minimal Node version to run the sample.

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

Note that in a real application, you may want to avoid the use of wildcards in your ClientID or use them selectively. Please follow best practices when working with AWS on production applications using the SDK.

</details>

## How to run
### Direct MQTT via mTLS

To Run this sample using a direct MQTT5 connection with a key and certificate, go to the `node/pub_sub_electron_node` folder.
1. Setup your credential. You need to fill in the credentials in the `node/pub_sub_electron_node/settings.ts` with your AWS endpoint, certificate file path, private key file path.

2. Install node packages
``` sh
npm install .
```

3. Start Sample
```sh
npm run start
```

### MQTT5 over Websockets with TLS

To Run this sample using Websockets, go to the `node/pub_sub_electron_node` folder.
1. Setup your AWS credentials in your environment variables or local files. See the [authorizing direct AWS](https://docs.aws.amazon.com/iot/latest/developerguide/authorizing-direct-aws.html) page for documentation on how to get the AWS credentials, which then you can set to the `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AWS_SESSION_TOKEN` environment variables.

2. Setup `node/pub_sub_electron_node/settings.ts`. You will need setup the `region` and `endpoint` in the setting file.

3. Install node packages
```sh
npm install .
```

4. Build and Run
```sh
npm run start
```

## Package
Please refer to (Electron-tutorial-packaging)[https://www.electronjs.org/docs/latest/tutorial/tutorial-packaging] for packaging details.
As our sample is using typescript, you will need include the compiled js files while packaging. You can config the `package.json` or `forge.config.js` to set the output folder for the compiled files.
Example `package.json`:
```js
"build": {
    "files": [
      "dist/*"
    ]
  }
```


## Electron FAQ
### Warning: `objc[79765]: Class WebSwapCGLLayer is implemented in both ... `
This is an issue when running Electron on MacOS. The API has a name duplication for "WebSwapCGLLayer". This warning should not affect your development and has been fixed in Electron v22

More info: https://github.com/electron/electron/issues/33685

### SyntaxError: Unexpected token '?'
Please check your dependency and Node version. If the error is not from your code, it is most likely your dependency is using a different version of node. As the nullish coalescing operator (??) is introduced in Node14, using Node14+ would help.

### N-API call failed: napi_create_external_arraybuffer( env, data_buffer->buffer, data_buffer->len, s_finalize_external_binary_byte_buf, data_buffer, &napi_binary).
This issue has been fixed in aws-iot-device-sdk-js-v2 v1.19.1.
Electron removed support for `napi_create_external_arraybuffer` in Electron v20. You can find more information from the Electron community here: https://github.com/electron/electron/issues/35801.

### Electron Packager Instructions "Error: An unhandled rejection has occurred inside Forge: Error: ENAMETOOLONG: name too long, scandir" with recursive path copy
The Electron Forge has an issue when copying files with a relative library path. We could avoid it by removing the local path for the dependency.
As an example:
```
"dependencies": {
        "aws-iot-device-sdk-v2": "file:../../..",
}
```
change it to:
```
"dependencies": {
        "aws-iot-device-sdk-v2": "^1.19.1",
}
```
As a workaround, if you would like to package the sample with your local library, you can manually use electron-packager with `--ignore=electron-packager` to work around (Reference:https://github.com/electron/electron-packager/issues/396)


### Uncaught Error: A dynamic link library (DLL) initialization routine failed. \\?\<library path>
*If you are on windows*

The issue should be fixed in release v1.19.1.
The library `aws-iot-device-sdk-v2` depends on the native modules `aws-crt`. In Electron 4.x and higher, the symbols needed by native modules are exported by electron.exe instead of node.dll or node.exe. In order to load native modules on Windows, the library need to install a delay-load hook that triggers when the native module is loaded to redirect the reference to use the loading executable (electron.exe in this case). A windows delay load is required for the library.

*If you still see this error after v1.19.1*
The issue usually indicates you are using a library distribution different from your development environment. When you run npm install, the node modules will pull the build files unique to your operating system, your architectures and the Node version. This usually happens when npm failed to pull the library with your development environment. Inspect the library distribution and make sure you are using the correct binary build.
Try
1. delete `node_modules` and `package-lock.json`
2. Make sure you are using the same node api version as the library distribution used.
3. Run `npm install` to reinstall the dependencies.

### Error "GPU process launch failed: error_code=18"
Electron bug: https://github.com/electron/electron/issues/32074
There is no valid workaround for now, could be disabled by `--no-sandbox`, while it might not be an option in prod.

### How to debug with Dev Tools
You can open dev tool using the following API:
```
  win.webContents.openDevTools()
```
