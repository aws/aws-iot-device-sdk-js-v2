/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 *
 * This file is generated
 */


/**
 * Data needed to make a DeleteNamedShadow request.
 *
 * @category IotShadow
 */
export interface DeleteNamedShadowRequest {

    /**
     * AWS IoT thing to delete a named shadow from.
     *
     */
    thingName: string;

    /**
     * Name of the shadow to delete.
     *
     */
    shadowName: string;

    /**
     * Optional. A client token used to correlate requests and responses. Enter an arbitrary value here and it is reflected in the response.
     *
     */
    clientToken?: string;

}

/**
 * Data needed to subscribe to DeleteNamedShadow responses for an AWS IoT thing.
 *
 * @category IotShadow
 */
export interface DeleteNamedShadowSubscriptionRequest {

    /**
     * AWS IoT thing to subscribe to DeleteNamedShadow operations for.
     *
     */
    thingName: string;

    /**
     * Name of the shadow to subscribe to DeleteNamedShadow operations for.
     *
     */
    shadowName: string;

}

/**
 * Data needed to make a DeleteShadow request.
 *
 * @category IotShadow
 */
export interface DeleteShadowRequest {

    /**
     * AWS IoT thing to delete the (classic) shadow of.
     *
     */
    thingName: string;

    /**
     * Optional. A client token used to correlate requests and responses. Enter an arbitrary value here and it is reflected in the response.
     *
     */
    clientToken?: string;

}

/**
 * Response payload to a DeleteShadow request.
 *
 * @category IotShadow
 */
export interface DeleteShadowResponse {

    /**
     * A client token used to correlate requests and responses.
     *
     */
    clientToken?: string;

    /**
     * The time the response was generated by AWS IoT.
     *
     */
    timestamp?: Date;

    /**
     * The current version of the document for the device's shadow.
     *
     */
    version?: number;

}

/**
 * Data needed to subscribe to DeleteShadow responses for an AWS IoT thing.
 *
 * @category IotShadow
 */
export interface DeleteShadowSubscriptionRequest {

    /**
     * AWS IoT thing to subscribe to DeleteShadow operations for.
     *
     */
    thingName: string;

}

/**
 * Response document containing details about a failed request.
 *
 * @category IotShadow
 */
export interface ErrorResponse {

    /**
     * Opaque request-response correlation data.  Present only if a client token was used in the request.
     *
     */
    clientToken?: string;

    /**
     * An HTTP response code that indicates the type of error.
     *
     */
    code?: number;

    /**
     * A text message that provides additional information.
     *
     */
    message?: string;

    /**
     * The date and time the response was generated by AWS IoT. This property is not present in all error response documents.
     *
     */
    timestamp?: Date;

}

/**
 * Data needed to make a GetNamedShadow request.
 *
 * @category IotShadow
 */
export interface GetNamedShadowRequest {

    /**
     * AWS IoT thing to get the named shadow for.
     *
     */
    thingName: string;

    /**
     * Name of the shadow to get.
     *
     */
    shadowName: string;

    /**
     * Optional. A client token used to correlate requests and responses. Enter an arbitrary value here and it is reflected in the response.
     *
     */
    clientToken?: string;

}

/**
 * Data needed to subscribe to GetNamedShadow responses.
 *
 * @category IotShadow
 */
export interface GetNamedShadowSubscriptionRequest {

    /**
     * AWS IoT thing subscribe to GetNamedShadow responses for.
     *
     */
    thingName: string;

    /**
     * Name of the shadow to subscribe to GetNamedShadow responses for.
     *
     */
    shadowName: string;

}

/**
 * Data needed to make a GetShadow request.
 *
 * @category IotShadow
 */
export interface GetShadowRequest {

    /**
     * AWS IoT thing to get the (classic) shadow for.
     *
     */
    thingName: string;

    /**
     * Optional. A client token used to correlate requests and responses. Enter an arbitrary value here and it is reflected in the response.
     *
     */
    clientToken?: string;

}

/**
 * Response payload to a GetShadow request.
 *
 * @category IotShadow
 */
export interface GetShadowResponse {

    /**
     * An opaque token used to correlate requests and responses.
     *
     */
    clientToken?: string;

    /**
     * The (classic) shadow state of the AWS IoT thing.
     *
     */
    state?: ShadowStateWithDelta;

    /**
     * Contains the timestamps for each attribute in the desired and reported sections of the state.
     *
     */
    metadata?: ShadowMetadata;

    /**
     * The time the response was generated by AWS IoT.
     *
     */
    timestamp?: Date;

    /**
     * The current version of the document for the device's shadow shared in AWS IoT. It is increased by one over the previous version of the document.
     *
     */
    version?: number;

}

/**
 * Data needed to subscribe to GetShadow responses.
 *
 * @category IotShadow
 */
export interface GetShadowSubscriptionRequest {

    /**
     * AWS IoT thing subscribe to GetShadow responses for.
     *
     */
    thingName: string;

}

/**
 * Data needed to subscribe to a device's NamedShadowDelta events.
 *
 * @category IotShadow
 */
export interface NamedShadowDeltaUpdatedSubscriptionRequest {

    /**
     * Name of the AWS IoT thing to get NamedShadowDelta events for.
     *
     */
    thingName: string;

    /**
     * Name of the shadow to get ShadowDelta events for.
     *
     */
    shadowName: string;

}

/**
 * Data needed to subscribe to a device's NamedShadowUpdated events.
 *
 * @category IotShadow
 */
export interface NamedShadowUpdatedSubscriptionRequest {

    /**
     * Name of the AWS IoT thing to get NamedShadowUpdated events for.
     *
     */
    thingName: string;

    /**
     * Name of the shadow to get NamedShadowUpdated events for.
     *
     */
    shadowName: string;

}

/**
 * An event generated when a shadow document was updated by a request to AWS IoT.  The event payload contains only the changes requested.
 *
 * @category IotShadow
 */
export interface ShadowDeltaUpdatedEvent {

    /**
     * Shadow properties that were updated.
     *
     */
    state?: object;

    /**
     * Timestamps for the shadow properties that were updated.
     *
     */
    metadata?: object;

    /**
     * The time the event was generated by AWS IoT.
     *
     */
    timestamp?: Date;

    /**
     * The current version of the document for the device's shadow.
     *
     */
    version?: number;

    /**
     * An opaque token used to correlate requests and responses.  Present only if a client token was used in the request.
     *
     */
    clientToken?: string;

}

/**
 * Data needed to subscribe to a device's ShadowDelta events.
 *
 * @category IotShadow
 */
export interface ShadowDeltaUpdatedSubscriptionRequest {

    /**
     * Name of the AWS IoT thing to get ShadowDelta events for.
     *
     */
    thingName: string;

}

/**
 * Contains the last-updated timestamps for each attribute in the desired and reported sections of the shadow state.
 *
 * @category IotShadow
 */
export interface ShadowMetadata {

    /**
     * Contains the timestamps for each attribute in the desired section of a shadow's state.
     *
     */
    desired?: object;

    /**
     * Contains the timestamps for each attribute in the reported section of a shadow's state.
     *
     */
    reported?: object;

}

/**
 * (Potentially partial) state of an AWS IoT thing's shadow.
 *
 * @category IotShadow
 */
export interface ShadowState {

    /**
     * The desired shadow state (from external services and devices).
     *
     */
    desired?: object;

    /**
     * The (last) reported shadow state from the device.
     *
     */
    reported?: object;

}

/**
 * (Potentially partial) state of an AWS IoT thing's shadow.  Includes the delta between the reported and desired states.
 *
 * @category IotShadow
 */
export interface ShadowStateWithDelta {

    /**
     * The desired shadow state (from external services and devices).
     *
     */
    desired?: object;

    /**
     * The (last) reported shadow state from the device.
     *
     */
    reported?: object;

    /**
     * The delta between the reported and desired states.
     *
     */
    delta?: object;

}

/**
 * A description of the before and after states of a device shadow.
 *
 * @category IotShadow
 */
export interface ShadowUpdatedEvent {

    /**
     * Contains the state of the object before the update.
     *
     */
    previous?: ShadowUpdatedSnapshot;

    /**
     * Contains the state of the object after the update.
     *
     */
    current?: ShadowUpdatedSnapshot;

    /**
     * The time the event was generated by AWS IoT.
     *
     */
    timestamp?: Date;

}

/**
 * Complete state of the (classic) shadow of an AWS IoT Thing.
 *
 * @category IotShadow
 */
export interface ShadowUpdatedSnapshot {

    /**
     * Current shadow state.
     *
     */
    state?: ShadowState;

    /**
     * Contains the timestamps for each attribute in the desired and reported sections of the state.
     *
     */
    metadata?: ShadowMetadata;

    /**
     * The current version of the document for the device's shadow.
     *
     */
    version?: number;

}

/**
 * Data needed to subscribe to a device's ShadowUpdated events.
 *
 * @category IotShadow
 */
export interface ShadowUpdatedSubscriptionRequest {

    /**
     * Name of the AWS IoT thing to get ShadowUpdated events for.
     *
     */
    thingName: string;

}

/**
 * Data needed to make an UpdateNamedShadow request.
 *
 * @category IotShadow
 */
export interface UpdateNamedShadowRequest {

    /**
     * Aws IoT thing to update a named shadow of.
     *
     */
    thingName: string;

    /**
     * Name of the shadow to update.
     *
     */
    shadowName: string;

    /**
     * Optional. A client token used to correlate requests and responses. Enter an arbitrary value here and it is reflected in the response.
     *
     */
    clientToken?: string;

    /**
     * Requested changes to shadow state.  Updates affect only the fields specified.
     *
     */
    state?: ShadowState;

    /**
     * (Optional) The Device Shadow service applies the update only if the specified version matches the latest version.
     *
     */
    version?: number;

}

/**
 * Data needed to subscribe to UpdateNamedShadow responses.
 *
 * @category IotShadow
 */
export interface UpdateNamedShadowSubscriptionRequest {

    /**
     * Name of the AWS IoT thing to listen to UpdateNamedShadow responses for.
     *
     */
    thingName: string;

    /**
     * Name of the shadow to listen to UpdateNamedShadow responses for.
     *
     */
    shadowName: string;

}

/**
 * Data needed to make an UpdateShadow request.
 *
 * @category IotShadow
 */
export interface UpdateShadowRequest {

    /**
     * Aws IoT thing to update the (classic) shadow of.
     *
     */
    thingName: string;

    /**
     * Optional. A client token used to correlate requests and responses. Enter an arbitrary value here and it is reflected in the response.
     *
     */
    clientToken?: string;

    /**
     * Requested changes to the shadow state.  Updates affect only the fields specified.
     *
     */
    state?: ShadowState;

    /**
     * (Optional) The Device Shadow service processes the update only if the specified version matches the latest version.
     *
     */
    version?: number;

}

/**
 * Response payload to an UpdateShadow request.
 *
 * @category IotShadow
 */
export interface UpdateShadowResponse {

    /**
     * An opaque token used to correlate requests and responses.  Present only if a client token was used in the request.
     *
     */
    clientToken?: string;

    /**
     * Updated device shadow state.
     *
     */
    state?: ShadowState;

    /**
     * Contains the timestamps for each attribute in the desired and reported sections so that you can determine when the state was updated.
     *
     */
    metadata?: ShadowMetadata;

    /**
     * The time the response was generated by AWS IoT. 
     *
     */
    timestamp?: Date;

    /**
     * The current version of the document for the device's shadow shared in AWS IoT. It is increased by one over the previous version of the document.
     *
     */
    version?: number;

}

/**
 * Data needed to subscribe to UpdateShadow responses.
 *
 * @category IotShadow
 */
export interface UpdateShadowSubscriptionRequest {

    /**
     * Name of the AWS IoT thing to listen to UpdateShadow responses for.
     *
     */
    thingName: string;

}

