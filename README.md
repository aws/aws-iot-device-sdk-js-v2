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
* [Mac-Only TLS Behavior](#Mac-Only-TLS-Behavior)
* [Samples](samples)
* [Getting Help](#Getting-Help)
* [Giving Feedback and Contributions](#Giving-Feedback-and-Contributions)

## Installation
### Check for minimum Requirements
*   The AWS IoT Device SDK for JavaScript requires Node v10.0 or later.
```
node -v
```

### Install the required libraries using apt
```
sudo apt-get install cmake
sudo apt-get install libssl-dev
```

### Install the required libraries using yum
```
sudo yum install cmake
sudo yum install openssl-devel
```

### Install the AWS Common Runtime
```
npm install aws-crt
```

### Install the AWS IoT Device SDK
```
npm install aws-iot-device-sdk-v2
```

### Build from source
```
npm install
```

## Mac-Only TLS Behavior

Please note that on Mac, once a private key is used with a certificate, that certificate-key pair is imported into the Mac Keychain.  All subsequent uses of that certificate will use the stored private key and ignore anything passed in programmatically.  Beginning in v1.2.4, when a stored private key from the Keychain is used, the following will be logged at the "info" log level:

```
static: certificate has an existing certificate-key pair that was previously imported into the Keychain.  Using key from Keychain instead of the one provided.
```

## Samples

[Samples README](samples)

## Getting Help

The best way to interact with our team is through GitHub. You can [open an issue](https://github.com/aws/aws-iot-device-sdk-js-v2/issues) and choose from one of our templates for guidance, bug reports, or feature requests. You may also find help on community resources such as [StackOverFlow](https://stackoverflow.com/questions/tagged/aws-iot) with the tag #aws-iot or If you have a support plan with [AWS Support](https://aws.amazon.com/premiumsupport/), you can also create a new support case.

Please make sure to check out our resources too before opening an issue:

*   [API Documentation](https://aws.github.io/aws-iot-device-sdk-js-v2/globals.html)
*   Our [Developer Guide](https://docs.aws.amazon.com/iot/latest/developerguide/what-is-aws-iot.html) ([source](https://github.com/awsdocs/aws-iot-docs))
*   Check for similar [Issues](https://github.com/aws/aws-iot-device-sdk-js-v2/issues)
*   [AWS IoT Core Documentation](https://docs.aws.amazon.com/iot/)
*   [Dev Blog](https://aws.amazon.com/blogs/?awsf.blog-master-iot=category-internet-of-things%23amazon-freertos%7Ccategory-internet-of-things%23aws-greengrass%7Ccategory-internet-of-things%23aws-iot-analytics%7Ccategory-internet-of-things%23aws-iot-button%7Ccategory-internet-of-things%23aws-iot-device-defender%7Ccategory-internet-of-things%23aws-iot-device-management%7Ccategory-internet-of-things%23aws-iot-platform)
* Integration with AWS IoT Services such as
[Device Shadow](https://docs.aws.amazon.com/iot/latest/developerguide/iot-device-shadows.html)
and [Jobs](https://docs.aws.amazon.com/iot/latest/developerguide/iot-jobs.html)
is provided by code that been generated from a model of the service.

## Giving Feedback and Contributions

We need your help in making this SDK great. Please participate in the community and contribute to this effort by submitting issues, participating in discussion forums and submitting pull requests through the following channels.

*   [Contributions Guidelines](CONTRIBUTING.md)
*   Articulate your feature request or upvote existing ones on our [Issues](https://github.com/aws/aws-iot-device-sdk-js-v2/issues?q=is%3Aissue+is%3Aopen+label%3Afeature-request) page.
*   Submit [Issues](https://github.com/aws/aws-iot-device-sdk-js-v2/issues)

## License

This library is licensed under the Apache 2.0 License.
