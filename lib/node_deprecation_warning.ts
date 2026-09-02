/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */

/**
 * Emits a one-time warning when the AWS IoT Device SDK v2 for JavaScript runs
 * on a Node.js version that will be unsupported starting January 2027.
 *
 * The warning is emitted at most once per process, the first time an SDK client
 * is created. Suppress it in any of these ways:
 * @example
 * // Preferred: mutate the shared, exported controller before creating a client.
 * require('aws-iot-device-sdk-v2').node_deprecation_warning.suppress = true;
 * @example
 * globalThis.AWS_IOT_DEVICE_SDK_JS_V2_SUPPRESS_NODE_DEPRECATION_WARNING = true;
 * @example
 * // AWS_IOT_DEVICE_SDK_JS_V2_SUPPRESS_NODE_DEPRECATION_WARNING=1 node app.js
 *
 * @packageDocumentation
 * @module aws-iot-device-sdk
 */

/** Minimum Node.js major version the SDK will continue to support. */
const MINIMUM_SUPPORTED_NODE_MAJOR_VERSION = 22;

/** Flag name shared by the global and environment-variable opt-outs. */
const SUPPRESS_FLAG = 'AWS_IOT_DEVICE_SDK_JS_V2_SUPPRESS_NODE_DEPRECATION_WARNING';

// Ensures the warning is emitted at most once per process.
let hasWarned = false;

// True if running under Node.js (as opposed to a browser bundle).
function isNodeJs(): boolean {
    return typeof process === 'object' &&
        typeof process.versions === 'object' &&
        typeof process.versions.node !== 'undefined';
}

// True if suppressed via the global flag or env var (any non-empty value
// other than "0"/"false" counts).
function isSuppressedExternally(): boolean {
    if ((globalThis as any)[SUPPRESS_FLAG]) {
        return true;
    }
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

/** @internal */
interface NodeDeprecationWarningController {
    /** Set to `true` to suppress the warning in-process. Defaults to `false`. */
    suppress: boolean;

    /** Emits the warning once per process unless suppressed. Called internally. */
    emitWarning(): void;
}

/**
 * Shared controller for the SDK's Node.js end-of-life deprecation warning.
 * Consumers can set `suppress = true` to opt out.
 */
export const node_deprecation_warning: NodeDeprecationWarningController = {
    suppress: false,

    emitWarning(): void {
        if (node_deprecation_warning.suppress || isSuppressedExternally()) {
            return;
        }
        if (!isNodeJs() || typeof process.emitWarning !== 'function') {
            return;
        }
        if (hasWarned || !isUnsupportedNodeVersion()) {
            return;
        }

        hasWarned = true;

        const nodeVersion = process.versions.node;
        process.emitWarning(
            `\n\nStarting in January 2027, the AWS IoT Device SDK v2 for JavaScript will require Node.js 22.x or later.\n` +
            `Support for Node.js 14.x, 16.x, 18.x and 20.x will be dropped.\n\n` +
            `You are currently on Node.js v${nodeVersion}.\n\n` +
            `To continue receiving updates for the AWS IoT Device SDK v2 for JavaScript, bug fixes, and security updates, ` +
            `please upgrade to a supported version of Node.js (ideally the latest LTS).\n\n` +
            `More information: https://github.com/aws/aws-iot-device-sdk-js-v2`,
            'NodeDeprecationWarning'
        );
    },
};
