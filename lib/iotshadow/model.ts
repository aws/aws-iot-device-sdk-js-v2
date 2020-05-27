/* Copyright 2010-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
*
* Licensed under the Apache License, Version 2.0 (the "License").
* You may not use this file except in compliance with the License.
* A copy of the License is located at
*
*  http://aws.amazon.com/apache2.0
*
* or in the "license" file accompanying this file. This file is distributed
* on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
* express or implied. See the License for the specific language governing
* permissions and limitations under the License.

* This file is generated
*/


/**
 * @module aws-iot-device-sdk
 * @category IotShadow
 */
export interface DeleteShadowRequest {
    thingName: string;
}

/**
 * @module aws-iot-device-sdk
 * @category IotShadow
 */
export interface DeleteShadowResponse {
    timestamp?: Date;
    version?: number;
}

/**
 * @module aws-iot-device-sdk
 * @category IotShadow
 */
export interface DeleteShadowSubscriptionRequest {
    thingName: string;
}

/**
 * @module aws-iot-device-sdk
 * @category IotShadow
 */
export interface ErrorResponse {
    message?: string;
    clientToken?: string;
    timestamp?: Date;
    code?: number;
}

/**
 * @module aws-iot-device-sdk
 * @category IotShadow
 */
export interface GetShadowRequest {
    thingName: string;
}

/**
 * @module aws-iot-device-sdk
 * @category IotShadow
 */
export interface GetShadowResponse {
    state?: ShadowStateWithDelta;
    version?: number;
    metadata?: ShadowMetadata;
    timestamp?: Date;
}

/**
 * @module aws-iot-device-sdk
 * @category IotShadow
 */
export interface GetShadowSubscriptionRequest {
    thingName: string;
}

/**
 * @module aws-iot-device-sdk
 * @category IotShadow
 */
export interface ShadowDeltaUpdatedEvent {
    metadata?: object;
    version?: number;
    timestamp?: Date;
    state?: object;
}

/**
 * @module aws-iot-device-sdk
 * @category IotShadow
 */
export interface ShadowDeltaUpdatedSubscriptionRequest {
    thingName: string;
}

/**
 * @module aws-iot-device-sdk
 * @category IotShadow
 */
export interface ShadowMetadata {
    desired?: object;
    reported?: object;
}

/**
 * @module aws-iot-device-sdk
 * @category IotShadow
 */
export interface ShadowState {
    desired?: object;
    reported?: object;
}

/**
 * @module aws-iot-device-sdk
 * @category IotShadow
 */
export interface ShadowStateWithDelta {
    reported?: object;
    delta?: object;
    desired?: object;
}

/**
 * @module aws-iot-device-sdk
 * @category IotShadow
 */
export interface ShadowUpdatedEvent {
    previous?: ShadowUpdatedSnapshot;
    current?: ShadowUpdatedSnapshot;
    timestamp?: Date;
}

/**
 * @module aws-iot-device-sdk
 * @category IotShadow
 */
export interface ShadowUpdatedSnapshot {
    version?: number;
    state?: ShadowState;
    metadata?: ShadowMetadata;
}

/**
 * @module aws-iot-device-sdk
 * @category IotShadow
 */
export interface ShadowUpdatedSubscriptionRequest {
    thingName: string;
}

/**
 * @module aws-iot-device-sdk
 * @category IotShadow
 */
export interface UpdateShadowRequest {
    state?: ShadowState;
    thingName: string;
    clientToken?: string;
    version?: number;
}

/**
 * @module aws-iot-device-sdk
 * @category IotShadow
 */
export interface UpdateShadowResponse {
    state?: ShadowState;
    clientToken?: string;
    version?: number;
    metadata?: ShadowMetadata;
    timestamp?: Date;
}

/**
 * @module aws-iot-device-sdk
 * @category IotShadow
 */
export interface UpdateShadowSubscriptionRequest {
    thingName: string;
}

