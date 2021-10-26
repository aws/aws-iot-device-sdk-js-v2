/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 *
 * This file is generated
 */

/**
 * @packageDocumentation
 * @module aws-iot-device-sdk
 */


/**
 * @category IotIdentity
 */
export interface CreateCertificateFromCsrRequest {
    certificateSigningRequest?: string;
}

/**
 * @category IotIdentity
 */
export interface CreateCertificateFromCsrResponse {
    certificateId?: string;
    certificateOwnershipToken?: string;
    certificatePem?: string;
}

/**
 * @category IotIdentity
 */
export interface CreateCertificateFromCsrSubscriptionRequest {
}

/**
 * @category IotIdentity
 */
export interface CreateKeysAndCertificateRequest {
}

/**
 * @category IotIdentity
 */
export interface CreateKeysAndCertificateResponse {
    certificateId?: string;
    certificateOwnershipToken?: string;
    certificatePem?: string;
    privateKey?: string;
}

/**
 * @category IotIdentity
 */
export interface CreateKeysAndCertificateSubscriptionRequest {
}

/**
 * @category IotIdentity
 */
export interface ErrorResponse {
    statusCode?: number;
    errorMessage?: string;
    errorCode?: string;
}

/**
 * @category IotIdentity
 */
export interface RegisterThingRequest {
    templateName: string;
    parameters?: {[key: string]: string};
    certificateOwnershipToken?: string;
}

/**
 * @category IotIdentity
 */
export interface RegisterThingResponse {
    thingName?: string;
    deviceConfiguration?: {[key: string]: string};
}

/**
 * @category IotIdentity
 */
export interface RegisterThingSubscriptionRequest {
    templateName: string;
}

