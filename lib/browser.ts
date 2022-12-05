/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */

/**
 * Browser entry point for AWS IoT SDK.
 * @packageDocumentation
 * @module aws-iot-device-sdk
 * @mergeTarget
 */

import * as iotidentity from './iotidentity/iotidentityclient';
import * as greengrass from './greengrass/discoveryclient';
import * as iotjobs from './iotjobs/iotjobsclient';
import * as iotshadow from './iotshadow/iotshadowclient';

import { mqtt, http, io, iot, auth } from 'aws-crt/dist.browser/browser';

export {
    auth,
    greengrass,
    io,
    iot,
    iotidentity,
    iotjobs,
    iotshadow,
    http,
    mqtt
}
