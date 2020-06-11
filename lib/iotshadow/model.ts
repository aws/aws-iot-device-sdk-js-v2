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
export interface DeleteNamedShadowRequest {
    clientToken?: string;
    shadowName: string;
    thingName: string;
}

/**
 * @module aws-iot-device-sdk
 * @category IotShadow
 */
export interface DeleteNamedShadowSubscriptionRequest {
    thingName: string;
    shadowName: string;
}

/**
 * @module aws-iot-device-sdk
 * @category IotShadow
 */
export interface DeleteShadowRequest {
    thingName: string;
    clientToken?: string;
}

/**
 * @module aws-iot-device-sdk
 * @category IotShadow
 */
export interface DeleteShadowResponse {
    version?: number;
    clientToken?: string;
    timestamp?: Date;
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
    timestamp?: Date;
    message?: string;
    clientToken?: string;
    code?: number;
}

/**
 * @module aws-iot-device-sdk
 * @category IotShadow
 */
export interface GetNamedShadowRequest {
    clientToken?: string;
    shadowName: string;
    thingName: string;
}

/**
 * @module aws-iot-device-sdk
 * @category IotShadow
 */
export interface GetNamedShadowSubscriptionRequest {
    thingName: string;
    shadowName: string;
}

/**
 * @module aws-iot-device-sdk
 * @category IotShadow
 */
export interface GetShadowRequest {
    thingName: string;
    clientToken?: string;
}

/**
 * @module aws-iot-device-sdk
 * @category IotShadow
 */
export interface GetShadowResponse {
    version?: number;
    clientToken?: string;
    state?: ShadowStateWithDelta;
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
export interface NamedShadowDeltaUpdatedSubscriptionRequest {
    thingName: string;
    shadowName: string;
}

/**
 * @module aws-iot-device-sdk
 * @category IotShadow
 */
export interface NamedShadowUpdatedSubscriptionRequest {
    shadowName: string;
    thingName: string;
}

/**
 * @module aws-iot-device-sdk
 * @category IotShadow
 */
export interface ShadowDeltaUpdatedEvent {
    version?: number;
    timestamp?: Date;
    metadata?: object;
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
    delta?: object;
    reported?: object;
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
    state?: ShadowState;
    metadata?: ShadowMetadata;
    version?: number;
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
export interface UpdateNamedShadowRequest {
    shadowName: string;
    clientToken?: string;
    thingName: string;
    state?: ShadowState;
    version?: number;
}

/**
 * @module aws-iot-device-sdk
 * @category IotShadow
 */
export interface UpdateNamedShadowSubscriptionRequest {
    thingName: string;
    shadowName: string;
}

/**
 * @module aws-iot-device-sdk
 * @category IotShadow
 */
export interface UpdateShadowRequest {
    state?: ShadowState;
    thingName: string;
    version?: number;
    clientToken?: string;
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

