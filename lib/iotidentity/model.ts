/* Copyright 2010-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
*
* Licensed under the Apache License, Version 2.0 (the "License").
* You may not use this file except in compliance with the License.
* A copy of the License is located at
*
*  http://aws.amazon.com/apache2.0
*
* or in the "license" file accompanying this file. This file is distributed
* on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
* express or implied. See the License for the specific language governing
* permissions and limitations under the License.

* This file is generated
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
    privateKey?: string;
    certificateOwnershipToken?: string;
    certificatePem?: string;
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
    errorCode?: string;
    statusCode?: number;
    errorMessage?: string;
}

/**
 * @category IotIdentity
 */
export interface RegisterThingRequest {
    parameters?: {[key: string]: string};
    templateName: string;
    certificateOwnershipToken?: string;
}

/**
 * @category IotIdentity
 */
export interface RegisterThingResponse {
    deviceConfiguration?: {[key: string]: string};
    thingName?: string;
}

/**
 * @category IotIdentity
 */
export interface RegisterThingSubscriptionRequest {
    templateName: string;
}

