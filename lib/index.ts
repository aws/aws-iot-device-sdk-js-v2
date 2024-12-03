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

import * as iotidentity from './iotidentity/iotidentityclient';
import * as greengrass from './greengrass/discoveryclient';
import * as iotjobs from './iotjobs/iotjobsclient';
import * as iotshadow from './iotshadow/iotshadowclient';
import * as eventstream_rpc from './eventstream_rpc';
import * as greengrasscoreipc from './greengrasscoreipc';

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
    CrtError,
    ICrtError
}
