/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 *
 * This file is generated
 */

import * as model from "./model";
import {fromUtf8, toUtf8} from "@aws-sdk/util-utf8-browser";
import * as model_validation_utils from "../mqtt_request_response_utils";
import * as mqtt_request_response_utils from "../mqtt_request_response_utils";
import {v4 as uuid} from "uuid";

function normalizeDescribeJobExecutionRequest(value: model.DescribeJobExecutionRequest) : any {
    let normalizedValue : any = {};

    if (value.clientToken) {
        normalizedValue.clientToken = value.clientToken;
    }
    if (value.executionNumber) {
        normalizedValue.executionNumber = value.executionNumber;
    }
    if (value.includeJobDocument) {
        normalizedValue.includeJobDocument = value.includeJobDocument;
    }

    return normalizedValue;
}

function buildDescribeJobExecutionRequestPayload(request: any) : ArrayBuffer {
    let value = normalizeDescribeJobExecutionRequest(request as model.DescribeJobExecutionRequest);

    return fromUtf8(JSON.stringify(value));
}

function applyCorrelationTokenToDescribeJobExecutionRequest(request: any) : [any, string | undefined] {
    let typedRequest: model.DescribeJobExecutionRequest = request;

    let correlationToken = uuid();

    typedRequest.clientToken = correlationToken;

    return [typedRequest, correlationToken];
}

function normalizeGetPendingJobExecutionsRequest(value: model.GetPendingJobExecutionsRequest) : any {
    let normalizedValue : any = {};

    if (value.clientToken) {
        normalizedValue.clientToken = value.clientToken;
    }

    return normalizedValue;
}

function buildGetPendingJobExecutionsRequestPayload(request: any) : ArrayBuffer {
    let value = normalizeGetPendingJobExecutionsRequest(request as model.GetPendingJobExecutionsRequest);

    return fromUtf8(JSON.stringify(value));
}

function applyCorrelationTokenToGetPendingJobExecutionsRequest(request: any) : [any, string | undefined] {
    let typedRequest: model.GetPendingJobExecutionsRequest = request;

    let correlationToken = uuid();

    typedRequest.clientToken = correlationToken;

    return [typedRequest, correlationToken];
}

function normalizeStartNextPendingJobExecutionRequest(value: model.StartNextPendingJobExecutionRequest) : any {
    let normalizedValue : any = {};

    if (value.clientToken) {
        normalizedValue.clientToken = value.clientToken;
    }
    if (value.stepTimeoutInMinutes) {
        normalizedValue.stepTimeoutInMinutes = value.stepTimeoutInMinutes;
    }
    if (value.statusDetails) {
        normalizedValue.statusDetails = value.statusDetails;
    }

    return normalizedValue;
}

function buildStartNextPendingJobExecutionRequestPayload(request: any) : ArrayBuffer {
    let value = normalizeStartNextPendingJobExecutionRequest(request as model.StartNextPendingJobExecutionRequest);

    return fromUtf8(JSON.stringify(value));
}

function applyCorrelationTokenToStartNextPendingJobExecutionRequest(request: any) : [any, string | undefined] {
    let typedRequest: model.StartNextPendingJobExecutionRequest = request;

    let correlationToken = uuid();

    typedRequest.clientToken = correlationToken;

    return [typedRequest, correlationToken];
}

function normalizeUpdateJobExecutionRequest(value: model.UpdateJobExecutionRequest) : any {
    let normalizedValue : any = {};

    if (value.status) {
        normalizedValue.status = value.status;
    }
    if (value.clientToken) {
        normalizedValue.clientToken = value.clientToken;
    }
    if (value.statusDetails) {
        normalizedValue.statusDetails = value.statusDetails;
    }
    if (value.expectedVersion) {
        normalizedValue.expectedVersion = value.expectedVersion;
    }
    if (value.executionNumber) {
        normalizedValue.executionNumber = value.executionNumber;
    }
    if (value.includeJobExecutionState) {
        normalizedValue.includeJobExecutionState = value.includeJobExecutionState;
    }
    if (value.includeJobDocument) {
        normalizedValue.includeJobDocument = value.includeJobDocument;
    }
    if (value.stepTimeoutInMinutes) {
        normalizedValue.stepTimeoutInMinutes = value.stepTimeoutInMinutes;
    }

    return normalizedValue;
}

function buildUpdateJobExecutionRequestPayload(request: any) : ArrayBuffer {
    let value = normalizeUpdateJobExecutionRequest(request as model.UpdateJobExecutionRequest);

    return fromUtf8(JSON.stringify(value));
}

function applyCorrelationTokenToUpdateJobExecutionRequest(request: any) : [any, string | undefined] {
    let typedRequest: model.UpdateJobExecutionRequest = request;

    let correlationToken = uuid();

    typedRequest.clientToken = correlationToken;

    return [typedRequest, correlationToken];
}

function buildDescribeJobExecutionSubscriptions(request: any) : Array<string> {
    let typedRequest: model.DescribeJobExecutionRequest = request;

    return new Array<string>(
        `$aws/things/${typedRequest.thingName}/jobs/${typedRequest.jobId}/get/+`,
    );
}

function buildDescribeJobExecutionPublishTopic(request: any) : string {
    let typedRequest: model.DescribeJobExecutionRequest = request;

    return `$aws/things/${typedRequest.thingName}/jobs/${typedRequest.jobId}/get`;
}

function buildDescribeJobExecutionResponsePaths(request: any) : Array<mqtt_request_response_utils.RequestResponsePath> {
    let typedRequest: model.DescribeJobExecutionRequest = request;

    return new Array<mqtt_request_response_utils.RequestResponsePath>(
        {
            topic: `$aws/things/${typedRequest.thingName}/jobs/${typedRequest.jobId}/get/accepted`,
            correlationTokenJsonPath: "clientToken",
            deserializer: deserializeDescribeJobExecutionResponse,
        },
        {
            topic: `$aws/things/${typedRequest.thingName}/jobs/${typedRequest.jobId}/get/rejected`,
                                            correlationTokenJsonPath: "clientToken",
            deserializer: deserializeV2ServiceError,
        },
    );
}

function buildGetPendingJobExecutionsSubscriptions(request: any) : Array<string> {
    let typedRequest: model.GetPendingJobExecutionsRequest = request;

    return new Array<string>(
        `$aws/things/${typedRequest.thingName}/jobs/get/+`,
    );
}

function buildGetPendingJobExecutionsPublishTopic(request: any) : string {
    let typedRequest: model.GetPendingJobExecutionsRequest = request;

    return `$aws/things/${typedRequest.thingName}/jobs/get`;
}

function buildGetPendingJobExecutionsResponsePaths(request: any) : Array<mqtt_request_response_utils.RequestResponsePath> {
    let typedRequest: model.GetPendingJobExecutionsRequest = request;

    return new Array<mqtt_request_response_utils.RequestResponsePath>(
        {
            topic: `$aws/things/${typedRequest.thingName}/jobs/get/accepted`,
            correlationTokenJsonPath: "clientToken",
            deserializer: deserializeGetPendingJobExecutionsResponse,
        },
        {
            topic: `$aws/things/${typedRequest.thingName}/jobs/get/rejected`,
                                            correlationTokenJsonPath: "clientToken",
            deserializer: deserializeV2ServiceError,
        },
    );
}

function buildStartNextPendingJobExecutionSubscriptions(request: any) : Array<string> {
    let typedRequest: model.StartNextPendingJobExecutionRequest = request;

    return new Array<string>(
        `$aws/things/${typedRequest.thingName}/jobs/start-next/+`,
    );
}

function buildStartNextPendingJobExecutionPublishTopic(request: any) : string {
    let typedRequest: model.StartNextPendingJobExecutionRequest = request;

    return `$aws/things/${typedRequest.thingName}/jobs/start-next`;
}

function buildStartNextPendingJobExecutionResponsePaths(request: any) : Array<mqtt_request_response_utils.RequestResponsePath> {
    let typedRequest: model.StartNextPendingJobExecutionRequest = request;

    return new Array<mqtt_request_response_utils.RequestResponsePath>(
        {
            topic: `$aws/things/${typedRequest.thingName}/jobs/start-next/accepted`,
            correlationTokenJsonPath: "clientToken",
            deserializer: deserializeStartNextJobExecutionResponse,
        },
        {
            topic: `$aws/things/${typedRequest.thingName}/jobs/start-next/rejected`,
                                            correlationTokenJsonPath: "clientToken",
            deserializer: deserializeV2ServiceError,
        },
    );
}

function buildUpdateJobExecutionSubscriptions(request: any) : Array<string> {
    let typedRequest: model.UpdateJobExecutionRequest = request;

    return new Array<string>(
        `$aws/things/${typedRequest.thingName}/jobs/${typedRequest.jobId}/update/+`,
    );
}

function buildUpdateJobExecutionPublishTopic(request: any) : string {
    let typedRequest: model.UpdateJobExecutionRequest = request;

    return `$aws/things/${typedRequest.thingName}/jobs/${typedRequest.jobId}/update`;
}

function buildUpdateJobExecutionResponsePaths(request: any) : Array<mqtt_request_response_utils.RequestResponsePath> {
    let typedRequest: model.UpdateJobExecutionRequest = request;

    return new Array<mqtt_request_response_utils.RequestResponsePath>(
        {
            topic: `$aws/things/${typedRequest.thingName}/jobs/${typedRequest.jobId}/update/accepted`,
            correlationTokenJsonPath: "clientToken",
            deserializer: deserializeUpdateJobExecutionResponse,
        },
        {
            topic: `$aws/things/${typedRequest.thingName}/jobs/${typedRequest.jobId}/update/rejected`,
                                            correlationTokenJsonPath: "clientToken",
            deserializer: deserializeV2ServiceError,
        },
    );
}

function deserializeDescribeJobExecutionResponse(payload: ArrayBuffer) : any {
    const payload_text = toUtf8(new Uint8Array(payload));

    return JSON.parse(payload_text);
}

function deserializeGetPendingJobExecutionsResponse(payload: ArrayBuffer) : any {
    const payload_text = toUtf8(new Uint8Array(payload));

    return JSON.parse(payload_text);
}

function deserializeStartNextJobExecutionResponse(payload: ArrayBuffer) : any {
    const payload_text = toUtf8(new Uint8Array(payload));

    return JSON.parse(payload_text);
}

function deserializeUpdateJobExecutionResponse(payload: ArrayBuffer) : any {
    const payload_text = toUtf8(new Uint8Array(payload));

    return JSON.parse(payload_text);
}

function deserializeV2ErrorResponse(payload: ArrayBuffer) : any {
    const payload_text = toUtf8(new Uint8Array(payload));

    return JSON.parse(payload_text);
}

function createRequestResponseOperationServiceModelMap() : Map<string, mqtt_request_response_utils.RequestResponseOperationModel> {
    return new Map<string, mqtt_request_response_utils.RequestResponseOperationModel>([
        ["describeJobExecution", {
            inputShapeName: "DescribeJobExecutionRequest",
            payloadTransformer: buildDescribeJobExecutionRequestPayload,
            subscriptionGenerator: buildDescribeJobExecutionSubscriptions,
            responsePathGenerator: buildDescribeJobExecutionResponsePaths,
            publishTopicGenerator: buildDescribeJobExecutionPublishTopic,
            correlationTokenApplicator: applyCorrelationTokenToDescribeJobExecutionRequest,
        }],
        ["getPendingJobExecutions", {
            inputShapeName: "GetPendingJobExecutionsRequest",
            payloadTransformer: buildGetPendingJobExecutionsRequestPayload,
            subscriptionGenerator: buildGetPendingJobExecutionsSubscriptions,
            responsePathGenerator: buildGetPendingJobExecutionsResponsePaths,
            publishTopicGenerator: buildGetPendingJobExecutionsPublishTopic,
            correlationTokenApplicator: applyCorrelationTokenToGetPendingJobExecutionsRequest,
        }],
        ["startNextPendingJobExecution", {
            inputShapeName: "StartNextPendingJobExecutionRequest",
            payloadTransformer: buildStartNextPendingJobExecutionRequestPayload,
            subscriptionGenerator: buildStartNextPendingJobExecutionSubscriptions,
            responsePathGenerator: buildStartNextPendingJobExecutionResponsePaths,
            publishTopicGenerator: buildStartNextPendingJobExecutionPublishTopic,
            correlationTokenApplicator: applyCorrelationTokenToStartNextPendingJobExecutionRequest,
        }],
        ["updateJobExecution", {
            inputShapeName: "UpdateJobExecutionRequest",
            payloadTransformer: buildUpdateJobExecutionRequestPayload,
            subscriptionGenerator: buildUpdateJobExecutionSubscriptions,
            responsePathGenerator: buildUpdateJobExecutionResponsePaths,
            publishTopicGenerator: buildUpdateJobExecutionPublishTopic,
            correlationTokenApplicator: applyCorrelationTokenToUpdateJobExecutionRequest,
        }],
    ]);
}

function buildCreateJobExecutionsChangedStreamTopicFilter(config: any) : string {
    const typedConfig : model.JobExecutionsChangedSubscriptionRequest = config;

    return `$aws/things/${typedConfig.thingName}/jobs/notify`;
}

function buildCreateNextJobExecutionChangedStreamTopicFilter(config: any) : string {
    const typedConfig : model.NextJobExecutionChangedSubscriptionRequest = config;

    return `$aws/things/${typedConfig.thingName}/jobs/notify-next`;
}


function deserializeJobExecutionsChangedEventPayload(payload: ArrayBuffer) : any {
    const payload_text = toUtf8(new Uint8Array(payload));

    return JSON.parse(payload_text);
}

function deserializeNextJobExecutionChangedEventPayload(payload: ArrayBuffer) : any {
    const payload_text = toUtf8(new Uint8Array(payload));

    return JSON.parse(payload_text);
}


function createStreamingOperationServiceModelMap() : Map<string, mqtt_request_response_utils.StreamingOperationModel> {
    return new Map<string, mqtt_request_response_utils.StreamingOperationModel>([
        ["createJobExecutionsChangedStream", {
            inputShapeName: "JobExecutionsChangedSubscriptionRequest",
            subscriptionGenerator: buildCreateJobExecutionsChangedStreamTopicFilter,
            deserializer: deserializeJobExecutionsChangedEventPayload,
        }],
        ["createNextJobExecutionChangedStream", {
            inputShapeName: "NextJobExecutionChangedSubscriptionRequest",
            subscriptionGenerator: buildCreateNextJobExecutionChangedStreamTopicFilter,
            deserializer: deserializeNextJobExecutionChangedEventPayload,
        }],
    ]);
}

function validateDescribeJobExecutionRequest(value: any) : void {

    // @ts-ignore
    let typedValue : model.DescribeJobExecutionRequest = value;

    model_validation_utils.validateValueAsTopicSegment(value.thingName, 'thingName');
    model_validation_utils.validateValueAsTopicSegment(value.jobId, 'jobId');
    model_validation_utils.validateValueAsOptionalInteger(value.executionNumber, 'executionNumber');
    model_validation_utils.validateValueAsOptionalBoolean(value.includeJobDocument, 'includeJobDocument');
}

function validateGetPendingJobExecutionsRequest(value: any) : void {

    // @ts-ignore
    let typedValue : model.GetPendingJobExecutionsRequest = value;

    model_validation_utils.validateValueAsTopicSegment(value.thingName, 'thingName');
}

function validateJobExecutionsChangedSubscriptionRequest(value: any) : void {

    // @ts-ignore
    let typedValue : model.JobExecutionsChangedSubscriptionRequest = value;

    model_validation_utils.validateValueAsTopicSegment(value.thingName, 'thingName');
}

function validateNextJobExecutionChangedSubscriptionRequest(value: any) : void {

    // @ts-ignore
    let typedValue : model.NextJobExecutionChangedSubscriptionRequest = value;

    model_validation_utils.validateValueAsTopicSegment(value.thingName, 'thingName');
}

function validateStartNextPendingJobExecutionRequest(value: any) : void {

    // @ts-ignore
    let typedValue : model.StartNextPendingJobExecutionRequest = value;

    model_validation_utils.validateValueAsTopicSegment(value.thingName, 'thingName');
    model_validation_utils.validateValueAsOptionalInteger(value.stepTimeoutInMinutes, 'stepTimeoutInMinutes');
    model_validation_utils.validateValueAsOptionalMap(value.statusDetails, model_validation_utils.validateValueAsString, model_validation_utils.validateValueAsString, 'statusDetails');
}

function validateUpdateJobExecutionRequest(value: any) : void {

    // @ts-ignore
    let typedValue : model.UpdateJobExecutionRequest = value;

    model_validation_utils.validateValueAsTopicSegment(value.thingName, 'thingName');
    model_validation_utils.validateValueAsTopicSegment(value.jobId, 'jobId');
    model_validation_utils.validateValueAsString(value.status, 'status');
    model_validation_utils.validateValueAsOptionalMap(value.statusDetails, model_validation_utils.validateValueAsString, model_validation_utils.validateValueAsString, 'statusDetails');
    model_validation_utils.validateValueAsOptionalInteger(value.expectedVersion, 'expectedVersion');
    model_validation_utils.validateValueAsOptionalInteger(value.executionNumber, 'executionNumber');
    model_validation_utils.validateValueAsOptionalBoolean(value.includeJobExecutionState, 'includeJobExecutionState');
    model_validation_utils.validateValueAsOptionalBoolean(value.includeJobDocument, 'includeJobDocument');
    model_validation_utils.validateValueAsOptionalInteger(value.stepTimeoutInMinutes, 'stepTimeoutInMinutes');
}


function createValidatorMap() : Map<string, (value: any) => void> {
    return new Map<string, (value: any) => void>([
        ["JobExecutionsChangedSubscriptionRequest", validateJobExecutionsChangedSubscriptionRequest],
        ["NextJobExecutionChangedSubscriptionRequest", validateNextJobExecutionChangedSubscriptionRequest],
        ["DescribeJobExecutionRequest", validateDescribeJobExecutionRequest],
        ["GetPendingJobExecutionsRequest", validateGetPendingJobExecutionsRequest],
        ["StartNextPendingJobExecutionRequest", validateStartNextPendingJobExecutionRequest],
        ["UpdateJobExecutionRequest", validateUpdateJobExecutionRequest],
    ]);
}

export function makeServiceModel() : mqtt_request_response_utils.RequestResponseServiceModel {
    let model : mqtt_request_response_utils.RequestResponseServiceModel = {
        requestResponseOperations: createRequestResponseOperationServiceModelMap(),
        streamingOperations: createStreamingOperationServiceModelMap(),
        shapeValidators: createValidatorMap()
    };

    return model;
}
