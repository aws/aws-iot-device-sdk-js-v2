/*
 *
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */

/**
 * Service clients and data models for interacting with AWS Iot services:
 * - Greengrass Discovery
 * - Identity
 * - Jobs
 * - Shadow
 *
 * @packageDocumentation
 */

import './suppress_crt_node_warning';
import * as eventstream_rpc from './eventstream_rpc';
import * as greengrass from './greengrass/discoveryclient';
import * as greengrasscoreipc from './greengrasscoreipc';
import * as iotidentity from './iotidentity/iotidentity';
import * as iotjobs from './iotjobs/iotjobs';
import * as iotshadow from './iotshadow/iotshadow';
import * as mqtt_request_response from './mqtt_request_response';

import {
    auth,
    http,
    io,
    iot,
    mqtt,
    mqtt5,
    CrtError,
    ICrtError
} from 'aws-crt';

// Register this SDK's identity factory with the CRT layer so that newly built
// MQTT5/MQTT3 client configs include IoTSDKVersion + IoTSDKMetricsVersion in
// the CONNECT packet's username field.
import { _setSdkMetricsFactory } from 'aws-crt/dist/native/aws_iot_metrics';
import { build_sdk_metrics } from './iot_sdk_metrics';
_setSdkMetricsFactory(build_sdk_metrics);

export {
    auth,
    eventstream_rpc,
    greengrass,
    greengrasscoreipc,
    http,
    io,
    iot,
    iotidentity,
    iotjobs,
    iotshadow,
    mqtt,
    mqtt5,
    mqtt_request_response,
    CrtError,
    ICrtError
}

/**
 * Emit runtime deprecation warning when running on a Node.js version
 * that iot-sdk-js-v2 will stop supporting (Node.js < 22).
 */
(function warnUnsupportedNodeVersion () {
    if(typeof process !== 'object' ||
       typeof process.versions !== 'object' ||
       typeof process.versions.node === 'undefined' ||
       typeof process.emitWarning !== 'function'){
        return;
    }
    const nodeVersion = process.versions.node
    const parsedNodeVersion = parseInt(nodeVersion.split('.')[0],10);
    if(Number.isNaN(parsedNodeVersion) || parsedNodeVersion >= 22){
        return;
    }
    process.emitWarning(
        `\n\nStarting from January 2027, the AWS IoT Device SDK for JavaScript v2 (IoT SDK JS V2) will require Node.js 22.x or later.\n` +
        `Support for Node.js 14.x, 16.x, 18.x and 20.x will be dropped.\n\n` +
        `You are currently on Node.js v${nodeVersion}.\n\n`+
        `To continue receiving updates for AWS IoT Device SDK for JavaScript v2, bug fixes, and security updates, `+
        `please upgrade to a supported version of Node.js (ideally the latest LTS).\n\n`+
        `More information: https://github.com/aws/aws-iot-device-sdk-js-v2`,
        'NodeDeprecationWarning'
    );
})();
