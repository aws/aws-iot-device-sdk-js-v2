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

function applyCorrelationTokenToDeleteNamedShadowRequest(request: any) : [any, string | undefined] {
    let typedRequest: model.DeleteNamedShadowRequest = request;

    let correlationToken = uuid();

    typedRequest.clientToken = correlationToken;

    return [typedRequest, correlationToken];
}

function normalizeDeleteShadowRequest(value: model.DeleteShadowRequest) : any {
    let normalizedValue : any = {};

    if (value.clientToken) {
        normalizedValue.clientToken = value.clientToken;
    }

    return normalizedValue;
}

function buildDeleteShadowRequestPayload(request: any) : ArrayBuffer {
    let value = normalizeDeleteShadowRequest(request as model.DeleteShadowRequest);

    return fromUtf8(JSON.stringify(value));
}

function applyCorrelationTokenToDeleteShadowRequest(request: any) : [any, string | undefined] {
    let typedRequest: model.DeleteShadowRequest = request;

    let correlationToken = uuid();

    typedRequest.clientToken = correlationToken;

    return [typedRequest, correlationToken];
}

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

function applyCorrelationTokenToGetNamedShadowRequest(request: any) : [any, string | undefined] {
    let typedRequest: model.GetNamedShadowRequest = request;

    let correlationToken = uuid();

    typedRequest.clientToken = correlationToken;

    return [typedRequest, correlationToken];
}

function normalizeGetShadowRequest(value: model.GetShadowRequest) : any {
    let normalizedValue : any = {};

    if (value.clientToken) {
        normalizedValue.clientToken = value.clientToken;
    }

    return normalizedValue;
}

function buildGetShadowRequestPayload(request: any) : ArrayBuffer {
    let value = normalizeGetShadowRequest(request as model.GetShadowRequest);

    return fromUtf8(JSON.stringify(value));
}

function applyCorrelationTokenToGetShadowRequest(request: any) : [any, string | undefined] {
    let typedRequest: model.GetShadowRequest = request;

    let correlationToken = uuid();

    typedRequest.clientToken = correlationToken;

    return [typedRequest, correlationToken];
}

function normalizeUpdateNamedShadowRequest(value: model.UpdateNamedShadowRequest) : any {
    let normalizedValue : any = {};

    if (value.clientToken) {
        normalizedValue.clientToken = value.clientToken;
    }
    if (value.state) {
        normalizedValue.state = value.state;
    }
    if (value.version) {
        normalizedValue.version = value.version;
    }

    return normalizedValue;
}

function buildUpdateNamedShadowRequestPayload(request: any) : ArrayBuffer {
    let value = normalizeUpdateNamedShadowRequest(request as model.UpdateNamedShadowRequest);

    return fromUtf8(JSON.stringify(value));
}

function applyCorrelationTokenToUpdateNamedShadowRequest(request: any) : [any, string | undefined] {
    let typedRequest: model.UpdateNamedShadowRequest = request;

    let correlationToken = uuid();

    typedRequest.clientToken = correlationToken;

    return [typedRequest, correlationToken];
}

function normalizeUpdateShadowRequest(value: model.UpdateShadowRequest) : any {
    let normalizedValue : any = {};

    if (value.clientToken) {
        normalizedValue.clientToken = value.clientToken;
    }
    if (value.state) {
        normalizedValue.state = value.state;
    }
    if (value.version) {
        normalizedValue.version = value.version;
    }

    return normalizedValue;
}

function buildUpdateShadowRequestPayload(request: any) : ArrayBuffer {
    let value = normalizeUpdateShadowRequest(request as model.UpdateShadowRequest);

    return fromUtf8(JSON.stringify(value));
}

function applyCorrelationTokenToUpdateShadowRequest(request: any) : [any, string | undefined] {
    let typedRequest: model.UpdateShadowRequest = request;

    let correlationToken = uuid();

    typedRequest.clientToken = correlationToken;

    return [typedRequest, correlationToken];
}

function buildDeleteNamedShadowSubscriptions(request: any) : Array<string> {
    let typedRequest: model.DeleteNamedShadowRequest = request;

    return new Array<string>(
        `$aws/things/${typedRequest.thingName}/shadow/name/${typedRequest.shadowName}/delete/+`,
    );
}

function buildDeleteNamedShadowPublishTopic(request: any) : string {
    let typedRequest: model.DeleteNamedShadowRequest = request;

    return `$aws/things/${typedRequest.thingName}/shadow/name/${typedRequest.shadowName}/delete`;
}

function buildDeleteNamedShadowResponsePaths(request: any) : Array<mqtt_request_response_utils.RequestResponsePath> {
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
            deserializer: deserializeV2ServiceError,
        },
    );
}

function buildDeleteShadowSubscriptions(request: any) : Array<string> {
    let typedRequest: model.DeleteShadowRequest = request;

    return new Array<string>(
        `$aws/things/${typedRequest.thingName}/shadow/delete/+`,
    );
}

function buildDeleteShadowPublishTopic(request: any) : string {
    let typedRequest: model.DeleteShadowRequest = request;

    return `$aws/things/${typedRequest.thingName}/shadow/delete`;
}

function buildDeleteShadowResponsePaths(request: any) : Array<mqtt_request_response_utils.RequestResponsePath> {
    let typedRequest: model.DeleteShadowRequest = request;

    return new Array<mqtt_request_response_utils.RequestResponsePath>(
        {
            topic: `$aws/things/${typedRequest.thingName}/shadow/delete/accepted`,
            correlationTokenJsonPath: "clientToken",
            deserializer: deserializeDeleteShadowResponse,
        },
        {
            topic: `$aws/things/${typedRequest.thingName}/shadow/delete/rejected`,
            correlationTokenJsonPath: "clientToken",
            deserializer: deserializeV2ServiceError,
        },
    );
}

function buildGetNamedShadowSubscriptions(request: any) : Array<string> {
    let typedRequest: model.GetNamedShadowRequest = request;

    return new Array<string>(
        `$aws/things/${typedRequest.thingName}/shadow/name/${typedRequest.shadowName}/get/+`,
    );
}

function buildGetNamedShadowPublishTopic(request: any) : string {
    let typedRequest: model.GetNamedShadowRequest = request;

    return `$aws/things/${typedRequest.thingName}/shadow/name/${typedRequest.shadowName}/get`;
}

function buildGetNamedShadowResponsePaths(request: any) : Array<mqtt_request_response_utils.RequestResponsePath> {
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
            deserializer: deserializeV2ServiceError,
        },
    );
}

function buildGetShadowSubscriptions(request: any) : Array<string> {
    let typedRequest: model.GetShadowRequest = request;

    return new Array<string>(
        `$aws/things/${typedRequest.thingName}/shadow/get/+`,
    );
}

function buildGetShadowPublishTopic(request: any) : string {
    let typedRequest: model.GetShadowRequest = request;

    return `$aws/things/${typedRequest.thingName}/shadow/get`;
}

function buildGetShadowResponsePaths(request: any) : Array<mqtt_request_response_utils.RequestResponsePath> {
    let typedRequest: model.GetShadowRequest = request;

    return new Array<mqtt_request_response_utils.RequestResponsePath>(
        {
            topic: `$aws/things/${typedRequest.thingName}/shadow/get/accepted`,
            correlationTokenJsonPath: "clientToken",
            deserializer: deserializeGetShadowResponse,
        },
        {
            topic: `$aws/things/${typedRequest.thingName}/shadow/get/rejected`,
            correlationTokenJsonPath: "clientToken",
            deserializer: deserializeV2ServiceError,
        },
    );
}

function buildUpdateNamedShadowSubscriptions(request: any) : Array<string> {
    let typedRequest: model.UpdateNamedShadowRequest = request;

    return new Array<string>(
        `$aws/things/${typedRequest.thingName}/shadow/name/${typedRequest.shadowName}/update/accepted`,
        `$aws/things/${typedRequest.thingName}/shadow/name/${typedRequest.shadowName}/update/rejected`,
    );
}

function buildUpdateNamedShadowPublishTopic(request: any) : string {
    let typedRequest: model.UpdateNamedShadowRequest = request;

    return `$aws/things/${typedRequest.thingName}/shadow/name/${typedRequest.shadowName}/update`;
}

function buildUpdateNamedShadowResponsePaths(request: any) : Array<mqtt_request_response_utils.RequestResponsePath> {
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
            deserializer: deserializeV2ServiceError,
        },
    );
}

function buildUpdateShadowSubscriptions(request: any) : Array<string> {
    let typedRequest: model.UpdateShadowRequest = request;

    return new Array<string>(
        `$aws/things/${typedRequest.thingName}/shadow/update/accepted`,
        `$aws/things/${typedRequest.thingName}/shadow/update/rejected`,
    );
}

function buildUpdateShadowPublishTopic(request: any) : string {
    let typedRequest: model.UpdateShadowRequest = request;

    return `$aws/things/${typedRequest.thingName}/shadow/update`;
}

function buildUpdateShadowResponsePaths(request: any) : Array<mqtt_request_response_utils.RequestResponsePath> {
    let typedRequest: model.UpdateShadowRequest = request;

    return new Array<mqtt_request_response_utils.RequestResponsePath>(
        {
            topic: `$aws/things/${typedRequest.thingName}/shadow/update/accepted`,
            correlationTokenJsonPath: "clientToken",
            deserializer: deserializeUpdateShadowResponse,
        },
        {
            topic: `$aws/things/${typedRequest.thingName}/shadow/update/rejected`,
            correlationTokenJsonPath: "clientToken",
            deserializer: deserializeV2ServiceError,
        },
    );
}

function deserializeDeleteShadowResponse(payload: ArrayBuffer) : any {
    const payload_text = toUtf8(new Uint8Array(payload));

    return JSON.parse(payload_text);
}

function deserializeGetShadowResponse(payload: ArrayBuffer) : any {
    const payload_text = toUtf8(new Uint8Array(payload));

    return JSON.parse(payload_text);
}

function deserializeUpdateShadowResponse(payload: ArrayBuffer) : any {
    const payload_text = toUtf8(new Uint8Array(payload));

    return JSON.parse(payload_text);
}

function deserializeV2ServiceError(payload: ArrayBuffer) : any {
    const payload_text = toUtf8(new Uint8Array(payload));

    return JSON.parse(payload_text);
}

function createRequestResponseOperationServiceModelMap() : Map<string, mqtt_request_response_utils.RequestResponseOperationModel> {
    return new Map<string, mqtt_request_response_utils.RequestResponseOperationModel>([
        ["deleteNamedShadow", {
            inputShapeName: "DeleteNamedShadowRequest",
            payloadTransformer: buildDeleteNamedShadowRequestPayload,
            subscriptionGenerator: buildDeleteNamedShadowSubscriptions,
            responsePathGenerator: buildDeleteNamedShadowResponsePaths,
            publishTopicGenerator: buildDeleteNamedShadowPublishTopic,
            correlationTokenApplicator: applyCorrelationTokenToDeleteNamedShadowRequest,
        }],
        ["deleteShadow", {
            inputShapeName: "DeleteShadowRequest",
            payloadTransformer: buildDeleteShadowRequestPayload,
            subscriptionGenerator: buildDeleteShadowSubscriptions,
            responsePathGenerator: buildDeleteShadowResponsePaths,
            publishTopicGenerator: buildDeleteShadowPublishTopic,
            correlationTokenApplicator: applyCorrelationTokenToDeleteShadowRequest,
        }],
        ["getNamedShadow", {
            inputShapeName: "GetNamedShadowRequest",
            payloadTransformer: buildGetNamedShadowRequestPayload,
            subscriptionGenerator: buildGetNamedShadowSubscriptions,
            responsePathGenerator: buildGetNamedShadowResponsePaths,
            publishTopicGenerator: buildGetNamedShadowPublishTopic,
            correlationTokenApplicator: applyCorrelationTokenToGetNamedShadowRequest,
        }],
        ["getShadow", {
            inputShapeName: "GetShadowRequest",
            payloadTransformer: buildGetShadowRequestPayload,
            subscriptionGenerator: buildGetShadowSubscriptions,
            responsePathGenerator: buildGetShadowResponsePaths,
            publishTopicGenerator: buildGetShadowPublishTopic,
            correlationTokenApplicator: applyCorrelationTokenToGetShadowRequest,
        }],
        ["updateNamedShadow", {
            inputShapeName: "UpdateNamedShadowRequest",
            payloadTransformer: buildUpdateNamedShadowRequestPayload,
            subscriptionGenerator: buildUpdateNamedShadowSubscriptions,
            responsePathGenerator: buildUpdateNamedShadowResponsePaths,
            publishTopicGenerator: buildUpdateNamedShadowPublishTopic,
            correlationTokenApplicator: applyCorrelationTokenToUpdateNamedShadowRequest,
        }],
        ["updateShadow", {
            inputShapeName: "UpdateShadowRequest",
            payloadTransformer: buildUpdateShadowRequestPayload,
            subscriptionGenerator: buildUpdateShadowSubscriptions,
            responsePathGenerator: buildUpdateShadowResponsePaths,
            publishTopicGenerator: buildUpdateShadowPublishTopic,
            correlationTokenApplicator: applyCorrelationTokenToUpdateShadowRequest,
        }],
    ]);
}

function buildCreateNamedShadowDeltaUpdatedStreamTopicFilter(config: any) : string {
    const typedConfig : model.NamedShadowDeltaUpdatedSubscriptionRequest = config;

    return `$aws/things/${typedConfig.thingName}/shadow/name/${typedConfig.shadowName}/update/delta`;
}

function buildCreateNamedShadowUpdatedStreamTopicFilter(config: any) : string {
    const typedConfig : model.NamedShadowUpdatedSubscriptionRequest = config;

    return `$aws/things/${typedConfig.thingName}/shadow/name/${typedConfig.shadowName}/update/documents`;
}

function buildCreateShadowDeltaUpdatedStreamTopicFilter(config: any) : string {
    const typedConfig : model.ShadowDeltaUpdatedSubscriptionRequest = config;

    return `$aws/things/${typedConfig.thingName}/shadow/update/delta`;
}

function buildCreateShadowUpdatedStreamTopicFilter(config: any) : string {
    const typedConfig : model.ShadowUpdatedSubscriptionRequest = config;

    return `$aws/things/${typedConfig.thingName}/shadow/update/documents`;
}


function deserializeShadowDeltaUpdatedEventPayload(payload: ArrayBuffer) : any {
    const payload_text = toUtf8(new Uint8Array(payload));

    return JSON.parse(payload_text);
}

function deserializeShadowUpdatedEventPayload(payload: ArrayBuffer) : any {
    const payload_text = toUtf8(new Uint8Array(payload));

    return JSON.parse(payload_text);
}


function createStreamingOperationServiceModelMap() : Map<string, mqtt_request_response_utils.StreamingOperationModel> {
    return new Map<string, mqtt_request_response_utils.StreamingOperationModel>([
        ["createNamedShadowDeltaUpdatedStream", {
            inputShapeName: "NamedShadowDeltaUpdatedSubscriptionRequest",
            subscriptionGenerator: buildCreateNamedShadowDeltaUpdatedStreamTopicFilter,
            deserializer: deserializeShadowDeltaUpdatedEventPayload,
        }],
        ["createNamedShadowUpdatedStream", {
            inputShapeName: "NamedShadowUpdatedSubscriptionRequest",
            subscriptionGenerator: buildCreateNamedShadowUpdatedStreamTopicFilter,
            deserializer: deserializeShadowUpdatedEventPayload,
        }],
        ["createShadowDeltaUpdatedStream", {
            inputShapeName: "ShadowDeltaUpdatedSubscriptionRequest",
            subscriptionGenerator: buildCreateShadowDeltaUpdatedStreamTopicFilter,
            deserializer: deserializeShadowDeltaUpdatedEventPayload,
        }],
        ["createShadowUpdatedStream", {
            inputShapeName: "ShadowUpdatedSubscriptionRequest",
            subscriptionGenerator: buildCreateShadowUpdatedStreamTopicFilter,
            deserializer: deserializeShadowUpdatedEventPayload,
        }],
    ]);
}

function validateDeleteNamedShadowRequest(value: any) : void {

    // @ts-ignore
    let typedValue : model.DeleteNamedShadowRequest = value;

    model_validation_utils.validateValueAsTopicSegment(value.thingName, 'thingName');
    model_validation_utils.validateValueAsTopicSegment(value.shadowName, 'shadowName');
}

function validateDeleteShadowRequest(value: any) : void {

    // @ts-ignore
    let typedValue : model.DeleteShadowRequest = value;

    model_validation_utils.validateValueAsTopicSegment(value.thingName, 'thingName');
}

function validateGetNamedShadowRequest(value: any) : void {

    // @ts-ignore
    let typedValue : model.GetNamedShadowRequest = value;

    model_validation_utils.validateValueAsTopicSegment(value.thingName, 'thingName');
    model_validation_utils.validateValueAsTopicSegment(value.shadowName, 'shadowName');
}

function validateGetShadowRequest(value: any) : void {

    // @ts-ignore
    let typedValue : model.GetShadowRequest = value;

    model_validation_utils.validateValueAsTopicSegment(value.thingName, 'thingName');
}

function validateNamedShadowDeltaUpdatedSubscriptionRequest(value: any) : void {

    // @ts-ignore
    let typedValue : model.NamedShadowDeltaUpdatedSubscriptionRequest = value;

    model_validation_utils.validateValueAsTopicSegment(value.thingName, 'thingName');
    model_validation_utils.validateValueAsTopicSegment(value.shadowName, 'shadowName');
}

function validateNamedShadowUpdatedSubscriptionRequest(value: any) : void {

    // @ts-ignore
    let typedValue : model.NamedShadowUpdatedSubscriptionRequest = value;

    model_validation_utils.validateValueAsTopicSegment(value.thingName, 'thingName');
    model_validation_utils.validateValueAsTopicSegment(value.shadowName, 'shadowName');
}

function validateShadowDeltaUpdatedSubscriptionRequest(value: any) : void {

    // @ts-ignore
    let typedValue : model.ShadowDeltaUpdatedSubscriptionRequest = value;

    model_validation_utils.validateValueAsTopicSegment(value.thingName, 'thingName');
}

function validateShadowState(value: any) : void {

    // @ts-ignore
    let typedValue : model.ShadowState = value;

    model_validation_utils.validateValueAsOptionalAny(value.desired, 'desired');
    model_validation_utils.validateValueAsOptionalAny(value.reported, 'reported');
}

function validateShadowUpdatedSubscriptionRequest(value: any) : void {

    // @ts-ignore
    let typedValue : model.ShadowUpdatedSubscriptionRequest = value;

    model_validation_utils.validateValueAsTopicSegment(value.thingName, 'thingName');
}

function validateUpdateNamedShadowRequest(value: any) : void {

    // @ts-ignore
    let typedValue : model.UpdateNamedShadowRequest = value;

    model_validation_utils.validateValueAsTopicSegment(value.thingName, 'thingName');
    model_validation_utils.validateValueAsTopicSegment(value.shadowName, 'shadowName');
    model_validation_utils.validateValueAsOptionalObject(value.state, validateShadowState, 'state');
    model_validation_utils.validateValueAsOptionalInteger(value.version, 'version');
}

function validateUpdateShadowRequest(value: any) : void {

    // @ts-ignore
    let typedValue : model.UpdateShadowRequest = value;

    model_validation_utils.validateValueAsTopicSegment(value.thingName, 'thingName');
    model_validation_utils.validateValueAsOptionalObject(value.state, validateShadowState, 'state');
    model_validation_utils.validateValueAsOptionalInteger(value.version, 'version');
}


function createValidatorMap() : Map<string, (value: any) => void> {
    return new Map<string, (value: any) => void>([
        ["NamedShadowDeltaUpdatedSubscriptionRequest", validateNamedShadowDeltaUpdatedSubscriptionRequest],
        ["NamedShadowUpdatedSubscriptionRequest", validateNamedShadowUpdatedSubscriptionRequest],
        ["ShadowDeltaUpdatedSubscriptionRequest", validateShadowDeltaUpdatedSubscriptionRequest],
        ["ShadowUpdatedSubscriptionRequest", validateShadowUpdatedSubscriptionRequest],
        ["DeleteNamedShadowRequest", validateDeleteNamedShadowRequest],
        ["DeleteShadowRequest", validateDeleteShadowRequest],
        ["GetNamedShadowRequest", validateGetNamedShadowRequest],
        ["GetShadowRequest", validateGetShadowRequest],
        ["UpdateNamedShadowRequest", validateUpdateNamedShadowRequest],
        ["UpdateShadowRequest", validateUpdateShadowRequest],
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
