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
                payload: payload,
                correlationToken: correlationToken
            };

            let response = await options.client.submitRequest(requestOptions);

            let responseTopic = response.topic;
            let responsePayload = response.payload;

            let deserializer = deserializerMap.get(responseTopic);
            if (!deserializer) {
                reject(createServiceError(`Operation "${options.operationName}" does not have a deserializer for topic "${responseTopic}"`));
                return;
            }

            resolve(deserializer(responsePayload) as ResponseType);
        } catch (err) {
            if (err instanceof ServiceError) {
                throw err;
            } else if (err instanceof CrtError) {
                throw createServiceError("", err as CrtError);
            } else {
                throw createServiceError((err as Error).toString());
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

function throwMissingPropertyError(propertyName?: string, shapeType?: string) : void {
    if (propertyName && shapeType) {
        throw createServiceError(`validation failure - missing required property '${propertyName}' of type '${shapeType}'`);
    } else {
        throw createServiceError(`validation failure - missing required property`);
    }
}

function throwInvalidPropertyValueError(valueDescription: string, propertyName?: string, shapeType?: string) : void {
    if (propertyName && shapeType) {
        throw createServiceError(`validation failure - property '${propertyName}' of type '${shapeType}' must be ${valueDescription}`);
    } else {
        throw createServiceError(`validation failure - property must be ${valueDescription}`);
    }
}

export function validateValueAsTopicSegment(value : any, propertyName?: string, shapeType?: string) : void {
    if (value === undefined) {
        throwMissingPropertyError(propertyName, shapeType);
    }

    if (typeof value !== 'string') {
        throwInvalidPropertyValueError("a string", propertyName, shapeType);
    }

    if (value.includes("/") || value.includes("#") || value.includes("+")) {
        throwInvalidPropertyValueError("a valid MQTT topic", propertyName, shapeType);
    }
}

export function validateOptionalValueAsNumber(value: any, propertyName?: string, shapeType?: string) {
    if (value === undefined) {
        return;
    }

    validateValueAsNumber(value, propertyName, shapeType);
}

export function validateValueAsNumber(value: any, propertyName?: string, shapeType?: string) {
    if (value == undefined) {
        throwMissingPropertyError(propertyName, shapeType);
    }

    if (typeof value !== 'number') {
        throwInvalidPropertyValueError("a number", propertyName, shapeType);
    }
}

export function validateValueAsObject(value: any, propertyName?: string, shapeType?: string) {
    if (value == undefined) {
        throwMissingPropertyError(propertyName, shapeType);
    }
}
