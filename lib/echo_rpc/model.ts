/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */


import {eventstream} from "aws-crt";
import * as eventstream_rpc from "../eventstream_rpc";

function encode_payload_as_base64(payload : eventstream.Payload) : string {
    if (typeof payload === "string") {
        return btoa(payload);
    } else {
        return Buffer.from(payload).toString("base64");
    }
}

function set_defined_property(object: any, propertyName: string, value: any, transformer? : (key: string, value : any) => any) : boolean {
    if (value === undefined || value == null) {
        return false;
    }

    if (transformer) {
        object[propertyName] = transformer(propertyName, value);
    } else {
        object[propertyName] = value;
    }

    return true;
}

function validateStringTransformer(key: string, value: any) {
    if (typeof value !== "string") {
        throw eventstream_rpc.createRpcError(eventstream_rpc.RpcErrorType.SerializationError, `Key '${key}' must have a string value`);
    }

    return value;
}

function set_defined_property_string(object: any, propertyName: string, value?: string) {
    set_defined_property(object, propertyName, value, validateStringTransformer);
}

function validateNumberTransformer(key: string, value: any) {
    if (typeof value !== "number") {
        throw eventstream_rpc.createRpcError(eventstream_rpc.RpcErrorType.SerializationError, `Key '${key}' must have a number value`);
    }

    return value;
}

function set_defined_property_number(object: any, propertyName: string, value?: number) {
    set_defined_property(object, propertyName, value, validateNumberTransformer);
}

export interface Pair {
    key? : string,

    value? : string
}

export function normalizePair(pair : Pair) : any {
    let normalized : any = {};

    set_defined_property_string(normalized, 'key', pair.key);
    set_defined_property_string(normalized, 'value', pair.value);

    return normalized;
}

export interface Product {
    name? : string,

    price? : number
}

export function normalizeProduct(product : Product) : any {
    let normalized : any = {};

    set_defined_property_string(normalized, 'name', product.name);
    set_defined_property_number(normalized, 'price', product.price);

    return normalized;
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

    set_defined_property(normalized, 'stringMessage', messageData.stringMessage);
    set_defined_property(normalized, 'booleanMessage', messageData.booleanMessage);
    set_defined_property(normalized, 'timeMessage', messageData.timeMessage, (value) => { return value.getTime(); });
    set_defined_property(normalized, 'documentMessage', messageData.documentMessage);
    set_defined_property(normalized, 'enumMessage', messageData.enumMessage);
    set_defined_property(normalized, 'blobMessage', messageData.blobMessage, encode_payload_as_base64);
    set_defined_property(normalized, 'stringListMessage', messageData.stringListMessage);
    set_defined_property(normalized, 'keyValuePairList', messageData.keyValuePairList, (value : Array<Pair>) => { return value.map((val : Pair) => { return normalizePair(val); }); });
    set_defined_property(normalized, 'stringToValue', messageData.stringToValue, (value : Map<string, Product>) => { return Array.from(value).map(([key, val]) => { return [key, normalizeProduct(val)]; }); });

    return normalized;
}

/*
function productReplacer(key: string, value: any) : any {
    return value;
}

function pairReplacer(key: string, value: any) : any {

}

function messageDataReplacer(key: string, value: any) : any {
    switch (key) {
        case "timeMessage":
            return (value as Date).getTime();

        case "blobMessage":
            if (typeof(value) === "string") {
                return btoa(value as string);
            } else {
                return Buffer.from(value).toString("base64");
            }

        case "keyValuePairList":
            return (value as Array<Pair>).map((value) => { return normalizePair(value as Pair); });

        case "stringToValue":
            return ??;

        default:
            return value;
    }
}
*/

export interface EchoMessageRequest {
    message?: MessageData
}

export function normalizeEchoMessageRequest(echoMessageRequest : EchoMessageRequest) : any {
    let normalized : any = {};

    set_defined_property(normalized, 'message', echoMessageRequest.message, normalizeMessageData);

    return normalized;
}

export interface EchoMessageResponse {
    message?: MessageData
}

export function normalizeEchoMessageResponse(echoMessageResponse : EchoMessageResponse) : any {
    let normalized : any = {};

    set_defined_property(normalized, 'message', echoMessageResponse.message, normalizeMessageData);

    return normalized;
}

