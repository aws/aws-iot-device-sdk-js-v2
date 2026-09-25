/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */

/**
 * Emits a one-time warning when the AWS IoT Device SDK v2 for JavaScript runs
 * on a Node.js version that will be unsupported starting January 2027.
 * @example
 * AWS_IOT_DEVICE_SDK_JS_V2_SUPPRESS_NODE_DEPRECATION_WARNING=1 node app.js
 * @example
 * process.env.AWS_IOT_DEVICE_SDK_JS_V2_SUPPRESS_NODE_DEPRECATION_WARNING='true'
 * @internal
 */

/** Minimum Node.js major version the SDK will continue to support. */
const MINIMUM_SUPPORTED_NODE_MAJOR_VERSION = 22;

/** Environment variable name for the suppression opt-out. */
const SUPPRESS_FLAG = 'AWS_IOT_DEVICE_SDK_JS_V2_SUPPRESS_NODE_DEPRECATION_WARNING';

// Ensures the warning is emitted at most once per process.
let hasWarned = false;

// True if suppressed via the environment variable (any non-empty value
// other than "0"/"false" counts).
function isSuppressedExternally(): boolean {
    const envValue = process.env[SUPPRESS_FLAG];
    if (envValue === undefined || envValue === '') {
        return false;
    }
    return envValue !== '0' && envValue.toLowerCase() !== 'false';
}

// True if the current Node.js major version is below the supported minimum.
// Unparseable versions are treated as supported.
function isUnsupportedNodeVersion(): boolean {
    const majorVersion = parseInt(process.versions.node.split('.')[0], 10);
    return !Number.isNaN(majorVersion) && majorVersion < MINIMUM_SUPPORTED_NODE_MAJOR_VERSION;
}

/**
 * Emits the SDK's Node.js deprecation warning once per process unless
 * suppressed. Called internally at import time.
 * @internal
 */
export function emitNodeDeprecationWarning(): void {
    if (hasWarned) {
        return;
    }
    hasWarned = true;

    if (isSuppressedExternally() || !isUnsupportedNodeVersion()) {
        return;
    }

    const nodeVersion = process.versions.node;
    process.emitWarning(
        `\n\nStarting in January 2027, the AWS IoT Device SDK v2 for JavaScript will require Node.js ${MINIMUM_SUPPORTED_NODE_MAJOR_VERSION}.x or later.\n` +
        `Support for Node.js 14.x, 16.x, 18.x, and 20.x will be dropped.\n\n` +
        `You are currently on Node.js v${nodeVersion}.\n\n` +
        `To continue receiving updates for the AWS IoT Device SDK v2 for JavaScript, bug fixes, and security updates, ` +
        `please upgrade to a supported version of Node.js (ideally the latest LTS).\n\n` +
        `More information: https://github.com/aws/aws-iot-device-sdk-js-v2`,
        'NodeDeprecationWarning'
    );
}
