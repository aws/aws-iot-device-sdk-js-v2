/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 *
 * This file is generated
 */

/**
 * @packageDocumentation
 * @module aws-iot-device-sdk
 */


/**
 * @category IotShadow
 */
export interface DeleteNamedShadowRequest {
    clientToken?: string;
    shadowName: string;
    thingName: string;
}

/**
 * @category IotShadow
 */
export interface DeleteNamedShadowSubscriptionRequest {
    thingName: string;
    shadowName: string;
}

/**
 * @category IotShadow
 */
export interface DeleteShadowRequest {
    thingName: string;
    clientToken?: string;
}

/**
 * @category IotShadow
 */
export interface DeleteShadowResponse {
    version?: number;
    clientToken?: string;
    timestamp?: Date;
}

/**
 * @category IotShadow
 */
export interface DeleteShadowSubscriptionRequest {
    thingName: string;
}

/**
 * @category IotShadow
 */
export interface ErrorResponse {
    timestamp?: Date;
    message?: string;
    clientToken?: string;
    code?: number;
}

/**
 * @category IotShadow
 */
export interface GetNamedShadowRequest {
    clientToken?: string;
    shadowName: string;
    thingName: string;
}

/**
 * @category IotShadow
 */
export interface GetNamedShadowSubscriptionRequest {
    thingName: string;
    shadowName: string;
}

/**
 * @category IotShadow
 */
export interface GetShadowRequest {
    thingName: string;
    clientToken?: string;
}

/**
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
 * @category IotShadow
 */
export interface GetShadowSubscriptionRequest {
    thingName: string;
}

/**
 * @category IotShadow
 */
export interface NamedShadowDeltaUpdatedSubscriptionRequest {
    thingName: string;
    shadowName: string;
}

/**
 * @category IotShadow
 */
export interface NamedShadowUpdatedSubscriptionRequest {
    shadowName: string;
    thingName: string;
}

/**
 * @category IotShadow
 */
export interface ShadowDeltaUpdatedEvent {
    version?: number;
    timestamp?: Date;
    metadata?: object;
    state?: object;
}

/**
 * @category IotShadow
 */
export interface ShadowDeltaUpdatedSubscriptionRequest {
    thingName: string;
}

/**
 * @category IotShadow
 */
export interface ShadowMetadata {
    desired?: object;
    reported?: object;
}

/**
 * @category IotShadow
 */
export interface ShadowState {
    desired?: object;
    reported?: object;
}

/**
 * @category IotShadow
 */
export interface ShadowStateWithDelta {
    delta?: object;
    reported?: object;
    desired?: object;
}

/**
 * @category IotShadow
 */
export interface ShadowUpdatedEvent {
    previous?: ShadowUpdatedSnapshot;
    current?: ShadowUpdatedSnapshot;
    timestamp?: Date;
}

/**
 * @category IotShadow
 */
export interface ShadowUpdatedSnapshot {
    state?: ShadowState;
    metadata?: ShadowMetadata;
    version?: number;
}

/**
 * @category IotShadow
 */
export interface ShadowUpdatedSubscriptionRequest {
    thingName: string;
}

/**
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
 * @category IotShadow
 */
export interface UpdateNamedShadowSubscriptionRequest {
    thingName: string;
    shadowName: string;
}

/**
 * @category IotShadow
 */
export interface UpdateShadowRequest {
    state?: ShadowState;
    thingName: string;
    version?: number;
    clientToken?: string;
}

/**
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
 * @category IotShadow
 */
export interface UpdateShadowSubscriptionRequest {
    thingName: string;
}

