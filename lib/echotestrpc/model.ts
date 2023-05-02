/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */

/* This file is generated */


/**
 * @packageDocumentation
 * @module echotestrpc
 */

import {eventstream} from "aws-crt";

/**
 * A simple product definition
 */
export interface Product {

    /**
     * The product's name
     */
    name?: string,

    /**
     * How much the product costs
     */
    price?: number

}

/**
 * Shape representing a pair of values
 */
export interface Pair {

    /**
     * Pair.key as a string
     */
    key: string,

    /**
     * Pair.value also a string!
     */
    value: string

}

/**
 * An enumeration of various tasty fruits.
 *
 * To preserve backwards compatibility, no validation is performed on enum-valued fields.
 */
export enum FruitEnum {

    /**
     * Apple documentation!
     */
    APPLE = "apl",

    /**
     * Orange documentation!
     */
    ORANGE = "org",

    /**
     * Banana documentation!
     */
    BANANA = "ban",

    /**
     * Pineapple documentation!
     */
    PINEAPPLE = "pin"

}

/**
 * A simple customer definition
 */
export interface Customer {

    /**
     * Opaque customer identifier
     */
    id?: number,

    /**
     * First name of the customer
     */
    firstName?: string,

    /**
     * Last name of the customer
     */
    lastName?: string

}

/**
 * Data associated with some notion of a message
 */
export interface MessageData {

    /**
     * Some string data
     */
    stringMessage?: string,

    /**
     * Some boolean data
     */
    booleanMessage?: boolean,

    /**
     * Some timestamp data
     */
    timeMessage?: Date,

    /**
     * Some document data
     */
    documentMessage?: any,

    /**
     * Some FruitEnum data
     */
    enumMessage?: FruitEnum,

    /**
     * Some blob data
     */
    blobMessage?: eventstream.Payload,

    /**
     * Some list of strings data
     */
    stringListMessage?: string[],

    /**
     * A list of key-value pairs
     */
    keyValuePairList?: Pair[],

    /**
     * A map from strings to Product shapes
     */
    stringToValue?: Map<string, Product>

}

/**
 * A union of values related to a streaming message.  Only one field may bet set.
 *
 * EchoStreamingMessage is a union type.  One and only one member must be set.
 */
export interface EchoStreamingMessage {

    /**
     * A message data record
     */
    streamMessage?: MessageData,

    /**
     * A key value pair
     */
    keyValuePair?: Pair

}

/**
 * A sample error shape
 */
export interface ServiceError {

    /**
     * An error message
     */
    message?: string,

    /**
     * Some auxiliary value
     */
    value?: string

}

/**
 * All data associated with the result of a GetAllCustomers operation
 */
export interface GetAllCustomersResponse {

    /**
     * A list of all known customers
     */
    customers?: Customer[]

}

/**
 * Data needed to perform a GetAllCustomers operation
 */
export interface GetAllCustomersRequest {

}

/**
 * All data associated with the result of an EchoMessage operation
 */
export interface EchoMessageResponse {

    /**
     * Some message data
     */
    message?: MessageData

}

/**
 * Data needed to perform an EchoMessage operation
 */
export interface EchoMessageRequest {

    /**
     * Some message data
     */
    message?: MessageData

}

/**
 * Data associated with the response to starting an EchoStreaming streaming operation
 */
export interface EchoStreamingResponse {

}

/**
 * Data needed to start an EchoStreaming streaming operation
 */
export interface EchoStreamingRequest {

}

/**
 * All data associated with the result of an EchoMessage operation
 */
export interface CauseServiceErrorResponse {

}

/**
 * Data needed to perform a CauseServiceError operation
 */
export interface CauseServiceErrorRequest {

}

/**
 * All data associated with the result of a GetAllProducts operation
 */
export interface GetAllProductsResponse {

    /**
     * A map from strings to products
     */
    products?: Map<string, Product>

}

/**
 * Data needed to perform a GetAllProducts operation
 */
export interface GetAllProductsRequest {

}

