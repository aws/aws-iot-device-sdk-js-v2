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


export interface DeleteShadowRequest {
    thingName: string;
}

export interface DeleteShadowResponse {
    timestamp?: Date;
    version?: number;
}

export interface DeleteShadowSubscriptionRequest {
    thingName: string;
}

export interface ErrorResponse {
    message?: string;
    clientToken?: string;
    timestamp?: Date;
    code?: number;
}

export interface GetShadowRequest {
    thingName: string;
}

export interface GetShadowResponse {
    state?: ShadowStateWithDelta;
    version?: number;
    metadata?: ShadowMetadata;
    timestamp?: Date;
}

export interface GetShadowSubscriptionRequest {
    thingName: string;
}

export interface ShadowDeltaUpdatedEvent {
    metadata?: object;
    version?: number;
    timestamp?: Date;
    state?: object;
}

export interface ShadowDeltaUpdatedSubscriptionRequest {
    thingName: string;
}

export interface ShadowMetadata {
    desired?: object;
    reported?: object;
}

export interface ShadowState {
    desired?: object;
    reported?: object;
}

export interface ShadowStateWithDelta {
    reported?: object;
    delta?: object;
    desired?: object;
}

export interface ShadowUpdatedEvent {
    previous?: ShadowUpdatedSnapshot;
    current?: ShadowUpdatedSnapshot;
    timestamp?: Date;
}

export interface ShadowUpdatedSnapshot {
    version?: number;
    state?: ShadowState;
    metadata?: ShadowMetadata;
}

export interface ShadowUpdatedSubscriptionRequest {
    thingName: string;
}

export interface UpdateShadowRequest {
    state?: ShadowState;
    thingName: string;
    clientToken?: string;
    version?: number;
}

export interface UpdateShadowResponse {
    state?: ShadowState;
    clientToken?: string;
    version?: number;
    metadata?: ShadowMetadata;
    timestamp?: Date;
}

export interface UpdateShadowSubscriptionRequest {
    thingName: string;
}

