/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */


import {eventstream} from "aws-crt";
import * as eventstream_rpc from "../eventstream_rpc"
import * as eventstream_rpc_utils from "../eventstream_rpc_utils"
import {toUtf8} from "@aws-sdk/util-utf8-browser";

export interface Pair {
    key? : string,

    value? : string
}

export function normalizePair(pair : Pair) : any {
    let normalized : any = {};

    eventstream_rpc_utils.setDefinedProperty(normalized, 'key', pair.key);
    eventstream_rpc_utils.setDefinedProperty(normalized, 'value', pair.value);

    return normalized;
}

export function deserializePair(pair : Pair) : Pair {
    return pair;
}

export function validatePair(pair : Pair) : void {
    eventstream_rpc_utils.validateValueAsOptionalString(pair.key, 'key', 'Pair');
    eventstream_rpc_utils.validateValueAsOptionalString(pair.value, 'value', 'Pair');
}

export interface Product {
    name? : string,

    price? : number
}

export function normalizeProduct(product : Product) : any {
    let normalized : any = {};

    eventstream_rpc_utils.setDefinedProperty(normalized, 'name', product.name);
    eventstream_rpc_utils.setDefinedProperty(normalized, 'price', product.price);

    return normalized;
}

export function deserializeProduct(product : Product) : Product {
    return product
}

export function validateProduct(product : Product) : any {
    eventstream_rpc_utils.validateValueAsOptionalString(product.name, 'name', 'Product');
    eventstream_rpc_utils.validateValueAsOptionalNumber(product.price, 'price', 'Product');
}

export interface MessageData {
    stringMessage? : string,

    booleanMessage?: boolean,

    timeMessage?: Date,

    documentMessage?: any,

    enumMessage?: string,

    blobMessage?: eventstream.Payload,

    stringListMessage?: string[],

    keyValuePairList?: Pair[],

    stringToValue?: Map<string, Product>
}

export function normalizeMessageData(messageData : MessageData) : any {
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

export function deserializeMessageData(messageData : MessageData) : MessageData {
    eventstream_rpc_utils.setDefinedProperty(messageData, 'timeMessage', messageData.timeMessage, eventstream_rpc_utils.transformNumberAsDate);
    eventstream_rpc_utils.setDefinedProperty(messageData, 'blobMessage', messageData.blobMessage, eventstream_rpc_utils.transformStringAsPayload);
    eventstream_rpc_utils.setDefinedArrayProperty(messageData, 'keyValuePairList', messageData.keyValuePairList, deserializePair);
    eventstream_rpc_utils.setDefinedObjectPropertyAsMap(messageData, 'stringToValue', messageData.stringToValue, deserializeProduct);

    return messageData;
}


export function validateMessageData(messageData : MessageData) {
    eventstream_rpc_utils.validateValueAsOptionalString(messageData.stringMessage, 'stringMessage', 'MessageData');
    eventstream_rpc_utils.validateValueAsOptionalBoolean(messageData.booleanMessage, 'booleanMessage', 'MessageData');
    eventstream_rpc_utils.validateValueAsOptionalDate(messageData.timeMessage, 'timeMessage', 'MessageData');
    eventstream_rpc_utils.validateValueAsOptionalString(messageData.enumMessage, 'enumMessage', 'MessageData');
    eventstream_rpc_utils.validateValueAsOptionalBlob(messageData.blobMessage, 'blobMessage', 'MessageData');
    eventstream_rpc_utils.validateValueAsOptionalArray(messageData.stringListMessage, eventstream_rpc_utils.validateValueAsString,'stringListMessage', 'MessageData');
    eventstream_rpc_utils.validateValueAsOptionalArray(messageData.keyValuePairList, validatePair,'keyValuePairList', 'MessageData');
    eventstream_rpc_utils.validateValueAsOptionalMap(messageData.stringToValue, validateProduct,'stringToValue', 'MessageData');
}

export interface EchoMessageRequest {
    message?: MessageData
}

export function normalizeEchoMessageRequest(echoMessageRequest : EchoMessageRequest) : any {
    let normalized : any = {};

    eventstream_rpc_utils.setDefinedProperty(normalized, 'message', echoMessageRequest.message, normalizeMessageData);

    return normalized;
}

export function deserializeEchoMessageRequest(echoMessageRequest : EchoMessageRequest) : EchoMessageRequest {
    eventstream_rpc_utils.setDefinedProperty(echoMessageRequest, 'message', echoMessageRequest.message, deserializeMessageData);

    return echoMessageRequest;
}

export function validateEchoMessageRequest(echoMessageRequest : EchoMessageRequest) {
    eventstream_rpc_utils.validateValueAsOptionalObject(echoMessageRequest.message, validateMessageData, 'message', 'EchoMessageRequest');
}

export function serializeEchoMessageRequestToEventstreamMessage(echoMessageRequest : EchoMessageRequest) : eventstream.Message {
    return {
        type: eventstream.MessageType.ApplicationMessage,
        payload: JSON.stringify(normalizeEchoMessageRequest(echoMessageRequest))
    };
}

export interface EchoMessageResponse {
    message?: MessageData
}

export function normalizeEchoMessageResponse(echoMessageResponse : EchoMessageResponse) : any {
    let normalized : any = {};

    eventstream_rpc_utils.setDefinedProperty(normalized, 'message', echoMessageResponse.message, normalizeMessageData);

    return normalized;
}

export function deserializeEchoMessageResponse(echoMessageResponse : EchoMessageResponse) : EchoMessageResponse {
    eventstream_rpc_utils.setDefinedProperty(echoMessageResponse, 'message', echoMessageResponse.message, deserializeMessageData);

    return echoMessageResponse;
}

export function validateEchoMessageResponse(echoMessageResponse : EchoMessageResponse) {
    eventstream_rpc_utils.validateValueAsOptionalObject(echoMessageResponse.message, validateMessageData, 'message', 'EchoMessageResponse');
}

export function deserializeEventstreamMessageToEchoMessageResponse(message: eventstream.Message) : EchoMessageResponse {
    let responseType : string = eventstream_rpc.getServiceModelTypeHeaderValue(message);
    if (responseType !== 'awstest#EchoMessageResponse') {
        throw eventstream_rpc.createRpcError(eventstream_rpc.RpcErrorType.InternalError, `Invalid message type.  Expected 'awstest#EchoMessageResponse', received '${responseType}'`);
    }

    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : EchoMessageResponse = JSON.parse(payload_text) as EchoMessageResponse;
    deserializeEchoMessageResponse(response);

    return response;
}
