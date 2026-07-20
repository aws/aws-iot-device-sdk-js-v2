/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */

/* This file is generated */


/**
 * @packageDocumentation
 * @module greengrasscoreipc
 */

import {eventstream} from "aws-crt";

/**
 * To preserve backwards compatibility, no validation is performed on enum-valued fields.
 */
export enum DetailedDeploymentStatus {

    SUCCESSFUL = "SUCCESSFUL",

    FAILED_NO_STATE_CHANGE = "FAILED_NO_STATE_CHANGE",

    FAILED_ROLLBACK_NOT_REQUESTED = "FAILED_ROLLBACK_NOT_REQUESTED",

    FAILED_ROLLBACK_COMPLETE = "FAILED_ROLLBACK_COMPLETE",

    REJECTED = "REJECTED"

}

export interface UserProperty {

    key?: string,

    value?: string

}

export interface SystemResourceLimits {

    /**
     * (Optional) The maximum amount of RAM (in kilobytes) that this component's processes can use on the core device.
     */
    memory?: number,

    /**
     * (Optional) The maximum amount of CPU time that this component's processes can use on the core device.
     */
    cpus?: number

}

export interface DeploymentStatusDetails {

    /**
     * The detailed deployment status of the local deployment.
     */
    detailedDeploymentStatus: DetailedDeploymentStatus,

    /**
     * (Optional) The list of local deployment errors
     */
    deploymentErrorStack?: string[],

    /**
     * (Optional) The list of local deployment error types
     */
    deploymentErrorTypes?: string[],

    /**
     * (Optional) The cause of local deployment failure
     */
    deploymentFailureCause?: string

}

/**
 * To preserve backwards compatibility, no validation is performed on enum-valued fields.
 */
export enum DeploymentStatus {

    QUEUED = "QUEUED",

    IN_PROGRESS = "IN_PROGRESS",

    SUCCEEDED = "SUCCEEDED",

    FAILED = "FAILED",

    CANCELED = "CANCELED"

}

/**
 * To preserve backwards compatibility, no validation is performed on enum-valued fields.
 */
export enum LifecycleState {

    RUNNING = "RUNNING",

    ERRORED = "ERRORED",

    NEW = "NEW",

    FINISHED = "FINISHED",

    INSTALLED = "INSTALLED",

    BROKEN = "BROKEN",

    STARTING = "STARTING",

    STOPPING = "STOPPING"

}

/**
 * Contextual information about the message.
 * NOTE The context is ignored if used in PublishMessage.
 */
export interface MessageContext {

    /**
     * The topic where the message was published.
     */
    topic?: string

}

/**
 * To preserve backwards compatibility, no validation is performed on enum-valued fields.
 */
export enum MetricUnitType {

    BYTES = "BYTES",

    BYTES_PER_SECOND = "BYTES_PER_SECOND",

    COUNT = "COUNT",

    COUNT_PER_SECOND = "COUNT_PER_SECOND",

    MEGABYTES = "MEGABYTES",

    SECONDS = "SECONDS"

}

/**
 * To preserve backwards compatibility, no validation is performed on enum-valued fields.
 */
export enum PayloadFormat {

    BYTES = "0",

    UTF8 = "1"

}

export interface RunWithInfo {

    /**
     * (Optional) The POSIX system user and, optionally, group to use to run this component on Linux core devices.
     */
    posixUser?: string,

    /**
     * (Optional) The Windows user to use to run this component on Windows core devices.
     */
    windowsUser?: string,

    /**
     * (Optional) The system resource limits to apply to this component's processes.
     */
    systemResourceLimits?: SystemResourceLimits

}

export interface LocalDeployment {

    /**
     * The ID of the local deployment.
     */
    deploymentId: string,

    /**
     * The status of the local deployment.
     */
    status: DeploymentStatus,

    /**
     * (Optional) The timestamp at which the local deployment was created in MM/dd/yyyy hh:mm:ss format
     */
    createdOn?: string,

    /**
     * (Optional) The status details of the local deployment.
     */
    deploymentStatusDetails?: DeploymentStatusDetails

}

export interface PostComponentUpdateEvent {

    /**
     * The ID of the AWS IoT Greengrass deployment that updated the component.
     */
    deploymentId: string

}

export interface PreComponentUpdateEvent {

    /**
     * The ID of the AWS IoT Greengrass deployment that updates the component.
     */
    deploymentId: string,

    /**
     * Whether or not Greengrass needs to restart to apply the update.
     */
    isGgcRestarting: boolean

}

/**
 * To preserve backwards compatibility, no validation is performed on enum-valued fields.
 */
export enum ConfigurationValidityStatus {

    ACCEPTED = "ACCEPTED",

    REJECTED = "REJECTED"

}

export interface ComponentDetails {

    /**
     * The name of the component.
     */
    componentName: string,

    /**
     * The version of the component.
     */
    version: string,

    /**
     * The state of the component.
     */
    state: LifecycleState,

    /**
     * The component's configuration as a JSON object.
     */
    configuration?: any

}

export interface CertificateUpdate {

    /**
     * The private key in pem format.
     */
    privateKey?: string,

    /**
     * The public key in pem format.
     */
    publicKey?: string,

    /**
     * The certificate in pem format.
     */
    certificate?: string,

    /**
     * List of CA certificates in pem format.
     */
    caCertificates?: string[]

}

/**
 * To preserve backwards compatibility, no validation is performed on enum-valued fields.
 */
export enum CertificateType {

    SERVER = "SERVER"

}

export interface BinaryMessage {

    /**
     * The binary message as a blob.
     */
    message?: eventstream.Payload,

    /**
     * The context of the message, such as the topic where the message was published.
     */
    context?: MessageContext

}

export interface JsonMessage {

    /**
     * The JSON message as an object.
     */
    message?: any,

    /**
     * The context of the message, such as the topic where the message was published.
     */
    context?: MessageContext

}

export interface MQTTCredential {

    /**
     * The client ID to used to connect.
     */
    clientId?: string,

    /**
     * The client certificate in pem format.
     */
    certificatePem?: string,

    /**
     * The username. (unused).
     */
    username?: string,

    /**
     * The password. (unused).
     */
    password?: string

}

export interface ValidateConfigurationUpdateEvent {

    /**
     * The object that contains the new configuration.
     */
    configuration?: any,

    /**
     * The ID of the AWS IoT Greengrass deployment that updates the component.
     */
    deploymentId: string

}

export interface Metric {

    name: string,

    unit: MetricUnitType,

    value: number

}

export interface ConfigurationUpdateEvent {

    /**
     * The name of the component.
     */
    componentName: string,

    /**
     * The key path to the configuration value that updated.
     */
    keyPath: string[]

}

export interface MQTTMessage {

    /**
     * The topic to which the message was published.
     */
    topicName: string,

    /**
     * (Optional) The message payload as a blob.
     */
    payload?: eventstream.Payload,

    /**
     * (Optional) The value of the retain flag.
     */
    retain?: boolean,

    /**
     * (Optional) MQTT user properties associated with the message.
     */
    userProperties?: UserProperty[],

    /**
     * (Optional) Message expiry interval in seconds.
     */
    messageExpiryIntervalSeconds?: number,

    /**
     * (Optional) Correlation data blob for request/response.
     */
    correlationData?: eventstream.Payload,

    /**
     * (Optional) Response topic for request/response.
     */
    responseTopic?: string,

    /**
     * (Optional) Message payload format.
     */
    payloadFormat?: PayloadFormat,

    /**
     * (Optional) Message content type.
     */
    contentType?: string

}

/**
 * To preserve backwards compatibility, no validation is performed on enum-valued fields.
 */
export enum FailureHandlingPolicy {

    ROLLBACK = "ROLLBACK",

    DO_NOTHING = "DO_NOTHING"

}

/**
 * To preserve backwards compatibility, no validation is performed on enum-valued fields.
 */
export enum RequestStatus {

    SUCCEEDED = "SUCCEEDED",

    FAILED = "FAILED"

}

export interface ComponentUpdatePolicyEvents {

    /**
     * An event that indicates that the Greengrass wants to update a component.
     */
    preUpdateEvent?: PreComponentUpdateEvent,

    /**
     * An event that indicates that the nucleus updated a component.
     */
    postUpdateEvent?: PostComponentUpdateEvent

}

/**
 * To preserve backwards compatibility, no validation is performed on enum-valued fields.
 */
export enum ReportedLifecycleState {

    RUNNING = "RUNNING",

    ERRORED = "ERRORED"

}

export interface SecretValue {

    /**
     * The decrypted part of the protected secret information that you provided to Secrets Manager as a string.
     */
    secretString?: string,

    /**
     * (Optional) The decrypted part of the protected secret information that you provided to Secrets Manager as binary data in the form of a byte array.
     */
    secretBinary?: eventstream.Payload

}

export interface ConfigurationValidityReport {

    /**
     * The validity status.
     */
    status: ConfigurationValidityStatus,

    /**
     * The ID of the AWS IoT Greengrass deployment that requested the configuration update.
     */
    deploymentId: string,

    /**
     * (Optional) A message that reports why the configuration isn't valid.
     */
    message?: string

}

export interface ClientDeviceCredential {

    /**
     * The client device's X.509 device certificate.
     */
    clientDeviceCertificate?: string

}

export interface CertificateUpdateEvent {

    /**
     * The information about the new certificate.
     */
    certificateUpdate?: CertificateUpdate

}

export interface CertificateOptions {

    /**
     * The types of certificate updates to subscribe to.
     */
    certificateType: CertificateType

}

export interface PublishMessage {

    /**
     * (Optional) A JSON message.
     */
    jsonMessage?: JsonMessage,

    /**
     * (Optional) A binary message.
     */
    binaryMessage?: BinaryMessage

}

export interface CredentialDocument {

    /**
     * The client device's MQTT credentials. Specify the client ID and certificate that the client device uses to connect.
     */
    mqttCredential?: MQTTCredential

}

export interface SubscriptionResponseMessage {

    /**
     * (Optional) A JSON message.
     */
    jsonMessage?: JsonMessage,

    /**
     * (Optional) A binary message.
     */
    binaryMessage?: BinaryMessage

}

/**
 * To preserve backwards compatibility, no validation is performed on enum-valued fields.
 */
export enum ReceiveMode {

    RECEIVE_ALL_MESSAGES = "RECEIVE_ALL_MESSAGES",

    RECEIVE_MESSAGES_FROM_OTHERS = "RECEIVE_MESSAGES_FROM_OTHERS"

}

export interface ValidateConfigurationUpdateEvents {

    /**
     * The configuration update event.
     */
    validateConfigurationUpdateEvent?: ValidateConfigurationUpdateEvent

}

export interface ConfigurationUpdateEvents {

    /**
     * The configuration update event.
     */
    configurationUpdateEvent?: ConfigurationUpdateEvent

}

/**
 * To preserve backwards compatibility, no validation is performed on enum-valued fields.
 */
export enum QOS {

    AT_MOST_ONCE = "0",

    AT_LEAST_ONCE = "1"

}

export interface IoTCoreMessage {

    /**
     * The MQTT message.
     */
    message?: MQTTMessage

}

export interface InvalidArgumentsError {

    message?: string

}

export interface InvalidArtifactsDirectoryPathError {

    message?: string

}

export interface InvalidRecipeDirectoryPathError {

    message?: string

}

export interface ServiceError {

    message?: string,

    context?: any

}

export interface CreateLocalDeploymentResponse {

    /**
     * The ID of the local deployment that the request created.
     */
    deploymentId?: string

}

export interface CreateLocalDeploymentRequest {

    /**
     * The thing group name the deployment is targeting. If the group name is not specified, "LOCAL_DEPLOYMENT" will be used.
     */
    groupName?: string,

    /**
     * Map of component name to version. Components will be added to the group's existing root components.
     */
    rootComponentVersionsToAdd?: Map<string, string>,

    /**
     * List of components that need to be removed from the group, for example if new artifacts were loaded in this request but recipe version did not change.
     */
    rootComponentsToRemove?: string[],

    /**
     * Map of component names to configuration.
     */
    componentToConfiguration?: Map<string, any>,

    /**
     * Map of component names to component run as info.
     */
    componentToRunWithInfo?: Map<string, RunWithInfo>,

    /**
     * All recipes files in this directory will be copied over to the Greengrass package store.
     */
    recipeDirectoryPath?: string,

    /**
     * All artifact files in this directory will be copied over to the Greengrass package store.
     */
    artifactsDirectoryPath?: string,

    /**
     * Deployment failure handling policy.
     */
    failureHandlingPolicy?: FailureHandlingPolicy

}

export interface ResourceNotFoundError {

    message?: string,

    resourceType?: string,

    resourceName?: string

}

export interface UnauthorizedError {

    message?: string

}

export interface PauseComponentResponse {

}

export interface PauseComponentRequest {

    /**
     * The name of the component to pause, which must be a generic component.
     */
    componentName: string

}

export interface ComponentNotFoundError {

    message?: string

}

export interface StopComponentResponse {

    /**
     * The status of the stop request.
     */
    stopStatus: RequestStatus,

    /**
     * A message about why the component failed to stop, if the request failed.
     */
    message?: string

}

export interface StopComponentRequest {

    /**
     * The name of the component.
     */
    componentName: string

}

export interface ListLocalDeploymentsResponse {

    /**
     * The list of local deployments.
     */
    localDeployments?: LocalDeployment[]

}

export interface ListLocalDeploymentsRequest {

}

export interface SubscribeToComponentUpdatesResponse {

}

export interface SubscribeToComponentUpdatesRequest {

}

export interface ListNamedShadowsForThingResponse {

    /**
     * The list of shadow names.
     */
    results: string[],

    /**
     * (Optional) The date and time that the response was generated.
     */
    timestamp: Date,

    /**
     * (Optional) The token value to use in paged requests to retrieve the next page in the sequence. This token isn't present when there are no more shadow names to return.
     */
    nextToken?: string

}

export interface ListNamedShadowsForThingRequest {

    /**
     * The name of the thing.
     */
    thingName: string,

    /**
     * (Optional) The token to retrieve the next set of results. This value is returned on paged results and is used in the call that returns the next page.
     */
    nextToken?: string,

    /**
     * (Optional) The number of shadow names to return in each call. Value must be between 1 and 100. Default is 25.
     */
    pageSize?: number

}

export interface CancelLocalDeploymentResponse {

    message?: string

}

export interface CancelLocalDeploymentRequest {

    /**
     * (Optional) The ID of the local deployment to cancel.
     */
    deploymentId?: string

}

export interface UpdateStateResponse {

}

export interface UpdateStateRequest {

    /**
     * The state to set this component to.
     */
    state: ReportedLifecycleState

}

export interface GetSecretValueResponse {

    /**
     * The ID of the secret.
     */
    secretId: string,

    /**
     * The ID of this version of the secret.
     */
    versionId: string,

    /**
     * The list of staging labels attached to this version of the secret.
     */
    versionStage: string[],

    /**
     * The value of this version of the secret.
     */
    secretValue: SecretValue

}

export interface GetSecretValueRequest {

    /**
     * The name of the secret to get. You can specify either the Amazon Resource Name (ARN) or the friendly name of the secret.
     */
    secretId: string,

    /**
     * (Optional) The ID of the version to get. If you don't specify versionId or versionStage, this operation defaults to the version with the AWSCURRENT label.
     */
    versionId?: string,

    /**
     * (Optional) The staging label of the version to get. If you don't specify versionId or versionStage, this operation defaults to the version with the AWSCURRENT label.
     */
    versionStage?: string,

    /**
     * (Optional) Whether to fetch the latest secret from cloud when the request is handled. Defaults to false.
     */
    refresh?: boolean

}

export interface GetLocalDeploymentStatusResponse {

    /**
     * The local deployment.
     */
    deployment: LocalDeployment

}

export interface GetLocalDeploymentStatusRequest {

    /**
     * The ID of the local deployment to get.
     */
    deploymentId: string

}

export interface RestartComponentResponse {

    /**
     * The status of the restart request.
     */
    restartStatus: RequestStatus,

    /**
     * A message about why the component failed to restart, if the request failed.
     */
    message?: string

}

export interface RestartComponentRequest {

    /**
     * The name of the component.
     */
    componentName: string

}

export interface InvalidTokenError {

    message?: string

}

export interface ValidateAuthorizationTokenResponse {

    isValid: boolean

}

export interface ValidateAuthorizationTokenRequest {

    token: string

}

export interface FailedUpdateConditionCheckError {

    message?: string

}

export interface ConflictError {

    message?: string

}

export interface UpdateConfigurationResponse {

}

export interface UpdateConfigurationRequest {

    /**
     * (Optional) The key path to the container node (the object) to update. Specify a list where each entry is the key for a single level in the configuration object. Defaults to the root of the configuration object.
     */
    keyPath?: string[],

    /**
     * The current Unix epoch time in milliseconds. This operation uses this timestamp to resolve concurrent updates to the key. If the key in the component configuration has a greater timestamp than the timestamp in the request, then the request fails.
     */
    timestamp: Date,

    /**
     * The configuration object to merge at the location that you specify in keyPath.
     */
    valueToMerge: any

}

export interface UpdateThingShadowResponse {

    /**
     * The response state document as a JSON encoded blob.
     */
    payload: eventstream.Payload

}

export interface UpdateThingShadowRequest {

    /**
     * The name of the thing.
     */
    thingName: string,

    /**
     * The name of the shadow. To specify the thing's classic shadow, set this parameter to an empty string ("").
     */
    shadowName?: string,

    /**
     * The request state document as a JSON encoded blob.
     */
    payload: eventstream.Payload

}

export interface SendConfigurationValidityReportResponse {

}

export interface SendConfigurationValidityReportRequest {

    /**
     * The report that tells Greengrass whether or not the configuration update is valid.
     */
    configurationValidityReport: ConfigurationValidityReport

}

export interface GetThingShadowResponse {

    /**
     * The response state document as a JSON encoded blob.
     */
    payload: eventstream.Payload

}

export interface GetThingShadowRequest {

    /**
     * The name of the thing.
     */
    thingName: string,

    /**
     * The name of the shadow. To specify the thing's classic shadow, set this parameter to an empty string ("").
     */
    shadowName?: string

}

export interface CreateDebugPasswordResponse {

    password: string,

    username: string,

    passwordExpiration: Date,

    certificateSHA256Hash?: string,

    certificateSHA1Hash?: string

}

export interface CreateDebugPasswordRequest {

}

export interface ListComponentsResponse {

    /**
     * The list of components.
     */
    components?: ComponentDetails[]

}

export interface ListComponentsRequest {

}

export interface InvalidClientDeviceAuthTokenError {

    message?: string

}

export interface AuthorizeClientDeviceActionResponse {

    /**
     * Whether the client device is authorized to perform the operation on the resource.
     */
    isAuthorized: boolean

}

export interface AuthorizeClientDeviceActionRequest {

    /**
     * The session token for the client device from GetClientDeviceAuthToken.
     */
    clientDeviceAuthToken: string,

    /**
     * The operation to authorize.
     */
    operation: string,

    /**
     * The resource the client device performs the operation on.
     */
    resource: string

}

export interface VerifyClientDeviceIdentityResponse {

    /**
     * Whether the client device's identity is valid.
     */
    isValidClientDevice: boolean

}

export interface VerifyClientDeviceIdentityRequest {

    /**
     * The client device's credentials.
     */
    credential: ClientDeviceCredential

}

export interface SubscribeToCertificateUpdatesResponse {

}

export interface SubscribeToCertificateUpdatesRequest {

    certificateOptions: CertificateOptions

}

export interface PublishToTopicResponse {

}

export interface PublishToTopicRequest {

    /**
     * The topic to publish the message.
     */
    topic: string,

    /**
     * The message to publish.
     */
    publishMessage: PublishMessage

}

export interface InvalidCredentialError {

    message?: string

}

export interface GetClientDeviceAuthTokenResponse {

    /**
     * The session token for the client device. You can use this session token in subsequent requests to authorize this client device's actions.
     */
    clientDeviceAuthToken: string

}

export interface GetClientDeviceAuthTokenRequest {

    /**
     * The client device's credentials.
     */
    credential: CredentialDocument

}

export interface GetComponentDetailsResponse {

    /**
     * The component's details.
     */
    componentDetails: ComponentDetails

}

export interface GetComponentDetailsRequest {

    /**
     * The name of the component to get.
     */
    componentName: string

}

export interface SubscribeToTopicResponse {

    topicName?: string

}

export interface SubscribeToTopicRequest {

    /**
     * The topic to subscribe to. Supports MQTT-style wildcards.
     */
    topic: string,

    /**
     * (Optional) The behavior that specifies whether the component receives messages from itself.
     */
    receiveMode?: ReceiveMode

}

export interface GetConfigurationResponse {

    /**
     * The name of the component.
     */
    componentName?: string,

    /**
     * The requested configuration as an object.
     */
    value?: any

}

export interface GetConfigurationRequest {

    /**
     * (Optional) The name of the component. Defaults to the name of the component that makes the request.
     */
    componentName?: string,

    /**
     * The key path to the configuration value. Specify a list where each entry is the key for a single level in the configuration object.
     */
    keyPath: string[]

}

export interface SubscribeToValidateConfigurationUpdatesResponse {

}

export interface SubscribeToValidateConfigurationUpdatesRequest {

}

export interface DeferComponentUpdateResponse {

}

export interface DeferComponentUpdateRequest {

    /**
     * The ID of the AWS IoT Greengrass deployment to defer.
     */
    deploymentId: string,

    /**
     * (Optional) The name of the component for which to defer updates. Defaults to the name of the component that makes the request.
     */
    message?: string,

    /**
     * The amount of time in milliseconds for which to defer the update. Greengrass waits for this amount of time and then sends another PreComponentUpdateEvent
     */
    recheckAfterMs?: number

}

export interface PutComponentMetricResponse {

}

export interface PutComponentMetricRequest {

    metrics: Metric[]

}

export interface DeleteThingShadowResponse {

    /**
     * An empty response state document.
     */
    payload: eventstream.Payload

}

export interface DeleteThingShadowRequest {

    /**
     * The name of the thing.
     */
    thingName: string,

    /**
     * The name of the shadow. To specify the thing's classic shadow, set this parameter to an empty string ("").
     */
    shadowName?: string

}

export interface SubscribeToConfigurationUpdateResponse {

}

export interface SubscribeToConfigurationUpdateRequest {

    /**
     * (Optional) The name of the component. Defaults to the name of the component that makes the request.
     */
    componentName?: string,

    /**
     * The key path to the configuration value for which to subscribe. Specify a list where each entry is the key for a single level in the configuration object.
     */
    keyPath: string[]

}

export interface PublishToIoTCoreResponse {

}

export interface PublishToIoTCoreRequest {

    /**
     * The topic to which to publish the message.
     */
    topicName: string,

    /**
     * The MQTT QoS to use.
     */
    qos: QOS,

    /**
     * (Optional) The message payload as a blob.
     */
    payload?: eventstream.Payload,

    /**
     * (Optional) Whether to set MQTT retain option to true when publishing.
     */
    retain?: boolean,

    /**
     * (Optional) MQTT user properties associated with the message.
     */
    userProperties?: UserProperty[],

    /**
     * (Optional) Message expiry interval in seconds.
     */
    messageExpiryIntervalSeconds?: number,

    /**
     * (Optional) Correlation data blob for request/response.
     */
    correlationData?: eventstream.Payload,

    /**
     * (Optional) Response topic for request/response.
     */
    responseTopic?: string,

    /**
     * (Optional) Message payload format.
     */
    payloadFormat?: PayloadFormat,

    /**
     * (Optional) Message content type.
     */
    contentType?: string

}

export interface ResumeComponentResponse {

}

export interface ResumeComponentRequest {

    /**
     * The name of the component to resume.
     */
    componentName: string

}

export interface SubscribeToIoTCoreResponse {

}

export interface SubscribeToIoTCoreRequest {

    /**
     * The topic to which to subscribe. Supports MQTT wildcards.
     */
    topicName: string,

    /**
     * The MQTT QoS to use.
     */
    qos: QOS

}

