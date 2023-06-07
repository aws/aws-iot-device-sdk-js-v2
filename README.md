# AWS IoT Device SDK for JavaScript v2
This document provides information about the AWS IoT device SDK for Javascript V2.

If you have any issues or feature requests, please file an issue or pull request.

This SDK is built on the AWS Common Runtime, a collection of libraries
([aws-c-common](https://github.com/awslabs/aws-c-common),
[aws-c-io](https://github.com/awslabs/aws-c-io),
[aws-c-mqtt](https://github.com/awslabs/aws-c-mqtt),
[aws-c-http](https://github.com/awslabs/aws-c-http),
[aws-c-cal](https://github.com/awslabs/aws-c-cal) ...) written in C to be
cross-platform, high-performance, secure, and reliable. The libraries are bound
to JS by the [awscrt](https://github.com/awslabs/aws-crt-nodejs) package.

*__Jump To:__*
* [Installation](#Installation)
* [Samples](samples)
* [Getting Help](#Getting-Help)
* [FAQ](./documents/FAQ.md)
* [Giving Feedback and Contributions](#Giving-Feedback-and-Contributions)
* [MQTT5 User Guide](https://github.com/awslabs/aws-crt-nodejs/blob/main/MQTT5-UserGuide.md)

## What's New

The SDK now supports Greengrass IPC.  See the [Greengrass IPC User Guide](https://github.com/aws/aws-iot-device-sdk-js-v2/blob/main/documents/GreengrassIPC.md)
or the [API Documentation](https://aws.github.io/aws-iot-device-sdk-js-v2/node/modules/greengrasscoreipc.html) for more information.

The SDK now supports MQTT5.  See the [MQTT5 User Guide](https://github.com/awslabs/aws-crt-nodejs/blob/main/MQTT5-UserGuide.md)
or the API Documentation for [NodeJS](https://awslabs.github.io/aws-crt-nodejs/node/modules/mqtt5.html) or
the [browser](https://awslabs.github.io/aws-crt-nodejs/browser/modules/mqtt5.html) for more information. There is also a [MQTT5 sample for NodeJS](https://github.com/aws/aws-iot-device-sdk-js-v2/blob/main/samples/node/pub_sub_mqtt5) and a [MQTT5 sample for the browser](https://github.com/aws/aws-iot-device-sdk-js-v2/blob/main/samples/browser/pub_sub_mqtt5).

## Installation

### Minimum Requirements

For use with Node, the following are required:
* Node v10.0+
  * Run `node -v` to check Node version.
* CMake 3.1+

[Step-by-step instructions](./documents/PREREQUISITES.md)

### Build SDK in existing project with NPM
``` sh
# Navigate to the Javascript project you want to add the
# Javascript V2 SDK to.
cd <your javascript project here>
# Install the V2 SDK.
npm install aws-iot-device-sdk-v2
# Now you can use the Javascript V2 SDK in your project.
```

### Build the V2 SDK from source

``` sh
# Create a workspace directory to hold all the SDK files.
mkdir sdk-workspace
cd sdk-workspace

# Clone the repository to access the samples.
git clone https://github.com/aws/aws-iot-device-sdk-js-v2.git

# Install the SDK.
cd aws-iot-device-sdk-js-v2
npm install

# Then you can run the samples following the instructions in the samples README.
```

### Build the V2 SDK and CRT from source

``` sh
# Create a workspace directory to hold all the SDK files.
mkdir sdk-workspace
cd sdk-workspace
# Clone the CRT repository.
#     (Use the latest version of the CRT here instead of "v1.12.4").
git clone --branch v1.12.4 --recurse-submodules https://github.com/awslabs/aws-crt-nodejs.git
# Ensure all submodules are properly updated.
cd aws-crt-nodejs
git submodule update --init --recursive
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
# Then you can run the samples following the instructions in the samples README.
```

## Samples

[Samples README](samples/README.md)

## Getting Help

The best way to interact with our team is through GitHub. You can [open an issue](https://github.com/aws/aws-iot-device-sdk-js-v2/issues) and choose from one of our templates for guidance, bug reports, or feature requests. You may also find help on community resources such as [StackOverFlow](https://stackoverflow.com/questions/tagged/aws-iot) with the tag #aws-iot or If you have a support plan with [AWS Support](https://aws.amazon.com/premiumsupport/), you can also create a new support case.

Please make sure to check out our resources too before opening an issue:

* Our [FAQ](./documents/FAQ.md)
* [API Documentation](https://aws.github.io/aws-iot-device-sdk-js-v2/)
* Our [Developer Guide](https://docs.aws.amazon.com/iot/latest/developerguide/what-is-aws-iot.html) ([source](https://github.com/awsdocs/aws-iot-docs))
* [MQTT5 User Guide](https://github.com/awslabs/aws-crt-nodejs/blob/main/MQTT5-UserGuide.md)
* Check for similar [Issues](https://github.com/aws/aws-iot-device-sdk-js-v2/issues)
* [AWS IoT Core Documentation](https://docs.aws.amazon.com/iot/)
* [Dev Blog](https://aws.amazon.com/blogs/?awsf.blog-master-iot=category-internet-of-things%23amazon-freertos%7Ccategory-internet-of-things%23aws-greengrass%7Ccategory-internet-of-things%23aws-iot-analytics%7Ccategory-internet-of-things%23aws-iot-button%7Ccategory-internet-of-things%23aws-iot-device-defender%7Ccategory-internet-of-things%23aws-iot-device-management%7Ccategory-internet-of-things%23aws-iot-platform)
* Integration with AWS IoT Services such as
[Device Shadow](https://docs.aws.amazon.com/iot/latest/developerguide/iot-device-shadows.html)
and [Jobs](https://docs.aws.amazon.com/iot/latest/developerguide/iot-jobs.html)
is provided by code that been generated from a model of the service.

## Giving Feedback and Contributions

We need your help in making this SDK great. Please participate in the community and contribute to this effort by submitting issues, participating in discussion forums and submitting pull requests through the following channels.

* [Contributions Guidelines](./documents/CONTRIBUTING.md)
* Articulate your feature request or upvote existing ones on our [Issues](https://github.com/aws/aws-iot-device-sdk-js-v2/issues?q=is%3Aissue+is%3Aopen+label%3Afeature-request) page.
* Create discussion questions [here](https://github.com/aws/aws-iot-device-sdk-js-v2/discussions)
* Find a bug open an [issue](https://github.com/aws/aws-iot-device-sdk-js-v2/issues)

## License

This library is licensed under the [Apache 2.0 License](./documents/LICENSE).

Latest released version: v1.13.1
