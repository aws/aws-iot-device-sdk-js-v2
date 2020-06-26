/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */

/**
 * @moduledefinition aws-iot-device-sdk
 */

import * as iotidentity from './iotidentity/iotidentityclient';
import * as greengrass from './greengrass/discoveryclient';
import * as iotjobs from './iotjobs/iotjobsclient';
import * as iotshadow from './iotshadow/iotshadowclient';

import { mqtt } from "aws-crt";

export {
    iotidentity,
    greengrass,
    iotjobs,
    iotshadow,
    mqtt
}
