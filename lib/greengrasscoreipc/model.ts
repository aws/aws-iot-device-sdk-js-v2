/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */


/**
 * @packageDocumentation
 * @module greengrasscoreipc
 */

import {eventstream} from "aws-crt";

export interface SystemResourceLimits {
    memory?: number,
    cpus?: number
}

export enum MetricUnitType {
    BYTES = "BYTES",
    BYTES_PER_SECOND = "BYTES_PER_SECOND",
    COUNT = "COUNT",
    COUNT_PER_SECOND = "COUNT_PER_SECOND",
    MEGABYTES = "MEGABYTES",
    SECONDS = "SECONDS"
}

export interface MessageContext {
    topic?: string
}

export interface ValidateConfigurationUpdateEvent {
    configuration?: any,
    deploymentId: string
}

export interface UserProperty {
    key?: string,
    value?: string
}

export interface RunWithInfo {
    posixUser?: string,
    windowsUser?: string,
    systemResourceLimits?: SystemResourceLimits
}

export interface PreComponentUpdateEvent {
    deploymentId: string,
    isGgcRestarting: boolean
}

export interface PostComponentUpdateEvent {
    deploymentId: string
}

export interface MQTTMessage {
    topicName: string,
    payload?: eventstream.Payload,
    retain?: boolean,
    userProperties?: UserProperty[],
    messageExpiryIntervalSeconds?: number,
    correlationData?: eventstream.Payload,
    responseTopic?: string,
    payloadFormat?: PayloadFormat,
    contentType?: string
}

export interface MQTTCredential {
    clientId?: string,
    certificatePem?: string,
    username?: string,
    password?: string
}

export interface Metric {
    name: string,
    unit: MetricUnitType,
    value: number
}

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

export interface JsonMessage {
    message?: any,
    context?: MessageContext
}

export enum DeploymentStatus {
    QUEUED = "QUEUED",
    IN_PROGRESS = "IN_PROGRESS",
    SUCCEEDED = "SUCCEEDED",
    FAILED = "FAILED"
}

export enum ConfigurationValidityStatus {
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED"
}

export interface ConfigurationUpdateEvent {
    componentName: string,
    keyPath: string[]
}

export interface CertificateUpdate {
    privateKey?: string,
    publicKey?: string,
    certificate?: string,
    caCertificates?: string[]
}

export enum CertificateType {
    SERVER = "SERVER"
}

export interface BinaryMessage {
    message?: eventstream.Payload,
    context?: MessageContext
}

export interface ValidateConfigurationUpdateEvents {
    validateConfigurationUpdateEvent?: ValidateConfigurationUpdateEvent
}

export interface SubscriptionResponseMessage {
    jsonMessage?: JsonMessage,
    binaryMessage?: BinaryMessage
}

export interface SecretValue {
    secretString?: string,
    secretBinary?: eventstream.Payload
}

export enum RequestStatus {
    SUCCEEDED = "SUCCEEDED",
    FAILED = "FAILED"
}

export enum ReportedLifecycleState {
    RUNNING = "RUNNING",
    ERRORED = "ERRORED"
}

export enum ReceiveMode {
    RECEIVE_ALL_MESSAGES = "RECEIVE_ALL_MESSAGES",
    RECEIVE_MESSAGES_FROM_OTHERS = "RECEIVE_MESSAGES_FROM_OTHERS"
}

export enum QOS {
    AT_MOST_ONCE = "0",
    AT_LEAST_ONCE = "1"
}

export interface PublishMessage {
    jsonMessage?: JsonMessage,
    binaryMessage?: BinaryMessage
}

export enum PayloadFormat {
    BYTES = "0",
    UTF8 = "1"
}

export interface LocalDeployment {
    deploymentId: string,
    status: DeploymentStatus
}

export interface IoTCoreMessage {
    message?: MQTTMessage
}

export interface CredentialDocument {
    mqttCredential?: MQTTCredential
}

export interface ConfigurationValidityReport {
    status: ConfigurationValidityStatus,
    deploymentId: string,
    message?: string
}

export interface ConfigurationUpdateEvents {
    configurationUpdateEvent?: ConfigurationUpdateEvent
}

export interface ComponentUpdatePolicyEvents {
    preUpdateEvent?: PreComponentUpdateEvent,
    postUpdateEvent?: PostComponentUpdateEvent
}

export interface ComponentDetails {
    componentName: string,
    version: string,
    state: LifecycleState,
    configuration?: any
}

export interface ClientDeviceCredential {
    clientDeviceCertificate?: string
}

export interface CertificateUpdateEvent {
    certificateUpdate?: CertificateUpdate
}

export interface CertificateOptions {
    certificateType: CertificateType
}

export interface InvalidArtifactsDirectoryPathError {
    message?: string
}

export interface InvalidRecipeDirectoryPathError {
    message?: string
}

export interface CreateLocalDeploymentResponse {
    deploymentId?: string
}

export interface CreateLocalDeploymentRequest {
    groupName?: string,
    rootComponentVersionsToAdd?: Map<string, string>,
    rootComponentsToRemove?: string[],
    componentToConfiguration?: Map<string, any>,
    componentToRunWithInfo?: Map<string, RunWithInfo>,
    recipeDirectoryPath?: string,
    artifactsDirectoryPath?: string
}

export interface PauseComponentResponse {
}

export interface PauseComponentRequest {
    componentName: string
}

export interface StopComponentResponse {
    stopStatus: RequestStatus,
    message?: string
}

export interface StopComponentRequest {
    componentName: string
}

export interface ListLocalDeploymentsResponse {
    localDeployments?: LocalDeployment[]
}

export interface ListLocalDeploymentsRequest {
}

export interface SubscribeToComponentUpdatesResponse {
}

export interface SubscribeToComponentUpdatesRequest {
}

export interface ListNamedShadowsForThingResponse {
    results: string[],
    timestamp: Date,
    nextToken?: string
}

export interface ListNamedShadowsForThingRequest {
    thingName: string,
    nextToken?: string,
    pageSize?: number
}

export interface UpdateStateResponse {
}

export interface UpdateStateRequest {
    state: ReportedLifecycleState
}

export interface GetSecretValueResponse {
    secretId: string,
    versionId: string,
    versionStage: string[],
    secretValue: SecretValue
}

export interface GetSecretValueRequest {
    secretId: string,
    versionId?: string,
    versionStage?: string
}

export interface GetLocalDeploymentStatusResponse {
    deployment: LocalDeployment
}

export interface GetLocalDeploymentStatusRequest {
    deploymentId: string
}

export interface ComponentNotFoundError {
    message?: string
}

export interface RestartComponentResponse {
    restartStatus: RequestStatus,
    message?: string
}

export interface RestartComponentRequest {
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

export interface UpdateConfigurationResponse {
}

export interface UpdateConfigurationRequest {
    keyPath?: string[],
    timestamp: Date,
    valueToMerge: any
}

export interface ConflictError {
    message?: string
}

export interface UpdateThingShadowResponse {
    payload: eventstream.Payload
}

export interface UpdateThingShadowRequest {
    thingName: string,
    shadowName?: string,
    payload: eventstream.Payload
}

export interface SendConfigurationValidityReportResponse {
}

export interface SendConfigurationValidityReportRequest {
    configurationValidityReport: ConfigurationValidityReport
}

export interface GetThingShadowResponse {
    payload: eventstream.Payload
}

export interface GetThingShadowRequest {
    thingName: string,
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
    components?: ComponentDetails[]
}

export interface ListComponentsRequest {
}

export interface InvalidClientDeviceAuthTokenError {
    message?: string
}

export interface AuthorizeClientDeviceActionResponse {
    isAuthorized: boolean
}

export interface AuthorizeClientDeviceActionRequest {
    clientDeviceAuthToken: string,
    operation: string,
    resource: string
}

export interface VerifyClientDeviceIdentityResponse {
    isValidClientDevice: boolean
}

export interface VerifyClientDeviceIdentityRequest {
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
    topic: string,
    publishMessage: PublishMessage
}

export interface InvalidCredentialError {
    message?: string
}

export interface GetClientDeviceAuthTokenResponse {
    clientDeviceAuthToken: string
}

export interface GetClientDeviceAuthTokenRequest {
    credential: CredentialDocument
}

export interface GetComponentDetailsResponse {
    componentDetails: ComponentDetails
}

export interface GetComponentDetailsRequest {
    componentName: string
}

export interface SubscribeToTopicResponse {
    topicName?: string
}

export interface SubscribeToTopicRequest {
    topic: string,
    receiveMode?: ReceiveMode
}

export interface GetConfigurationResponse {
    componentName?: string,
    value?: any
}

export interface GetConfigurationRequest {
    componentName?: string,
    keyPath: string[]
}

export interface SubscribeToValidateConfigurationUpdatesResponse {
}

export interface SubscribeToValidateConfigurationUpdatesRequest {
}

export interface DeferComponentUpdateResponse {
}

export interface DeferComponentUpdateRequest {
    deploymentId: string,
    message?: string,
    recheckAfterMs?: number
}

export interface PutComponentMetricResponse {
}

export interface PutComponentMetricRequest {
    metrics: Metric[]
}

export interface InvalidArgumentsError {
    message?: string
}

export interface DeleteThingShadowResponse {
    payload: eventstream.Payload
}

export interface DeleteThingShadowRequest {
    thingName: string,
    shadowName?: string
}

export interface SubscribeToConfigurationUpdateResponse {
}

export interface SubscribeToConfigurationUpdateRequest {
    componentName?: string,
    keyPath: string[]
}

export interface PublishToIoTCoreResponse {
}

export interface PublishToIoTCoreRequest {
    topicName: string,
    qos: QOS,
    payload?: eventstream.Payload,
    retain?: boolean,
    userProperties?: UserProperty[],
    messageExpiryIntervalSeconds?: number,
    correlationData?: eventstream.Payload,
    responseTopic?: string,
    payloadFormat?: PayloadFormat,
    contentType?: string
}

export interface ResourceNotFoundError {
    message?: string,
    resourceType?: string,
    resourceName?: string
}

export interface ResumeComponentResponse {
}

export interface ResumeComponentRequest {
    componentName: string
}

export interface UnauthorizedError {
    message?: string
}

export interface ServiceError {
    message?: string,
    context?: any
}

export interface SubscribeToIoTCoreResponse {
}

export interface SubscribeToIoTCoreRequest {
    topicName: string,
    qos: QOS
}

