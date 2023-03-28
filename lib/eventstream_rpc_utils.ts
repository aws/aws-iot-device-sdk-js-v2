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

export function encodePayloadAsBase64(payload : eventstream.Payload) : string {
    if (typeof payload === "string") {
        return btoa(payload);
    } else {
        return Buffer.from(payload).toString("base64");
    }
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

export function validateValueAsString(value : any, propertyName?: string, type?: string) : void {
    if (!value) {
        return;
    }

    if (typeof value !== 'string') {
        if (propertyName && type) {
            throw eventstream_rpc.createRpcError(eventstream_rpc.RpcErrorType.ValidationError, `Property '${propertyName}' of type '${type}' must have a string value`);
        } else {
            throw eventstream_rpc.createRpcError(eventstream_rpc.RpcErrorType.ValidationError, `Value is not a string`);
        }
    }
}

export function validateValueAsNumber(value : any, propertyName?: string, type?: string) {
    if (!value) {
        return;
    }

    if (typeof value !== 'number') {
        if (propertyName && type) {
            throw eventstream_rpc.createRpcError(eventstream_rpc.RpcErrorType.ValidationError, `Property '${propertyName}' of type '${type}' must have a number value`);
        } else {
            throw eventstream_rpc.createRpcError(eventstream_rpc.RpcErrorType.ValidationError, `Value is not a number`);
        }
    }
}

export function validateValueAsBoolean(value : any, propertyName?: string, type?: string) {
    if (!value) {
        return;
    }

    if (typeof value !== 'boolean') {
        if (propertyName && type) {
            throw eventstream_rpc.createRpcError(eventstream_rpc.RpcErrorType.ValidationError, `Property '${propertyName}' of type '${type}' must have a boolean value`);
        } else {
            throw eventstream_rpc.createRpcError(eventstream_rpc.RpcErrorType.ValidationError, `Value is not a boolean`);
        }
    }
}

export type ElementValidator = (value : any) => void;

export function validateValueAsArray(value : any, elementValidator : ElementValidator, propertyName?: string, type?: string) {
    if (!value) {
        return;
    }

    if (!Array.isArray(value)) {
        if (propertyName && type) {
            throw eventstream_rpc.createRpcError(eventstream_rpc.RpcErrorType.ValidationError, `Property '${propertyName}' of type '${type}' must be an array`);
        } else {
            throw eventstream_rpc.createRpcError(eventstream_rpc.RpcErrorType.ValidationError, `Value is not an array`);
        }
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

export function validateValueAsMap(value : any, elementValidator : ElementValidator, propertyName?: string, type?: string) {
    if (!value) {
        return;
    }

    if (!(value instanceof Map)) {
        if (propertyName && type) {
            throw eventstream_rpc.createRpcError(eventstream_rpc.RpcErrorType.ValidationError, `Property '${propertyName}' of type '${type}' must be a map`);
        } else {
            throw eventstream_rpc.createRpcError(eventstream_rpc.RpcErrorType.ValidationError, `Value is not a map`);
        }
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

export function validateObjectProperty(value : any, elementValidator : ElementValidator, propertyName: string, type: string) {
    if (!value) {
        return;
    }

    try {
        elementValidator(value);
    } catch (err) {
        let rpcError : eventstream_rpc.RpcError = err as eventstream_rpc.RpcError;
        throw eventstream_rpc.createRpcError(eventstream_rpc.RpcErrorType.ValidationError, `Property '${propertyName}' of type '${type}' contains an invalid value`, new CrtError(rpcError.toString()));
    }
}