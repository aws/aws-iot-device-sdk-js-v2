# Development Guide

This document provides instructions for building and developing with the AWS IoT Device SDK for JavaScript v2.

## Building from source

```bash
# Create a workspace directory to hold all the SDK files
mkdir sdk-workspace
cd sdk-workspace

# Clone the repository
git clone https://github.com/aws/aws-iot-device-sdk-js-v2.git
cd aws-iot-device-sdk-js-v2

# Install dependencies
npm install
```

The SDK version will be `1.0.0-dev`, so just specify this version in your application config. Alternatively, you can change the version in the [package.json](../package.json#L3) file.
