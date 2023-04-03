/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */

import * as eventstream_rpc_utils from "../eventstream_rpc_utils";
import * as model from "./model";
import {eventstream} from "aws-crt";
import * as eventstream_rpc from "../eventstream_rpc";
import {toUtf8} from "@aws-sdk/util-utf8-browser";

function createNormalizerMap() : Map<string, eventstream_rpc.ShapeNormalizer> {
    return new Map<string, eventstream_rpc.ShapeNormalizer>([
        ["awstest#Pair", normalizePair],
        ["awstest#Product", normalizeProduct],
        ["awstest#MessageData", normalizeMessageData],
        ["awstest#EchoMessageRequest", normalizeEchoMessageRequest],
        ["awstest#EchoMessageResponse", normalizeEchoMessageResponse],
        ["awstest#CauseServiceErrorRequest", normalizeCauseServiceErrorRequest],
        ["awstest#CauseServiceErrorResponse", normalizeCauseServiceErrorResponse],
        ["awstest#ServiceError", normalizeServiceError],
        ["awstest#Customer", normalizeCustomer],
        ["awstest#EchoStreamingRequest", normalizeEchoStreamingRequest],
        ["awstest#EchoStreamingResponse", normalizeEchoStreamingResponse],
        ["awstest#EchoStreamingMessage", normalizeEchoStreamingMessage],
        ["awstest#GetAllCustomersRequest", normalizeGetAllCustomersRequest],
        ["awstest#GetAllCustomersResponse", normalizeGetAllCustomersResponse],
        ["awstest#GetAllProductsRequest", normalizeGetAllProductsRequest],
        ["awstest#GetAllProductsResponse", normalizeGetAllProductsResponse]
    ])
}

function createValidatorMap() : Map<string, eventstream_rpc.ShapeValidator> {
    return new Map<string, eventstream_rpc.ShapeValidator>([
        ["awstest#Pair", validatePair],
        ["awstest#Product", validateProduct],
        ["awstest#MessageData", validateMessageData],
        ["awstest#EchoMessageRequest", validateEchoMessageRequest],
        ["awstest#EchoMessageResponse", validateEchoMessageResponse],
        ["awstest#CauseServiceErrorRequest", validateCauseServiceErrorRequest],
        ["awstest#CauseServiceErrorResponse", validateCauseServiceErrorResponse],
        ["awstest#ServiceError", validateServiceError],
        ["awstest#Customer", validateCustomer],
        ["awstest#EchoStreamingRequest", validateEchoStreamingRequest],
        ["awstest#EchoStreamingResponse", validateEchoStreamingResponse],
        ["awstest#EchoStreamingMessage", validateEchoStreamingMessage],
        ["awstest#GetAllCustomersRequest", validateGetAllCustomersRequest],
        ["awstest#GetAllCustomersResponse", validateGetAllCustomersResponse],
        ["awstest#GetAllProductsRequest", validateGetAllProductsRequest],
        ["awstest#GetAllProductsResponse", validateGetAllProductsResponse]
    ])
}

function createDeserializerMap() : Map<string, eventstream_rpc.ShapeDeserializer> {
    return new Map<string, eventstream_rpc.ShapeDeserializer>([
        ["awstest#EchoMessageResponse", deserializeEventstreamMessageToEchoMessageResponse],
        ["awstest#CauseServiceErrorResponse", deserializeEventstreamMessageToCauseServiceErrorResponse],
        ["awstest#ServiceError", deserializeEventstreamMessageToServiceError],
        ["awstest#EchoStreamingResponse", deserializeEventstreamMessageToEchoStreamingResponse],
        ["awstest#EchoStreamingMessage", deserializeEventstreamMessageToEchoStreamingMessage],
        ["awstest#GetAllCustomersResponse", deserializeEventstreamMessageToGetAllCustomersResponse],
        ["awstest#GetAllProductsResponse", deserializeEventstreamMessageToGetAllProductsResponse]
    ])
}

function createSerializerMap() : Map<string, eventstream_rpc.ShapeSerializer> {
    return new Map<string, eventstream_rpc.ShapeSerializer>([
        ["awstest#EchoMessageRequest", serializeEchoMessageRequestToEventstreamMessage],
        ["awstest#CauseServiceErrorRequest", serializeCauseServiceErrorRequestToEventstreamMessage],
        ["awstest#EchoStreamingRequest", serializeEchoStreamingRequestToEventstreamMessage],
        ["awstest#GetAllCustomersRequest", serializeGetAllCustomersRequestToEventstreamMessage],
        ["awstest#GetAllProductsRequest", serializeGetAllProductsRequestToEventstreamMessage]
    ])
}

function createOperationMap() : Map<string, eventstream_rpc.EventstreamRpcServiceModelOperation> {
    return new Map<string, eventstream_rpc.EventstreamRpcServiceModelOperation>([
        ["awstest#EchoMessage", {
            requestShape: "awstest#EchoMessageRequest",
            responseShape: "awstest#EchoMessageResponse",
            errorShapes: new Set<string>([])
        }],
        ["awstest#CauseServiceError", {
            requestShape: "awstest#CauseServiceErrorRequest",
            responseShape: "awstest#CauseServiceErrorResponse",
            errorShapes: new Set<string>(["awstest#ServiceError"])
        }],
        ["awstest#CauseStreamServiceToError", {
            requestShape: "awstest#EchoStreamingRequest",
            responseShape: "awstest#EchoStreamingResponse",
            errorShapes: new Set<string>(["awstest#ServiceError"])
        }],
        ["awstest#EchoStreamMessages", {
            requestShape: "awstest#EchoStreamingRequest",
            responseShape: "awstest#EchoStreamingResponse",
            errorShapes: new Set<string>([])
        }],
        ["awstest#GetAllCustomers", {
            requestShape: "awstest#GetAllCustomersRequest",
            responseShape: "awstest#GetAllCustomersResponse",
            errorShapes: new Set<string>(["awstest#ServiceError"])
        }],
        ["awstest#GetAllProducts", {
            requestShape: "awstest#GetAllProductsRequest",
            responseShape: "awstest#GetAllProductsResponse",
            errorShapes: new Set<string>(["awstest#ServiceError"])
        }]
    ])
}

export function makeServiceModel() : eventstream_rpc.EventstreamRpcServiceModel {
    return {
        normalizers: createNormalizerMap(),
        validators: createValidatorMap(),
        deserializers: createDeserializerMap(),
        serializers: createSerializerMap(),
        operations: createOperationMap()
    }
}

export function normalizePair(pair : model.Pair) : any {
    let normalized : any = {};

    eventstream_rpc_utils.setDefinedProperty(normalized, 'key', pair.key);
    eventstream_rpc_utils.setDefinedProperty(normalized, 'value', pair.value);

    return normalized;
}

export function deserializePair(pair : model.Pair) : model.Pair {
    return pair;
}

export function validatePair(pair : model.Pair) : void {
    eventstream_rpc_utils.validateValueAsString(pair.key, 'key', 'Pair');
    eventstream_rpc_utils.validateValueAsString(pair.value, 'value', 'Pair');
}

export function normalizeProduct(product : model.Product) : any {
    let normalized : any = {};

    eventstream_rpc_utils.setDefinedProperty(normalized, 'name', product.name);
    eventstream_rpc_utils.setDefinedProperty(normalized, 'price', product.price);

    return normalized;
}

export function deserializeProduct(product : model.Product) : model.Product {
    return product
}

export function validateProduct(product : model.Product) : any {
    eventstream_rpc_utils.validateValueAsOptionalString(product.name, 'name', 'Product');
    eventstream_rpc_utils.validateValueAsOptionalNumber(product.price, 'price', 'Product');
}

export function normalizeMessageData(messageData : model.MessageData) : any {
    let normalized : any = {};

    eventstream_rpc_utils.setDefinedProperty(normalized, 'stringMessage', messageData.stringMessage);
    eventstream_rpc_utils.setDefinedProperty(normalized, 'booleanMessage', messageData.booleanMessage);
    eventstream_rpc_utils.setDefinedProperty(normalized, 'timeMessage', messageData.timeMessage, eventstream_rpc_utils.encodeDateAsNumber);
    eventstream_rpc_utils.setDefinedProperty(normalized, 'documentMessage', messageData.documentMessage);
    eventstream_rpc_utils.setDefinedProperty(normalized, 'enumMessage', messageData.enumMessage);
    eventstream_rpc_utils.setDefinedProperty(normalized, 'blobMessage', messageData.blobMessage, eventstream_rpc_utils.encodePayloadAsString);
    eventstream_rpc_utils.setDefinedProperty(normalized, 'stringListMessage', messageData.stringListMessage);
    eventstream_rpc_utils.setDefinedArrayProperty(normalized, 'keyValuePairList', messageData.keyValuePairList, normalizePair);
    eventstream_rpc_utils.setDefinedMapPropertyAsObject(normalized, 'stringToValue', messageData.stringToValue, normalizeProduct);

    return normalized;
}

export function deserializeMessageData(messageData : model.MessageData) : model.MessageData {
    eventstream_rpc_utils.setDefinedProperty(messageData, 'timeMessage', messageData.timeMessage, eventstream_rpc_utils.transformNumberAsDate);
    eventstream_rpc_utils.setDefinedProperty(messageData, 'blobMessage', messageData.blobMessage, eventstream_rpc_utils.transformStringAsPayload);
    eventstream_rpc_utils.setDefinedArrayProperty(messageData, 'keyValuePairList', messageData.keyValuePairList, deserializePair);
    eventstream_rpc_utils.setDefinedObjectPropertyAsMap(messageData, 'stringToValue', messageData.stringToValue, deserializeProduct);

    return messageData;
}

export function validateMessageData(messageData : model.MessageData) {
    eventstream_rpc_utils.validateValueAsOptionalString(messageData.stringMessage, 'stringMessage', 'MessageData');
    eventstream_rpc_utils.validateValueAsOptionalBoolean(messageData.booleanMessage, 'booleanMessage', 'MessageData');
    eventstream_rpc_utils.validateValueAsOptionalDate(messageData.timeMessage, 'timeMessage', 'MessageData');
    eventstream_rpc_utils.validateValueAsOptionalString(messageData.enumMessage, 'enumMessage', 'MessageData');
    eventstream_rpc_utils.validateValueAsOptionalBlob(messageData.blobMessage, 'blobMessage', 'MessageData');
    eventstream_rpc_utils.validateValueAsOptionalArray(messageData.stringListMessage, eventstream_rpc_utils.validateValueAsString,'stringListMessage', 'MessageData');
    eventstream_rpc_utils.validateValueAsOptionalArray(messageData.keyValuePairList, validatePair,'keyValuePairList', 'MessageData');
    eventstream_rpc_utils.validateValueAsOptionalMap(messageData.stringToValue, validateProduct,'stringToValue', 'MessageData');
}

export function normalizeEchoMessageRequest(echoMessageRequest : model.EchoMessageRequest) : any {
    let normalized : any = {};

    eventstream_rpc_utils.setDefinedProperty(normalized, 'message', echoMessageRequest.message, normalizeMessageData);

    return normalized;
}

export function deserializeEchoMessageRequest(echoMessageRequest : model.EchoMessageRequest) : model.EchoMessageRequest {
    eventstream_rpc_utils.setDefinedProperty(echoMessageRequest, 'message', echoMessageRequest.message, deserializeMessageData);

    return echoMessageRequest;
}

export function validateEchoMessageRequest(echoMessageRequest : model.EchoMessageRequest) {
    eventstream_rpc_utils.validateValueAsOptionalObject(echoMessageRequest.message, validateMessageData, 'message', 'EchoMessageRequest');
}

export function serializeEchoMessageRequestToEventstreamMessage(echoMessageRequest : model.EchoMessageRequest) : eventstream.Message {
    return {
        type: eventstream.MessageType.ApplicationMessage,
        payload: JSON.stringify(normalizeEchoMessageRequest(echoMessageRequest))
    };
}

export function normalizeEchoMessageResponse(echoMessageResponse : model.EchoMessageResponse) : any {
    let normalized : any = {};

    eventstream_rpc_utils.setDefinedProperty(normalized, 'message', echoMessageResponse.message, normalizeMessageData);

    return normalized;
}

export function deserializeEchoMessageResponse(echoMessageResponse : model.EchoMessageResponse) : model.EchoMessageResponse {
    eventstream_rpc_utils.setDefinedProperty(echoMessageResponse, 'message', echoMessageResponse.message, deserializeMessageData);

    return echoMessageResponse;
}

export function validateEchoMessageResponse(echoMessageResponse : model.EchoMessageResponse) {
    eventstream_rpc_utils.validateValueAsOptionalObject(echoMessageResponse.message, validateMessageData, 'message', 'EchoMessageResponse');
}

export function deserializeEventstreamMessageToEchoMessageResponse(message: eventstream.Message) : model.EchoMessageResponse {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.EchoMessageResponse = JSON.parse(payload_text) as model.EchoMessageResponse;

    return deserializeEchoMessageResponse(response);
}

export function normalizeCauseServiceErrorRequest(causeServiceErrorRequest : model.CauseServiceErrorRequest) : any {
    let normalized : any = {};

    return normalized;
}

export function deserializeCauseServiceErrorRequest(causeServiceErrorRequest : model.CauseServiceErrorRequest) : model.CauseServiceErrorRequest {
    return causeServiceErrorRequest;
}

export function validateCauseServiceErrorRequest(causeServiceErrorRequest : model.CauseServiceErrorRequest) {
}

export function serializeCauseServiceErrorRequestToEventstreamMessage(causeServiceErrorRequest : model.CauseServiceErrorRequest) : eventstream.Message {
    return {
        type: eventstream.MessageType.ApplicationMessage,
        payload: JSON.stringify(normalizeCauseServiceErrorRequest(causeServiceErrorRequest))
    };
}

export function normalizeCauseServiceErrorResponse(causeServiceErrorResponse : model.CauseServiceErrorResponse) : any {
    let normalized : any = {};

    return normalized;
}

export function deserializeCauseServiceErrorResponse(causeServiceErrorResponse : model.CauseServiceErrorResponse) : model.CauseServiceErrorResponse {
    return causeServiceErrorResponse;
}

export function validateCauseServiceErrorResponse(causeServiceErrorResponse : model.CauseServiceErrorResponse) {
}

export function deserializeEventstreamMessageToCauseServiceErrorResponse(message: eventstream.Message) : model.CauseServiceErrorResponse {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.CauseServiceErrorResponse = JSON.parse(payload_text) as model.CauseServiceErrorResponse;

    return deserializeCauseServiceErrorResponse(response);
}

export function normalizeServiceError(serviceError : model.ServiceError) : any {
    let normalized : any = {};

    eventstream_rpc_utils.setDefinedProperty(normalized, 'message', serviceError.message);
    eventstream_rpc_utils.setDefinedProperty(normalized, 'value', serviceError.value);

    return normalized;
}

export function deserializeServiceError(serviceError : model.ServiceError) : model.ServiceError {
    return serviceError;
}

export function validateServiceError(serviceError : model.ServiceError) : void {
    eventstream_rpc_utils.validateValueAsOptionalString(serviceError.message, 'message', 'ServiceError');
    eventstream_rpc_utils.validateValueAsOptionalString(serviceError.value, 'value', 'ServiceError');
}

export function deserializeEventstreamMessageToServiceError(message: eventstream.Message) : model.ServiceError {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.ServiceError = JSON.parse(payload_text) as model.ServiceError;

    return deserializeServiceError(response);
}


export function normalizeCustomer(customer : model.Customer) : any {
    let normalized : any = {};

    eventstream_rpc_utils.setDefinedProperty(normalized, 'id', customer.id);
    eventstream_rpc_utils.setDefinedProperty(normalized, 'firstName', customer.firstName);
    eventstream_rpc_utils.setDefinedProperty(normalized, 'lastName', customer.lastName);

    return normalized;
}

export function deserializeCustomer(customer : model.Customer) : model.Customer {
    return customer;
}

export function validateCustomer(customer : model.Customer) : void {
    eventstream_rpc_utils.validateValueAsOptionalInteger(customer.id, 'id', 'Customer');
    eventstream_rpc_utils.validateValueAsOptionalString(customer.firstName, 'firstName', 'Customer');
    eventstream_rpc_utils.validateValueAsOptionalString(customer.lastName, 'lastName', 'Customer');
}

export function normalizeEchoStreamingRequest(echoStreamingRequest : model.EchoStreamingRequest) : any {
    let normalized : any = {};

    return normalized;
}

export function deserializeEchoStreamingRequest(echoStreamingRequest : model.EchoStreamingRequest) : model.EchoStreamingRequest {
    return echoStreamingRequest;
}

export function validateEchoStreamingRequest(echoStreamingRequest : model.EchoStreamingRequest) {
}

export function serializeEchoStreamingRequestToEventstreamMessage(echoStreamingRequest : model.EchoStreamingRequest) : eventstream.Message {
    return {
        type: eventstream.MessageType.ApplicationMessage,
        payload: JSON.stringify(normalizeEchoStreamingRequest(echoStreamingRequest))
    };
}

export function normalizeEchoStreamingResponse(echoStreamingResponse : model.EchoStreamingResponse) : any {
    let normalized : any = {};

    return normalized;
}

export function deserializeEchoStreamingResponse(echoStreamingResponse : model.EchoStreamingResponse) : model.EchoStreamingResponse {
    return echoStreamingResponse;
}

export function validateEchoStreamingResponse(echoStreamingResponse : model.EchoStreamingResponse) {
}

export function deserializeEventstreamMessageToEchoStreamingResponse(message: eventstream.Message) : model.EchoStreamingResponse {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.EchoStreamingResponse = JSON.parse(payload_text) as model.EchoStreamingResponse;

    return deserializeEchoStreamingResponse(response);
}

export function normalizeEchoStreamingMessage(echoStreamingMessage : model.EchoStreamingMessage) : any {
    let normalized : any = {};

    eventstream_rpc_utils.setDefinedProperty(normalized, 'streamMessage', echoStreamingMessage.streamMessage, normalizeMessageData);
    eventstream_rpc_utils.setDefinedProperty(normalized, 'keyValuePair', echoStreamingMessage.keyValuePair, normalizePair);

    return normalized;
}

const _echoStreamMessagePropertyDeserializers : Map<string, eventstream_rpc_utils.PropertyTransformer | undefined> = new Map<string, eventstream_rpc_utils.PropertyTransformer | undefined >([
    ["streamMessage", deserializeMessageData],
    ["keyValuePair", deserializePair]
]);

export function deserializeEchoStreamingMessage(echoStreamingMessage : model.EchoStreamingMessage) : model.EchoStreamingMessage {
    let union = {};

    eventstream_rpc_utils.setUnionProperty(union, _echoStreamMessagePropertyDeserializers, echoStreamingMessage);

    return union;
}

const _echoStreamMessagePropertyValidators : Map<string, eventstream_rpc_utils.ElementValidator> = new Map<string, eventstream_rpc_utils.ElementValidator>([
    ["streamMessage", validateMessageData],
    ["keyValuePair", validatePair]
]);

export function validateEchoStreamingMessage(echoStreamingMessage : model.EchoStreamingMessage) {
    eventstream_rpc_utils.validateValueAsUnion(echoStreamingMessage, _echoStreamMessagePropertyValidators);
}

export function deserializeEventstreamMessageToEchoStreamingMessage(message: eventstream.Message) : model.EchoStreamingMessage {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.EchoStreamingMessage = JSON.parse(payload_text) as model.EchoStreamingMessage;

    return deserializeEchoStreamingMessage(response);
}

export function normalizeGetAllCustomersRequest(getAllCustomersRequest : model.GetAllCustomersRequest) : any {
    let normalized : any = {};

    return normalized;
}

export function deserializeGetAllCustomersRequest(getAllCustomersRequest : model.GetAllCustomersRequest) : model.GetAllCustomersRequest {
    return getAllCustomersRequest;
}

export function validateGetAllCustomersRequest(getAllCustomersRequest : model.GetAllCustomersRequest) {
}

export function serializeGetAllCustomersRequestToEventstreamMessage(getAllCustomersRequest : model.GetAllCustomersRequest) : eventstream.Message {
    return {
        type: eventstream.MessageType.ApplicationMessage,
        payload: JSON.stringify(normalizeGetAllCustomersRequest(getAllCustomersRequest))
    };
}

export function normalizeGetAllCustomersResponse(getAllCustomersResponse : model.GetAllCustomersResponse) : any {
    let normalized : any = {};

    eventstream_rpc_utils.setDefinedArrayProperty(normalized, 'customers', getAllCustomersResponse.customers, normalizeCustomer);

    return normalized;
}

export function deserializeGetAllCustomersResponse(getAllCustomersResponse : model.GetAllCustomersResponse) : model.GetAllCustomersResponse {
    eventstream_rpc_utils.setDefinedArrayProperty(getAllCustomersResponse, 'customers', getAllCustomersResponse.customers, deserializeCustomer);

    return getAllCustomersResponse;
}

export function validateGetAllCustomersResponse(getAllCustomersResponse : model.GetAllCustomersResponse) {
    eventstream_rpc_utils.validateValueAsOptionalArray(getAllCustomersResponse.customers, validateCustomer, 'customers', 'GetAllCustomersResponse');
}

export function deserializeEventstreamMessageToGetAllCustomersResponse(message: eventstream.Message) : model.GetAllCustomersResponse {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.GetAllCustomersResponse = JSON.parse(payload_text) as model.GetAllCustomersResponse;
    deserializeGetAllCustomersResponse(response);

    return response;
}

export function normalizeGetAllProductsRequest(getAllProductsRequest : model.GetAllProductsRequest) : any {
    let normalized : any = {};

    return normalized;
}

export function deserializeGetAllProductsRequest(getAllProductsRequest : model.GetAllProductsRequest) : model.GetAllProductsRequest {
    return getAllProductsRequest;
}

export function validateGetAllProductsRequest(getAllProductsRequest : model.GetAllProductsRequest) {
}

export function serializeGetAllProductsRequestToEventstreamMessage(getAllProductsRequest : model.GetAllProductsRequest) : eventstream.Message {
    return {
        type: eventstream.MessageType.ApplicationMessage,
        payload: JSON.stringify(normalizeGetAllProductsRequest(getAllProductsRequest))
    };
}

export function normalizeGetAllProductsResponse(getAllProductsResponse : model.GetAllProductsResponse) : any {
    let normalized : any = {};

    eventstream_rpc_utils.setDefinedArrayProperty(normalized, 'products', getAllProductsResponse.products, normalizeProduct);

    return normalized;
}

export function deserializeGetAllProductsResponse(getAllProductsResponse : model.GetAllProductsResponse) : model.GetAllProductsResponse {
    eventstream_rpc_utils.setDefinedArrayProperty(getAllProductsResponse, 'products', getAllProductsResponse.products, deserializeProduct);

    return getAllProductsResponse;
}

export function validateGetAllProductsResponse(getAllProductsResponse : model.GetAllProductsResponse) {
    eventstream_rpc_utils.validateValueAsOptionalMap(getAllProductsResponse.products, validateProduct, 'products', 'GetAllProductsResponse');
}

export function deserializeEventstreamMessageToGetAllProductsResponse(message: eventstream.Message) : model.GetAllProductsResponse {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.GetAllProductsResponse = JSON.parse(payload_text) as model.GetAllProductsResponse;
    deserializeGetAllProductsResponse(response);

    return response;
}

