/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */

/**
 * @packageDocumentation
 * @module echo_rpc
 */

import {eventstream} from "aws-crt";

export interface Pair {
    key : string,

    value : string
}

export interface Product {
    name? : string,

    price? : number
}

export enum FruitEnum {
    APPLE = "apl",
    ORANGE = "org",
    BANANA = "ban",
    PINEAPPLE = "pin"
}

export interface MessageData {
    stringMessage? : string,

    booleanMessage?: boolean,

    timeMessage?: Date,

    documentMessage?: any,

    enumMessage?: FruitEnum,

    blobMessage?: eventstream.Payload,

    stringListMessage?: string[],

    keyValuePairList?: Pair[],

    stringToValue?: Map<string, Product>
}

export interface EchoMessageRequest {
    message?: MessageData
}

export interface EchoMessageResponse {
    message?: MessageData
}

export interface CauseServiceErrorRequest {
}

export interface CauseServiceErrorResponse {
}

export interface ServiceError {
    message?: string,

    value?: string
}

export interface Customer {
    id : number;

    firstName : string;

    lastName : string;
}

export interface EchoStreamingRequest {
}

export interface EchoStreamingResponse {
}

export interface EchoStreamingMessage {
    streamMessage?: MessageData,

    keyValuePair?: Pair
}

export interface GetAllCustomersRequest {
}

export interface GetAllCustomersResponse {

    customers?: Customer[];
}

export interface GetAllProductsRequest {
}

export interface GetAllProductsResponse {
    products?: Map<string, Product>
}