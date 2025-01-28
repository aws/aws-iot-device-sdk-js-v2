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

function normalizeCreateCertificateFromCsrRequest(value: model.CreateCertificateFromCsrRequest) : any {
    let normalizedValue : any = {};

    if (value.certificateSigningRequest) {
        normalizedValue.certificateSigningRequest = value.certificateSigningRequest;
    }

    return normalizedValue;
}

function buildCreateCertificateFromCsrRequestPayload(request: any) : ArrayBuffer {
    let value = normalizeCreateCertificateFromCsrRequest(request as model.CreateCertificateFromCsrRequest);

    return fromUtf8(JSON.stringify(value));
}

function applyCorrelationTokenToCreateCertificateFromCsrRequest(request: any) : [any, string | undefined] {
    return [request, undefined];
}

function normalizeCreateKeysAndCertificateRequest(value: model.CreateKeysAndCertificateRequest) : any {
    let normalizedValue : any = {};


    return normalizedValue;
}

function buildCreateKeysAndCertificateRequestPayload(request: any) : ArrayBuffer {
    let value = normalizeCreateKeysAndCertificateRequest(request as model.CreateKeysAndCertificateRequest);

    return fromUtf8(JSON.stringify(value));
}

function applyCorrelationTokenToCreateKeysAndCertificateRequest(request: any) : [any, string | undefined] {
    return [request, undefined];
}

function normalizeRegisterThingRequest(value: model.RegisterThingRequest) : any {
    let normalizedValue : any = {};

    if (value.certificateOwnershipToken) {
        normalizedValue.certificateOwnershipToken = value.certificateOwnershipToken;
    }
    if (value.parameters) {
        normalizedValue.parameters = value.parameters;
    }

    return normalizedValue;
}

function buildRegisterThingRequestPayload(request: any) : ArrayBuffer {
    let value = normalizeRegisterThingRequest(request as model.RegisterThingRequest);

    return fromUtf8(JSON.stringify(value));
}

function applyCorrelationTokenToRegisterThingRequest(request: any) : [any, string | undefined] {
    return [request, undefined];
}

function buildCreateCertificateFromCsrSubscriptions(request: any) : Array<string> {

    return new Array<string>(
        `$aws/certificates/create-from-csr/json/accepted`,
        `$aws/certificates/create-from-csr/json/rejected`,
    );
}

function buildCreateCertificateFromCsrPublishTopic(request: any) : string {

    return `$aws/certificates/create-from-csr/json`;
}

function buildCreateCertificateFromCsrResponsePaths(request: any) : Array<mqtt_request_response_utils.RequestResponsePath> {

    return new Array<mqtt_request_response_utils.RequestResponsePath>(
        {
            topic: `$aws/certificates/create-from-csr/json/accepted`,
            deserializer: deserializeCreateCertificateFromCsrResponse,
        },
        {
            topic: `$aws/certificates/create-from-csr/json/rejected`,
            deserializer: deserializeV2ServiceError,
        },
    );
}

function buildCreateKeysAndCertificateSubscriptions(request: any) : Array<string> {

    return new Array<string>(
        `$aws/certificates/create/json/accepted`,
        `$aws/certificates/create/json/rejected`,
    );
}

function buildCreateKeysAndCertificatePublishTopic(request: any) : string {

    return `$aws/certificates/create/json`;
}

function buildCreateKeysAndCertificateResponsePaths(request: any) : Array<mqtt_request_response_utils.RequestResponsePath> {

    return new Array<mqtt_request_response_utils.RequestResponsePath>(
        {
            topic: `$aws/certificates/create/json/accepted`,
            deserializer: deserializeCreateKeysAndCertificateResponse,
        },
        {
            topic: `$aws/certificates/create/json/rejected`,
            deserializer: deserializeV2ServiceError,
        },
    );
}

function buildRegisterThingSubscriptions(request: any) : Array<string> {
    let typedRequest: model.RegisterThingRequest = request;

    return new Array<string>(
        `$aws/provisioning-templates/${typedRequest.templateName}/provision/json/accepted`,
        `$aws/provisioning-templates/${typedRequest.templateName}/provision/json/rejected`,
    );
}

function buildRegisterThingPublishTopic(request: any) : string {
    let typedRequest: model.RegisterThingRequest = request;

    return `$aws/provisioning-templates/${typedRequest.templateName}/provision/json`;
}

function buildRegisterThingResponsePaths(request: any) : Array<mqtt_request_response_utils.RequestResponsePath> {
    let typedRequest: model.RegisterThingRequest = request;

    return new Array<mqtt_request_response_utils.RequestResponsePath>(
        {
            topic: `$aws/provisioning-templates/${typedRequest.templateName}/provision/json/accepted`,
            deserializer: deserializeRegisterThingResponse,
        },
        {
            topic: `$aws/provisioning-templates/${typedRequest.templateName}/provision/json/rejected`,
            deserializer: deserializeV2ServiceError,
        },
    );
}

function deserializeCreateCertificateFromCsrResponse(payload: ArrayBuffer) : any {
    const payload_text = toUtf8(new Uint8Array(payload));

    return JSON.parse(payload_text);
}

function deserializeCreateKeysAndCertificateResponse(payload: ArrayBuffer) : any {
    const payload_text = toUtf8(new Uint8Array(payload));

    return JSON.parse(payload_text);
}

function deserializeRegisterThingResponse(payload: ArrayBuffer) : any {
    const payload_text = toUtf8(new Uint8Array(payload));

    return JSON.parse(payload_text);
}

function deserializeV2ErrorResponse(payload: ArrayBuffer) : any {
    const payload_text = toUtf8(new Uint8Array(payload));

    return JSON.parse(payload_text);
}

function createRequestResponseOperationServiceModelMap() : Map<string, mqtt_request_response_utils.RequestResponseOperationModel> {
    return new Map<string, mqtt_request_response_utils.RequestResponseOperationModel>([
        ["createCertificateFromCsr", {
            inputShapeName: "CreateCertificateFromCsrRequest",
            payloadTransformer: buildCreateCertificateFromCsrRequestPayload,
            subscriptionGenerator: buildCreateCertificateFromCsrSubscriptions,
            responsePathGenerator: buildCreateCertificateFromCsrResponsePaths,
            publishTopicGenerator: buildCreateCertificateFromCsrPublishTopic,
            correlationTokenApplicator: applyCorrelationTokenToCreateCertificateFromCsrRequest,
        }],
        ["createKeysAndCertificate", {
            inputShapeName: "CreateKeysAndCertificateRequest",
            payloadTransformer: buildCreateKeysAndCertificateRequestPayload,
            subscriptionGenerator: buildCreateKeysAndCertificateSubscriptions,
            responsePathGenerator: buildCreateKeysAndCertificateResponsePaths,
            publishTopicGenerator: buildCreateKeysAndCertificatePublishTopic,
            correlationTokenApplicator: applyCorrelationTokenToCreateKeysAndCertificateRequest,
        }],
        ["registerThing", {
            inputShapeName: "RegisterThingRequest",
            payloadTransformer: buildRegisterThingRequestPayload,
            subscriptionGenerator: buildRegisterThingSubscriptions,
            responsePathGenerator: buildRegisterThingResponsePaths,
            publishTopicGenerator: buildRegisterThingPublishTopic,
            correlationTokenApplicator: applyCorrelationTokenToRegisterThingRequest,
        }],
    ]);
}



function createStreamingOperationServiceModelMap() : Map<string, mqtt_request_response_utils.StreamingOperationModel> {
    return new Map<string, mqtt_request_response_utils.StreamingOperationModel>([
    ]);
}

function validateCreateCertificateFromCsrRequest(value: any) : void {

    // @ts-ignore
    let typedValue : model.CreateCertificateFromCsrRequest = value;

    model_validation_utils.validateValueAsString(value.certificateSigningRequest, 'certificateSigningRequest');
}

function validateCreateKeysAndCertificateRequest(value: any) : void {

    // @ts-ignore
    let typedValue : model.CreateKeysAndCertificateRequest = value;

}

function validateRegisterThingRequest(value: any) : void {

    // @ts-ignore
    let typedValue : model.RegisterThingRequest = value;

    model_validation_utils.validateValueAsTopicSegment(value.templateName, 'templateName');
    model_validation_utils.validateValueAsString(value.certificateOwnershipToken, 'certificateOwnershipToken');
    model_validation_utils.validateValueAsOptionalMap(value.parameters, model_validation_utils.validateValueAsString, model_validation_utils.validateValueAsString, 'parameters');
}


function createValidatorMap() : Map<string, (value: any) => void> {
    return new Map<string, (value: any) => void>([
        ["CreateCertificateFromCsrRequest", validateCreateCertificateFromCsrRequest],
        ["CreateKeysAndCertificateRequest", validateCreateKeysAndCertificateRequest],
        ["RegisterThingRequest", validateRegisterThingRequest],
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
