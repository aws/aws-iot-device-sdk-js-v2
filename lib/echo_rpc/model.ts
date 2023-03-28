/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */


import {eventstream, CrtError} from "aws-crt";
import * as eventstream_rpc from "../eventstream_rpc";
import * as eventstream_rpc_utils from "../eventstream_rpc_utils"
import {setDefinedArrayProperty, validateObjectProperty} from "../eventstream_rpc_utils";


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

export function validatePair(pair : Pair) : void {
    eventstream_rpc_utils.validateValueAsString(pair.key, 'key', 'Pair');
    eventstream_rpc_utils.validateValueAsString(pair.value, 'value', 'Pair');
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

export function validateProduct(product : Product) : any {
    eventstream_rpc_utils.validateValueAsString(product.name, 'name', 'Product');
    eventstream_rpc_utils.validateValueAsNumber(product.price, 'price', 'Product');
}

export interface MessageData {
    stringMessage? : string,

    booleanMessage?: boolean,

    timeMessage?: Date,

    documentMessage?: Map<string, any>,

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
    eventstream_rpc_utils.setDefinedProperty(normalized, 'timeMessage', messageData.timeMessage);
    eventstream_rpc_utils.setDefinedProperty(normalized, 'documentMessage', messageData.documentMessage);
    eventstream_rpc_utils.setDefinedProperty(normalized, 'enumMessage', messageData.enumMessage);
    eventstream_rpc_utils.setDefinedProperty(normalized, 'blobMessage', messageData.blobMessage, eventstream_rpc_utils.encodePayloadAsBase64);
    eventstream_rpc_utils.setDefinedProperty(normalized, 'stringListMessage', messageData.stringListMessage);
    eventstream_rpc_utils.setDefinedArrayProperty(normalized, 'keyValuePairList', messageData.keyValuePairList, normalizePair);
    eventstream_rpc_utils.setDefinedProperty(normalized, 'stringToValue', messageData.stringToValue, (value : Map<string, Product>) => { return Array.from(value).map(([key, val]) => { return [key, normalizeProduct(val)]; }); });

    return normalized;
}


export function validateMessageData(messageData : MessageData) {
    eventstream_rpc_utils.validateValueAsString(messageData.stringMessage, 'stringMessage', 'MessageData');
    eventstream_rpc_utils.validateValueAsString(messageData.booleanMessage, 'booleanMessage', 'MessageData');
}

export interface EchoMessageRequest {
    message?: MessageData
}

export function normalizeEchoMessageRequest(echoMessageRequest : EchoMessageRequest) : any {
    let normalized : any = {};

    eventstream_rpc_utils.setDefinedProperty(normalized, 'message', echoMessageRequest.message, normalizeMessageData);

    return normalized;
}

export function validateEchoMessageRequest(echoMessageRequest : EchoMessageRequest) {
    validateObjectProperty(echoMessageRequest.message, validateMessageData, 'message', 'EchoMessageRequest');
}

export interface EchoMessageResponse {
    message?: MessageData
}

export function normalizeEchoMessageResponse(echoMessageResponse : EchoMessageResponse) : any {
    let normalized : any = {};

    eventstream_rpc_utils.setDefinedProperty(normalized, 'message', echoMessageResponse.message, normalizeMessageData);

    return normalized;
}

export function validateEchoMessageResponse(echoMessageResponse : EchoMessageResponse) {
    validateObjectProperty(echoMessageResponse.message, validateMessageData, 'message', 'EchoMessageResponse');
}
