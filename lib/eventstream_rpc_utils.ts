/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */

import * as eventstream_rpc from "./eventstream_rpc";
import {CrtError, eventstream} from "aws-crt";

/**
 * @packageDocumentation
 * @module eventstream_rpc_utils
 */

export function encodePayloadAsString(payload : eventstream.Payload) : string {
    if (typeof payload === "string") {
        return Buffer.from(payload).toString("base64");
    } else {
        return Buffer.from(payload).toString("base64");
    }
}

export function transformStringAsPayload(value : string) : eventstream.Payload {
    return Buffer.from(value, "base64");
}

export function encodeDateAsNumber(date : Date) : number {
    return date.getTime() / 1000.0;
}

export function transformNumberAsDate(value : number) : Date {
    return new Date(value * 1000.0);
}

export type PropertyTransformer = (value : any) => any;

export function setDefinedProperty(object: any, propertyName: string, value: any, transformer? : PropertyTransformer) : void {
    if (value === undefined || value == null) {
        return;
    }

    if (transformer) {
        object[propertyName] = transformer(value);
    } else {
        object[propertyName] = value;
    }
}

export function setDefinedArrayProperty(object: any, propertyName: string, value: any, transformer? : PropertyTransformer) : void {
    if (value === undefined || value == null) {
        return;
    }

    let array = new Array();
    for (const element of value) {
        if (transformer) {
            array.push(transformer(element));
        } else {
            array.push(element);
        }
    }

    object[propertyName] = array;
}

export function setDefinedMapPropertyAsObject(object: any, propertyName: string, value: any, transformer? : PropertyTransformer) : void {
    if (value === undefined || value == null) {
        return;
    }

    let mapAsObject : any = {};
    for (const [key, val] of (value as Map<string, any>).entries()) {
        if (transformer) {
            mapAsObject[key] = transformer(val);
        } else {
            mapAsObject[key] = val;
        }
    }

    object[propertyName] = mapAsObject;
}

export function setDefinedObjectPropertyAsMap(object: any, propertyName: string, value: any, transformer? : PropertyTransformer) : void {
    if (value === undefined || value == null) {
        return;
    }

    let map = new Map();
    for (const property in value) {
        if (transformer) {
            map.set(property, transformer(value[property]));
        } else {
            map.set(property, value[property]);
        }
    }

    object[propertyName] = map;
}

function throwMissingPropertyError(propertyName?: string, type?: string) : void {
    if (propertyName && type) {
        throw eventstream_rpc.createRpcError(eventstream_rpc.RpcErrorType.ValidationError, `Missing required property '${propertyName}' of type '${type}'`);
    } else {
        throw eventstream_rpc.createRpcError(eventstream_rpc.RpcErrorType.ValidationError, `Missing required property`);
    }
}

function throwInvalidPropertyValueError(valueDescription: string, propertyName?: string, type?: string) : void {
    if (propertyName && type) {
        throw eventstream_rpc.createRpcError(eventstream_rpc.RpcErrorType.ValidationError, `Property '${propertyName}' of type '${type}' must be ${valueDescription}`);
    } else {
        throw eventstream_rpc.createRpcError(eventstream_rpc.RpcErrorType.ValidationError, `Property must be ${valueDescription}`);
    }
}

export function validateValueAsString(value : any, propertyName?: string, type?: string) : void {
    if (!value) {
        throwMissingPropertyError(propertyName, type);
    }

    if (typeof value !== 'string') {
        throwInvalidPropertyValueError('a string value', propertyName, type);
    }
}

export function validateValueAsOptionalString(value : any, propertyName?: string, type?: string) : void {
    if (!value) {
        return;
    }

    validateValueAsString(value, propertyName, type);
}

export function validateValueAsNumber(value : any, propertyName?: string, type?: string) {
    if (!value) {
        throwMissingPropertyError(propertyName, type);
    }

    if (typeof value !== 'number') {
        throwInvalidPropertyValueError('a number value', propertyName, type);
    }
}

export function validateValueAsOptionalNumber(value : any, propertyName?: string, type?: string) {
    if (!value) {
        return;
    }

    validateValueAsNumber(value, propertyName, type);
}

export function validateValueAsInteger(value : any, propertyName?: string, type?: string) {
    if (!value) {
        throwMissingPropertyError(propertyName, type);
    }

    if (typeof value !== 'number' || !Number.isSafeInteger(value as number)) {
        throwInvalidPropertyValueError('an integer value', propertyName, type);
    }
}

export function validateValueAsOptionalInteger(value : any, propertyName?: string, type?: string) {
    if (!value) {
        return;
    }

    validateValueAsInteger(value, propertyName, type);
}

export function validateValueAsBoolean(value : any, propertyName?: string, type?: string) {
    if (!value) {
        throwMissingPropertyError(propertyName, type);
    }

    if (typeof value !== 'boolean') {
        throwInvalidPropertyValueError('a boolean value', propertyName, type);
    }
}

export function validateValueAsOptionalBoolean(value : any, propertyName?: string, type?: string) {
    if (!value) {
        return;
    }

    validateValueAsBoolean(value, propertyName, type);
}

export function validateValueAsDate(value : any, propertyName?: string, type?: string) {
    if (!value) {
        throwMissingPropertyError(propertyName, type);
    }

    if (!(value instanceof Date) || isNaN((value as Date).getTime())) {
        throwInvalidPropertyValueError('a Date value', propertyName, type);
    }
}

export function validateValueAsOptionalDate(value : any, propertyName?: string, type?: string) {
    if (!value) {
        return;
    }

    validateValueAsDate(value, propertyName, type);
}

// export type Payload = string | Record<string, unknown> | ArrayBuffer | ArrayBufferView;

export function validateValueAsBlob(value : any, propertyName?: string, type?: string) {
    if (!value) {
        throwMissingPropertyError(propertyName, type);
    }

    /* there doesn't seem to be a good way of checking if something is an ArrayBuffer */
    if ((typeof value !== 'string') && !ArrayBuffer.isView(value) && (!value.byteLength || !value.maxByteLength)) {
        throwInvalidPropertyValueError('a value convertible to a binary payload', propertyName, type);
    }
}

export function validateValueAsOptionalBlob(value : any, propertyName?: string, type?: string) {
    if (!value) {
        return;
    }

    validateValueAsBlob(value, propertyName, type);
}

export type ElementValidator = (value : any) => void;

export function validateValueAsArray(value : any, elementValidator : ElementValidator, propertyName?: string, type?: string) {
    if (!value) {
        throwMissingPropertyError(propertyName, type);
    }

    if (!Array.isArray(value)) {
        throwInvalidPropertyValueError('an array value', propertyName, type);
    }

    for (const element of value) {
        try {
            elementValidator(element);
        } catch (err) {
            let rpcError : eventstream_rpc.RpcError = err as eventstream_rpc.RpcError;
            if (propertyName && type) {
                throw eventstream_rpc.createRpcError(eventstream_rpc.RpcErrorType.ValidationError, `Array property '${propertyName}' of type '${type}' contains an invalid value`, new CrtError(rpcError.toString()));
            } else {
                throw eventstream_rpc.createRpcError(eventstream_rpc.RpcErrorType.ValidationError, `Array contains an invalid value`, new CrtError(rpcError.toString()));
            }
        }
    }
}

export function validateValueAsOptionalArray(value : any, elementValidator : ElementValidator, propertyName?: string, type?: string) {
    if (!value) {
        return;
    }

    validateValueAsArray(value, elementValidator, propertyName, type);
}

export function validateValueAsMap(value : any, elementValidator : ElementValidator, propertyName?: string, type?: string) {
    if (!value) {
        return;
    }

    if (!(value instanceof Map)) {
        throwInvalidPropertyValueError('a map value', propertyName, type);
    }

    let valueAsMap = value as Map<any, any>;
    for (const [key, val] of valueAsMap) {
        try {
            validateValueAsString(key);
        } catch (err) {
            let rpcError : eventstream_rpc.RpcError = err as eventstream_rpc.RpcError;
            if (propertyName && type) {
                throw eventstream_rpc.createRpcError(eventstream_rpc.RpcErrorType.ValidationError, `Map property '${propertyName}' of type '${type}' contains an invalid key`, new CrtError(rpcError.toString()));
            } else {
                throw eventstream_rpc.createRpcError(eventstream_rpc.RpcErrorType.ValidationError, `Map contains an invalid key`, new CrtError(rpcError.toString()));
            }
        }

        try {
            elementValidator(val);
        } catch (err) {
            let rpcError : eventstream_rpc.RpcError = err as eventstream_rpc.RpcError;
            if (propertyName && type) {
                throw eventstream_rpc.createRpcError(eventstream_rpc.RpcErrorType.ValidationError, `Map property '${propertyName}' of type '${type}' contains an invalid value`, new CrtError(rpcError.toString()));
            } else {
                throw eventstream_rpc.createRpcError(eventstream_rpc.RpcErrorType.ValidationError, `Map contains an invalid value`, new CrtError(rpcError.toString()));
            }
        }
    }
}

export function validateValueAsOptionalMap(value : any, elementValidator : ElementValidator, propertyName?: string, type?: string) {
    if (!value) {
        return;
    }

    validateValueAsMap(value, elementValidator, propertyName, type);
}

export function validateValueAsObject(value : any, elementValidator : ElementValidator, propertyName: string, type: string) {
    if (!value) {
        throwMissingPropertyError(propertyName, type);
    }

    try {
        elementValidator(value);
    } catch (err) {
        let rpcError : eventstream_rpc.RpcError = err as eventstream_rpc.RpcError;
        throw eventstream_rpc.createRpcError(eventstream_rpc.RpcErrorType.ValidationError, `Property '${propertyName}' of type '${type}' contains an invalid value`, new CrtError(rpcError.toString()));
    }
}

export function validateValueAsOptionalObject(value : any, elementValidator : ElementValidator, propertyName: string, type: string) {
    if (!value) {
        return;
    }

    validateValueAsObject(value, elementValidator, propertyName, type);
}

function getPropertyCount(value : any, propertyNames : IterableIterator<string>) {
    let propertyCount : number = 0;
    for (const propertyName in propertyNames) {
        if (value.hasOwnProperty(propertyName)) {
            propertyCount += 1;
        }
    }

    return propertyCount;
}

export type UnionTransformer = Map<string, PropertyTransformer | undefined>;

export type UnionValidator = Map<string, ElementValidator | undefined>;

export function validateValueAsUnion(value : any, validators : UnionValidator) {
    let propertyCount : number = getPropertyCount(value, validators.keys());

    if (propertyCount != 1) {
        throw eventstream_rpc.createRpcError(eventstream_rpc.RpcErrorType.ValidationError, `Union has ${propertyCount} properties set`);
    }

    for (const [propertyName, validator] of validators.entries()) {
        let propertyValue = value[propertyName];
        if (propertyValue && validator) {
            try {
                validator(propertyValue);
            } catch (err) {
                let rpcError : eventstream_rpc.RpcError = err as eventstream_rpc.RpcError;
                throw eventstream_rpc.createRpcError(eventstream_rpc.RpcErrorType.ValidationError, `Union property '${propertyName}' contains an invalid value`, new CrtError(rpcError.toString()));
            }
        }
    }
}

export function setUnionProperty(value : any, setters : UnionTransformer, source : any) {
    let propertyCount : number = getPropertyCount(source, setters.keys());

    if (propertyCount != 1) {
        throw eventstream_rpc.createRpcError(eventstream_rpc.RpcErrorType.ValidationError, `Union has ${propertyCount} properties set`);
    }

    for (const [propertyName, setter] of setters.entries()) {
        let propertyValue = value[propertyName];
        if (propertyValue) {
            setDefinedProperty(value, propertyName, propertyValue, setter);
        }
    }
}
