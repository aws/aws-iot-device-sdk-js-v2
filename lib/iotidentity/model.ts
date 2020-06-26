/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */


/**
 * @module aws-iot-device-sdk
 * @category IotIdentity
 */
export interface CreateCertificateFromCsrRequest {
    certificateSigningRequest?: string;
}

/**
 * @module aws-iot-device-sdk
 * @category IotIdentity
 */
export interface CreateCertificateFromCsrResponse {
    certificateId?: string;
    certificateOwnershipToken?: string;
    certificatePem?: string;
}

/**
 * @module aws-iot-device-sdk
 * @category IotIdentity
 */
export interface CreateCertificateFromCsrSubscriptionRequest {
}

/**
 * @module aws-iot-device-sdk
 * @category IotIdentity
 */
export interface CreateKeysAndCertificateRequest {
}

/**
 * @module aws-iot-device-sdk
 * @category IotIdentity
 */
export interface CreateKeysAndCertificateResponse {
    certificateId?: string;
    certificateOwnershipToken?: string;
    certificatePem?: string;
    privateKey?: string;
}

/**
 * @module aws-iot-device-sdk
 * @category IotIdentity
 */
export interface CreateKeysAndCertificateSubscriptionRequest {
}

/**
 * @module aws-iot-device-sdk
 * @category IotIdentity
 */
export interface ErrorResponse {
    statusCode?: number;
    errorMessage?: string;
    errorCode?: string;
}

/**
 * @module aws-iot-device-sdk
 * @category IotIdentity
 */
export interface RegisterThingRequest {
    templateName: string;
    parameters?: {[key: string]: string};
    certificateOwnershipToken?: string;
}

/**
 * @module aws-iot-device-sdk
 * @category IotIdentity
 */
export interface RegisterThingResponse {
    thingName?: string;
    deviceConfiguration?: {[key: string]: string};
}

/**
 * @module aws-iot-device-sdk
 * @category IotIdentity
 */
export interface RegisterThingSubscriptionRequest {
    templateName: string;
}

