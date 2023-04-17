/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */


/**
 * @packageDocumentation
 * @module echotestrpc
 */

import {eventstream} from "aws-crt";

export interface Product {
    name?: string,
    price?: number
}

export interface Pair {
    key: string,
    value: string
}

export enum FruitEnum {
    APPLE = "apl",
    ORANGE = "org",
    BANANA = "ban",
    PINEAPPLE = "pin"
}

export interface Customer {
    id?: number,
    firstName?: string,
    lastName?: string
}

export interface MessageData {
    stringMessage?: string,
    booleanMessage?: boolean,
    timeMessage?: Date,
    documentMessage?: any,
    enumMessage?: FruitEnum,
    blobMessage?: eventstream.Payload,
    stringListMessage?: string[],
    keyValuePairList?: Pair[],
    stringToValue?: Map<string, Product>
}

export interface EchoStreamingMessage {
    streamMessage?: MessageData,
    keyValuePair?: Pair
}

export interface GetAllCustomersResponse {
    customers?: Customer[]
}

export interface GetAllCustomersRequest {
}

export interface EchoMessageResponse {
    message?: MessageData
}

export interface EchoMessageRequest {
    message?: MessageData
}

export interface EchoStreamingResponse {
}

export interface EchoStreamingRequest {
}

export interface CauseServiceErrorResponse {
}

export interface CauseServiceErrorRequest {
}

export interface ServiceError {
    message?: string,
    value?: string
}

export interface GetAllProductsResponse {
    products?: Map<string, Product>
}

export interface GetAllProductsRequest {
}

