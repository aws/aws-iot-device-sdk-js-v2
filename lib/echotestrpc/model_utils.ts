/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */

/* This file is generated */

import * as eventstream_rpc_utils from "../eventstream_rpc_utils";
import * as model from "./model";
import {eventstream} from "aws-crt";
import * as eventstream_rpc from "../eventstream_rpc";
import {toUtf8} from "@aws-sdk/util-utf8-browser";

function createNormalizerMap() : Map<string, eventstream_rpc.ShapeNormalizer> {
    return new Map<string, eventstream_rpc.ShapeNormalizer>([
        ["awstest#Product", normalizeProduct],
        ["awstest#Pair", normalizePair],
        ["awstest#Customer", normalizeCustomer],
        ["awstest#MessageData", normalizeMessageData],
        ["awstest#EchoStreamingMessage", normalizeEchoStreamingMessage],
        ["awstest#ServiceError", normalizeServiceError],
        ["awstest#GetAllCustomersResponse", normalizeGetAllCustomersResponse],
        ["awstest#GetAllCustomersRequest", normalizeGetAllCustomersRequest],
        ["awstest#EchoMessageResponse", normalizeEchoMessageResponse],
        ["awstest#EchoMessageRequest", normalizeEchoMessageRequest],
        ["awstest#EchoStreamingResponse", normalizeEchoStreamingResponse],
        ["awstest#EchoStreamingRequest", normalizeEchoStreamingRequest],
        ["awstest#CauseServiceErrorResponse", normalizeCauseServiceErrorResponse],
        ["awstest#CauseServiceErrorRequest", normalizeCauseServiceErrorRequest],
        ["awstest#GetAllProductsResponse", normalizeGetAllProductsResponse],
        ["awstest#GetAllProductsRequest", normalizeGetAllProductsRequest]
    ]);
}

function createValidatorMap() : Map<string, eventstream_rpc.ShapeValidator> {
    return new Map<string, eventstream_rpc.ShapeValidator>([
        ["awstest#Product", validateProduct],
        ["awstest#Pair", validatePair],
        ["awstest#Customer", validateCustomer],
        ["awstest#MessageData", validateMessageData],
        ["awstest#EchoStreamingMessage", validateEchoStreamingMessage],
        ["awstest#ServiceError", validateServiceError],
        ["awstest#GetAllCustomersResponse", validateGetAllCustomersResponse],
        ["awstest#GetAllCustomersRequest", validateGetAllCustomersRequest],
        ["awstest#EchoMessageResponse", validateEchoMessageResponse],
        ["awstest#EchoMessageRequest", validateEchoMessageRequest],
        ["awstest#EchoStreamingResponse", validateEchoStreamingResponse],
        ["awstest#EchoStreamingRequest", validateEchoStreamingRequest],
        ["awstest#CauseServiceErrorResponse", validateCauseServiceErrorResponse],
        ["awstest#CauseServiceErrorRequest", validateCauseServiceErrorRequest],
        ["awstest#GetAllProductsResponse", validateGetAllProductsResponse],
        ["awstest#GetAllProductsRequest", validateGetAllProductsRequest]
    ]);
}

function createDeserializerMap() : Map<string, eventstream_rpc.ShapeDeserializer> {
    return new Map<string, eventstream_rpc.ShapeDeserializer>([
        ["awstest#GetAllCustomersResponse", deserializeEventstreamMessageToGetAllCustomersResponse],
        ["awstest#ServiceError", deserializeEventstreamMessageToServiceError],
        ["awstest#EchoStreamingResponse", deserializeEventstreamMessageToEchoStreamingResponse],
        ["awstest#CauseServiceErrorResponse", deserializeEventstreamMessageToCauseServiceErrorResponse],
        ["awstest#EchoMessageResponse", deserializeEventstreamMessageToEchoMessageResponse],
        ["awstest#GetAllProductsResponse", deserializeEventstreamMessageToGetAllProductsResponse],
        ["awstest#EchoStreamingMessage", deserializeEventstreamMessageToEchoStreamingMessage]
    ]);
}

function createSerializerMap() : Map<string, eventstream_rpc.ShapeSerializer> {
    return new Map<string, eventstream_rpc.ShapeSerializer>([
        ["awstest#GetAllProductsRequest", serializeGetAllProductsRequestToEventstreamMessage],
        ["awstest#EchoMessageRequest", serializeEchoMessageRequestToEventstreamMessage],
        ["awstest#GetAllCustomersRequest", serializeGetAllCustomersRequestToEventstreamMessage],
        ["awstest#CauseServiceErrorRequest", serializeCauseServiceErrorRequestToEventstreamMessage],
        ["awstest#EchoStreamingRequest", serializeEchoStreamingRequestToEventstreamMessage],
        ["awstest#EchoStreamingMessage", serializeEchoStreamingMessageToEventstreamMessage]
    ]);
}

function createOperationMap() : Map<string, eventstream_rpc.EventstreamRpcServiceModelOperation> {
    return new Map<string, eventstream_rpc.EventstreamRpcServiceModelOperation>([
        ["awstest#CauseServiceError", {
            requestShape: "awstest#CauseServiceErrorRequest",
            responseShape: "awstest#CauseServiceErrorResponse",
            errorShapes: new Set<string>([
                "awstest#ServiceError"
            ])
        }],
        ["awstest#CauseStreamServiceToError", {
            requestShape: "awstest#EchoStreamingRequest",
            responseShape: "awstest#EchoStreamingResponse",
            outboundMessageShape: "awstest#EchoStreamingMessage",
            inboundMessageShape: "awstest#EchoStreamingMessage",
            errorShapes: new Set<string>([
                "awstest#ServiceError"
            ])
        }],
        ["awstest#EchoMessage", {
            requestShape: "awstest#EchoMessageRequest",
            responseShape: "awstest#EchoMessageResponse",
            errorShapes: new Set<string>([
            ])
        }],
        ["awstest#EchoStreamMessages", {
            requestShape: "awstest#EchoStreamingRequest",
            responseShape: "awstest#EchoStreamingResponse",
            outboundMessageShape: "awstest#EchoStreamingMessage",
            inboundMessageShape: "awstest#EchoStreamingMessage",
            errorShapes: new Set<string>([
            ])
        }],
        ["awstest#GetAllCustomers", {
            requestShape: "awstest#GetAllCustomersRequest",
            responseShape: "awstest#GetAllCustomersResponse",
            errorShapes: new Set<string>([
                "awstest#ServiceError"
            ])
        }],
        ["awstest#GetAllProducts", {
            requestShape: "awstest#GetAllProductsRequest",
            responseShape: "awstest#GetAllProductsResponse",
            errorShapes: new Set<string>([
                "awstest#ServiceError"
            ])
        }]
    ]);
}

const FruitEnumValues : Set<string> = new Set<string>([
    "apl",
    "org",
    "ban",
    "pin"
]);


function createEnumsMap() : Map<string, Set<string>> {
    return new Map<string, Set<string>>([
        ["FruitEnum", FruitEnumValues],
    ]);
}

export function makeServiceModel() : eventstream_rpc.EventstreamRpcServiceModel {
    return {
        normalizers: createNormalizerMap(),
        validators: createValidatorMap(),
        deserializers: createDeserializerMap(),
        serializers: createSerializerMap(),
        operations: createOperationMap(),
        enums: createEnumsMap()
    };
}

export function normalizeProduct(value : model.Product) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'name', value.name);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'price', value.price);

    return normalizedValue;
}

export function normalizePair(value : model.Pair) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'key', value.key);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'value', value.value);

    return normalizedValue;
}

export function normalizeCustomer(value : model.Customer) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'id', value.id);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'firstName', value.firstName);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'lastName', value.lastName);

    return normalizedValue;
}

export function normalizeMessageData(value : model.MessageData) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'stringMessage', value.stringMessage);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'booleanMessage', value.booleanMessage);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'timeMessage', value.timeMessage, eventstream_rpc_utils.encodeDateAsNumber);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'documentMessage', value.documentMessage);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'enumMessage', value.enumMessage);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'blobMessage', value.blobMessage, eventstream_rpc_utils.encodePayloadAsString);
    eventstream_rpc_utils.setDefinedArrayProperty(normalizedValue, 'stringListMessage', value.stringListMessage, undefined);
    eventstream_rpc_utils.setDefinedArrayProperty(normalizedValue, 'keyValuePairList', value.keyValuePairList, normalizePair);
    eventstream_rpc_utils.setDefinedMapPropertyAsObject(normalizedValue, 'stringToValue', value.stringToValue, undefined, normalizeProduct);

    return normalizedValue;
}

export function normalizeEchoStreamingMessage(value : model.EchoStreamingMessage) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'streamMessage', value.streamMessage, normalizeMessageData);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'keyValuePair', value.keyValuePair, normalizePair);

    return normalizedValue;
}

export function normalizeServiceError(value : model.ServiceError) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'message', value.message);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'value', value.value);

    return normalizedValue;
}

export function normalizeGetAllCustomersResponse(value : model.GetAllCustomersResponse) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedArrayProperty(normalizedValue, 'customers', value.customers, normalizeCustomer);

    return normalizedValue;
}

export function normalizeGetAllCustomersRequest(value : model.GetAllCustomersRequest) : any {
    let normalizedValue : any = {};

    return normalizedValue;
}

export function normalizeEchoMessageResponse(value : model.EchoMessageResponse) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'message', value.message, normalizeMessageData);

    return normalizedValue;
}

export function normalizeEchoMessageRequest(value : model.EchoMessageRequest) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'message', value.message, normalizeMessageData);

    return normalizedValue;
}

export function normalizeEchoStreamingResponse(value : model.EchoStreamingResponse) : any {
    let normalizedValue : any = {};

    return normalizedValue;
}

export function normalizeEchoStreamingRequest(value : model.EchoStreamingRequest) : any {
    let normalizedValue : any = {};

    return normalizedValue;
}

export function normalizeCauseServiceErrorResponse(value : model.CauseServiceErrorResponse) : any {
    let normalizedValue : any = {};

    return normalizedValue;
}

export function normalizeCauseServiceErrorRequest(value : model.CauseServiceErrorRequest) : any {
    let normalizedValue : any = {};

    return normalizedValue;
}

export function normalizeGetAllProductsResponse(value : model.GetAllProductsResponse) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedMapPropertyAsObject(normalizedValue, 'products', value.products, undefined, normalizeProduct);

    return normalizedValue;
}

export function normalizeGetAllProductsRequest(value : model.GetAllProductsRequest) : any {
    let normalizedValue : any = {};

    return normalizedValue;
}

export function validateProduct(value : model.Product) : void {
    eventstream_rpc_utils.validateValueAsOptionalString(value.name, 'name', 'Product');
    eventstream_rpc_utils.validateValueAsOptionalNumber(value.price, 'price', 'Product');
}

export function validatePair(value : model.Pair) : void {
    eventstream_rpc_utils.validateValueAsString(value.key, 'key', 'Pair');
    eventstream_rpc_utils.validateValueAsString(value.value, 'value', 'Pair');
}

export function validateCustomer(value : model.Customer) : void {
    eventstream_rpc_utils.validateValueAsOptionalInteger(value.id, 'id', 'Customer');
    eventstream_rpc_utils.validateValueAsOptionalString(value.firstName, 'firstName', 'Customer');
    eventstream_rpc_utils.validateValueAsOptionalString(value.lastName, 'lastName', 'Customer');
}

export function validateMessageData(value : model.MessageData) : void {
    eventstream_rpc_utils.validateValueAsOptionalString(value.stringMessage, 'stringMessage', 'MessageData');
    eventstream_rpc_utils.validateValueAsOptionalBoolean(value.booleanMessage, 'booleanMessage', 'MessageData');
    eventstream_rpc_utils.validateValueAsOptionalDate(value.timeMessage, 'timeMessage', 'MessageData');
    eventstream_rpc_utils.validateValueAsOptionalAny(value.documentMessage, 'documentMessage', 'MessageData');
    eventstream_rpc_utils.validateValueAsOptionalString(value.enumMessage, 'enumMessage', 'MessageData');
    eventstream_rpc_utils.validateValueAsOptionalBlob(value.blobMessage, 'blobMessage', 'MessageData');
    eventstream_rpc_utils.validateValueAsOptionalArray(value.stringListMessage, eventstream_rpc_utils.validateValueAsString, 'stringListMessage', 'MessageData');
    eventstream_rpc_utils.validateValueAsOptionalArray(value.keyValuePairList, validatePair, 'keyValuePairList', 'MessageData');
    eventstream_rpc_utils.validateValueAsOptionalMap(value.stringToValue, eventstream_rpc_utils.validateValueAsString, validateProduct, 'stringToValue', 'MessageData');
}

const _EchoStreamingMessagePropertyValidators : Map<string, eventstream_rpc_utils.ElementValidator> = new Map<string, eventstream_rpc_utils.ElementValidator>([
    ["streamMessage", validateMessageData],
    ["keyValuePair", validatePair]
]);

export function validateEchoStreamingMessage(value : model.EchoStreamingMessage) : void {
    eventstream_rpc_utils.validateValueAsUnion(value, _EchoStreamingMessagePropertyValidators);
}

export function validateServiceError(value : model.ServiceError) : void {
    eventstream_rpc_utils.validateValueAsOptionalString(value.message, 'message', 'ServiceError');
    eventstream_rpc_utils.validateValueAsOptionalString(value.value, 'value', 'ServiceError');
}

export function validateGetAllCustomersResponse(value : model.GetAllCustomersResponse) : void {
    eventstream_rpc_utils.validateValueAsOptionalArray(value.customers, validateCustomer, 'customers', 'GetAllCustomersResponse');
}

export function validateGetAllCustomersRequest(value : model.GetAllCustomersRequest) : void {
}

export function validateEchoMessageResponse(value : model.EchoMessageResponse) : void {
    eventstream_rpc_utils.validateValueAsOptionalObject(value.message, validateMessageData, 'message', 'EchoMessageResponse');
}

export function validateEchoMessageRequest(value : model.EchoMessageRequest) : void {
    eventstream_rpc_utils.validateValueAsOptionalObject(value.message, validateMessageData, 'message', 'EchoMessageRequest');
}

export function validateEchoStreamingResponse(value : model.EchoStreamingResponse) : void {
}

export function validateEchoStreamingRequest(value : model.EchoStreamingRequest) : void {
}

export function validateCauseServiceErrorResponse(value : model.CauseServiceErrorResponse) : void {
}

export function validateCauseServiceErrorRequest(value : model.CauseServiceErrorRequest) : void {
}

export function validateGetAllProductsResponse(value : model.GetAllProductsResponse) : void {
    eventstream_rpc_utils.validateValueAsOptionalMap(value.products, eventstream_rpc_utils.validateValueAsString, validateProduct, 'products', 'GetAllProductsResponse');
}

export function validateGetAllProductsRequest(value : model.GetAllProductsRequest) : void {
}

export function deserializeProduct(value : model.Product) : model.Product {
    return value;
}

export function deserializePair(value : model.Pair) : model.Pair {
    return value;
}

export function deserializeCustomer(value : model.Customer) : model.Customer {
    return value;
}

export function deserializeMessageData(value : model.MessageData) : model.MessageData {
    eventstream_rpc_utils.setDefinedProperty(value, 'timeMessage', value.timeMessage, eventstream_rpc_utils.transformNumberAsDate);
    eventstream_rpc_utils.setDefinedProperty(value, 'blobMessage', value.blobMessage, eventstream_rpc_utils.transformStringAsPayload);
    eventstream_rpc_utils.setDefinedArrayProperty(value, 'keyValuePairList', value.keyValuePairList, deserializePair);
    eventstream_rpc_utils.setDefinedObjectPropertyAsMap(value, 'stringToValue', value.stringToValue, undefined, deserializeProduct);
    return value;
}

export function deserializeEchoStreamingMessage(value : model.EchoStreamingMessage) : model.EchoStreamingMessage {
    eventstream_rpc_utils.setDefinedProperty(value, 'streamMessage', value.streamMessage, deserializeMessageData);
    eventstream_rpc_utils.setDefinedProperty(value, 'keyValuePair', value.keyValuePair, deserializePair);
    return value;
}

export function deserializeServiceError(value : model.ServiceError) : model.ServiceError {
    return value;
}

export function deserializeGetAllCustomersResponse(value : model.GetAllCustomersResponse) : model.GetAllCustomersResponse {
    eventstream_rpc_utils.setDefinedArrayProperty(value, 'customers', value.customers, deserializeCustomer);
    return value;
}

export function deserializeGetAllCustomersRequest(value : model.GetAllCustomersRequest) : model.GetAllCustomersRequest {
    return value;
}

export function deserializeEchoMessageResponse(value : model.EchoMessageResponse) : model.EchoMessageResponse {
    eventstream_rpc_utils.setDefinedProperty(value, 'message', value.message, deserializeMessageData);
    return value;
}

export function deserializeEchoMessageRequest(value : model.EchoMessageRequest) : model.EchoMessageRequest {
    eventstream_rpc_utils.setDefinedProperty(value, 'message', value.message, deserializeMessageData);
    return value;
}

export function deserializeEchoStreamingResponse(value : model.EchoStreamingResponse) : model.EchoStreamingResponse {
    return value;
}

export function deserializeEchoStreamingRequest(value : model.EchoStreamingRequest) : model.EchoStreamingRequest {
    return value;
}

export function deserializeCauseServiceErrorResponse(value : model.CauseServiceErrorResponse) : model.CauseServiceErrorResponse {
    return value;
}

export function deserializeCauseServiceErrorRequest(value : model.CauseServiceErrorRequest) : model.CauseServiceErrorRequest {
    return value;
}

export function deserializeGetAllProductsResponse(value : model.GetAllProductsResponse) : model.GetAllProductsResponse {
    eventstream_rpc_utils.setDefinedObjectPropertyAsMap(value, 'products', value.products, undefined, deserializeProduct);
    return value;
}

export function deserializeGetAllProductsRequest(value : model.GetAllProductsRequest) : model.GetAllProductsRequest {
    return value;
}

export function deserializeEventstreamMessageToGetAllCustomersResponse(message: eventstream.Message) : model.GetAllCustomersResponse {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.GetAllCustomersResponse = JSON.parse(payload_text) as model.GetAllCustomersResponse;

    return deserializeGetAllCustomersResponse(response);
}

export function deserializeEventstreamMessageToServiceError(message: eventstream.Message) : model.ServiceError {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.ServiceError = JSON.parse(payload_text) as model.ServiceError;

    return deserializeServiceError(response);
}

export function deserializeEventstreamMessageToEchoStreamingResponse(message: eventstream.Message) : model.EchoStreamingResponse {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.EchoStreamingResponse = JSON.parse(payload_text) as model.EchoStreamingResponse;

    return deserializeEchoStreamingResponse(response);
}

export function deserializeEventstreamMessageToCauseServiceErrorResponse(message: eventstream.Message) : model.CauseServiceErrorResponse {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.CauseServiceErrorResponse = JSON.parse(payload_text) as model.CauseServiceErrorResponse;

    return deserializeCauseServiceErrorResponse(response);
}

export function deserializeEventstreamMessageToEchoMessageResponse(message: eventstream.Message) : model.EchoMessageResponse {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.EchoMessageResponse = JSON.parse(payload_text) as model.EchoMessageResponse;

    return deserializeEchoMessageResponse(response);
}

export function deserializeEventstreamMessageToGetAllProductsResponse(message: eventstream.Message) : model.GetAllProductsResponse {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.GetAllProductsResponse = JSON.parse(payload_text) as model.GetAllProductsResponse;

    return deserializeGetAllProductsResponse(response);
}

export function deserializeEventstreamMessageToEchoStreamingMessage(message: eventstream.Message) : model.EchoStreamingMessage {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.EchoStreamingMessage = JSON.parse(payload_text) as model.EchoStreamingMessage;

    return deserializeEchoStreamingMessage(response);
}

export function serializeGetAllProductsRequestToEventstreamMessage(request : model.GetAllProductsRequest) : eventstream.Message {
    return {
        type: eventstream.MessageType.ApplicationMessage,
        payload: JSON.stringify(normalizeGetAllProductsRequest(request))
    };
}

export function serializeEchoMessageRequestToEventstreamMessage(request : model.EchoMessageRequest) : eventstream.Message {
    return {
        type: eventstream.MessageType.ApplicationMessage,
        payload: JSON.stringify(normalizeEchoMessageRequest(request))
    };
}

export function serializeGetAllCustomersRequestToEventstreamMessage(request : model.GetAllCustomersRequest) : eventstream.Message {
    return {
        type: eventstream.MessageType.ApplicationMessage,
        payload: JSON.stringify(normalizeGetAllCustomersRequest(request))
    };
}

export function serializeCauseServiceErrorRequestToEventstreamMessage(request : model.CauseServiceErrorRequest) : eventstream.Message {
    return {
        type: eventstream.MessageType.ApplicationMessage,
        payload: JSON.stringify(normalizeCauseServiceErrorRequest(request))
    };
}

export function serializeEchoStreamingRequestToEventstreamMessage(request : model.EchoStreamingRequest) : eventstream.Message {
    return {
        type: eventstream.MessageType.ApplicationMessage,
        payload: JSON.stringify(normalizeEchoStreamingRequest(request))
    };
}

export function serializeEchoStreamingMessageToEventstreamMessage(request : model.EchoStreamingMessage) : eventstream.Message {
    return {
        type: eventstream.MessageType.ApplicationMessage,
        payload: JSON.stringify(normalizeEchoStreamingMessage(request))
    };
}

