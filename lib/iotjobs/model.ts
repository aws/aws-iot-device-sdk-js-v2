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
 * @category IotJobs
 */
export enum RejectedErrorCode {
    UNKNOWN_ENUM_VALUE = "UNKNOWN_ENUM_VALUE",
    INVALID_TOPIC = "InvalidTopic",
    INVALID_STATE_TRANSITION = "InvalidStateTransition",
    RESOURCE_NOT_FOUND = "ResourceNotFound",
    INVALID_REQUEST = "InvalidRequest",
    REQUEST_THROTTLED = "RequestThrottled",
    INTERNAL_ERROR = "InternalError",
    TERMINAL_STATE_REACHED = "TerminalStateReached",
    INVALID_JSON = "InvalidJson",
    VERSION_MISMATCH = "VersionMismatch",
}

/**
 * @category IotJobs
 */
export enum JobStatus {
    UNKNOWN_ENUM_VALUE = "UNKNOWN_ENUM_VALUE",
    IN_PROGRESS = "IN_PROGRESS",
    FAILED = "FAILED",
    QUEUED = "QUEUED",
    TIMED_OUT = "TIMED_OUT",
    SUCCEEDED = "SUCCEEDED",
    CANCELED = "CANCELED",
    REJECTED = "REJECTED",
    REMOVED = "REMOVED",
}


/**
 * @category IotJobs
 */
export interface DescribeJobExecutionRequest {
    includeJobDocument?: boolean;
    jobId: string;
    clientToken?: string;
    executionNumber?: number;
    thingName: string;
}

/**
 * @category IotJobs
 */
export interface DescribeJobExecutionResponse {
    execution?: JobExecutionData;
    clientToken?: string;
    timestamp?: Date;
}

/**
 * @category IotJobs
 */
export interface DescribeJobExecutionSubscriptionRequest {
    thingName: string;
    jobId: string;
}

/**
 * @category IotJobs
 */
export interface GetPendingJobExecutionsRequest {
    thingName: string;
    clientToken?: string;
}

/**
 * @category IotJobs
 */
export interface GetPendingJobExecutionsResponse {
    clientToken?: string;
    queuedJobs?: Array<JobExecutionSummary>;
    timestamp?: Date;
    inProgressJobs?: Array<JobExecutionSummary>;
}

/**
 * @category IotJobs
 */
export interface GetPendingJobExecutionsSubscriptionRequest {
    thingName: string;
}

/**
 * @category IotJobs
 */
export interface JobExecutionData {
    jobId?: string;
    thingName?: string;
    jobDocument?: object;
    executionNumber?: number;
    statusDetails?: {[key: string]: string};
    status?: JobStatus;
    versionNumber?: number;
    queuedAt?: Date;
    lastUpdatedAt?: Date;
    startedAt?: Date;
}

/**
 * @category IotJobs
 */
export interface JobExecutionState {
    versionNumber?: number;
    statusDetails?: {[key: string]: string};
    status?: JobStatus;
}

/**
 * @category IotJobs
 */
export interface JobExecutionSummary {
    lastUpdatedAt?: Date;
    executionNumber?: number;
    versionNumber?: number;
    jobId?: string;
    startedAt?: Date;
    queuedAt?: Date;
}

/**
 * @category IotJobs
 */
export interface JobExecutionsChangedEvent {
    jobs?: {[key: string]: Array<JobExecutionSummary>};
    timestamp?: Date;
}

/**
 * @category IotJobs
 */
export interface JobExecutionsChangedSubscriptionRequest {
    thingName: string;
}

/**
 * @category IotJobs
 */
export interface NextJobExecutionChangedEvent {
    execution?: JobExecutionData;
    timestamp?: Date;
}

/**
 * @category IotJobs
 */
export interface NextJobExecutionChangedSubscriptionRequest {
    thingName: string;
}

/**
 * @category IotJobs
 */
export interface RejectedErrorResponse {
    timestamp?: Date;
    clientToken?: string;
    code?: RejectedErrorCode;
    executionState?: JobExecutionState;
    message?: string;
}

/**
 * @category IotJobs
 */
export interface StartNextJobExecutionResponse {
    clientToken?: string;
    timestamp?: Date;
    execution?: JobExecutionData;
}

/**
 * @category IotJobs
 */
export interface StartNextPendingJobExecutionRequest {
    clientToken?: string;
    thingName: string;
    statusDetails?: {[key: string]: string};
    stepTimeoutInMinutes?: number;
}

/**
 * @category IotJobs
 */
export interface StartNextPendingJobExecutionSubscriptionRequest {
    thingName: string;
}

/**
 * @category IotJobs
 */
export interface UpdateJobExecutionRequest {
    thingName: string;
    expectedVersion?: number;
    executionNumber?: number;
    includeJobDocument?: boolean;
    statusDetails?: {[key: string]: string};
    includeJobExecutionState?: boolean;
    status?: JobStatus;
    stepTimeoutInMinutes?: number;
    jobId: string;
    clientToken?: string;
}

/**
 * @category IotJobs
 */
export interface UpdateJobExecutionResponse {
    timestamp?: Date;
    clientToken?: string;
    jobDocument?: object;
    executionState?: JobExecutionState;
}

/**
 * @category IotJobs
 */
export interface UpdateJobExecutionSubscriptionRequest {
    thingName: string;
    jobId: string;
}

