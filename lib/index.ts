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
