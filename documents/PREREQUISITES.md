# Prerequisites

## Overview

The AWS IoT Device SDK for JavaScript v2 requires Node.js v14+ to run. For most users, installing Node.js is all that's needed to get started with the SDK.

## Requirements

**Minimum Requirements:**
- Node.js v14+

**Installation:**
```bash
npm install aws-iot-device-sdk-v2
```

You can check your Node.js version with:
```bash
node -v
```

## Platform-Specific Installation

### Windows

Download the Node.js installer from the [official Node.js website](https://nodejs.org/en/download/). Download the installer for Windows and follow the prompts to install.

### macOS

**Using Homebrew** (recommended):
```bash
brew install node
```

**Manual Installation:**
Download the Node.js installer from the [official Node.js website](https://nodejs.org/en/download/). Download the installer for macOS and follow the prompts to install.

### Linux

**Using Package Managers:**
- **Ubuntu**: `sudo apt install nodejs npm`
- **Arch Linux**: `sudo pacman -S nodejs npm`
- **RHEL/CentOS/Fedora**: `sudo dnf install nodejs npm` or `sudo yum install nodejs npm`

**Manual Installation:**
Download the Node.js installer from the [official Node.js website](https://nodejs.org/en/download/). Download the installer for Linux and follow the prompts to install.

You can also install Node.js using package managers for many Linux distributions. See the [Node.js package manager guide](https://nodejs.org/en/download/package-manager/) for more options.

## Troubleshooting

**Common Issues:**
- **Node version too old**: Ensure you're using Node.js v14+ with `node -v`
- **npm not found**: Install npm alongside Node.js or update your Node.js installation
- **Permission errors**: On Linux/macOS, you may need to use `sudo` or configure npm to use a different directory

**Getting Help:**
- Check our [FAQ](./FAQ.md)
- Search [existing issues](https://github.com/aws/aws-iot-device-sdk-js-v2/issues)
- Create a [new issue](https://github.com/aws/aws-iot-device-sdk-js-v2/issues/new/choose)
