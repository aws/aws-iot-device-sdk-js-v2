# AWS IoT Device SDK for JavaScript v2

This document provides information about the AWS IoT device SDK for Javascript V2. This SDK is built on the [AWS Common Runtime](https://docs.aws.amazon.com/sdkref/latest/guide/common-runtime.html)

*__Jump To:__*
* [Installation](#installation)
* [Samples](https://github.com/aws/aws-iot-device-sdk-js-v2/tree/main/samples)
* [Getting Help](#getting-help)
* [FAQ](https://github.com/aws/aws-iot-device-sdk-js-v2/blob/main/documents/FAQ.md)
* [API Docs](https://aws.github.io/aws-iot-device-sdk-js-v2/)
* [MQTT5 User Guide](https://github.com/awslabs/aws-crt-nodejs/blob/main/MQTT5-UserGuide.md)
* [Migration Guide from the AWS IoT SDK for JavaScript v1](./documents/MIGRATION_GUIDE.md)

## Installation

### Minimum Requirements

For use with Node, the following are required:
* Node v14+
  * Run `node -v` to check Node version.
* CMake 3.1+

[Step-by-step instructions](https://github.com/aws/aws-iot-device-sdk-js-v2/blob/main/documents/PREREQUISITES.md)

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

## Samples

[Samples README](https://github.com/aws/aws-iot-device-sdk-js-v2/blob/main/samples/README.md)

## Getting Help

The best way to interact with our team is through GitHub. You can open a [discussion](https://github.com/aws/aws-iot-device-sdk-js-v2/discussions) for guidance questions or an [issue](https://github.com/aws/aws-iot-device-sdk-js-v2/issues/new/choose) for bug reports, or feature requests. You may also find help on community resources such as [StackOverFlow](https://stackoverflow.com/questions/tagged/aws-iot) with the tag [#aws-iot](https://stackoverflow.com/questions/tagged/aws-iot) or if you have a support plan with [AWS Support](https://aws.amazon.com/premiumsupport/), you can also create a new support case.

Please make sure to check out our resources too before opening an issue:

*  [FAQ](https://github.com/aws/aws-iot-device-sdk-js-v2/blob/main/documents/FAQ.md)
* [API Docs](https://aws.github.io/aws-iot-device-sdk-js-v2/)
* [IoT Guide](https://docs.aws.amazon.com/iot/latest/developerguide/what-is-aws-iot.html) ([source](https://github.com/awsdocs/aws-iot-docs))
* [MQTT5 User Guide](https://github.com/awslabs/aws-crt-nodejs/blob/main/MQTT5-UserGuide.md)
* Check for similar [Issues](https://github.com/aws/aws-iot-device-sdk-js-v2/issues)
* [AWS IoT Core Documentation](https://docs.aws.amazon.com/iot/)
* [Dev Blog](https://aws.amazon.com/blogs/?awsf.blog-master-iot=category-internet-of-things%23amazon-freertos%7Ccategory-internet-of-things%23aws-greengrass%7Ccategory-internet-of-things%23aws-iot-analytics%7Ccategory-internet-of-things%23aws-iot-button%7Ccategory-internet-of-things%23aws-iot-device-defender%7Ccategory-internet-of-things%23aws-iot-device-management%7Ccategory-internet-of-things%23aws-iot-platform)
* Integration with AWS IoT Services such as
[Device Shadow](https://docs.aws.amazon.com/iot/latest/developerguide/iot-device-shadows.html)
and [Jobs](https://docs.aws.amazon.com/iot/latest/developerguide/iot-jobs.html)
is provided by code that been generated from a model of the service.
* [Contributions Guidelines](https://github.com/aws/aws-iot-device-sdk-js-v2/blob/main/documents/CONTRIBUTING.md)

## License

This library is licensed under the [Apache 2.0 License](https://github.com/aws/aws-iot-device-sdk-js-v2/blob/main/documents/LICENSE).

Latest released version: v1.21.1
