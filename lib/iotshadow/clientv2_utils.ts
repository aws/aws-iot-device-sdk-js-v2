/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 *
 * This file is generated
 */


import * as model from "./model";
import {fromUtf8, toUtf8} from "@aws-sdk/util-utf8-browser";
import * as mqtt_request_response_utils from "../mqtt_request_response_utils";
import {v4 as uuid} from "uuid";

function normalizeGetNamedShadowRequest(value: model.GetNamedShadowRequest) : any {
    let normalizedValue : any = {};
    if (value.clientToken) {
        normalizedValue.clientToken = value.clientToken;
    }

    return normalizedValue;
}

function buildGetNamedShadowRequestPayload(request: any) : ArrayBuffer {
    let value = normalizeGetNamedShadowRequest(request as model.GetNamedShadowRequest);

    return fromUtf8(JSON.stringify(value));
}

function buildGetNamedShadowRequestSubscriptions(request: any) : Array<string> {
    let typedRequest: model.GetNamedShadowRequest = request;

    return new Array<string>(
        `$aws/things/${typedRequest.thingName}/shadow/name/${typedRequest.shadowName}/get/+`
    );
}

function deserializeGetShadowResponse(payload: ArrayBuffer) : any {
    const payload_text = toUtf8(new Uint8Array(payload));

    return JSON.parse(payload_text);
}

function deserializeErrorResponse(payload: ArrayBuffer): any {
    const payload_text = toUtf8(new Uint8Array(payload));
    let errorResponse = JSON.parse(payload_text);

    throw mqtt_request_response_utils.createServiceError("Operation failed with modeled service error", undefined, errorResponse);
}

function buildGetNamedShadowRequestResponsePaths(request: any) : Array<mqtt_request_response_utils.RequestResponsePath> {
    let typedRequest: model.GetNamedShadowRequest = request;

    return new Array<mqtt_request_response_utils.RequestResponsePath>(
        {
            topic: `$aws/things/${typedRequest.thingName}/shadow/name/${typedRequest.shadowName}/get/accepted`,
            correlationTokenJsonPath: "clientToken",
            deserializer: deserializeGetShadowResponse,
        },
        {
            topic: `$aws/things/${typedRequest.thingName}/shadow/name/${typedRequest.shadowName}/get/rejected`,
            correlationTokenJsonPath: "clientToken",
            deserializer: deserializeErrorResponse,
        },
    )
}

function buildGetNamedShadowRequestPublishTopic(request: any) : string {
    let typedRequest: model.GetNamedShadowRequest = request;

    return `$aws/things/${typedRequest.thingName}/shadow/name/${typedRequest.shadowName}/get`;
}

function applyCorrelationTokenToGetNamedShadowRequest(request: any) : [any, string | undefined] {
    let typedRequest: model.GetNamedShadowRequest = request;

    let correlationToken = uuid();

    typedRequest.clientToken = correlationToken;

    return [typedRequest, correlationToken];
}

function normalizeDeleteNamedShadowRequest(value: model.DeleteNamedShadowRequest) : any {
    let normalizedValue : any = {};
    if (value.clientToken) {
        normalizedValue.clientToken = value.clientToken;
    }

    return normalizedValue;
}

function buildDeleteNamedShadowRequestPayload(request: any) : ArrayBuffer {
    let value = normalizeDeleteNamedShadowRequest(request as model.DeleteNamedShadowRequest);

    return fromUtf8(JSON.stringify(value));
}

function buildDeleteNamedShadowRequestSubscriptions(request: any) : Array<string> {
    let typedRequest: model.DeleteNamedShadowRequest = request;

    return new Array<string>(
        `$aws/things/${typedRequest.thingName}/shadow/name/${typedRequest.shadowName}/delete/+`
    );
}

function deserializeDeleteShadowResponse(payload: ArrayBuffer) : any {
    const payload_text = toUtf8(new Uint8Array(payload));

    return JSON.parse(payload_text);
}

function buildDeleteNamedShadowRequestResponsePaths(request: any) : Array<mqtt_request_response_utils.RequestResponsePath> {
    let typedRequest: model.DeleteNamedShadowRequest = request;

    return new Array<mqtt_request_response_utils.RequestResponsePath>(
        {
            topic: `$aws/things/${typedRequest.thingName}/shadow/name/${typedRequest.shadowName}/delete/accepted`,
            correlationTokenJsonPath: "clientToken",
            deserializer: deserializeDeleteShadowResponse,
        },
        {
            topic: `$aws/things/${typedRequest.thingName}/shadow/name/${typedRequest.shadowName}/delete/rejected`,
            correlationTokenJsonPath: "clientToken",
            deserializer: deserializeErrorResponse,
        },
    )
}

function buildDeleteNamedShadowRequestPublishTopic(request: any) : string {
    let typedRequest: model.DeleteNamedShadowRequest = request;

    return `$aws/things/${typedRequest.thingName}/shadow/name/${typedRequest.shadowName}/delete`;
}

function applyCorrelationTokenToDeleteNamedShadowRequest(request: any) : [any, string | undefined] {
    let typedRequest: model.DeleteNamedShadowRequest = request;

    let correlationToken = uuid();

    typedRequest.clientToken = correlationToken;

    return [typedRequest, correlationToken];
}

function normalizeUpdateNamedShadowRequest(value: model.UpdateNamedShadowRequest) : any {
    let normalizedValue : any = {};

    if (value.clientToken) {
        normalizedValue.clientToken = value.clientToken;
    }

    if (value.version) {
        normalizedValue.version = value.clientToken;
    }

    normalizedValue.state = value.state;

    return normalizedValue;
}

function buildUpdateNamedShadowRequestPayload(request: any) : ArrayBuffer {
    let value = normalizeUpdateNamedShadowRequest(request as model.UpdateNamedShadowRequest);

    return fromUtf8(JSON.stringify(value));
}

function buildUpdateNamedShadowRequestSubscriptions(request: any) : Array<string> {
    let typedRequest: model.UpdateNamedShadowRequest = request;

    return new Array<string>(
        `$aws/things/${typedRequest.thingName}/shadow/name/${typedRequest.shadowName}/delete/accepted`,
        `$aws/things/${typedRequest.thingName}/shadow/name/${typedRequest.shadowName}/delete/rejected`
    );
}

function deserializeUpdateShadowResponse(payload: ArrayBuffer) : any {
    const payload_text = toUtf8(new Uint8Array(payload));

    return JSON.parse(payload_text);
}

function buildUpdateNamedShadowRequestResponsePaths(request: any) : Array<mqtt_request_response_utils.RequestResponsePath> {
    let typedRequest: model.UpdateNamedShadowRequest = request;

    return new Array<mqtt_request_response_utils.RequestResponsePath>(
        {
            topic: `$aws/things/${typedRequest.thingName}/shadow/name/${typedRequest.shadowName}/update/accepted`,
            correlationTokenJsonPath: "clientToken",
            deserializer: deserializeUpdateShadowResponse,
        },
        {
            topic: `$aws/things/${typedRequest.thingName}/shadow/name/${typedRequest.shadowName}/update/rejected`,
            correlationTokenJsonPath: "clientToken",
            deserializer: deserializeErrorResponse,
        },
    )
}

function buildUpdateNamedShadowRequestPublishTopic(request: any) : string {
    let typedRequest: model.UpdateNamedShadowRequest = request;

    return `$aws/things/${typedRequest.thingName}/shadow/name/${typedRequest.shadowName}/update`;
}

function applyCorrelationTokenToUpdateNamedShadowRequest(request: any) : [any, string | undefined] {
    let typedRequest: model.UpdateNamedShadowRequest = request;

    let correlationToken = uuid();

    typedRequest.clientToken = correlationToken;

    return [typedRequest, correlationToken];
}

function createRequestResponseOperationServiceModelMap() : Map<string, mqtt_request_response_utils.RequestResponseOperationModel> {
    return new Map<string, mqtt_request_response_utils.RequestResponseOperationModel>([
        ["GetNamedShadow", {
            inputShapeName: "GetNamedShadowRequest",
            payloadTransformer: buildGetNamedShadowRequestPayload,
            subscriptionGenerator: buildGetNamedShadowRequestSubscriptions,
            responsePathGenerator: buildGetNamedShadowRequestResponsePaths,
            publishTopicGenerator: buildGetNamedShadowRequestPublishTopic,
            correlationTokenApplicator: applyCorrelationTokenToGetNamedShadowRequest,
        }],
        ["DeleteNamedShadow", {
            inputShapeName: "DeleteNamedShadowRequest",
            payloadTransformer: buildDeleteNamedShadowRequestPayload,
            subscriptionGenerator: buildDeleteNamedShadowRequestSubscriptions,
            responsePathGenerator: buildDeleteNamedShadowRequestResponsePaths,
            publishTopicGenerator: buildDeleteNamedShadowRequestPublishTopic,
            correlationTokenApplicator: applyCorrelationTokenToDeleteNamedShadowRequest,
        }],
        ["UpdateNamedShadow", {
            inputShapeName: "UpdateNamedShadowRequest",
            payloadTransformer: buildUpdateNamedShadowRequestPayload,
            subscriptionGenerator: buildUpdateNamedShadowRequestSubscriptions,
            responsePathGenerator: buildUpdateNamedShadowRequestResponsePaths,
            publishTopicGenerator: buildUpdateNamedShadowRequestPublishTopic,
            correlationTokenApplicator: applyCorrelationTokenToUpdateNamedShadowRequest,
        }],
    ]);
}

function buildNamedShadowDeltaUpdatedSubscriptionTopicFilter(config: any) : string {
    const typedConfig : model.NamedShadowDeltaUpdatedSubscriptionRequest = config;

    return `$aws/things/${typedConfig.thingName}/shadow/name/${typedConfig.shadowName}/update/delta`;
}

function deserializeNamedShadowDeltaUpdatedPayload(payload: ArrayBuffer) : any {
    const payload_text = toUtf8(new Uint8Array(payload));

    return JSON.parse(payload_text);
}

function buildNamedShadowUpdatedSubscriptionTopicFilter(config: any) : string {
    const typedConfig : model.NamedShadowUpdatedSubscriptionRequest = config;

    return `$aws/things/${typedConfig.thingName}/shadow/name/${typedConfig.shadowName}/update/document`;
}

function deserializeNamedShadowUpdatedPayload(payload: ArrayBuffer) : any {
    const payload_text = toUtf8(new Uint8Array(payload));

    return JSON.parse(payload_text);
}

function createStreamingOperationServiceModelMap() : Map<string, mqtt_request_response_utils.StreamingOperationModel> {
    return new Map<string, mqtt_request_response_utils.StreamingOperationModel>([
        ["createNamedShadowDeltaUpdatedEventStream", {
            inputShapeName : "NamedShadowDeltaUpdatedSubscriptionRequest",
            subscriptionGenerator: buildNamedShadowDeltaUpdatedSubscriptionTopicFilter,
            deserializer: deserializeNamedShadowDeltaUpdatedPayload,
        }],
        ["createNamedShadowUpdatedEventStream", {
            inputShapeName : "NamedShadowUpdatedSubscriptionRequest",
            subscriptionGenerator: buildNamedShadowUpdatedSubscriptionTopicFilter,
            deserializer: deserializeNamedShadowUpdatedPayload,
        }],
    ]);
}

function validateDeleteNamedShadowRequest(value: any) : void {
    let typedValue : model.DeleteNamedShadowRequest = value;

    mqtt_request_response_utils.validateValueAsTopicSegment(typedValue.thingName, "thingName", "DeleteNamedShadowRequest");
    mqtt_request_response_utils.validateValueAsTopicSegment(typedValue.shadowName, "shadowName", "DeleteNamedShadowRequest");
}

function validateGetNamedShadowRequest(value: any) : void {
    let typedValue : model.GetNamedShadowRequest = value;

    mqtt_request_response_utils.validateValueAsTopicSegment(typedValue.thingName, "thingName", "GetNamedShadowRequest");
    mqtt_request_response_utils.validateValueAsTopicSegment(typedValue.shadowName, "shadowName", "GetNamedShadowRequest");
}

function validateShadowState(value: any) : void {
}

function validateUpdateNamedShadowRequest(value: any) : void {
    let typedValue : model.UpdateNamedShadowRequest = value;

    mqtt_request_response_utils.validateValueAsTopicSegment(typedValue.thingName, "thingName", "UpdateNamedShadowRequest");
    mqtt_request_response_utils.validateValueAsTopicSegment(typedValue.shadowName, "shadowName", "UpdateNamedShadowRequest");
    mqtt_request_response_utils.validateOptionalValueAsNumber(typedValue.version, "version", "UpdateNamedShadowRequest");

    validateShadowState(typedValue.state);
}

function validateNamedShadowDeltaUpdatedSubscriptionRequest(value: any) : void {
    let typedValue : model.NamedShadowDeltaUpdatedSubscriptionRequest = value;

    mqtt_request_response_utils.validateValueAsTopicSegment(typedValue.thingName, "thingName", "NamedShadowDeltaUpdatedSubscriptionRequest");
    mqtt_request_response_utils.validateValueAsTopicSegment(typedValue.shadowName, "shadowName", "NamedShadowDeltaUpdatedSubscriptionRequest");
}

function validateNamedShadowUpdatedSubscriptionRequest(value: any) : void {
    let typedValue : model.NamedShadowUpdatedSubscriptionRequest = value;

    mqtt_request_response_utils.validateValueAsTopicSegment(typedValue.thingName, "thingName", "NamedShadowUpdatedSubscriptionRequest");
    mqtt_request_response_utils.validateValueAsTopicSegment(typedValue.shadowName, "shadowName", "NamedShadowUpdatedSubscriptionRequest");
}

function createValidatorMap() : Map<string, (value: any) => void> {
    return new Map<string, (value: any) => void>([
        ["DeleteNamedShadowRequest", validateDeleteNamedShadowRequest],
        ["GetNamedShadowRequest", validateGetNamedShadowRequest],
        ["UpdateNamedShadowRequest", validateUpdateNamedShadowRequest],
        ["NamedShadowDeltaUpdatedSubscriptionRequest", validateNamedShadowDeltaUpdatedSubscriptionRequest],
        ["NamedShadowUpdatedSubscriptionRequest", validateNamedShadowUpdatedSubscriptionRequest]
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