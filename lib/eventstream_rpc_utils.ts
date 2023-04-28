/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */

import * as eventstream_rpc from "./eventstream_rpc";
import {CrtError, eventstream} from "aws-crt";

/*
 * Internal utility functions for generated RPC clients to perform normalization, serialization, deserialization, and
 * validation.
 *
 * Don't export; don't make part of SDK documentation.
 */

/**
 * Transforms an eventstream payload type (an opaque blob) to a base64-encoded string
 *
 * @param payload blob to transform
 * @return a base64-encoded string
 */
export function encodePayloadAsString(payload : eventstream.Payload) : string {
    return Buffer.from(payload).toString("base64");
}

/**
 * Transforms a base64-encoded string to an ArrayBuffer with the raw bytes
 *
 * @param value a base64-encoded string
 * @return an ArrayBuffer of decoded bytes
 */
export function transformStringAsPayload(value : string) : eventstream.Payload {
    return Buffer.from(value, "base64");
}

/**
 * Transforms a Date to a fractional number: seconds elapsed since epoch
 * @param date Date to transform
 * @return seconds elapsed since epoch
 */
export function encodeDateAsNumber(date : Date) : number {
    return date.getTime() / 1000.0;
}

/**
 * Transforms a value representing seconds elapsed since epoch into a Date
 * @param value seconds elapsed since epoch
 * @return an equivalent Date
 */
export function transformNumberAsDate(value : number) : Date {
    return new Date(value * 1000.0);
}

export type PropertyTransformer = (value : any) => any;

/**
 * Normalization/deserialization helper that replaces a value, if it exists, with a potentially transformed value
 *
 * @param object object to potentially set a property on
 * @param propertyName name of property to replace
 * @param value value to set the property to (or transform and set the property to)
 * @param transformer optional transformation function to apply to value first before setting
 */
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

/**
 * Normalizes an array value
 *
 * @param value array to normalize
 * @param valueTransformer optional transformation to apply to all array values
 *
 * @return a normalized array
 */
export function normalizeArrayValue(value: any, transformer? : PropertyTransformer) : any[] {
    if (transformer == undefined) {
        return value;
    }

    let array: any[] = new Array();
    for (const element of value) {
        array.push(transformer(element));
    }

    return array;
}

/**
 * Normalization/deserialization helper that replaces an array value, if it exists, with a potentially transformed value
 *
 * @param object object to potentially set an array property on
 * @param propertyName name of property to replace
 * @param value array value to set the property to (or transform and set the property to)
 * @param transformer optional transformation function to apply to all array elements
 */
export function setDefinedArrayProperty(object: any, propertyName: string, value: any, transformer? : PropertyTransformer) : void {
    if (value === undefined || value == null) {
        return;
    }

    object[propertyName] = normalizeArrayValue(value, transformer);
}

/**
 * Transforms a map value into a generic object with optional key and value transformation
 *
 * @param value map to transform
 * @param keyTransformer optional transformation to apply to all map keys
 * @param valueTransformer optional transformation to apply to all map values
 *
 * @return map transformed into an object
 */
export function normalizeMapValueAsObject(value: any, keyTransformer?: PropertyTransformer, valueTransformer? : PropertyTransformer) : any {
    let mapAsObject: any = {};

    for (const [key, val] of (value as Map<any, any>).entries()) {
        let transformedKey : any = keyTransformer ? keyTransformer(key) : key;
        let transformedvalue : any = valueTransformer ? valueTransformer(val) : val;

        mapAsObject[transformedKey] = transformedvalue;
    }

    return mapAsObject;
}

/**
 * Normalization/deserialization helper that replaces a javascript Object, if it exists, with a map where the
 * values are potentially transformed
 *
 * @param object object to potentially set an object property on
 * @param propertyName name of property to replace
 * @param value object value to transform into a map
 * @param transformer optional transformation function to apply to all map values
 */
export function setDefinedMapPropertyAsObject(object: any, propertyName: string, value: any, keyTransformer?: PropertyTransformer, valueTransformer? : PropertyTransformer) : void {
    if (value === undefined || value == null) {
        return;
    }

    object[propertyName] = normalizeMapValueAsObject(value);
}

/**
 * Normalization/deserialization helper that replaces an string-keyed map value, if it exists, with a map where the
 * values are potentially transformed
 *
 * @param object object to potentially set a map property on
 * @param propertyName name of property to set
 * @param value map value to set the property to (or transform and set the property to)
 * @param transformer optional transformation function to apply to all map values
 */
export function setDefinedObjectPropertyAsMap(object: any, propertyName: string, value: any, keyTransformer?: PropertyTransformer, valueTransformer? : PropertyTransformer) : void {
    if (value === undefined || value == null) {
        return;
    }

    let map = new Map();
    for (const property in value) {
        let transformedKey : any = keyTransformer ? keyTransformer(property) : property;
        let transformedValue : any = valueTransformer ? valueTransformer(value[property]) : value[property];

        map.set(transformedKey, transformedValue);
    }

    object[propertyName] = map;
}

/**
 * Throws an RpcError with a detailed description, if possible, of what required property was missing
 *
 * @param propertyName optional, name of the missing property
 * @param type optional, type of object that the property was supposed to be on
 */
function throwMissingPropertyError(propertyName?: string, type?: string) : void {
    if (propertyName && type) {
        throw eventstream_rpc.createRpcError(eventstream_rpc.RpcErrorType.ValidationError, `Missing required property '${propertyName}' of type '${type}'`);
    } else {
        throw eventstream_rpc.createRpcError(eventstream_rpc.RpcErrorType.ValidationError, `Missing required property`);
    }
}

/**
 * Throws an RpcError with a detailed description, if possible, of what property had a bad value
 *
 * @param valueDescription additional context of what the value should have been
 * @param propertyName optional, name of the invalid property
 * @param type optional, type of object that the property is on
 */
function throwInvalidPropertyValueError(valueDescription: string, propertyName?: string, type?: string) : void {
    if (propertyName && type) {
        throw eventstream_rpc.createRpcError(eventstream_rpc.RpcErrorType.ValidationError, `Property '${propertyName}' of type '${type}' must be ${valueDescription}`);
    } else {
        throw eventstream_rpc.createRpcError(eventstream_rpc.RpcErrorType.ValidationError, `Property must be ${valueDescription}`);
    }
}

/**
 * Throws an error if a property value is not a string
 *
 * @param value value to check
 * @param propertyName optional, name of the property with this value
 * @param type optional, type of object that the property is on
 */
export function validateValueAsString(value : any, propertyName?: string, type?: string) : void {
    if (value === undefined) {
        throwMissingPropertyError(propertyName, type);
    }

    if (typeof value !== 'string') {
        throwInvalidPropertyValueError('a string value', propertyName, type);
    }
}

/**
 * Throws an error if a property value is not a string or undefined
 *
 * @param value value to check
 * @param propertyName optional, name of the property with this value
 * @param type optional, type of object that the property is on
 */
export function validateValueAsOptionalString(value : any, propertyName?: string, type?: string) : void {
    if (value === undefined) {
        return;
    }

    validateValueAsString(value, propertyName, type);
}

/**
 * Throws an error if a property value is not a number
 *
 * @param value value to check
 * @param propertyName optional, name of the property with this value
 * @param type optional, type of object that the property is on
 */
export function validateValueAsNumber(value : any, propertyName?: string, type?: string) {
    if (value === undefined) {
        throwMissingPropertyError(propertyName, type);
    }

    if (typeof value !== 'number') {
        throwInvalidPropertyValueError('a number value', propertyName, type);
    }
}

/**
 * Throws an error if a property value is not a number or undefined
 *
 * @param value value to check
 * @param propertyName optional, name of the property with this value
 * @param type optional, type of object that the property is on
 */
export function validateValueAsOptionalNumber(value : any, propertyName?: string, type?: string) {
    if (value === undefined) {
        return;
    }

    validateValueAsNumber(value, propertyName, type);
}

/**
 * Throws an error if a property value is not an integer
 *
 * @param value value to check
 * @param propertyName optional, name of the property with this value
 * @param type optional, type of object that the property is on
 */
export function validateValueAsInteger(value : any, propertyName?: string, type?: string) {
    if (value === undefined) {
        throwMissingPropertyError(propertyName, type);
    }

    if (typeof value !== 'number' || !Number.isSafeInteger(value as number)) {
        throwInvalidPropertyValueError('an integer value', propertyName, type);
    }
}

/**
 * Throws an error if a property value is not an integer or undefined
 *
 * @param value value to check
 * @param propertyName optional, name of the property with this value
 * @param type optional, type of object that the property is on
 */
export function validateValueAsOptionalInteger(value : any, propertyName?: string, type?: string) {
    if (value === undefined) {
        return;
    }

    validateValueAsInteger(value, propertyName, type);
}

/**
 * Throws an error if a property value is not a boolean
 *
 * @param value value to check
 * @param propertyName optional, name of the property with this value
 * @param type optional, type of object that the property is on
 */
export function validateValueAsBoolean(value : any, propertyName?: string, type?: string) {
    if (value === undefined) {
        throwMissingPropertyError(propertyName, type);
    }

    if (typeof value !== 'boolean') {
        throwInvalidPropertyValueError('a boolean value', propertyName, type);
    }
}

/**
 * Throws an error if a property value is not a boolean or undefined
 *
 * @param value value to check
 * @param propertyName optional, name of the property with this value
 * @param type optional, type of object that the property is on
 */
export function validateValueAsOptionalBoolean(value : any, propertyName?: string, type?: string) {
    if (value === undefined) {
        return;
    }

    validateValueAsBoolean(value, propertyName, type);
}

/**
 * Throws an error if a property value is not a Date
 *
 * @param value value to check
 * @param propertyName optional, name of the property with this value
 * @param type optional, type of object that the property is on
 */
export function validateValueAsDate(value : any, propertyName?: string, type?: string) {
    if (value === undefined) {
        throwMissingPropertyError(propertyName, type);
    }

    if (!(value instanceof Date) || isNaN((value as Date).getTime())) {
        throwInvalidPropertyValueError('a Date value', propertyName, type);
    }
}

/**
 * Throws an error if a property value is not a Date or undefined
 *
 * @param value value to check
 * @param propertyName optional, name of the property with this value
 * @param type optional, type of object that the property is on
 */
export function validateValueAsOptionalDate(value : any, propertyName?: string, type?: string) {
    if (value === undefined) {
        return;
    }

    validateValueAsDate(value, propertyName, type);
}

/**
 * Throws an error if a property value is not a valid eventstream payload (blob) type
 *
 * @param value value to check
 * @param propertyName optional, name of the property with this value
 * @param type optional, type of object that the property is on
 */
export function validateValueAsBlob(value : any, propertyName?: string, type?: string) {
    if (value === undefined) {
        throwMissingPropertyError(propertyName, type);
    }

    /* there doesn't seem to be a good way of checking if something is an ArrayBuffer */
    if ((typeof value !== 'string') && !ArrayBuffer.isView(value) && (!value.byteLength || !value.maxByteLength)) {
        throwInvalidPropertyValueError('a value convertible to a binary payload', propertyName, type);
    }
}

/**
 * Throws an error if a property value is not a valid eventstream payload type or undefined
 *
 * @param value value to check
 * @param propertyName optional, name of the property with this value
 * @param type optional, type of object that the property is on
 */
export function validateValueAsOptionalBlob(value : any, propertyName?: string, type?: string) {
    if (value === undefined) {
        return;
    }

    validateValueAsBlob(value, propertyName, type);
}

/**
 * Throws an error if a property value is not a valid defined object
 *
 * @param value value to check
 * @param propertyName optional, name of the property with this value
 * @param type optional, type of object that the property is on
 */
export function validateValueAsAny(value : any, propertyName?: string, type?: string) {
    if (value === undefined) {
        throwMissingPropertyError(propertyName, type);
    }
}

/**
 * Throws an error if a property value is not a valid JS object or undefined (always succeeds)
 *
 * @param value value to check
 * @param propertyName optional, name of the property with this value
 * @param type optional, type of object that the property is on
 */
export function validateValueAsOptionalAny(value : any, propertyName?: string, type?: string) {
    if (value === undefined) {
        return;
    }

    validateValueAsAny(value, propertyName, type);
}

export type ElementValidator = (value : any) => void;

/**
 * Throws an error if a property value is not a valid array type
 *
 * @param value value to check
 * @param elementValidator validation function to apply to each array element
 * @param propertyName optional, name of the property with this value
 * @param type optional, type of object that the property is on
 */
export function validateValueAsArray(value : any, elementValidator : ElementValidator, propertyName?: string, type?: string) {
    if (value === undefined) {
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

/**
 * Throws an error if a property value is not a valid array type or undefined
 *
 * @param value value to check
 * @param elementValidator validation function to apply to each array element
 * @param propertyName optional, name of the property with this value
 * @param type optional, type of object that the property is on
 */
export function validateValueAsOptionalArray(value : any, elementValidator : ElementValidator, propertyName?: string, type?: string) {
    if (value === undefined) {
        return;
    }

    validateValueAsArray(value, elementValidator, propertyName, type);
}

/**
 * Throws an error if a property value is not a valid map type
 *
 * @param value value to check
 * @param elementValidator validation function to apply to each map value
 * @param propertyName optional, name of the property with this value
 * @param type optional, type of object that the property is on
 */
export function validateValueAsMap(value : any, keyValidator : ElementValidator, valueValidator : ElementValidator, propertyName?: string, type?: string) {
    if (value === undefined) {
        return;
    }

    if (!(value instanceof Map)) {
        throwInvalidPropertyValueError('a map value', propertyName, type);
    }

    let valueAsMap = value as Map<any, any>;
    for (const [key, val] of valueAsMap) {
        try {
            keyValidator(key);
        } catch (err) {
            let rpcError : eventstream_rpc.RpcError = err as eventstream_rpc.RpcError;
            if (propertyName && type) {
                throw eventstream_rpc.createRpcError(eventstream_rpc.RpcErrorType.ValidationError, `Map property '${propertyName}' of type '${type}' contains an invalid key`, new CrtError(rpcError.toString()));
            } else {
                throw eventstream_rpc.createRpcError(eventstream_rpc.RpcErrorType.ValidationError, `Map contains an invalid key`, new CrtError(rpcError.toString()));
            }
        }

        try {
            valueValidator(val);
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

/**
 * Throws an error if a property value is not a valid map type or undefined
 *
 * @param value value to check
 * @param elementValidator validation function to apply to each map value
 * @param propertyName optional, name of the property with this value
 * @param type optional, type of object that the property is on
 */
export function validateValueAsOptionalMap(value : any, keyValidator : ElementValidator, valueValidator : ElementValidator, propertyName?: string, type?: string) {
    if (value === undefined) {
        return;
    }

    validateValueAsMap(value, keyValidator, valueValidator, propertyName, type);
}

/**
 * Throws an error if a property value does not pass a validation check
 *
 * @param value value to check
 * @param elementValidator validation function to apply to the property value
 * @param propertyName optional, name of the property with this value
 * @param type optional, type of object that the property is on
 */
export function validateValueAsObject(value : any, elementValidator : ElementValidator, propertyName: string, type: string) {
    if (value === undefined) {
        throwMissingPropertyError(propertyName, type);
    }

    try {
        elementValidator(value);
    } catch (err) {
        let rpcError : eventstream_rpc.RpcError = err as eventstream_rpc.RpcError;
        throw eventstream_rpc.createRpcError(eventstream_rpc.RpcErrorType.ValidationError, `Property '${propertyName}' of type '${type}' contains an invalid value`, new CrtError(rpcError.toString()));
    }
}

/**
 * Throws an error if a property value does not pass a validation check and is defined
 *
 * @param value value to check
 * @param elementValidator validation function to apply to the property value
 * @param propertyName optional, name of the property with this value
 * @param type optional, type of object that the property is on
 */
export function validateValueAsOptionalObject(value : any, elementValidator : ElementValidator, propertyName: string, type: string) {
    if (value === undefined) {
        return;
    }

    validateValueAsObject(value, elementValidator, propertyName, type);
}

/*
 * Unions must have exactly one property set.  This function helps check that.
 */
function getPropertyCount(value : any, propertyNames : IterableIterator<string>) {
    let propertyCount : number = 0;
    for (const propertyName of propertyNames) {
        if (value.hasOwnProperty(propertyName)) {
            propertyCount += 1;
        }
    }

    return propertyCount;
}

export type UnionTransformer = Map<string, PropertyTransformer | undefined>;

export type UnionValidator = Map<string, ElementValidator | undefined>;

/**
 * Throws a validation error if:
 *   (1) the value does not have exactly one modeled property set, or
 *   (2) the set property does not pass validation
 *
 * @param value union value to check
 * @param validators a map of validators, from (union) property name to validation function
 */
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
