/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 *
 * This file is generated
 */

/**
 * A value indicating the kind of error encountered while processing an AWS IoT Jobs request
 *
 * @category IotJobs
 */
export enum RejectedErrorCode {

    UNKNOWN_ENUM_VALUE = "UNKNOWN_ENUM_VALUE",

    /**
     * The request was sent to a topic in the AWS IoT Jobs namespace that does not map to any API.
     */
    INVALID_TOPIC = "InvalidTopic",

    /**
     * An update attempted to change the job execution to a state that is invalid because of the job execution's current state. In this case, the body of the error message also contains the executionState field.
     */
    INVALID_STATE_TRANSITION = "InvalidStateTransition",

    /**
     * The JobExecution specified by the request topic does not exist.
     */
    RESOURCE_NOT_FOUND = "ResourceNotFound",

    /**
     * The contents of the request were invalid. The message contains details about the error.
     */
    INVALID_REQUEST = "InvalidRequest",

    /**
     * The request was throttled.
     */
    REQUEST_THROTTLED = "RequestThrottled",

    /**
     * There was an internal error during the processing of the request.
     */
    INTERNAL_ERROR = "InternalError",

    /**
     * Occurs when a command to describe a job is performed on a job that is in a terminal state.
     */
    TERMINAL_STATE_REACHED = "TerminalStateReached",

    /**
     * The contents of the request could not be interpreted as valid UTF-8-encoded JSON.
     */
    INVALID_JSON = "InvalidJson",

    /**
     * The expected version specified in the request does not match the version of the job execution in the AWS IoT Jobs service. In this case, the body of the error message also contains the executionState field.
     */
    VERSION_MISMATCH = "VersionMismatch",
}

/**
 * The status of the job execution.
 *
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
 * Data needed to make a DescribeJobExecution request.
 *
 * @category IotJobs
 */
export interface DescribeJobExecutionRequest {

    /**
     * The name of the thing associated with the device.
     *
     */
    thingName: string;

    /**
     * The unique identifier assigned to this job when it was created. Or use $next to return the next pending job execution for a thing (status IN_PROGRESS or QUEUED). In this case, any job executions with status IN_PROGRESS are returned first. Job executions are returned in the order in which they were created.
     *
     */
    jobId: string;

    /**
     * An opaque string used to correlate requests and responses. Enter an arbitrary value here and it is reflected in the response.
     *
     */
    clientToken?: string;

    /**
     * Optional. A number that identifies a job execution on a device. If not specified, the latest job execution is returned.
     *
     */
    executionNumber?: number;

    /**
     * Optional. Unless set to false, the response contains the job document. The default is true.
     *
     */
    includeJobDocument?: boolean;

}

/**
 * Response payload to a DescribeJobExecution request.
 *
 * @category IotJobs
 */
export interface DescribeJobExecutionResponse {

    /**
     * A client token used to correlate requests and responses.
     *
     */
    clientToken?: string;

    /**
     * Contains data about a job execution.
     *
     */
    execution?: JobExecutionData;

    /**
     * The time when the message was sent.
     *
     */
    timestamp?: Date;

}

/**
 * Data needed to subscribe to DescribeJobExecution responses.
 *
 * @category IotJobs
 */
export interface DescribeJobExecutionSubscriptionRequest {

    /**
     * Name of the IoT Thing that you want to subscribe to DescribeJobExecution response events for.
     *
     */
    thingName: string;

    /**
     * Job ID that you want to subscribe to DescribeJobExecution response events for.
     *
     */
    jobId: string;

}

/**
 * Data needed to make a GetPendingJobExecutions request.
 *
 * @category IotJobs
 */
export interface GetPendingJobExecutionsRequest {

    /**
     * IoT Thing the request is relative to.
     *
     */
    thingName: string;

    /**
     * Optional. A client token used to correlate requests and responses. Enter an arbitrary value here and it is reflected in the response.
     *
     */
    clientToken?: string;

}

/**
 * Response payload to a GetPendingJobExecutions request.
 *
 * @category IotJobs
 */
export interface GetPendingJobExecutionsResponse {

    /**
     * A list of JobExecutionSummary objects with status IN_PROGRESS.
     *
     */
    inProgressJobs?: Array<JobExecutionSummary>;

    /**
     * A list of JobExecutionSummary objects with status QUEUED.
     *
     */
    queuedJobs?: Array<JobExecutionSummary>;

    /**
     * The time when the message was sent.
     *
     */
    timestamp?: Date;

    /**
     * A client token used to correlate requests and responses.
     *
     */
    clientToken?: string;

}

/**
 * Data needed to subscribe to GetPendingJobExecutions responses.
 *
 * @category IotJobs
 */
export interface GetPendingJobExecutionsSubscriptionRequest {

    /**
     * Name of the IoT Thing that you want to subscribe to GetPendingJobExecutions response events for.
     *
     */
    thingName: string;

}

/**
 * Data about a job execution.
 *
 * @category IotJobs
 */
export interface JobExecutionData {

    /**
     * The unique identifier you assigned to this job when it was created.
     *
     */
    jobId?: string;

    /**
     * The name of the thing that is executing the job.
     *
     */
    thingName?: string;

    /**
     * The content of the job document.
     *
     */
    jobDocument?: object;

    /**
     * The status of the job execution. Can be one of: QUEUED, IN_PROGRESS, FAILED, SUCCEEDED, CANCELED, TIMED_OUT, REJECTED, or REMOVED.
     *
     */
    status?: JobStatus;

    /**
     * A collection of name-value pairs that describe the status of the job execution.
     *
     */
    statusDetails?: {[key: string]: string};

    /**
     * The time when the job execution was enqueued.
     *
     */
    queuedAt?: Date;

    /**
     * The time when the job execution started.
     *
     */
    startedAt?: Date;

    /**
     * The time when the job execution started. 
     *
     */
    lastUpdatedAt?: Date;

    /**
     * The version of the job execution. Job execution versions are incremented each time they are updated by a device.
     *
     */
    versionNumber?: number;

    /**
     * A number that identifies a job execution on a device. It can be used later in commands that return or update job execution information.
     *
     */
    executionNumber?: number;

}

/**
 * Sent whenever a job execution is added to or removed from the list of pending job executions for a thing.
 *
 * @category IotJobs
 */
export interface JobExecutionsChangedEvent {

    /**
     * Map from JobStatus to a list of Jobs transitioning to that status.
     *
     */
    jobs?: {[key: string]: Array<JobExecutionSummary>};

    /**
     * The time when the message was sent.
     *
     */
    timestamp?: Date;

}

/**
 * Data needed to subscribe to JobExecutionsChanged events.
 *
 * @category IotJobs
 */
export interface JobExecutionsChangedSubscriptionRequest {

    /**
     * Name of the IoT Thing that you want to subscribe to JobExecutionsChanged events for.
     *
     */
    thingName: string;

}

/**
 * Data about the state of a job execution.
 *
 * @category IotJobs
 */
export interface JobExecutionState {

    /**
     * The status of the job execution. Can be one of: QUEUED, IN_PROGRESS, FAILED, SUCCEEDED, CANCELED, TIMED_OUT, REJECTED, or REMOVED.
     *
     */
    status?: JobStatus;

    /**
     * A collection of name-value pairs that describe the status of the job execution.
     *
     */
    statusDetails?: {[key: string]: string};

    /**
     * The version of the job execution. Job execution versions are incremented each time they are updated by a device.
     *
     */
    versionNumber?: number;

}

/**
 * Contains a subset of information about a job execution.
 *
 * @category IotJobs
 */
export interface JobExecutionSummary {

    /**
     * The unique identifier you assigned to this job when it was created.
     *
     */
    jobId?: string;

    /**
     * A number that identifies a job execution on a device.
     *
     */
    executionNumber?: number;

    /**
     * The version of the job execution. Job execution versions are incremented each time the AWS IoT Jobs service receives an update from a device.
     *
     */
    versionNumber?: number;

    /**
     * The time when the job execution was last updated.
     *
     */
    lastUpdatedAt?: Date;

    /**
     * The time when the job execution was enqueued.
     *
     */
    queuedAt?: Date;

    /**
     * The time when the job execution started.
     *
     */
    startedAt?: Date;

}

/**
 * Sent whenever there is a change to which job execution is next on the list of pending job executions for a thing, as defined for DescribeJobExecution with jobId $next. This message is not sent when the next job's execution details change, only when the next job that would be returned by DescribeJobExecution with jobId $next has changed.
 *
 * @category IotJobs
 */
export interface NextJobExecutionChangedEvent {

    /**
     * Contains data about a job execution.
     *
     */
    execution?: JobExecutionData;

    /**
     * The time when the message was sent.
     *
     */
    timestamp?: Date;

}

/**
 * Data needed to subscribe to NextJobExecutionChanged events.
 *
 * @category IotJobs
 */
export interface NextJobExecutionChangedSubscriptionRequest {

    /**
     * Name of the IoT Thing that you want to subscribe to NextJobExecutionChanged events for.
     *
     */
    thingName: string;

}

/**
 * Response document containing details about a failed request.
 *
 * @category IotJobs
 */
export interface RejectedErrorResponse {

    /**
     * Opaque token that can correlate this response to the original request.
     *
     */
    clientToken?: string;

    /**
     * Indicates the type of error.
     *
     */
    code?: RejectedErrorCode;

    /**
     * A text message that provides additional information.
     *
     */
    message?: string;

    /**
     * The date and time the response was generated by AWS IoT.
     *
     */
    timestamp?: Date;

    /**
     * A JobExecutionState object. This field is included only when the code field has the value InvalidStateTransition or VersionMismatch.
     *
     */
    executionState?: JobExecutionState;

}

/**
 * Response payload to a StartNextJobExecution request.
 *
 * @category IotJobs
 */
export interface StartNextJobExecutionResponse {

    /**
     * A client token used to correlate requests and responses.
     *
     */
    clientToken?: string;

    /**
     * Contains data about a job execution.
     *
     */
    execution?: JobExecutionData;

    /**
     * The time when the message was sent to the device. 
     *
     */
    timestamp?: Date;

}

/**
 * Data needed to make a StartNextPendingJobExecution request.
 *
 * @category IotJobs
 */
export interface StartNextPendingJobExecutionRequest {

    /**
     * IoT Thing the request is relative to.
     *
     */
    thingName: string;

    /**
     * Optional. A client token used to correlate requests and responses. Enter an arbitrary value here and it is reflected in the response.
     *
     */
    clientToken?: string;

    /**
     * Specifies the amount of time this device has to finish execution of this job.
     *
     */
    stepTimeoutInMinutes?: number;

    /**
     * A collection of name-value pairs that describe the status of the job execution. If not specified, the statusDetails are unchanged.
     *
     */
    statusDetails?: {[key: string]: string};

}

/**
 * Data needed to subscribe to StartNextPendingJobExecution responses.
 *
 * @category IotJobs
 */
export interface StartNextPendingJobExecutionSubscriptionRequest {

    /**
     * Name of the IoT Thing that you want to subscribe to StartNextPendingJobExecution response events for.
     *
     */
    thingName: string;

}

/**
 * Data needed to make an UpdateJobExecution request.
 *
 * @category IotJobs
 */
export interface UpdateJobExecutionRequest {

    /**
     * The name of the thing associated with the device. 
     *
     */
    thingName: string;

    /**
     * The unique identifier assigned to this job when it was created.
     *
     */
    jobId: string;

    /**
     * The new status for the job execution (IN_PROGRESS, FAILED, SUCCEEDED, or REJECTED). This must be specified on every update.
     *
     */
    status?: JobStatus;

    /**
     * A client token used to correlate requests and responses. Enter an arbitrary value here and it is reflected in the response.
     *
     */
    clientToken?: string;

    /**
     * A collection of name-value pairs that describe the status of the job execution. If not specified, the statusDetails are unchanged.
     *
     */
    statusDetails?: {[key: string]: string};

    /**
     * The expected current version of the job execution. Each time you update the job execution, its version is incremented. If the version of the job execution stored in the AWS IoT Jobs service does not match, the update is rejected with a VersionMismatch error, and an ErrorResponse that contains the current job execution status data is returned.
     *
     */
    expectedVersion?: number;

    /**
     * Optional. A number that identifies a job execution on a device. If not specified, the latest job execution is used.
     *
     */
    executionNumber?: number;

    /**
     * Optional. When included and set to true, the response contains the JobExecutionState field. The default is false.
     *
     */
    includeJobExecutionState?: boolean;

    /**
     * Optional. When included and set to true, the response contains the JobDocument. The default is false.
     *
     */
    includeJobDocument?: boolean;

    /**
     * Specifies the amount of time this device has to finish execution of this job. If the job execution status is not set to a terminal state before this timer expires, or before the timer is reset (by again calling UpdateJobExecution, setting the status to IN_PROGRESS and specifying a new timeout value in this field) the job execution status is set to TIMED_OUT. Setting or resetting this timeout has no effect on the job execution timeout that might have been specified when the job was created (by using CreateJob with the timeoutConfig).
     *
     */
    stepTimeoutInMinutes?: number;

}

/**
 * Response payload to an UpdateJobExecution request.
 *
 * @category IotJobs
 */
export interface UpdateJobExecutionResponse {

    /**
     * A client token used to correlate requests and responses.
     *
     */
    clientToken?: string;

    /**
     * Contains data about the state of a job execution.
     *
     */
    executionState?: JobExecutionState;

    /**
     * A UTF-8 encoded JSON document that contains information that your devices need to perform the job.
     *
     */
    jobDocument?: object;

    /**
     * The time when the message was sent.
     *
     */
    timestamp?: Date;

}

/**
 * Data needed to subscribe to UpdateJobExecution responses.
 *
 * @category IotJobs
 */
export interface UpdateJobExecutionSubscriptionRequest {

    /**
     * Name of the IoT Thing that you want to subscribe to UpdateJobExecution response events for.
     *
     */
    thingName: string;

    /**
     * Job ID that you want to subscribe to UpdateJobExecution response events for.
     *
     */
    jobId: string;

}

