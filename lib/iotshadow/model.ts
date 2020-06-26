/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
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

