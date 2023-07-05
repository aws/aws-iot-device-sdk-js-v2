# Node: MQTT5 PubSub Electron

[**Return to main sample list**](../../README.md)

This sample uses the
[Message Broker](https://docs.aws.amazon.com/iot/latest/developerguide/iot-message-broker.html)
for AWS IoT to send and receive messages through an MQTT connection using MQTT5.

MQTT5 introduces additional features and enhancements that improve the development experience with MQTT. You can read more about MQTT5 in the Java V2 SDK by checking out the [MQTT5 user guide](https://github.com/awslabs/aws-crt-nodejs/blob/main/MQTT5-UserGuide.md).

Note: MQTT5 support is currently in **developer preview**. We encourage feedback at all times, but feedback during the preview window is especially valuable in shaping the final product. During the preview period we may make backwards-incompatible changes to the public API, but in general, this is something we will try our best to avoid.

## Requirements

The sample is built with typescript@5^ and Electron@19. Node14 would be minimal Node version to run the sample.


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

### Prerequisite: NODE_API_NO_EXTERNAL_BUFFERS_ALLOWED
If you are using Electron@19 and below, you can skip this part.

As introduction of V8 Memory Cage by Electron, the external buffer for N-API is no longer valid. You would need rebuild the aws-crt library from source to disable the external buffer by enable the CMake flag `NODE_API_NO_EXTERNAL_BUFFERS_ALLOWED`.

1. Build the CRT from source
```
# Create a workspace directory to hold all the SDK files.
mkdir sdk-workspace
cd sdk-workspace
# Clone the CRT repository.
git clone --branch [CRT_VERSION] --recurse-submodules https://github.com/awslabs/aws-crt-nodejs.git
# Ensure all submodules are properly updated.
cd aws-crt-nodejs
git submodule update --init --recursive
```
2. Uncomment cmake flag `NODE_API_NO_EXTERNAL_BUFFERS_ALLOWED` In `aws-crt-nodejs/CMakeLists.txt`
```
# Some runtimes other than Node.js (e.x.: Chromium and Electron ) have dropped support for external buffers.
# Uncomment the definition below to hide the functions that create external buffers.
add_definitions(-DNODE_API_NO_EXTERNAL_BUFFERS_ALLOWED)
```

3. Build the V2 SDK from source
```
cd ..
# Clone the SDK repository.
git clone --recursive https://github.com/aws/aws-iot-device-sdk-js-v2.git
# Ensure all submodules are properly updated.
cd aws-iot-device-sdk-js-v2
git submodule update --init --recursive
# Install the CRT.
npm install ../aws-crt-nodejs
# Install the SDK.
npm install
```
Then you can run the samples following the instruction


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
1. Setup your credential. You will need to set your AWS credentials in your environment variables or local files. See the [authorizing direct AWS](https://docs.aws.amazon.com/iot/latest/developerguide/authorizing-direct-aws.html) page for documentation on how to get the AWS credentials, which then you can set to the `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS`, and `AWS_SESSION_TOKEN` environment variables.

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

## Package
Please refer to (Electron-tutorial-packaging)[https://www.electronjs.org/docs/latest/tutorial/tutorial-packaging] for packaging details.
As our sample is using typescript, you would need include the compiled js files while packaging. You can config the `package.json` or `forge.config.js` to set it.
Example `package.json`:
```js
"build": {
    "files": [
      "dist/*"
    ]
  }
```


## Electron Q&A
### Warning: `objc[79765]: Class WebSwapCGLLayer is implemented in both ` ?

This is an issue running Electron on MacOS. The API has a name duplication for "WebSwapCGLLayer". The warning should not affect your development. The issue is fixed by Electron in v22.

More info: https://github.com/electron/electron/issues/33685

### SyntaxError: Unexpected token '?'
Please check your dependency and Node version. If the error is not from your code, it is most likely your dependency is using a different version of node. As the nullish coalescing operator (??) is introduced in Node14, using Node14+ would help.

### N-API call failed: napi_create_external_arraybuffer( env, data_buffer->buffer, data_buffer->len, s_finalize_external_binary_byte_buf, data_buffer, &napi_binary).
Electron removed support for `napi_create_external_arraybuffer` since Electron@20. You can find more information from the Electron community here: https://github.com/electron/electron/issues/35801.
You would need build the library from source to avoid the issue. Please check out [Prerequisite](#prerequisite:-node_api_no_external_buffers_allowed)

### Electron Packager Instructions "Error: An unhandled rejection has occurred inside Forge: Error: ENAMETOOLONG: name too long, scandir" with recursive path copy
With our investigation, the issue would happen if we set a local library dependency. As an example:
```
"dependencies": {
        "aws-iot-device-sdk-v2": "file:../../..",
}
```
The Electron Forge has an issue while copying files with a relative library path. We could avoid it by getting rid of the local path for the dependency. e.x.:
```
"dependencies": {
        "aws-iot-device-sdk-v2": "^1.13.1",
}
```
Meanwhile if you would like to package the sample with your local library, you can manually use electron-packager with `--ignore=electron-packager` to work around (Reference:https://github.com/electron/electron-packager/issues/396)


### Uncaught Error: A dynamic link library (DLL) initialization routine failed. \\?\<library path>
The issue usually indicates you are using a library distribution different from your development environment. When you run npm install, the node modules will pull the build files unique to your operating system, your architectures and the Node version. This usually happens when npm failed to pull the library with your development environment. You would like to checkout the library distribution and make sure you are using the correct binary build.
Try 1. delete `node_modules` and `package-lock.json`  2. Make sure you are using the same node api version as the library distribution used. 3. Run `npm install` to reinstall the dependencies.

### Error "GPU process launch failed: error_code=18"
Electron bug: https://github.com/electron/electron/issues/32074
There is no valid work around for now, could be disabled by `--no-sandbox`, while it might not be an option in prod.

### How to debug with Dev Tools
You can open dev tool using the following API:
```
  win.webContents.openDevTools()
```

