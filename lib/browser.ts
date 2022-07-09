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

import { mqtt, http, io, iot, auth } from 'aws-crt/dist.browser/browser';

export {
    mqtt,
    http,
    io,
    iot,
    auth
}
