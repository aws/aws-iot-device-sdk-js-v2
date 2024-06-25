/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */

import {CrtError, mqtt_request_response} from "aws-crt";
import {ServiceError} from "./mqtt_request_response";

export interface StreamingOperationConfig {
    operationName: string,

    serviceModel: RequestResponseServiceModel,

    client: mqtt_request_response.RequestResponseClient,

    modelConfig: any,
}

export interface RequestResponseOperationConfig {
    operationName: string,

    serviceModel: RequestResponseServiceModel,

    client: mqtt_request_response.RequestResponseClient,

    request: any,
}

export type MessageDeserializer = (payload: ArrayBuffer) => any;

export interface RequestResponsePath {
    topic: string,

    correlationTokenJsonPath?: string,

    deserializer: MessageDeserializer;
}

export interface RequestResponseOperationModel {
    inputShapeName: string;

    payloadTransformer: (request: any) => ArrayBuffer;

    subscriptionGenerator: (request: any) => Array<string>;

    responsePathGenerator: (request: any) => Array<RequestResponsePath>;

    publishTopicGenerator: (request: any) => string;

    correlationTokenApplicator: (request: any) => [any, string | undefined];
}

export interface StreamingOperationModel {
    inputShapeName: string;

    subscriptionGenerator: (config: any) => string;

    deserializer: MessageDeserializer;
}

export interface RequestResponseServiceModel {

    // operation name -> operation model
    requestResponseOperations: Map<string, RequestResponseOperationModel>,

    // operation name -> operation model
    streamingOperations: Map<string, StreamingOperationModel>,

    // shape name -> validator function
    shapeValidators: Map<string, (value: any) => void>;
}

function buildResponseDeserializerMap(paths: Array<RequestResponsePath>) : Map<string, MessageDeserializer> {
    return new Map<string, MessageDeserializer>(
        paths.map((path) => {
            return [path.topic, path.deserializer];
        })
    );
}

function buildResponsePaths(paths: Array<RequestResponsePath>) : Array<mqtt_request_response.ResponsePath> {
    return paths.map((path) => {
        return {
            topic: path.topic,
            correlationTokenJsonPath: path.correlationTokenJsonPath,
        };
    });
}

export async function doRequestResponse<ResponseType>(options: RequestResponseOperationConfig) : Promise<ResponseType> {
    return new Promise<ResponseType>(async (resolve, reject) => {
        try {
            let operationModel = options.serviceModel.requestResponseOperations.get(options.operationName);
            if (!operationModel) {
                reject(createServiceError(`Operation "${options.operationName}" not in client's service model`));
                return;
            }

            let validator = options.serviceModel.shapeValidators.get(operationModel.inputShapeName);
            if (!validator) {
                reject(createServiceError(`Operation "${options.operationName}" does not have an input validator`));
                return;
            }

            validator(options.request);

            let publishTopic = operationModel.publishTopicGenerator(options.request);
            let subscriptionsNeeded = operationModel.subscriptionGenerator(options.request);
            let modelPaths = operationModel.responsePathGenerator(options.request);
            let deserializerMap = buildResponseDeserializerMap(modelPaths);
            let responsePaths = buildResponsePaths(modelPaths);

            let [request, correlationToken] = operationModel.correlationTokenApplicator(options.request);

            let payload = operationModel.payloadTransformer(request);

            let requestOptions: mqtt_request_response.RequestResponseOperationOptions = {
                subscriptionTopicFilters: subscriptionsNeeded,
                responsePaths: responsePaths,
                publishTopic: publishTopic,
                payload: payload
            };

            if (correlationToken) {
                requestOptions.correlationToken = correlationToken;
            }

            let response = await options.client.submitRequest(requestOptions);

            let responseTopic = response.topic;
            let responsePayload = response.payload;

            let deserializer = deserializerMap.get(responseTopic);
            if (!deserializer) {
                reject(createServiceError(`Operation "${options.operationName}" does not have a deserializer for topic "${responseTopic}"`));
                return;
            }

            let deserializedResponse = deserializer(responsePayload) as ResponseType;
            resolve(deserializedResponse);
        } catch (err) {
            if (err instanceof ServiceError) {
                reject(err);
            } else if (err instanceof CrtError) {
                reject(createServiceError("??", err as CrtError));
            } else {
                reject(createServiceError((err as Error).toString()));
            }
        }
    });


}

export function createServiceError(description: string, internalError?: CrtError, modeledError?: any) {
    return new ServiceError({
        description: description,
        internalError: internalError,
        modeledError: modeledError,
    });
}

function throwMissingPropertyError(propertyName?: string) : void {
    if (propertyName) {
        throw createServiceError(`validation failure - missing required property '${propertyName}'`);
    } else {
        throw createServiceError(`validation failure - missing required property`);
    }
}

function throwInvalidPropertyValueError(valueDescription: string, propertyName?: string) : void {
    if (propertyName) {
        throw createServiceError(`validation failure - property '${propertyName}' must be ${valueDescription}`);
    } else {
        throw createServiceError(`validation failure - property must be ${valueDescription}`);
    }
}

export function validateValueAsTopicSegment(value : any, propertyName?: string) : void {
    if (value === undefined) {
        throwMissingPropertyError(propertyName);
    }

    if (typeof value !== 'string') {
        throwInvalidPropertyValueError("a string", propertyName);
    }

    if (value.includes("/") || value.includes("#") || value.includes("+")) {
        throwInvalidPropertyValueError("a valid MQTT topic", propertyName);
    }
}

export function validateOptionalValueAsNumber(value: any, propertyName?: string) {
    if (value === undefined) {
        return;
    }

    validateValueAsNumber(value, propertyName);
}

export function validateValueAsNumber(value: any, propertyName?: string) {
    if (value == undefined) {
        throwMissingPropertyError(propertyName);
    }

    if (typeof value !== 'number') {
        throwInvalidPropertyValueError("a number", propertyName);
    }
}

//////////////

export function validateValueAsString(value : any, propertyName?: string) : void {
    if (value === undefined) {
        throwMissingPropertyError(propertyName);
    }

    if (typeof value !== 'string') {
        throwInvalidPropertyValueError('a string value', propertyName);
    }
}

export function validateValueAsOptionalString(value : any, propertyName?: string) : void {
    if (value === undefined) {
        return;
    }

    validateValueAsString(value, propertyName);
}

export function validateValueAsInteger(value : any, propertyName?: string) {
    if (value === undefined) {
        throwMissingPropertyError(propertyName);
    }

    if (typeof value !== 'number' || !Number.isSafeInteger(value as number)) {
        throwInvalidPropertyValueError('an integer value', propertyName);
    }
}

export function validateValueAsOptionalInteger(value : any, propertyName?: string) {
    if (value === undefined) {
        return;
    }

    validateValueAsInteger(value, propertyName);
}

export function validateValueAsBoolean(value : any, propertyName?: string) {
    if (value === undefined) {
        throwMissingPropertyError(propertyName);
    }

    if (typeof value !== 'boolean') {
        throwInvalidPropertyValueError('a boolean value', propertyName);
    }
}

export function validateValueAsOptionalBoolean(value : any, propertyName?: string) {
    if (value === undefined) {
        return;
    }

    validateValueAsBoolean(value, propertyName);
}

export function validateValueAsDate(value : any, propertyName?: string) {
    if (value === undefined) {
        throwMissingPropertyError(propertyName);
    }

    if (!(value instanceof Date) || isNaN((value as Date).getTime())) {
        throwInvalidPropertyValueError('a Date value', propertyName);
    }
}

export function validateValueAsOptionalDate(value : any, propertyName?: string) {
    if (value === undefined) {
        return;
    }

    validateValueAsDate(value, propertyName);
}

export function validateValueAsBlob(value : any, propertyName?: string) {
    if (value === undefined) {
        throwMissingPropertyError(propertyName);
    }

    /* there doesn't seem to be a good way of checking if something is an ArrayBuffer */
    if ((typeof value !== 'string') && !ArrayBuffer.isView(value) && (!value.byteLength || !value.maxByteLength)) {
        throwInvalidPropertyValueError('a value convertible to a binary payload', propertyName);
    }
}

export function validateValueAsOptionalBlob(value : any, propertyName?: string) {
    if (value === undefined) {
        return;
    }

    validateValueAsBlob(value, propertyName);
}

export function validateValueAsAny(value : any, propertyName?: string) {
    if (value === undefined) {
        throwMissingPropertyError(propertyName);
    }
}

export function validateValueAsOptionalAny(value : any, propertyName?: string) {
    if (value === undefined) {
        return;
    }

    validateValueAsAny(value, propertyName);
}

export type ElementValidator = (value : any) => void;

export function validateValueAsArray(value : any, elementValidator : ElementValidator, propertyName?: string) {
    if (value === undefined) {
        throwMissingPropertyError(propertyName);
    }

    if (!Array.isArray(value)) {
        throwInvalidPropertyValueError('an array value', propertyName);
    }

    for (const element of value) {
        try {
            elementValidator(element);
        } catch (err) {
            let serviceError : ServiceError = err as ServiceError;
            if (propertyName) {
                throw createServiceError(`Array property '${propertyName}' contains an invalid value: ${serviceError.toString()}`);
            } else {
                throw createServiceError(`Array contains an invalid value: ${serviceError.toString()}`);
            }
        }
    }
}

export function validateValueAsOptionalArray(value : any, elementValidator : ElementValidator, propertyName?: string) {
    if (value === undefined) {
        return;
    }

    validateValueAsArray(value, elementValidator, propertyName);
}

export function validateValueAsMap(value : any, keyValidator : ElementValidator, valueValidator : ElementValidator, propertyName?: string) {
    if (value === undefined) {
        return;
    }

    if (!(value instanceof Map)) {
        throwInvalidPropertyValueError('a map value', propertyName);
    }

    let valueAsMap = value as Map<any, any>;
    for (const [key, val] of valueAsMap) {
        try {
            keyValidator(key);
        } catch (err) {
            let serviceError : ServiceError = err as ServiceError;
            if (propertyName) {
                throw createServiceError(`Map property '${propertyName}' contains an invalid key: ${serviceError.toString()}`);
            } else {
                throw createServiceError(`Map contains an invalid key: ${serviceError.toString()}`);
            }
        }

        try {
            valueValidator(val);
        } catch (err) {
            let serviceError : ServiceError = err as ServiceError;
            if (propertyName) {
                throw createServiceError(`Map property '${propertyName}' contains an invalid value: ${serviceError.toString()}`);
            } else {
                throw createServiceError(`Map contains an invalid value: ${serviceError.toString()}`);
            }
        }
    }
}

export function validateValueAsOptionalMap(value : any, keyValidator : ElementValidator, valueValidator : ElementValidator, propertyName?: string) {
    if (value === undefined) {
        return;
    }

    validateValueAsMap(value, keyValidator, valueValidator, propertyName);
}

export function validateValueAsObject(value : any, elementValidator : ElementValidator, propertyName: string) {
    if (value === undefined) {
        throwMissingPropertyError(propertyName);
    }

    try {
        elementValidator(value);
    } catch (err) {
        let serviceError : ServiceError = err as ServiceError;
        throw createServiceError(`Property '${propertyName}' contains an invalid value: ${serviceError.toString()}`);
    }
}

export function validateValueAsOptionalObject(value : any, elementValidator : ElementValidator, propertyName: string,) {
    if (value === undefined) {
        return;
    }

    validateValueAsObject(value, elementValidator, propertyName);
}

