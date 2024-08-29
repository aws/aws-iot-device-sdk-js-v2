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

import * as iotidentity from './iotidentity/iotidentity';
import * as greengrass from './greengrass/discoveryclient';
import * as iotjobs from './iotjobs/iotjobs';
import * as iotshadow from './iotshadow/iotshadow';
import * as eventstream_rpc from './eventstream_rpc';
import * as greengrasscoreipc from './greengrasscoreipc';
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
