# AWS IoT Device SDK for JavaScript v2

The AWS IoT Device SDK for JavaScript v2 connects your JavaScript applications and devices to the AWS IoT platform. It handles the complexities of secure communication, authentication, and device management so you can focus on your IoT solution. The SDK makes it easy to use AWS IoT services like Device Shadows, Jobs, and Fleet Provisioning.

**Supported Platforms**: Linux, Windows 11+, macOS 14+

> **Note**: The SDK is known to work on older platform versions, but we only guarantee compatibility for the platforms listed above.

*__Topics:__*
* [Features](#features)
* [Installation](#installation)
  * [Minimum Requirements](#minimum-requirements)
  * [Installing from npm](#installing-from-npm)
* [Getting Started](#getting-started)
* [Samples](samples)
* [MQTT5 User Guide](https://github.com/awslabs/aws-crt-nodejs/blob/main/MQTT5-UserGuide.md)
* [Getting Help](#getting-help)
* [Resources](#resources)

## Features

The primary purpose of the AWS IoT Device SDK for JavaScript v2 is to simplify the process of connecting devices to AWS IoT Core and interacting with AWS IoT services on various platforms. The SDK provides:

* Integrated service clients for AWS IoT Core services
* Secure device connections to AWS IoT Core using MQTT protocol including MQTT 5.0
* Support for [multiple authentication methods and connection types](https://github.com/awslabs/aws-crt-nodejs/blob/main/MQTT5-UserGuide.md#how-to-create-an-mqtt5-client-based-on-desired-connection-method)

#### Supported AWS IoT Core services

* The [AWS IoT Device Shadow](https://docs.aws.amazon.com/iot/latest/developerguide/iot-device-shadows.html) service manages device state information in the cloud.
* The [AWS IoT Jobs](https://docs.aws.amazon.com/iot/latest/developerguide/iot-jobs.html) service sends remote operations to connected devices.
* The [AWS IoT fleet provisioning](https://docs.aws.amazon.com/iot/latest/developerguide/provision-wo-cert.html) service generates and delivers device certificates automatically.

## Installation

The recommended way to use the AWS IoT Device SDK for JavaScript v2 in your project is to install it from npm.

### Minimum Requirements

To develop applications with the AWS IoT Device SDK for JavaScript v2, you need:

* Node.js v14+
  * Run `node -v` to check Node version

See [detailed setup instructions](./documents/PREREQUISITES.md) for more information.

### Installing from npm

Navigate to your JavaScript project directory and install the SDK:

```bash
cd <your-javascript-project>
npm install aws-iot-device-sdk-v2
```

### Building from source

See the [Development Guide](./documents/DEVELOPING.md) for detailed instructions on building from source and using local builds.

## Getting Started

To get started with the AWS IoT Device SDK for JavaScript v2:

1. **Install the SDK** - See the [Installation](#installation) section for installation details

2. **Choose your connection method** - The SDK supports multiple authentication methods including X.509 certificates, AWS credentials, and custom authentication. [MQTT5 User Guide connection section](https://github.com/awslabs/aws-crt-nodejs/blob/main/MQTT5-UserGuide.md#connecting-to-aws-iot-core) provides more guidance

3. **Follow a complete example** - Check out the [samples](samples) directory

4. **Learn MQTT5 features** - For advanced usage and configuration options, see the [MQTT5 User Guide](https://github.com/awslabs/aws-crt-nodejs/blob/main/MQTT5-UserGuide.md)

The samples provide ready-to-run code with detailed setup instructions for each authentication method and use case.

## Samples

Check out the [samples](samples) directory for working code examples that demonstrate:
- [Basic MQTT connection and messaging](./samples/node/pub_sub_mqtt5)
- [AWS IoT Device Shadow operations](./samples/node/service_clients/shadow)
- [AWS IoT Jobs](./samples/node/service_clients/jobs)
- [AWS IoT Fleet provisioning](./samples/node/service_clients/fleet_provisioning)

The samples provide ready-to-run code with detailed setup instructions for each authentication method and use case.

## Getting Help

The best way to interact with our team is through GitHub.
* Open [discussion](https://github.com/aws/aws-iot-device-sdk-js-v2/discussions): Share ideas and solutions with the SDK community
* Search [issues](https://github.com/aws/aws-iot-device-sdk-js-v2/issues): Find created issues for answers based on a topic
* Create an [issue](https://github.com/aws/aws-iot-device-sdk-js-v2/issues/new/choose): New feature request or file a bug

If you have a support plan with [AWS Support](https://aws.amazon.com/premiumsupport/), you can also create a new support case.

## Resources

Check out our resources for additional guidance too before opening an issue:

* [FAQ](./documents/FAQ.md)
* [AWS IoT Core Developer Guide](https://docs.aws.amazon.com/iot/latest/developerguide/what-is-aws-iot.html)
* [MQTT5 User Guide](https://github.com/awslabs/aws-crt-nodejs/blob/main/MQTT5-UserGuide.md)
* [API Docs](https://aws.github.io/aws-iot-device-sdk-js-v2/)
* [AWS IoT Core Documentation](https://docs.aws.amazon.com/iot/)
* [Dev Blog](https://aws.amazon.com/blogs/iot/category/internet-of-things/)
* [Migration Guide from the AWS IoT SDK for JavaScript v1](./documents/MIGRATION_GUIDE.md)
* [Contributions Guidelines](./documents/CONTRIBUTING.md)

## License

This library is licensed under the [Apache 2.0 License](./documents/LICENSE).

Latest released version: v1.25.0
