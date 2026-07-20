/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */

/* This file is generated */

import * as eventstream_rpc_utils from "../eventstream_rpc_utils";
import * as model from "./model";
import {eventstream} from "aws-crt";
import * as eventstream_rpc from "../eventstream_rpc";
import {toUtf8} from "@aws-sdk/util-utf8-browser";

function createNormalizerMap() : Map<string, eventstream_rpc.ShapeNormalizer> {
    return new Map<string, eventstream_rpc.ShapeNormalizer>([
        ["aws.greengrass#UserProperty", normalizeUserProperty],
        ["aws.greengrass#SystemResourceLimits", normalizeSystemResourceLimits],
        ["aws.greengrass#DeploymentStatusDetails", normalizeDeploymentStatusDetails],
        ["aws.greengrass#MessageContext", normalizeMessageContext],
        ["aws.greengrass#RunWithInfo", normalizeRunWithInfo],
        ["aws.greengrass#LocalDeployment", normalizeLocalDeployment],
        ["aws.greengrass#PostComponentUpdateEvent", normalizePostComponentUpdateEvent],
        ["aws.greengrass#PreComponentUpdateEvent", normalizePreComponentUpdateEvent],
        ["aws.greengrass#ComponentDetails", normalizeComponentDetails],
        ["aws.greengrass#CertificateUpdate", normalizeCertificateUpdate],
        ["aws.greengrass#BinaryMessage", normalizeBinaryMessage],
        ["aws.greengrass#JsonMessage", normalizeJsonMessage],
        ["aws.greengrass#MQTTCredential", normalizeMQTTCredential],
        ["aws.greengrass#ValidateConfigurationUpdateEvent", normalizeValidateConfigurationUpdateEvent],
        ["aws.greengrass#Metric", normalizeMetric],
        ["aws.greengrass#ConfigurationUpdateEvent", normalizeConfigurationUpdateEvent],
        ["aws.greengrass#MQTTMessage", normalizeMQTTMessage],
        ["aws.greengrass#ComponentUpdatePolicyEvents", normalizeComponentUpdatePolicyEvents],
        ["aws.greengrass#SecretValue", normalizeSecretValue],
        ["aws.greengrass#ConfigurationValidityReport", normalizeConfigurationValidityReport],
        ["aws.greengrass#ClientDeviceCredential", normalizeClientDeviceCredential],
        ["aws.greengrass#CertificateUpdateEvent", normalizeCertificateUpdateEvent],
        ["aws.greengrass#CertificateOptions", normalizeCertificateOptions],
        ["aws.greengrass#PublishMessage", normalizePublishMessage],
        ["aws.greengrass#CredentialDocument", normalizeCredentialDocument],
        ["aws.greengrass#SubscriptionResponseMessage", normalizeSubscriptionResponseMessage],
        ["aws.greengrass#ValidateConfigurationUpdateEvents", normalizeValidateConfigurationUpdateEvents],
        ["aws.greengrass#ConfigurationUpdateEvents", normalizeConfigurationUpdateEvents],
        ["aws.greengrass#IoTCoreMessage", normalizeIoTCoreMessage],
        ["aws.greengrass#InvalidArgumentsError", normalizeInvalidArgumentsError],
        ["aws.greengrass#InvalidArtifactsDirectoryPathError", normalizeInvalidArtifactsDirectoryPathError],
        ["aws.greengrass#InvalidRecipeDirectoryPathError", normalizeInvalidRecipeDirectoryPathError],
        ["aws.greengrass#ServiceError", normalizeServiceError],
        ["aws.greengrass#CreateLocalDeploymentResponse", normalizeCreateLocalDeploymentResponse],
        ["aws.greengrass#CreateLocalDeploymentRequest", normalizeCreateLocalDeploymentRequest],
        ["aws.greengrass#ResourceNotFoundError", normalizeResourceNotFoundError],
        ["aws.greengrass#UnauthorizedError", normalizeUnauthorizedError],
        ["aws.greengrass#PauseComponentResponse", normalizePauseComponentResponse],
        ["aws.greengrass#PauseComponentRequest", normalizePauseComponentRequest],
        ["aws.greengrass#ComponentNotFoundError", normalizeComponentNotFoundError],
        ["aws.greengrass#StopComponentResponse", normalizeStopComponentResponse],
        ["aws.greengrass#StopComponentRequest", normalizeStopComponentRequest],
        ["aws.greengrass#ListLocalDeploymentsResponse", normalizeListLocalDeploymentsResponse],
        ["aws.greengrass#ListLocalDeploymentsRequest", normalizeListLocalDeploymentsRequest],
        ["aws.greengrass#SubscribeToComponentUpdatesResponse", normalizeSubscribeToComponentUpdatesResponse],
        ["aws.greengrass#SubscribeToComponentUpdatesRequest", normalizeSubscribeToComponentUpdatesRequest],
        ["aws.greengrass#ListNamedShadowsForThingResponse", normalizeListNamedShadowsForThingResponse],
        ["aws.greengrass#ListNamedShadowsForThingRequest", normalizeListNamedShadowsForThingRequest],
        ["aws.greengrass#CancelLocalDeploymentResponse", normalizeCancelLocalDeploymentResponse],
        ["aws.greengrass#CancelLocalDeploymentRequest", normalizeCancelLocalDeploymentRequest],
        ["aws.greengrass#UpdateStateResponse", normalizeUpdateStateResponse],
        ["aws.greengrass#UpdateStateRequest", normalizeUpdateStateRequest],
        ["aws.greengrass#GetSecretValueResponse", normalizeGetSecretValueResponse],
        ["aws.greengrass#GetSecretValueRequest", normalizeGetSecretValueRequest],
        ["aws.greengrass#GetLocalDeploymentStatusResponse", normalizeGetLocalDeploymentStatusResponse],
        ["aws.greengrass#GetLocalDeploymentStatusRequest", normalizeGetLocalDeploymentStatusRequest],
        ["aws.greengrass#RestartComponentResponse", normalizeRestartComponentResponse],
        ["aws.greengrass#RestartComponentRequest", normalizeRestartComponentRequest],
        ["aws.greengrass#InvalidTokenError", normalizeInvalidTokenError],
        ["aws.greengrass#ValidateAuthorizationTokenResponse", normalizeValidateAuthorizationTokenResponse],
        ["aws.greengrass#ValidateAuthorizationTokenRequest", normalizeValidateAuthorizationTokenRequest],
        ["aws.greengrass#FailedUpdateConditionCheckError", normalizeFailedUpdateConditionCheckError],
        ["aws.greengrass#ConflictError", normalizeConflictError],
        ["aws.greengrass#UpdateConfigurationResponse", normalizeUpdateConfigurationResponse],
        ["aws.greengrass#UpdateConfigurationRequest", normalizeUpdateConfigurationRequest],
        ["aws.greengrass#UpdateThingShadowResponse", normalizeUpdateThingShadowResponse],
        ["aws.greengrass#UpdateThingShadowRequest", normalizeUpdateThingShadowRequest],
        ["aws.greengrass#SendConfigurationValidityReportResponse", normalizeSendConfigurationValidityReportResponse],
        ["aws.greengrass#SendConfigurationValidityReportRequest", normalizeSendConfigurationValidityReportRequest],
        ["aws.greengrass#GetThingShadowResponse", normalizeGetThingShadowResponse],
        ["aws.greengrass#GetThingShadowRequest", normalizeGetThingShadowRequest],
        ["aws.greengrass#CreateDebugPasswordResponse", normalizeCreateDebugPasswordResponse],
        ["aws.greengrass#CreateDebugPasswordRequest", normalizeCreateDebugPasswordRequest],
        ["aws.greengrass#ListComponentsResponse", normalizeListComponentsResponse],
        ["aws.greengrass#ListComponentsRequest", normalizeListComponentsRequest],
        ["aws.greengrass#InvalidClientDeviceAuthTokenError", normalizeInvalidClientDeviceAuthTokenError],
        ["aws.greengrass#AuthorizeClientDeviceActionResponse", normalizeAuthorizeClientDeviceActionResponse],
        ["aws.greengrass#AuthorizeClientDeviceActionRequest", normalizeAuthorizeClientDeviceActionRequest],
        ["aws.greengrass#VerifyClientDeviceIdentityResponse", normalizeVerifyClientDeviceIdentityResponse],
        ["aws.greengrass#VerifyClientDeviceIdentityRequest", normalizeVerifyClientDeviceIdentityRequest],
        ["aws.greengrass#SubscribeToCertificateUpdatesResponse", normalizeSubscribeToCertificateUpdatesResponse],
        ["aws.greengrass#SubscribeToCertificateUpdatesRequest", normalizeSubscribeToCertificateUpdatesRequest],
        ["aws.greengrass#PublishToTopicResponse", normalizePublishToTopicResponse],
        ["aws.greengrass#PublishToTopicRequest", normalizePublishToTopicRequest],
        ["aws.greengrass#InvalidCredentialError", normalizeInvalidCredentialError],
        ["aws.greengrass#GetClientDeviceAuthTokenResponse", normalizeGetClientDeviceAuthTokenResponse],
        ["aws.greengrass#GetClientDeviceAuthTokenRequest", normalizeGetClientDeviceAuthTokenRequest],
        ["aws.greengrass#GetComponentDetailsResponse", normalizeGetComponentDetailsResponse],
        ["aws.greengrass#GetComponentDetailsRequest", normalizeGetComponentDetailsRequest],
        ["aws.greengrass#SubscribeToTopicResponse", normalizeSubscribeToTopicResponse],
        ["aws.greengrass#SubscribeToTopicRequest", normalizeSubscribeToTopicRequest],
        ["aws.greengrass#GetConfigurationResponse", normalizeGetConfigurationResponse],
        ["aws.greengrass#GetConfigurationRequest", normalizeGetConfigurationRequest],
        ["aws.greengrass#SubscribeToValidateConfigurationUpdatesResponse", normalizeSubscribeToValidateConfigurationUpdatesResponse],
        ["aws.greengrass#SubscribeToValidateConfigurationUpdatesRequest", normalizeSubscribeToValidateConfigurationUpdatesRequest],
        ["aws.greengrass#DeferComponentUpdateResponse", normalizeDeferComponentUpdateResponse],
        ["aws.greengrass#DeferComponentUpdateRequest", normalizeDeferComponentUpdateRequest],
        ["aws.greengrass#PutComponentMetricResponse", normalizePutComponentMetricResponse],
        ["aws.greengrass#PutComponentMetricRequest", normalizePutComponentMetricRequest],
        ["aws.greengrass#DeleteThingShadowResponse", normalizeDeleteThingShadowResponse],
        ["aws.greengrass#DeleteThingShadowRequest", normalizeDeleteThingShadowRequest],
        ["aws.greengrass#SubscribeToConfigurationUpdateResponse", normalizeSubscribeToConfigurationUpdateResponse],
        ["aws.greengrass#SubscribeToConfigurationUpdateRequest", normalizeSubscribeToConfigurationUpdateRequest],
        ["aws.greengrass#PublishToIoTCoreResponse", normalizePublishToIoTCoreResponse],
        ["aws.greengrass#PublishToIoTCoreRequest", normalizePublishToIoTCoreRequest],
        ["aws.greengrass#ResumeComponentResponse", normalizeResumeComponentResponse],
        ["aws.greengrass#ResumeComponentRequest", normalizeResumeComponentRequest],
        ["aws.greengrass#SubscribeToIoTCoreResponse", normalizeSubscribeToIoTCoreResponse],
        ["aws.greengrass#SubscribeToIoTCoreRequest", normalizeSubscribeToIoTCoreRequest]
    ]);
}

function createValidatorMap() : Map<string, eventstream_rpc.ShapeValidator> {
    return new Map<string, eventstream_rpc.ShapeValidator>([
        ["aws.greengrass#UserProperty", validateUserProperty],
        ["aws.greengrass#SystemResourceLimits", validateSystemResourceLimits],
        ["aws.greengrass#DeploymentStatusDetails", validateDeploymentStatusDetails],
        ["aws.greengrass#MessageContext", validateMessageContext],
        ["aws.greengrass#RunWithInfo", validateRunWithInfo],
        ["aws.greengrass#LocalDeployment", validateLocalDeployment],
        ["aws.greengrass#PostComponentUpdateEvent", validatePostComponentUpdateEvent],
        ["aws.greengrass#PreComponentUpdateEvent", validatePreComponentUpdateEvent],
        ["aws.greengrass#ComponentDetails", validateComponentDetails],
        ["aws.greengrass#CertificateUpdate", validateCertificateUpdate],
        ["aws.greengrass#BinaryMessage", validateBinaryMessage],
        ["aws.greengrass#JsonMessage", validateJsonMessage],
        ["aws.greengrass#MQTTCredential", validateMQTTCredential],
        ["aws.greengrass#ValidateConfigurationUpdateEvent", validateValidateConfigurationUpdateEvent],
        ["aws.greengrass#Metric", validateMetric],
        ["aws.greengrass#ConfigurationUpdateEvent", validateConfigurationUpdateEvent],
        ["aws.greengrass#MQTTMessage", validateMQTTMessage],
        ["aws.greengrass#ComponentUpdatePolicyEvents", validateComponentUpdatePolicyEvents],
        ["aws.greengrass#SecretValue", validateSecretValue],
        ["aws.greengrass#ConfigurationValidityReport", validateConfigurationValidityReport],
        ["aws.greengrass#ClientDeviceCredential", validateClientDeviceCredential],
        ["aws.greengrass#CertificateUpdateEvent", validateCertificateUpdateEvent],
        ["aws.greengrass#CertificateOptions", validateCertificateOptions],
        ["aws.greengrass#PublishMessage", validatePublishMessage],
        ["aws.greengrass#CredentialDocument", validateCredentialDocument],
        ["aws.greengrass#SubscriptionResponseMessage", validateSubscriptionResponseMessage],
        ["aws.greengrass#ValidateConfigurationUpdateEvents", validateValidateConfigurationUpdateEvents],
        ["aws.greengrass#ConfigurationUpdateEvents", validateConfigurationUpdateEvents],
        ["aws.greengrass#IoTCoreMessage", validateIoTCoreMessage],
        ["aws.greengrass#InvalidArgumentsError", validateInvalidArgumentsError],
        ["aws.greengrass#InvalidArtifactsDirectoryPathError", validateInvalidArtifactsDirectoryPathError],
        ["aws.greengrass#InvalidRecipeDirectoryPathError", validateInvalidRecipeDirectoryPathError],
        ["aws.greengrass#ServiceError", validateServiceError],
        ["aws.greengrass#CreateLocalDeploymentResponse", validateCreateLocalDeploymentResponse],
        ["aws.greengrass#CreateLocalDeploymentRequest", validateCreateLocalDeploymentRequest],
        ["aws.greengrass#ResourceNotFoundError", validateResourceNotFoundError],
        ["aws.greengrass#UnauthorizedError", validateUnauthorizedError],
        ["aws.greengrass#PauseComponentResponse", validatePauseComponentResponse],
        ["aws.greengrass#PauseComponentRequest", validatePauseComponentRequest],
        ["aws.greengrass#ComponentNotFoundError", validateComponentNotFoundError],
        ["aws.greengrass#StopComponentResponse", validateStopComponentResponse],
        ["aws.greengrass#StopComponentRequest", validateStopComponentRequest],
        ["aws.greengrass#ListLocalDeploymentsResponse", validateListLocalDeploymentsResponse],
        ["aws.greengrass#ListLocalDeploymentsRequest", validateListLocalDeploymentsRequest],
        ["aws.greengrass#SubscribeToComponentUpdatesResponse", validateSubscribeToComponentUpdatesResponse],
        ["aws.greengrass#SubscribeToComponentUpdatesRequest", validateSubscribeToComponentUpdatesRequest],
        ["aws.greengrass#ListNamedShadowsForThingResponse", validateListNamedShadowsForThingResponse],
        ["aws.greengrass#ListNamedShadowsForThingRequest", validateListNamedShadowsForThingRequest],
        ["aws.greengrass#CancelLocalDeploymentResponse", validateCancelLocalDeploymentResponse],
        ["aws.greengrass#CancelLocalDeploymentRequest", validateCancelLocalDeploymentRequest],
        ["aws.greengrass#UpdateStateResponse", validateUpdateStateResponse],
        ["aws.greengrass#UpdateStateRequest", validateUpdateStateRequest],
        ["aws.greengrass#GetSecretValueResponse", validateGetSecretValueResponse],
        ["aws.greengrass#GetSecretValueRequest", validateGetSecretValueRequest],
        ["aws.greengrass#GetLocalDeploymentStatusResponse", validateGetLocalDeploymentStatusResponse],
        ["aws.greengrass#GetLocalDeploymentStatusRequest", validateGetLocalDeploymentStatusRequest],
        ["aws.greengrass#RestartComponentResponse", validateRestartComponentResponse],
        ["aws.greengrass#RestartComponentRequest", validateRestartComponentRequest],
        ["aws.greengrass#InvalidTokenError", validateInvalidTokenError],
        ["aws.greengrass#ValidateAuthorizationTokenResponse", validateValidateAuthorizationTokenResponse],
        ["aws.greengrass#ValidateAuthorizationTokenRequest", validateValidateAuthorizationTokenRequest],
        ["aws.greengrass#FailedUpdateConditionCheckError", validateFailedUpdateConditionCheckError],
        ["aws.greengrass#ConflictError", validateConflictError],
        ["aws.greengrass#UpdateConfigurationResponse", validateUpdateConfigurationResponse],
        ["aws.greengrass#UpdateConfigurationRequest", validateUpdateConfigurationRequest],
        ["aws.greengrass#UpdateThingShadowResponse", validateUpdateThingShadowResponse],
        ["aws.greengrass#UpdateThingShadowRequest", validateUpdateThingShadowRequest],
        ["aws.greengrass#SendConfigurationValidityReportResponse", validateSendConfigurationValidityReportResponse],
        ["aws.greengrass#SendConfigurationValidityReportRequest", validateSendConfigurationValidityReportRequest],
        ["aws.greengrass#GetThingShadowResponse", validateGetThingShadowResponse],
        ["aws.greengrass#GetThingShadowRequest", validateGetThingShadowRequest],
        ["aws.greengrass#CreateDebugPasswordResponse", validateCreateDebugPasswordResponse],
        ["aws.greengrass#CreateDebugPasswordRequest", validateCreateDebugPasswordRequest],
        ["aws.greengrass#ListComponentsResponse", validateListComponentsResponse],
        ["aws.greengrass#ListComponentsRequest", validateListComponentsRequest],
        ["aws.greengrass#InvalidClientDeviceAuthTokenError", validateInvalidClientDeviceAuthTokenError],
        ["aws.greengrass#AuthorizeClientDeviceActionResponse", validateAuthorizeClientDeviceActionResponse],
        ["aws.greengrass#AuthorizeClientDeviceActionRequest", validateAuthorizeClientDeviceActionRequest],
        ["aws.greengrass#VerifyClientDeviceIdentityResponse", validateVerifyClientDeviceIdentityResponse],
        ["aws.greengrass#VerifyClientDeviceIdentityRequest", validateVerifyClientDeviceIdentityRequest],
        ["aws.greengrass#SubscribeToCertificateUpdatesResponse", validateSubscribeToCertificateUpdatesResponse],
        ["aws.greengrass#SubscribeToCertificateUpdatesRequest", validateSubscribeToCertificateUpdatesRequest],
        ["aws.greengrass#PublishToTopicResponse", validatePublishToTopicResponse],
        ["aws.greengrass#PublishToTopicRequest", validatePublishToTopicRequest],
        ["aws.greengrass#InvalidCredentialError", validateInvalidCredentialError],
        ["aws.greengrass#GetClientDeviceAuthTokenResponse", validateGetClientDeviceAuthTokenResponse],
        ["aws.greengrass#GetClientDeviceAuthTokenRequest", validateGetClientDeviceAuthTokenRequest],
        ["aws.greengrass#GetComponentDetailsResponse", validateGetComponentDetailsResponse],
        ["aws.greengrass#GetComponentDetailsRequest", validateGetComponentDetailsRequest],
        ["aws.greengrass#SubscribeToTopicResponse", validateSubscribeToTopicResponse],
        ["aws.greengrass#SubscribeToTopicRequest", validateSubscribeToTopicRequest],
        ["aws.greengrass#GetConfigurationResponse", validateGetConfigurationResponse],
        ["aws.greengrass#GetConfigurationRequest", validateGetConfigurationRequest],
        ["aws.greengrass#SubscribeToValidateConfigurationUpdatesResponse", validateSubscribeToValidateConfigurationUpdatesResponse],
        ["aws.greengrass#SubscribeToValidateConfigurationUpdatesRequest", validateSubscribeToValidateConfigurationUpdatesRequest],
        ["aws.greengrass#DeferComponentUpdateResponse", validateDeferComponentUpdateResponse],
        ["aws.greengrass#DeferComponentUpdateRequest", validateDeferComponentUpdateRequest],
        ["aws.greengrass#PutComponentMetricResponse", validatePutComponentMetricResponse],
        ["aws.greengrass#PutComponentMetricRequest", validatePutComponentMetricRequest],
        ["aws.greengrass#DeleteThingShadowResponse", validateDeleteThingShadowResponse],
        ["aws.greengrass#DeleteThingShadowRequest", validateDeleteThingShadowRequest],
        ["aws.greengrass#SubscribeToConfigurationUpdateResponse", validateSubscribeToConfigurationUpdateResponse],
        ["aws.greengrass#SubscribeToConfigurationUpdateRequest", validateSubscribeToConfigurationUpdateRequest],
        ["aws.greengrass#PublishToIoTCoreResponse", validatePublishToIoTCoreResponse],
        ["aws.greengrass#PublishToIoTCoreRequest", validatePublishToIoTCoreRequest],
        ["aws.greengrass#ResumeComponentResponse", validateResumeComponentResponse],
        ["aws.greengrass#ResumeComponentRequest", validateResumeComponentRequest],
        ["aws.greengrass#SubscribeToIoTCoreResponse", validateSubscribeToIoTCoreResponse],
        ["aws.greengrass#SubscribeToIoTCoreRequest", validateSubscribeToIoTCoreRequest]
    ]);
}

function createDeserializerMap() : Map<string, eventstream_rpc.ShapeDeserializer> {
    return new Map<string, eventstream_rpc.ShapeDeserializer>([
        ["aws.greengrass#ConflictError", deserializeEventstreamMessageToConflictError],
        ["aws.greengrass#CreateDebugPasswordResponse", deserializeEventstreamMessageToCreateDebugPasswordResponse],
        ["aws.greengrass#SubscriptionResponseMessage", deserializeEventstreamMessageToSubscriptionResponseMessage],
        ["aws.greengrass#FailedUpdateConditionCheckError", deserializeEventstreamMessageToFailedUpdateConditionCheckError],
        ["aws.greengrass#ListNamedShadowsForThingResponse", deserializeEventstreamMessageToListNamedShadowsForThingResponse],
        ["aws.greengrass#ComponentNotFoundError", deserializeEventstreamMessageToComponentNotFoundError],
        ["aws.greengrass#CertificateUpdateEvent", deserializeEventstreamMessageToCertificateUpdateEvent],
        ["aws.greengrass#GetSecretValueResponse", deserializeEventstreamMessageToGetSecretValueResponse],
        ["aws.greengrass#SubscribeToIoTCoreResponse", deserializeEventstreamMessageToSubscribeToIoTCoreResponse],
        ["aws.greengrass#InvalidRecipeDirectoryPathError", deserializeEventstreamMessageToInvalidRecipeDirectoryPathError],
        ["aws.greengrass#ListLocalDeploymentsResponse", deserializeEventstreamMessageToListLocalDeploymentsResponse],
        ["aws.greengrass#ResumeComponentResponse", deserializeEventstreamMessageToResumeComponentResponse],
        ["aws.greengrass#InvalidArgumentsError", deserializeEventstreamMessageToInvalidArgumentsError],
        ["aws.greengrass#GetComponentDetailsResponse", deserializeEventstreamMessageToGetComponentDetailsResponse],
        ["aws.greengrass#PutComponentMetricResponse", deserializeEventstreamMessageToPutComponentMetricResponse],
        ["aws.greengrass#ComponentUpdatePolicyEvents", deserializeEventstreamMessageToComponentUpdatePolicyEvents],
        ["aws.greengrass#IoTCoreMessage", deserializeEventstreamMessageToIoTCoreMessage],
        ["aws.greengrass#UpdateStateResponse", deserializeEventstreamMessageToUpdateStateResponse],
        ["aws.greengrass#DeferComponentUpdateResponse", deserializeEventstreamMessageToDeferComponentUpdateResponse],
        ["aws.greengrass#ListComponentsResponse", deserializeEventstreamMessageToListComponentsResponse],
        ["aws.greengrass#SubscribeToComponentUpdatesResponse", deserializeEventstreamMessageToSubscribeToComponentUpdatesResponse],
        ["aws.greengrass#VerifyClientDeviceIdentityResponse", deserializeEventstreamMessageToVerifyClientDeviceIdentityResponse],
        ["aws.greengrass#ResourceNotFoundError", deserializeEventstreamMessageToResourceNotFoundError],
        ["aws.greengrass#InvalidArtifactsDirectoryPathError", deserializeEventstreamMessageToInvalidArtifactsDirectoryPathError],
        ["aws.greengrass#SendConfigurationValidityReportResponse", deserializeEventstreamMessageToSendConfigurationValidityReportResponse],
        ["aws.greengrass#GetThingShadowResponse", deserializeEventstreamMessageToGetThingShadowResponse],
        ["aws.greengrass#InvalidClientDeviceAuthTokenError", deserializeEventstreamMessageToInvalidClientDeviceAuthTokenError],
        ["aws.greengrass#PublishToIoTCoreResponse", deserializeEventstreamMessageToPublishToIoTCoreResponse],
        ["aws.greengrass#SubscribeToTopicResponse", deserializeEventstreamMessageToSubscribeToTopicResponse],
        ["aws.greengrass#InvalidTokenError", deserializeEventstreamMessageToInvalidTokenError],
        ["aws.greengrass#GetClientDeviceAuthTokenResponse", deserializeEventstreamMessageToGetClientDeviceAuthTokenResponse],
        ["aws.greengrass#CreateLocalDeploymentResponse", deserializeEventstreamMessageToCreateLocalDeploymentResponse],
        ["aws.greengrass#PublishToTopicResponse", deserializeEventstreamMessageToPublishToTopicResponse],
        ["aws.greengrass#ValidateAuthorizationTokenResponse", deserializeEventstreamMessageToValidateAuthorizationTokenResponse],
        ["aws.greengrass#UpdateThingShadowResponse", deserializeEventstreamMessageToUpdateThingShadowResponse],
        ["aws.greengrass#AuthorizeClientDeviceActionResponse", deserializeEventstreamMessageToAuthorizeClientDeviceActionResponse],
        ["aws.greengrass#GetConfigurationResponse", deserializeEventstreamMessageToGetConfigurationResponse],
        ["aws.greengrass#InvalidCredentialError", deserializeEventstreamMessageToInvalidCredentialError],
        ["aws.greengrass#GetLocalDeploymentStatusResponse", deserializeEventstreamMessageToGetLocalDeploymentStatusResponse],
        ["aws.greengrass#PauseComponentResponse", deserializeEventstreamMessageToPauseComponentResponse],
        ["aws.greengrass#UnauthorizedError", deserializeEventstreamMessageToUnauthorizedError],
        ["aws.greengrass#SubscribeToCertificateUpdatesResponse", deserializeEventstreamMessageToSubscribeToCertificateUpdatesResponse],
        ["aws.greengrass#UpdateConfigurationResponse", deserializeEventstreamMessageToUpdateConfigurationResponse],
        ["aws.greengrass#RestartComponentResponse", deserializeEventstreamMessageToRestartComponentResponse],
        ["aws.greengrass#DeleteThingShadowResponse", deserializeEventstreamMessageToDeleteThingShadowResponse],
        ["aws.greengrass#SubscribeToConfigurationUpdateResponse", deserializeEventstreamMessageToSubscribeToConfigurationUpdateResponse],
        ["aws.greengrass#SubscribeToValidateConfigurationUpdatesResponse", deserializeEventstreamMessageToSubscribeToValidateConfigurationUpdatesResponse],
        ["aws.greengrass#ServiceError", deserializeEventstreamMessageToServiceError],
        ["aws.greengrass#ConfigurationUpdateEvents", deserializeEventstreamMessageToConfigurationUpdateEvents],
        ["aws.greengrass#StopComponentResponse", deserializeEventstreamMessageToStopComponentResponse],
        ["aws.greengrass#ValidateConfigurationUpdateEvents", deserializeEventstreamMessageToValidateConfigurationUpdateEvents],
        ["aws.greengrass#CancelLocalDeploymentResponse", deserializeEventstreamMessageToCancelLocalDeploymentResponse]
    ]);
}

function createSerializerMap() : Map<string, eventstream_rpc.ShapeSerializer> {
    return new Map<string, eventstream_rpc.ShapeSerializer>([
        ["aws.greengrass#GetComponentDetailsRequest", serializeGetComponentDetailsRequestToEventstreamMessage],
        ["aws.greengrass#PublishToTopicRequest", serializePublishToTopicRequestToEventstreamMessage],
        ["aws.greengrass#CreateDebugPasswordRequest", serializeCreateDebugPasswordRequestToEventstreamMessage],
        ["aws.greengrass#UpdateThingShadowRequest", serializeUpdateThingShadowRequestToEventstreamMessage],
        ["aws.greengrass#ResumeComponentRequest", serializeResumeComponentRequestToEventstreamMessage],
        ["aws.greengrass#StopComponentRequest", serializeStopComponentRequestToEventstreamMessage],
        ["aws.greengrass#VerifyClientDeviceIdentityRequest", serializeVerifyClientDeviceIdentityRequestToEventstreamMessage],
        ["aws.greengrass#AuthorizeClientDeviceActionRequest", serializeAuthorizeClientDeviceActionRequestToEventstreamMessage],
        ["aws.greengrass#ListLocalDeploymentsRequest", serializeListLocalDeploymentsRequestToEventstreamMessage],
        ["aws.greengrass#SendConfigurationValidityReportRequest", serializeSendConfigurationValidityReportRequestToEventstreamMessage],
        ["aws.greengrass#ValidateAuthorizationTokenRequest", serializeValidateAuthorizationTokenRequestToEventstreamMessage],
        ["aws.greengrass#GetClientDeviceAuthTokenRequest", serializeGetClientDeviceAuthTokenRequestToEventstreamMessage],
        ["aws.greengrass#PauseComponentRequest", serializePauseComponentRequestToEventstreamMessage],
        ["aws.greengrass#PublishToIoTCoreRequest", serializePublishToIoTCoreRequestToEventstreamMessage],
        ["aws.greengrass#DeleteThingShadowRequest", serializeDeleteThingShadowRequestToEventstreamMessage],
        ["aws.greengrass#GetConfigurationRequest", serializeGetConfigurationRequestToEventstreamMessage],
        ["aws.greengrass#DeferComponentUpdateRequest", serializeDeferComponentUpdateRequestToEventstreamMessage],
        ["aws.greengrass#GetSecretValueRequest", serializeGetSecretValueRequestToEventstreamMessage],
        ["aws.greengrass#ListComponentsRequest", serializeListComponentsRequestToEventstreamMessage],
        ["aws.greengrass#SubscribeToTopicRequest", serializeSubscribeToTopicRequestToEventstreamMessage],
        ["aws.greengrass#CancelLocalDeploymentRequest", serializeCancelLocalDeploymentRequestToEventstreamMessage],
        ["aws.greengrass#SubscribeToCertificateUpdatesRequest", serializeSubscribeToCertificateUpdatesRequestToEventstreamMessage],
        ["aws.greengrass#SubscribeToValidateConfigurationUpdatesRequest", serializeSubscribeToValidateConfigurationUpdatesRequestToEventstreamMessage],
        ["aws.greengrass#CreateLocalDeploymentRequest", serializeCreateLocalDeploymentRequestToEventstreamMessage],
        ["aws.greengrass#PutComponentMetricRequest", serializePutComponentMetricRequestToEventstreamMessage],
        ["aws.greengrass#SubscribeToConfigurationUpdateRequest", serializeSubscribeToConfigurationUpdateRequestToEventstreamMessage],
        ["aws.greengrass#SubscribeToComponentUpdatesRequest", serializeSubscribeToComponentUpdatesRequestToEventstreamMessage],
        ["aws.greengrass#RestartComponentRequest", serializeRestartComponentRequestToEventstreamMessage],
        ["aws.greengrass#ListNamedShadowsForThingRequest", serializeListNamedShadowsForThingRequestToEventstreamMessage],
        ["aws.greengrass#UpdateConfigurationRequest", serializeUpdateConfigurationRequestToEventstreamMessage],
        ["aws.greengrass#GetLocalDeploymentStatusRequest", serializeGetLocalDeploymentStatusRequestToEventstreamMessage],
        ["aws.greengrass#GetThingShadowRequest", serializeGetThingShadowRequestToEventstreamMessage],
        ["aws.greengrass#SubscribeToIoTCoreRequest", serializeSubscribeToIoTCoreRequestToEventstreamMessage],
        ["aws.greengrass#UpdateStateRequest", serializeUpdateStateRequestToEventstreamMessage]
    ]);
}

function createOperationMap() : Map<string, eventstream_rpc.EventstreamRpcServiceModelOperation> {
    return new Map<string, eventstream_rpc.EventstreamRpcServiceModelOperation>([
        ["aws.greengrass#AuthorizeClientDeviceAction", {
            requestShape: "aws.greengrass#AuthorizeClientDeviceActionRequest",
            responseShape: "aws.greengrass#AuthorizeClientDeviceActionResponse",
            errorShapes: new Set<string>([
                "aws.greengrass#UnauthorizedError",
                "aws.greengrass#ServiceError",
                "aws.greengrass#InvalidArgumentsError",
                "aws.greengrass#InvalidClientDeviceAuthTokenError"
            ])
        }],
        ["aws.greengrass#CancelLocalDeployment", {
            requestShape: "aws.greengrass#CancelLocalDeploymentRequest",
            responseShape: "aws.greengrass#CancelLocalDeploymentResponse",
            errorShapes: new Set<string>([
                "aws.greengrass#ServiceError",
                "aws.greengrass#ResourceNotFoundError",
                "aws.greengrass#InvalidArgumentsError"
            ])
        }],
        ["aws.greengrass#CreateDebugPassword", {
            requestShape: "aws.greengrass#CreateDebugPasswordRequest",
            responseShape: "aws.greengrass#CreateDebugPasswordResponse",
            errorShapes: new Set<string>([
                "aws.greengrass#UnauthorizedError",
                "aws.greengrass#ServiceError"
            ])
        }],
        ["aws.greengrass#CreateLocalDeployment", {
            requestShape: "aws.greengrass#CreateLocalDeploymentRequest",
            responseShape: "aws.greengrass#CreateLocalDeploymentResponse",
            errorShapes: new Set<string>([
                "aws.greengrass#ServiceError",
                "aws.greengrass#InvalidRecipeDirectoryPathError",
                "aws.greengrass#InvalidArtifactsDirectoryPathError",
                "aws.greengrass#InvalidArgumentsError"
            ])
        }],
        ["aws.greengrass#DeferComponentUpdate", {
            requestShape: "aws.greengrass#DeferComponentUpdateRequest",
            responseShape: "aws.greengrass#DeferComponentUpdateResponse",
            errorShapes: new Set<string>([
                "aws.greengrass#ServiceError",
                "aws.greengrass#ResourceNotFoundError",
                "aws.greengrass#InvalidArgumentsError"
            ])
        }],
        ["aws.greengrass#DeleteThingShadow", {
            requestShape: "aws.greengrass#DeleteThingShadowRequest",
            responseShape: "aws.greengrass#DeleteThingShadowResponse",
            errorShapes: new Set<string>([
                "aws.greengrass#InvalidArgumentsError",
                "aws.greengrass#ResourceNotFoundError",
                "aws.greengrass#ServiceError",
                "aws.greengrass#UnauthorizedError"
            ])
        }],
        ["aws.greengrass#GetClientDeviceAuthToken", {
            requestShape: "aws.greengrass#GetClientDeviceAuthTokenRequest",
            responseShape: "aws.greengrass#GetClientDeviceAuthTokenResponse",
            errorShapes: new Set<string>([
                "aws.greengrass#UnauthorizedError",
                "aws.greengrass#ServiceError",
                "aws.greengrass#InvalidArgumentsError",
                "aws.greengrass#InvalidCredentialError"
            ])
        }],
        ["aws.greengrass#GetComponentDetails", {
            requestShape: "aws.greengrass#GetComponentDetailsRequest",
            responseShape: "aws.greengrass#GetComponentDetailsResponse",
            errorShapes: new Set<string>([
                "aws.greengrass#ServiceError",
                "aws.greengrass#ResourceNotFoundError",
                "aws.greengrass#InvalidArgumentsError"
            ])
        }],
        ["aws.greengrass#GetConfiguration", {
            requestShape: "aws.greengrass#GetConfigurationRequest",
            responseShape: "aws.greengrass#GetConfigurationResponse",
            errorShapes: new Set<string>([
                "aws.greengrass#ServiceError",
                "aws.greengrass#ResourceNotFoundError"
            ])
        }],
        ["aws.greengrass#GetLocalDeploymentStatus", {
            requestShape: "aws.greengrass#GetLocalDeploymentStatusRequest",
            responseShape: "aws.greengrass#GetLocalDeploymentStatusResponse",
            errorShapes: new Set<string>([
                "aws.greengrass#ServiceError",
                "aws.greengrass#ResourceNotFoundError"
            ])
        }],
        ["aws.greengrass#GetSecretValue", {
            requestShape: "aws.greengrass#GetSecretValueRequest",
            responseShape: "aws.greengrass#GetSecretValueResponse",
            errorShapes: new Set<string>([
                "aws.greengrass#UnauthorizedError",
                "aws.greengrass#ResourceNotFoundError",
                "aws.greengrass#ServiceError"
            ])
        }],
        ["aws.greengrass#GetThingShadow", {
            requestShape: "aws.greengrass#GetThingShadowRequest",
            responseShape: "aws.greengrass#GetThingShadowResponse",
            errorShapes: new Set<string>([
                "aws.greengrass#InvalidArgumentsError",
                "aws.greengrass#ResourceNotFoundError",
                "aws.greengrass#ServiceError",
                "aws.greengrass#UnauthorizedError"
            ])
        }],
        ["aws.greengrass#ListComponents", {
            requestShape: "aws.greengrass#ListComponentsRequest",
            responseShape: "aws.greengrass#ListComponentsResponse",
            errorShapes: new Set<string>([
                "aws.greengrass#ServiceError"
            ])
        }],
        ["aws.greengrass#ListLocalDeployments", {
            requestShape: "aws.greengrass#ListLocalDeploymentsRequest",
            responseShape: "aws.greengrass#ListLocalDeploymentsResponse",
            errorShapes: new Set<string>([
                "aws.greengrass#ServiceError"
            ])
        }],
        ["aws.greengrass#ListNamedShadowsForThing", {
            requestShape: "aws.greengrass#ListNamedShadowsForThingRequest",
            responseShape: "aws.greengrass#ListNamedShadowsForThingResponse",
            errorShapes: new Set<string>([
                "aws.greengrass#InvalidArgumentsError",
                "aws.greengrass#ResourceNotFoundError",
                "aws.greengrass#ServiceError",
                "aws.greengrass#UnauthorizedError"
            ])
        }],
        ["aws.greengrass#PauseComponent", {
            requestShape: "aws.greengrass#PauseComponentRequest",
            responseShape: "aws.greengrass#PauseComponentResponse",
            errorShapes: new Set<string>([
                "aws.greengrass#UnauthorizedError",
                "aws.greengrass#ServiceError",
                "aws.greengrass#ResourceNotFoundError"
            ])
        }],
        ["aws.greengrass#PublishToIoTCore", {
            requestShape: "aws.greengrass#PublishToIoTCoreRequest",
            responseShape: "aws.greengrass#PublishToIoTCoreResponse",
            errorShapes: new Set<string>([
                "aws.greengrass#ServiceError",
                "aws.greengrass#UnauthorizedError"
            ])
        }],
        ["aws.greengrass#PublishToTopic", {
            requestShape: "aws.greengrass#PublishToTopicRequest",
            responseShape: "aws.greengrass#PublishToTopicResponse",
            errorShapes: new Set<string>([
                "aws.greengrass#ServiceError",
                "aws.greengrass#UnauthorizedError"
            ])
        }],
        ["aws.greengrass#PutComponentMetric", {
            requestShape: "aws.greengrass#PutComponentMetricRequest",
            responseShape: "aws.greengrass#PutComponentMetricResponse",
            errorShapes: new Set<string>([
                "aws.greengrass#UnauthorizedError",
                "aws.greengrass#ServiceError",
                "aws.greengrass#InvalidArgumentsError"
            ])
        }],
        ["aws.greengrass#RestartComponent", {
            requestShape: "aws.greengrass#RestartComponentRequest",
            responseShape: "aws.greengrass#RestartComponentResponse",
            errorShapes: new Set<string>([
                "aws.greengrass#ServiceError",
                "aws.greengrass#ComponentNotFoundError",
                "aws.greengrass#InvalidArgumentsError"
            ])
        }],
        ["aws.greengrass#ResumeComponent", {
            requestShape: "aws.greengrass#ResumeComponentRequest",
            responseShape: "aws.greengrass#ResumeComponentResponse",
            errorShapes: new Set<string>([
                "aws.greengrass#UnauthorizedError",
                "aws.greengrass#ServiceError",
                "aws.greengrass#ResourceNotFoundError"
            ])
        }],
        ["aws.greengrass#SendConfigurationValidityReport", {
            requestShape: "aws.greengrass#SendConfigurationValidityReportRequest",
            responseShape: "aws.greengrass#SendConfigurationValidityReportResponse",
            errorShapes: new Set<string>([
                "aws.greengrass#InvalidArgumentsError",
                "aws.greengrass#ServiceError"
            ])
        }],
        ["aws.greengrass#StopComponent", {
            requestShape: "aws.greengrass#StopComponentRequest",
            responseShape: "aws.greengrass#StopComponentResponse",
            errorShapes: new Set<string>([
                "aws.greengrass#ServiceError",
                "aws.greengrass#ComponentNotFoundError",
                "aws.greengrass#InvalidArgumentsError"
            ])
        }],
        ["aws.greengrass#SubscribeToCertificateUpdates", {
            requestShape: "aws.greengrass#SubscribeToCertificateUpdatesRequest",
            responseShape: "aws.greengrass#SubscribeToCertificateUpdatesResponse",
            inboundMessageShape: "aws.greengrass#CertificateUpdateEvent",
            errorShapes: new Set<string>([
                "aws.greengrass#ServiceError",
                "aws.greengrass#UnauthorizedError",
                "aws.greengrass#InvalidArgumentsError"
            ])
        }],
        ["aws.greengrass#SubscribeToComponentUpdates", {
            requestShape: "aws.greengrass#SubscribeToComponentUpdatesRequest",
            responseShape: "aws.greengrass#SubscribeToComponentUpdatesResponse",
            inboundMessageShape: "aws.greengrass#ComponentUpdatePolicyEvents",
            errorShapes: new Set<string>([
                "aws.greengrass#ServiceError",
                "aws.greengrass#ResourceNotFoundError"
            ])
        }],
        ["aws.greengrass#SubscribeToConfigurationUpdate", {
            requestShape: "aws.greengrass#SubscribeToConfigurationUpdateRequest",
            responseShape: "aws.greengrass#SubscribeToConfigurationUpdateResponse",
            inboundMessageShape: "aws.greengrass#ConfigurationUpdateEvents",
            errorShapes: new Set<string>([
                "aws.greengrass#ServiceError",
                "aws.greengrass#ResourceNotFoundError"
            ])
        }],
        ["aws.greengrass#SubscribeToIoTCore", {
            requestShape: "aws.greengrass#SubscribeToIoTCoreRequest",
            responseShape: "aws.greengrass#SubscribeToIoTCoreResponse",
            inboundMessageShape: "aws.greengrass#IoTCoreMessage",
            errorShapes: new Set<string>([
                "aws.greengrass#ServiceError",
                "aws.greengrass#UnauthorizedError"
            ])
        }],
        ["aws.greengrass#SubscribeToTopic", {
            requestShape: "aws.greengrass#SubscribeToTopicRequest",
            responseShape: "aws.greengrass#SubscribeToTopicResponse",
            inboundMessageShape: "aws.greengrass#SubscriptionResponseMessage",
            errorShapes: new Set<string>([
                "aws.greengrass#InvalidArgumentsError",
                "aws.greengrass#ServiceError",
                "aws.greengrass#UnauthorizedError"
            ])
        }],
        ["aws.greengrass#SubscribeToValidateConfigurationUpdates", {
            requestShape: "aws.greengrass#SubscribeToValidateConfigurationUpdatesRequest",
            responseShape: "aws.greengrass#SubscribeToValidateConfigurationUpdatesResponse",
            inboundMessageShape: "aws.greengrass#ValidateConfigurationUpdateEvents",
            errorShapes: new Set<string>([
                "aws.greengrass#ServiceError"
            ])
        }],
        ["aws.greengrass#UpdateConfiguration", {
            requestShape: "aws.greengrass#UpdateConfigurationRequest",
            responseShape: "aws.greengrass#UpdateConfigurationResponse",
            errorShapes: new Set<string>([
                "aws.greengrass#ServiceError",
                "aws.greengrass#UnauthorizedError",
                "aws.greengrass#ConflictError",
                "aws.greengrass#FailedUpdateConditionCheckError",
                "aws.greengrass#InvalidArgumentsError"
            ])
        }],
        ["aws.greengrass#UpdateState", {
            requestShape: "aws.greengrass#UpdateStateRequest",
            responseShape: "aws.greengrass#UpdateStateResponse",
            errorShapes: new Set<string>([
                "aws.greengrass#ServiceError",
                "aws.greengrass#ResourceNotFoundError"
            ])
        }],
        ["aws.greengrass#UpdateThingShadow", {
            requestShape: "aws.greengrass#UpdateThingShadowRequest",
            responseShape: "aws.greengrass#UpdateThingShadowResponse",
            errorShapes: new Set<string>([
                "aws.greengrass#InvalidArgumentsError",
                "aws.greengrass#ConflictError",
                "aws.greengrass#ServiceError",
                "aws.greengrass#UnauthorizedError"
            ])
        }],
        ["aws.greengrass#ValidateAuthorizationToken", {
            requestShape: "aws.greengrass#ValidateAuthorizationTokenRequest",
            responseShape: "aws.greengrass#ValidateAuthorizationTokenResponse",
            errorShapes: new Set<string>([
                "aws.greengrass#InvalidTokenError",
                "aws.greengrass#UnauthorizedError",
                "aws.greengrass#ServiceError"
            ])
        }],
        ["aws.greengrass#VerifyClientDeviceIdentity", {
            requestShape: "aws.greengrass#VerifyClientDeviceIdentityRequest",
            responseShape: "aws.greengrass#VerifyClientDeviceIdentityResponse",
            errorShapes: new Set<string>([
                "aws.greengrass#UnauthorizedError",
                "aws.greengrass#ServiceError",
                "aws.greengrass#InvalidArgumentsError"
            ])
        }]
    ]);
}

const DetailedDeploymentStatusValues : Set<string> = new Set<string>([
    "SUCCESSFUL",
    "FAILED_NO_STATE_CHANGE",
    "FAILED_ROLLBACK_NOT_REQUESTED",
    "FAILED_ROLLBACK_COMPLETE",
    "REJECTED"
]);

const DeploymentStatusValues : Set<string> = new Set<string>([
    "QUEUED",
    "IN_PROGRESS",
    "SUCCEEDED",
    "FAILED",
    "CANCELED"
]);

const LifecycleStateValues : Set<string> = new Set<string>([
    "RUNNING",
    "ERRORED",
    "NEW",
    "FINISHED",
    "INSTALLED",
    "BROKEN",
    "STARTING",
    "STOPPING"
]);

const MetricUnitTypeValues : Set<string> = new Set<string>([
    "BYTES",
    "BYTES_PER_SECOND",
    "COUNT",
    "COUNT_PER_SECOND",
    "MEGABYTES",
    "SECONDS"
]);

const PayloadFormatValues : Set<string> = new Set<string>([
    "0",
    "1"
]);

const ConfigurationValidityStatusValues : Set<string> = new Set<string>([
    "ACCEPTED",
    "REJECTED"
]);

const CertificateTypeValues : Set<string> = new Set<string>([
    "SERVER"
]);

const FailureHandlingPolicyValues : Set<string> = new Set<string>([
    "ROLLBACK",
    "DO_NOTHING"
]);

const RequestStatusValues : Set<string> = new Set<string>([
    "SUCCEEDED",
    "FAILED"
]);

const ReportedLifecycleStateValues : Set<string> = new Set<string>([
    "RUNNING",
    "ERRORED"
]);

const ReceiveModeValues : Set<string> = new Set<string>([
    "RECEIVE_ALL_MESSAGES",
    "RECEIVE_MESSAGES_FROM_OTHERS"
]);

const QOSValues : Set<string> = new Set<string>([
    "0",
    "1"
]);


function createEnumsMap() : Map<string, Set<string>> {
    return new Map<string, Set<string>>([
        ["DetailedDeploymentStatus", DetailedDeploymentStatusValues],
        ["DeploymentStatus", DeploymentStatusValues],
        ["LifecycleState", LifecycleStateValues],
        ["MetricUnitType", MetricUnitTypeValues],
        ["PayloadFormat", PayloadFormatValues],
        ["ConfigurationValidityStatus", ConfigurationValidityStatusValues],
        ["CertificateType", CertificateTypeValues],
        ["FailureHandlingPolicy", FailureHandlingPolicyValues],
        ["RequestStatus", RequestStatusValues],
        ["ReportedLifecycleState", ReportedLifecycleStateValues],
        ["ReceiveMode", ReceiveModeValues],
        ["QOS", QOSValues],
    ]);
}

export function makeServiceModel() : eventstream_rpc.EventstreamRpcServiceModel {
    return {
        normalizers: createNormalizerMap(),
        validators: createValidatorMap(),
        deserializers: createDeserializerMap(),
        serializers: createSerializerMap(),
        operations: createOperationMap(),
        enums: createEnumsMap()
    };
}

export function normalizeUserProperty(value : model.UserProperty) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'key', value.key);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'value', value.value);

    return normalizedValue;
}

export function normalizeSystemResourceLimits(value : model.SystemResourceLimits) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'memory', value.memory);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'cpus', value.cpus);

    return normalizedValue;
}

export function normalizeDeploymentStatusDetails(value : model.DeploymentStatusDetails) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'detailedDeploymentStatus', value.detailedDeploymentStatus);
    eventstream_rpc_utils.setDefinedArrayProperty(normalizedValue, 'deploymentErrorStack', value.deploymentErrorStack, undefined);
    eventstream_rpc_utils.setDefinedArrayProperty(normalizedValue, 'deploymentErrorTypes', value.deploymentErrorTypes, undefined);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'deploymentFailureCause', value.deploymentFailureCause);

    return normalizedValue;
}

export function normalizeMessageContext(value : model.MessageContext) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'topic', value.topic);

    return normalizedValue;
}

export function normalizeRunWithInfo(value : model.RunWithInfo) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'posixUser', value.posixUser);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'windowsUser', value.windowsUser);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'systemResourceLimits', value.systemResourceLimits, normalizeSystemResourceLimits);

    return normalizedValue;
}

export function normalizeLocalDeployment(value : model.LocalDeployment) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'deploymentId', value.deploymentId);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'status', value.status);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'createdOn', value.createdOn);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'deploymentStatusDetails', value.deploymentStatusDetails, normalizeDeploymentStatusDetails);

    return normalizedValue;
}

export function normalizePostComponentUpdateEvent(value : model.PostComponentUpdateEvent) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'deploymentId', value.deploymentId);

    return normalizedValue;
}

export function normalizePreComponentUpdateEvent(value : model.PreComponentUpdateEvent) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'deploymentId', value.deploymentId);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'isGgcRestarting', value.isGgcRestarting);

    return normalizedValue;
}

export function normalizeComponentDetails(value : model.ComponentDetails) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'componentName', value.componentName);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'version', value.version);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'state', value.state);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'configuration', value.configuration);

    return normalizedValue;
}

export function normalizeCertificateUpdate(value : model.CertificateUpdate) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'privateKey', value.privateKey);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'publicKey', value.publicKey);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'certificate', value.certificate);
    eventstream_rpc_utils.setDefinedArrayProperty(normalizedValue, 'caCertificates', value.caCertificates, undefined);

    return normalizedValue;
}

export function normalizeBinaryMessage(value : model.BinaryMessage) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'message', value.message, eventstream_rpc_utils.encodePayloadAsString);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'context', value.context, normalizeMessageContext);

    return normalizedValue;
}

export function normalizeJsonMessage(value : model.JsonMessage) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'message', value.message);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'context', value.context, normalizeMessageContext);

    return normalizedValue;
}

export function normalizeMQTTCredential(value : model.MQTTCredential) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'clientId', value.clientId);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'certificatePem', value.certificatePem);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'username', value.username);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'password', value.password);

    return normalizedValue;
}

export function normalizeValidateConfigurationUpdateEvent(value : model.ValidateConfigurationUpdateEvent) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'configuration', value.configuration);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'deploymentId', value.deploymentId);

    return normalizedValue;
}

export function normalizeMetric(value : model.Metric) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'name', value.name);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'unit', value.unit);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'value', value.value);

    return normalizedValue;
}

export function normalizeConfigurationUpdateEvent(value : model.ConfigurationUpdateEvent) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'componentName', value.componentName);
    eventstream_rpc_utils.setDefinedArrayProperty(normalizedValue, 'keyPath', value.keyPath, undefined);

    return normalizedValue;
}

export function normalizeMQTTMessage(value : model.MQTTMessage) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'topicName', value.topicName);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'payload', value.payload, eventstream_rpc_utils.encodePayloadAsString);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'retain', value.retain);
    eventstream_rpc_utils.setDefinedArrayProperty(normalizedValue, 'userProperties', value.userProperties, normalizeUserProperty);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'messageExpiryIntervalSeconds', value.messageExpiryIntervalSeconds);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'correlationData', value.correlationData, eventstream_rpc_utils.encodePayloadAsString);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'responseTopic', value.responseTopic);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'payloadFormat', value.payloadFormat);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'contentType', value.contentType);

    return normalizedValue;
}

export function normalizeComponentUpdatePolicyEvents(value : model.ComponentUpdatePolicyEvents) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'preUpdateEvent', value.preUpdateEvent, normalizePreComponentUpdateEvent);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'postUpdateEvent', value.postUpdateEvent, normalizePostComponentUpdateEvent);

    return normalizedValue;
}

export function normalizeSecretValue(value : model.SecretValue) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'secretString', value.secretString);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'secretBinary', value.secretBinary, eventstream_rpc_utils.encodePayloadAsString);

    return normalizedValue;
}

export function normalizeConfigurationValidityReport(value : model.ConfigurationValidityReport) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'status', value.status);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'deploymentId', value.deploymentId);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'message', value.message);

    return normalizedValue;
}

export function normalizeClientDeviceCredential(value : model.ClientDeviceCredential) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'clientDeviceCertificate', value.clientDeviceCertificate);

    return normalizedValue;
}

export function normalizeCertificateUpdateEvent(value : model.CertificateUpdateEvent) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'certificateUpdate', value.certificateUpdate, normalizeCertificateUpdate);

    return normalizedValue;
}

export function normalizeCertificateOptions(value : model.CertificateOptions) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'certificateType', value.certificateType);

    return normalizedValue;
}

export function normalizePublishMessage(value : model.PublishMessage) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'jsonMessage', value.jsonMessage, normalizeJsonMessage);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'binaryMessage', value.binaryMessage, normalizeBinaryMessage);

    return normalizedValue;
}

export function normalizeCredentialDocument(value : model.CredentialDocument) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'mqttCredential', value.mqttCredential, normalizeMQTTCredential);

    return normalizedValue;
}

export function normalizeSubscriptionResponseMessage(value : model.SubscriptionResponseMessage) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'jsonMessage', value.jsonMessage, normalizeJsonMessage);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'binaryMessage', value.binaryMessage, normalizeBinaryMessage);

    return normalizedValue;
}

export function normalizeValidateConfigurationUpdateEvents(value : model.ValidateConfigurationUpdateEvents) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'validateConfigurationUpdateEvent', value.validateConfigurationUpdateEvent, normalizeValidateConfigurationUpdateEvent);

    return normalizedValue;
}

export function normalizeConfigurationUpdateEvents(value : model.ConfigurationUpdateEvents) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'configurationUpdateEvent', value.configurationUpdateEvent, normalizeConfigurationUpdateEvent);

    return normalizedValue;
}

export function normalizeIoTCoreMessage(value : model.IoTCoreMessage) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'message', value.message, normalizeMQTTMessage);

    return normalizedValue;
}

export function normalizeInvalidArgumentsError(value : model.InvalidArgumentsError) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'message', value.message);

    return normalizedValue;
}

export function normalizeInvalidArtifactsDirectoryPathError(value : model.InvalidArtifactsDirectoryPathError) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'message', value.message);

    return normalizedValue;
}

export function normalizeInvalidRecipeDirectoryPathError(value : model.InvalidRecipeDirectoryPathError) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'message', value.message);

    return normalizedValue;
}

export function normalizeServiceError(value : model.ServiceError) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'message', value.message);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'context', value.context);

    return normalizedValue;
}

export function normalizeCreateLocalDeploymentResponse(value : model.CreateLocalDeploymentResponse) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'deploymentId', value.deploymentId);

    return normalizedValue;
}

export function normalizeCreateLocalDeploymentRequest(value : model.CreateLocalDeploymentRequest) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'groupName', value.groupName);
    eventstream_rpc_utils.setDefinedMapPropertyAsObject(normalizedValue, 'rootComponentVersionsToAdd', value.rootComponentVersionsToAdd, undefined, undefined);
    eventstream_rpc_utils.setDefinedArrayProperty(normalizedValue, 'rootComponentsToRemove', value.rootComponentsToRemove, undefined);
    eventstream_rpc_utils.setDefinedMapPropertyAsObject(normalizedValue, 'componentToConfiguration', value.componentToConfiguration, undefined, undefined);
    eventstream_rpc_utils.setDefinedMapPropertyAsObject(normalizedValue, 'componentToRunWithInfo', value.componentToRunWithInfo, undefined, normalizeRunWithInfo);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'recipeDirectoryPath', value.recipeDirectoryPath);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'artifactsDirectoryPath', value.artifactsDirectoryPath);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'failureHandlingPolicy', value.failureHandlingPolicy);

    return normalizedValue;
}

export function normalizeResourceNotFoundError(value : model.ResourceNotFoundError) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'message', value.message);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'resourceType', value.resourceType);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'resourceName', value.resourceName);

    return normalizedValue;
}

export function normalizeUnauthorizedError(value : model.UnauthorizedError) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'message', value.message);

    return normalizedValue;
}

export function normalizePauseComponentResponse(value : model.PauseComponentResponse) : any {
    let normalizedValue : any = {};

    return normalizedValue;
}

export function normalizePauseComponentRequest(value : model.PauseComponentRequest) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'componentName', value.componentName);

    return normalizedValue;
}

export function normalizeComponentNotFoundError(value : model.ComponentNotFoundError) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'message', value.message);

    return normalizedValue;
}

export function normalizeStopComponentResponse(value : model.StopComponentResponse) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'stopStatus', value.stopStatus);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'message', value.message);

    return normalizedValue;
}

export function normalizeStopComponentRequest(value : model.StopComponentRequest) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'componentName', value.componentName);

    return normalizedValue;
}

export function normalizeListLocalDeploymentsResponse(value : model.ListLocalDeploymentsResponse) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedArrayProperty(normalizedValue, 'localDeployments', value.localDeployments, normalizeLocalDeployment);

    return normalizedValue;
}

export function normalizeListLocalDeploymentsRequest(value : model.ListLocalDeploymentsRequest) : any {
    let normalizedValue : any = {};

    return normalizedValue;
}

export function normalizeSubscribeToComponentUpdatesResponse(value : model.SubscribeToComponentUpdatesResponse) : any {
    let normalizedValue : any = {};

    return normalizedValue;
}

export function normalizeSubscribeToComponentUpdatesRequest(value : model.SubscribeToComponentUpdatesRequest) : any {
    let normalizedValue : any = {};

    return normalizedValue;
}

export function normalizeListNamedShadowsForThingResponse(value : model.ListNamedShadowsForThingResponse) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedArrayProperty(normalizedValue, 'results', value.results, undefined);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'timestamp', value.timestamp, eventstream_rpc_utils.encodeDateAsNumber);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'nextToken', value.nextToken);

    return normalizedValue;
}

export function normalizeListNamedShadowsForThingRequest(value : model.ListNamedShadowsForThingRequest) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'thingName', value.thingName);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'nextToken', value.nextToken);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'pageSize', value.pageSize);

    return normalizedValue;
}

export function normalizeCancelLocalDeploymentResponse(value : model.CancelLocalDeploymentResponse) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'message', value.message);

    return normalizedValue;
}

export function normalizeCancelLocalDeploymentRequest(value : model.CancelLocalDeploymentRequest) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'deploymentId', value.deploymentId);

    return normalizedValue;
}

export function normalizeUpdateStateResponse(value : model.UpdateStateResponse) : any {
    let normalizedValue : any = {};

    return normalizedValue;
}

export function normalizeUpdateStateRequest(value : model.UpdateStateRequest) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'state', value.state);

    return normalizedValue;
}

export function normalizeGetSecretValueResponse(value : model.GetSecretValueResponse) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'secretId', value.secretId);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'versionId', value.versionId);
    eventstream_rpc_utils.setDefinedArrayProperty(normalizedValue, 'versionStage', value.versionStage, undefined);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'secretValue', value.secretValue, normalizeSecretValue);

    return normalizedValue;
}

export function normalizeGetSecretValueRequest(value : model.GetSecretValueRequest) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'secretId', value.secretId);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'versionId', value.versionId);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'versionStage', value.versionStage);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'refresh', value.refresh);

    return normalizedValue;
}

export function normalizeGetLocalDeploymentStatusResponse(value : model.GetLocalDeploymentStatusResponse) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'deployment', value.deployment, normalizeLocalDeployment);

    return normalizedValue;
}

export function normalizeGetLocalDeploymentStatusRequest(value : model.GetLocalDeploymentStatusRequest) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'deploymentId', value.deploymentId);

    return normalizedValue;
}

export function normalizeRestartComponentResponse(value : model.RestartComponentResponse) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'restartStatus', value.restartStatus);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'message', value.message);

    return normalizedValue;
}

export function normalizeRestartComponentRequest(value : model.RestartComponentRequest) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'componentName', value.componentName);

    return normalizedValue;
}

export function normalizeInvalidTokenError(value : model.InvalidTokenError) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'message', value.message);

    return normalizedValue;
}

export function normalizeValidateAuthorizationTokenResponse(value : model.ValidateAuthorizationTokenResponse) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'isValid', value.isValid);

    return normalizedValue;
}

export function normalizeValidateAuthorizationTokenRequest(value : model.ValidateAuthorizationTokenRequest) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'token', value.token);

    return normalizedValue;
}

export function normalizeFailedUpdateConditionCheckError(value : model.FailedUpdateConditionCheckError) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'message', value.message);

    return normalizedValue;
}

export function normalizeConflictError(value : model.ConflictError) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'message', value.message);

    return normalizedValue;
}

export function normalizeUpdateConfigurationResponse(value : model.UpdateConfigurationResponse) : any {
    let normalizedValue : any = {};

    return normalizedValue;
}

export function normalizeUpdateConfigurationRequest(value : model.UpdateConfigurationRequest) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedArrayProperty(normalizedValue, 'keyPath', value.keyPath, undefined);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'timestamp', value.timestamp, eventstream_rpc_utils.encodeDateAsNumber);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'valueToMerge', value.valueToMerge);

    return normalizedValue;
}

export function normalizeUpdateThingShadowResponse(value : model.UpdateThingShadowResponse) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'payload', value.payload, eventstream_rpc_utils.encodePayloadAsString);

    return normalizedValue;
}

export function normalizeUpdateThingShadowRequest(value : model.UpdateThingShadowRequest) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'thingName', value.thingName);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'shadowName', value.shadowName);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'payload', value.payload, eventstream_rpc_utils.encodePayloadAsString);

    return normalizedValue;
}

export function normalizeSendConfigurationValidityReportResponse(value : model.SendConfigurationValidityReportResponse) : any {
    let normalizedValue : any = {};

    return normalizedValue;
}

export function normalizeSendConfigurationValidityReportRequest(value : model.SendConfigurationValidityReportRequest) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'configurationValidityReport', value.configurationValidityReport, normalizeConfigurationValidityReport);

    return normalizedValue;
}

export function normalizeGetThingShadowResponse(value : model.GetThingShadowResponse) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'payload', value.payload, eventstream_rpc_utils.encodePayloadAsString);

    return normalizedValue;
}

export function normalizeGetThingShadowRequest(value : model.GetThingShadowRequest) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'thingName', value.thingName);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'shadowName', value.shadowName);

    return normalizedValue;
}

export function normalizeCreateDebugPasswordResponse(value : model.CreateDebugPasswordResponse) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'password', value.password);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'username', value.username);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'passwordExpiration', value.passwordExpiration, eventstream_rpc_utils.encodeDateAsNumber);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'certificateSHA256Hash', value.certificateSHA256Hash);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'certificateSHA1Hash', value.certificateSHA1Hash);

    return normalizedValue;
}

export function normalizeCreateDebugPasswordRequest(value : model.CreateDebugPasswordRequest) : any {
    let normalizedValue : any = {};

    return normalizedValue;
}

export function normalizeListComponentsResponse(value : model.ListComponentsResponse) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedArrayProperty(normalizedValue, 'components', value.components, normalizeComponentDetails);

    return normalizedValue;
}

export function normalizeListComponentsRequest(value : model.ListComponentsRequest) : any {
    let normalizedValue : any = {};

    return normalizedValue;
}

export function normalizeInvalidClientDeviceAuthTokenError(value : model.InvalidClientDeviceAuthTokenError) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'message', value.message);

    return normalizedValue;
}

export function normalizeAuthorizeClientDeviceActionResponse(value : model.AuthorizeClientDeviceActionResponse) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'isAuthorized', value.isAuthorized);

    return normalizedValue;
}

export function normalizeAuthorizeClientDeviceActionRequest(value : model.AuthorizeClientDeviceActionRequest) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'clientDeviceAuthToken', value.clientDeviceAuthToken);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'operation', value.operation);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'resource', value.resource);

    return normalizedValue;
}

export function normalizeVerifyClientDeviceIdentityResponse(value : model.VerifyClientDeviceIdentityResponse) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'isValidClientDevice', value.isValidClientDevice);

    return normalizedValue;
}

export function normalizeVerifyClientDeviceIdentityRequest(value : model.VerifyClientDeviceIdentityRequest) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'credential', value.credential, normalizeClientDeviceCredential);

    return normalizedValue;
}

export function normalizeSubscribeToCertificateUpdatesResponse(value : model.SubscribeToCertificateUpdatesResponse) : any {
    let normalizedValue : any = {};

    return normalizedValue;
}

export function normalizeSubscribeToCertificateUpdatesRequest(value : model.SubscribeToCertificateUpdatesRequest) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'certificateOptions', value.certificateOptions, normalizeCertificateOptions);

    return normalizedValue;
}

export function normalizePublishToTopicResponse(value : model.PublishToTopicResponse) : any {
    let normalizedValue : any = {};

    return normalizedValue;
}

export function normalizePublishToTopicRequest(value : model.PublishToTopicRequest) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'topic', value.topic);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'publishMessage', value.publishMessage, normalizePublishMessage);

    return normalizedValue;
}

export function normalizeInvalidCredentialError(value : model.InvalidCredentialError) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'message', value.message);

    return normalizedValue;
}

export function normalizeGetClientDeviceAuthTokenResponse(value : model.GetClientDeviceAuthTokenResponse) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'clientDeviceAuthToken', value.clientDeviceAuthToken);

    return normalizedValue;
}

export function normalizeGetClientDeviceAuthTokenRequest(value : model.GetClientDeviceAuthTokenRequest) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'credential', value.credential, normalizeCredentialDocument);

    return normalizedValue;
}

export function normalizeGetComponentDetailsResponse(value : model.GetComponentDetailsResponse) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'componentDetails', value.componentDetails, normalizeComponentDetails);

    return normalizedValue;
}

export function normalizeGetComponentDetailsRequest(value : model.GetComponentDetailsRequest) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'componentName', value.componentName);

    return normalizedValue;
}

export function normalizeSubscribeToTopicResponse(value : model.SubscribeToTopicResponse) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'topicName', value.topicName);

    return normalizedValue;
}

export function normalizeSubscribeToTopicRequest(value : model.SubscribeToTopicRequest) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'topic', value.topic);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'receiveMode', value.receiveMode);

    return normalizedValue;
}

export function normalizeGetConfigurationResponse(value : model.GetConfigurationResponse) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'componentName', value.componentName);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'value', value.value);

    return normalizedValue;
}

export function normalizeGetConfigurationRequest(value : model.GetConfigurationRequest) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'componentName', value.componentName);
    eventstream_rpc_utils.setDefinedArrayProperty(normalizedValue, 'keyPath', value.keyPath, undefined);

    return normalizedValue;
}

export function normalizeSubscribeToValidateConfigurationUpdatesResponse(value : model.SubscribeToValidateConfigurationUpdatesResponse) : any {
    let normalizedValue : any = {};

    return normalizedValue;
}

export function normalizeSubscribeToValidateConfigurationUpdatesRequest(value : model.SubscribeToValidateConfigurationUpdatesRequest) : any {
    let normalizedValue : any = {};

    return normalizedValue;
}

export function normalizeDeferComponentUpdateResponse(value : model.DeferComponentUpdateResponse) : any {
    let normalizedValue : any = {};

    return normalizedValue;
}

export function normalizeDeferComponentUpdateRequest(value : model.DeferComponentUpdateRequest) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'deploymentId', value.deploymentId);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'message', value.message);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'recheckAfterMs', value.recheckAfterMs);

    return normalizedValue;
}

export function normalizePutComponentMetricResponse(value : model.PutComponentMetricResponse) : any {
    let normalizedValue : any = {};

    return normalizedValue;
}

export function normalizePutComponentMetricRequest(value : model.PutComponentMetricRequest) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedArrayProperty(normalizedValue, 'metrics', value.metrics, normalizeMetric);

    return normalizedValue;
}

export function normalizeDeleteThingShadowResponse(value : model.DeleteThingShadowResponse) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'payload', value.payload, eventstream_rpc_utils.encodePayloadAsString);

    return normalizedValue;
}

export function normalizeDeleteThingShadowRequest(value : model.DeleteThingShadowRequest) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'thingName', value.thingName);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'shadowName', value.shadowName);

    return normalizedValue;
}

export function normalizeSubscribeToConfigurationUpdateResponse(value : model.SubscribeToConfigurationUpdateResponse) : any {
    let normalizedValue : any = {};

    return normalizedValue;
}

export function normalizeSubscribeToConfigurationUpdateRequest(value : model.SubscribeToConfigurationUpdateRequest) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'componentName', value.componentName);
    eventstream_rpc_utils.setDefinedArrayProperty(normalizedValue, 'keyPath', value.keyPath, undefined);

    return normalizedValue;
}

export function normalizePublishToIoTCoreResponse(value : model.PublishToIoTCoreResponse) : any {
    let normalizedValue : any = {};

    return normalizedValue;
}

export function normalizePublishToIoTCoreRequest(value : model.PublishToIoTCoreRequest) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'topicName', value.topicName);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'qos', value.qos);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'payload', value.payload, eventstream_rpc_utils.encodePayloadAsString);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'retain', value.retain);
    eventstream_rpc_utils.setDefinedArrayProperty(normalizedValue, 'userProperties', value.userProperties, normalizeUserProperty);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'messageExpiryIntervalSeconds', value.messageExpiryIntervalSeconds);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'correlationData', value.correlationData, eventstream_rpc_utils.encodePayloadAsString);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'responseTopic', value.responseTopic);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'payloadFormat', value.payloadFormat);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'contentType', value.contentType);

    return normalizedValue;
}

export function normalizeResumeComponentResponse(value : model.ResumeComponentResponse) : any {
    let normalizedValue : any = {};

    return normalizedValue;
}

export function normalizeResumeComponentRequest(value : model.ResumeComponentRequest) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'componentName', value.componentName);

    return normalizedValue;
}

export function normalizeSubscribeToIoTCoreResponse(value : model.SubscribeToIoTCoreResponse) : any {
    let normalizedValue : any = {};

    return normalizedValue;
}

export function normalizeSubscribeToIoTCoreRequest(value : model.SubscribeToIoTCoreRequest) : any {
    let normalizedValue : any = {};
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'topicName', value.topicName);
    eventstream_rpc_utils.setDefinedProperty(normalizedValue, 'qos', value.qos);

    return normalizedValue;
}

export function validateUserProperty(value : model.UserProperty) : void {
    eventstream_rpc_utils.validateValueAsOptionalString(value.key, 'key', 'UserProperty');
    eventstream_rpc_utils.validateValueAsOptionalString(value.value, 'value', 'UserProperty');
}

export function validateSystemResourceLimits(value : model.SystemResourceLimits) : void {
    eventstream_rpc_utils.validateValueAsOptionalInteger(value.memory, 'memory', 'SystemResourceLimits');
    eventstream_rpc_utils.validateValueAsOptionalNumber(value.cpus, 'cpus', 'SystemResourceLimits');
}

export function validateDeploymentStatusDetails(value : model.DeploymentStatusDetails) : void {
    eventstream_rpc_utils.validateValueAsString(value.detailedDeploymentStatus, 'detailedDeploymentStatus', 'DeploymentStatusDetails');
    eventstream_rpc_utils.validateValueAsOptionalArray(value.deploymentErrorStack, eventstream_rpc_utils.validateValueAsString, 'deploymentErrorStack', 'DeploymentStatusDetails');
    eventstream_rpc_utils.validateValueAsOptionalArray(value.deploymentErrorTypes, eventstream_rpc_utils.validateValueAsString, 'deploymentErrorTypes', 'DeploymentStatusDetails');
    eventstream_rpc_utils.validateValueAsOptionalString(value.deploymentFailureCause, 'deploymentFailureCause', 'DeploymentStatusDetails');
}

export function validateMessageContext(value : model.MessageContext) : void {
    eventstream_rpc_utils.validateValueAsOptionalString(value.topic, 'topic', 'MessageContext');
}

export function validateRunWithInfo(value : model.RunWithInfo) : void {
    eventstream_rpc_utils.validateValueAsOptionalString(value.posixUser, 'posixUser', 'RunWithInfo');
    eventstream_rpc_utils.validateValueAsOptionalString(value.windowsUser, 'windowsUser', 'RunWithInfo');
    eventstream_rpc_utils.validateValueAsOptionalObject(value.systemResourceLimits, validateSystemResourceLimits, 'systemResourceLimits', 'RunWithInfo');
}

export function validateLocalDeployment(value : model.LocalDeployment) : void {
    eventstream_rpc_utils.validateValueAsString(value.deploymentId, 'deploymentId', 'LocalDeployment');
    eventstream_rpc_utils.validateValueAsString(value.status, 'status', 'LocalDeployment');
    eventstream_rpc_utils.validateValueAsOptionalString(value.createdOn, 'createdOn', 'LocalDeployment');
    eventstream_rpc_utils.validateValueAsOptionalObject(value.deploymentStatusDetails, validateDeploymentStatusDetails, 'deploymentStatusDetails', 'LocalDeployment');
}

export function validatePostComponentUpdateEvent(value : model.PostComponentUpdateEvent) : void {
    eventstream_rpc_utils.validateValueAsString(value.deploymentId, 'deploymentId', 'PostComponentUpdateEvent');
}

export function validatePreComponentUpdateEvent(value : model.PreComponentUpdateEvent) : void {
    eventstream_rpc_utils.validateValueAsString(value.deploymentId, 'deploymentId', 'PreComponentUpdateEvent');
    eventstream_rpc_utils.validateValueAsBoolean(value.isGgcRestarting, 'isGgcRestarting', 'PreComponentUpdateEvent');
}

export function validateComponentDetails(value : model.ComponentDetails) : void {
    eventstream_rpc_utils.validateValueAsString(value.componentName, 'componentName', 'ComponentDetails');
    eventstream_rpc_utils.validateValueAsString(value.version, 'version', 'ComponentDetails');
    eventstream_rpc_utils.validateValueAsString(value.state, 'state', 'ComponentDetails');
    eventstream_rpc_utils.validateValueAsOptionalAny(value.configuration, 'configuration', 'ComponentDetails');
}

export function validateCertificateUpdate(value : model.CertificateUpdate) : void {
    eventstream_rpc_utils.validateValueAsOptionalString(value.privateKey, 'privateKey', 'CertificateUpdate');
    eventstream_rpc_utils.validateValueAsOptionalString(value.publicKey, 'publicKey', 'CertificateUpdate');
    eventstream_rpc_utils.validateValueAsOptionalString(value.certificate, 'certificate', 'CertificateUpdate');
    eventstream_rpc_utils.validateValueAsOptionalArray(value.caCertificates, eventstream_rpc_utils.validateValueAsString, 'caCertificates', 'CertificateUpdate');
}

export function validateBinaryMessage(value : model.BinaryMessage) : void {
    eventstream_rpc_utils.validateValueAsOptionalBlob(value.message, 'message', 'BinaryMessage');
    eventstream_rpc_utils.validateValueAsOptionalObject(value.context, validateMessageContext, 'context', 'BinaryMessage');
}

export function validateJsonMessage(value : model.JsonMessage) : void {
    eventstream_rpc_utils.validateValueAsOptionalAny(value.message, 'message', 'JsonMessage');
    eventstream_rpc_utils.validateValueAsOptionalObject(value.context, validateMessageContext, 'context', 'JsonMessage');
}

export function validateMQTTCredential(value : model.MQTTCredential) : void {
    eventstream_rpc_utils.validateValueAsOptionalString(value.clientId, 'clientId', 'MQTTCredential');
    eventstream_rpc_utils.validateValueAsOptionalString(value.certificatePem, 'certificatePem', 'MQTTCredential');
    eventstream_rpc_utils.validateValueAsOptionalString(value.username, 'username', 'MQTTCredential');
    eventstream_rpc_utils.validateValueAsOptionalString(value.password, 'password', 'MQTTCredential');
}

export function validateValidateConfigurationUpdateEvent(value : model.ValidateConfigurationUpdateEvent) : void {
    eventstream_rpc_utils.validateValueAsOptionalAny(value.configuration, 'configuration', 'ValidateConfigurationUpdateEvent');
    eventstream_rpc_utils.validateValueAsString(value.deploymentId, 'deploymentId', 'ValidateConfigurationUpdateEvent');
}

export function validateMetric(value : model.Metric) : void {
    eventstream_rpc_utils.validateValueAsString(value.name, 'name', 'Metric');
    eventstream_rpc_utils.validateValueAsString(value.unit, 'unit', 'Metric');
    eventstream_rpc_utils.validateValueAsNumber(value.value, 'value', 'Metric');
}

export function validateConfigurationUpdateEvent(value : model.ConfigurationUpdateEvent) : void {
    eventstream_rpc_utils.validateValueAsString(value.componentName, 'componentName', 'ConfigurationUpdateEvent');
    eventstream_rpc_utils.validateValueAsArray(value.keyPath, eventstream_rpc_utils.validateValueAsString, 'keyPath', 'ConfigurationUpdateEvent');
}

export function validateMQTTMessage(value : model.MQTTMessage) : void {
    eventstream_rpc_utils.validateValueAsString(value.topicName, 'topicName', 'MQTTMessage');
    eventstream_rpc_utils.validateValueAsOptionalBlob(value.payload, 'payload', 'MQTTMessage');
    eventstream_rpc_utils.validateValueAsOptionalBoolean(value.retain, 'retain', 'MQTTMessage');
    eventstream_rpc_utils.validateValueAsOptionalArray(value.userProperties, validateUserProperty, 'userProperties', 'MQTTMessage');
    eventstream_rpc_utils.validateValueAsOptionalInteger(value.messageExpiryIntervalSeconds, 'messageExpiryIntervalSeconds', 'MQTTMessage');
    eventstream_rpc_utils.validateValueAsOptionalBlob(value.correlationData, 'correlationData', 'MQTTMessage');
    eventstream_rpc_utils.validateValueAsOptionalString(value.responseTopic, 'responseTopic', 'MQTTMessage');
    eventstream_rpc_utils.validateValueAsOptionalString(value.payloadFormat, 'payloadFormat', 'MQTTMessage');
    eventstream_rpc_utils.validateValueAsOptionalString(value.contentType, 'contentType', 'MQTTMessage');
}

const _ComponentUpdatePolicyEventsPropertyValidators : Map<string, eventstream_rpc_utils.ElementValidator> = new Map<string, eventstream_rpc_utils.ElementValidator>([
    ["preUpdateEvent", validatePreComponentUpdateEvent],
    ["postUpdateEvent", validatePostComponentUpdateEvent]
]);

export function validateComponentUpdatePolicyEvents(value : model.ComponentUpdatePolicyEvents) : void {
    eventstream_rpc_utils.validateValueAsUnion(value, _ComponentUpdatePolicyEventsPropertyValidators);
}

const _SecretValuePropertyValidators : Map<string, eventstream_rpc_utils.ElementValidator> = new Map<string, eventstream_rpc_utils.ElementValidator>([
    ["secretString", eventstream_rpc_utils.validateValueAsString],
    ["secretBinary", eventstream_rpc_utils.validateValueAsBlob]
]);

export function validateSecretValue(value : model.SecretValue) : void {
    eventstream_rpc_utils.validateValueAsUnion(value, _SecretValuePropertyValidators);
}

export function validateConfigurationValidityReport(value : model.ConfigurationValidityReport) : void {
    eventstream_rpc_utils.validateValueAsString(value.status, 'status', 'ConfigurationValidityReport');
    eventstream_rpc_utils.validateValueAsString(value.deploymentId, 'deploymentId', 'ConfigurationValidityReport');
    eventstream_rpc_utils.validateValueAsOptionalString(value.message, 'message', 'ConfigurationValidityReport');
}

const _ClientDeviceCredentialPropertyValidators : Map<string, eventstream_rpc_utils.ElementValidator> = new Map<string, eventstream_rpc_utils.ElementValidator>([
    ["clientDeviceCertificate", eventstream_rpc_utils.validateValueAsString]
]);

export function validateClientDeviceCredential(value : model.ClientDeviceCredential) : void {
    eventstream_rpc_utils.validateValueAsUnion(value, _ClientDeviceCredentialPropertyValidators);
}

const _CertificateUpdateEventPropertyValidators : Map<string, eventstream_rpc_utils.ElementValidator> = new Map<string, eventstream_rpc_utils.ElementValidator>([
    ["certificateUpdate", validateCertificateUpdate]
]);

export function validateCertificateUpdateEvent(value : model.CertificateUpdateEvent) : void {
    eventstream_rpc_utils.validateValueAsUnion(value, _CertificateUpdateEventPropertyValidators);
}

export function validateCertificateOptions(value : model.CertificateOptions) : void {
    eventstream_rpc_utils.validateValueAsString(value.certificateType, 'certificateType', 'CertificateOptions');
}

const _PublishMessagePropertyValidators : Map<string, eventstream_rpc_utils.ElementValidator> = new Map<string, eventstream_rpc_utils.ElementValidator>([
    ["jsonMessage", validateJsonMessage],
    ["binaryMessage", validateBinaryMessage]
]);

export function validatePublishMessage(value : model.PublishMessage) : void {
    eventstream_rpc_utils.validateValueAsUnion(value, _PublishMessagePropertyValidators);
}

const _CredentialDocumentPropertyValidators : Map<string, eventstream_rpc_utils.ElementValidator> = new Map<string, eventstream_rpc_utils.ElementValidator>([
    ["mqttCredential", validateMQTTCredential]
]);

export function validateCredentialDocument(value : model.CredentialDocument) : void {
    eventstream_rpc_utils.validateValueAsUnion(value, _CredentialDocumentPropertyValidators);
}

const _SubscriptionResponseMessagePropertyValidators : Map<string, eventstream_rpc_utils.ElementValidator> = new Map<string, eventstream_rpc_utils.ElementValidator>([
    ["jsonMessage", validateJsonMessage],
    ["binaryMessage", validateBinaryMessage]
]);

export function validateSubscriptionResponseMessage(value : model.SubscriptionResponseMessage) : void {
    eventstream_rpc_utils.validateValueAsUnion(value, _SubscriptionResponseMessagePropertyValidators);
}

const _ValidateConfigurationUpdateEventsPropertyValidators : Map<string, eventstream_rpc_utils.ElementValidator> = new Map<string, eventstream_rpc_utils.ElementValidator>([
    ["validateConfigurationUpdateEvent", validateValidateConfigurationUpdateEvent]
]);

export function validateValidateConfigurationUpdateEvents(value : model.ValidateConfigurationUpdateEvents) : void {
    eventstream_rpc_utils.validateValueAsUnion(value, _ValidateConfigurationUpdateEventsPropertyValidators);
}

const _ConfigurationUpdateEventsPropertyValidators : Map<string, eventstream_rpc_utils.ElementValidator> = new Map<string, eventstream_rpc_utils.ElementValidator>([
    ["configurationUpdateEvent", validateConfigurationUpdateEvent]
]);

export function validateConfigurationUpdateEvents(value : model.ConfigurationUpdateEvents) : void {
    eventstream_rpc_utils.validateValueAsUnion(value, _ConfigurationUpdateEventsPropertyValidators);
}

const _IoTCoreMessagePropertyValidators : Map<string, eventstream_rpc_utils.ElementValidator> = new Map<string, eventstream_rpc_utils.ElementValidator>([
    ["message", validateMQTTMessage]
]);

export function validateIoTCoreMessage(value : model.IoTCoreMessage) : void {
    eventstream_rpc_utils.validateValueAsUnion(value, _IoTCoreMessagePropertyValidators);
}

export function validateInvalidArgumentsError(value : model.InvalidArgumentsError) : void {
    eventstream_rpc_utils.validateValueAsOptionalString(value.message, 'message', 'InvalidArgumentsError');
}

export function validateInvalidArtifactsDirectoryPathError(value : model.InvalidArtifactsDirectoryPathError) : void {
    eventstream_rpc_utils.validateValueAsOptionalString(value.message, 'message', 'InvalidArtifactsDirectoryPathError');
}

export function validateInvalidRecipeDirectoryPathError(value : model.InvalidRecipeDirectoryPathError) : void {
    eventstream_rpc_utils.validateValueAsOptionalString(value.message, 'message', 'InvalidRecipeDirectoryPathError');
}

export function validateServiceError(value : model.ServiceError) : void {
    eventstream_rpc_utils.validateValueAsOptionalString(value.message, 'message', 'ServiceError');
    eventstream_rpc_utils.validateValueAsOptionalAny(value.context, 'context', 'ServiceError');
}

export function validateCreateLocalDeploymentResponse(value : model.CreateLocalDeploymentResponse) : void {
    eventstream_rpc_utils.validateValueAsOptionalString(value.deploymentId, 'deploymentId', 'CreateLocalDeploymentResponse');
}

export function validateCreateLocalDeploymentRequest(value : model.CreateLocalDeploymentRequest) : void {
    eventstream_rpc_utils.validateValueAsOptionalString(value.groupName, 'groupName', 'CreateLocalDeploymentRequest');
    eventstream_rpc_utils.validateValueAsOptionalMap(value.rootComponentVersionsToAdd, eventstream_rpc_utils.validateValueAsString, eventstream_rpc_utils.validateValueAsString, 'rootComponentVersionsToAdd', 'CreateLocalDeploymentRequest');
    eventstream_rpc_utils.validateValueAsOptionalArray(value.rootComponentsToRemove, eventstream_rpc_utils.validateValueAsString, 'rootComponentsToRemove', 'CreateLocalDeploymentRequest');
    eventstream_rpc_utils.validateValueAsOptionalMap(value.componentToConfiguration, eventstream_rpc_utils.validateValueAsString, eventstream_rpc_utils.validateValueAsAny, 'componentToConfiguration', 'CreateLocalDeploymentRequest');
    eventstream_rpc_utils.validateValueAsOptionalMap(value.componentToRunWithInfo, eventstream_rpc_utils.validateValueAsString, validateRunWithInfo, 'componentToRunWithInfo', 'CreateLocalDeploymentRequest');
    eventstream_rpc_utils.validateValueAsOptionalString(value.recipeDirectoryPath, 'recipeDirectoryPath', 'CreateLocalDeploymentRequest');
    eventstream_rpc_utils.validateValueAsOptionalString(value.artifactsDirectoryPath, 'artifactsDirectoryPath', 'CreateLocalDeploymentRequest');
    eventstream_rpc_utils.validateValueAsOptionalString(value.failureHandlingPolicy, 'failureHandlingPolicy', 'CreateLocalDeploymentRequest');
}

export function validateResourceNotFoundError(value : model.ResourceNotFoundError) : void {
    eventstream_rpc_utils.validateValueAsOptionalString(value.message, 'message', 'ResourceNotFoundError');
    eventstream_rpc_utils.validateValueAsOptionalString(value.resourceType, 'resourceType', 'ResourceNotFoundError');
    eventstream_rpc_utils.validateValueAsOptionalString(value.resourceName, 'resourceName', 'ResourceNotFoundError');
}

export function validateUnauthorizedError(value : model.UnauthorizedError) : void {
    eventstream_rpc_utils.validateValueAsOptionalString(value.message, 'message', 'UnauthorizedError');
}

export function validatePauseComponentResponse(value : model.PauseComponentResponse) : void {
}

export function validatePauseComponentRequest(value : model.PauseComponentRequest) : void {
    eventstream_rpc_utils.validateValueAsString(value.componentName, 'componentName', 'PauseComponentRequest');
}

export function validateComponentNotFoundError(value : model.ComponentNotFoundError) : void {
    eventstream_rpc_utils.validateValueAsOptionalString(value.message, 'message', 'ComponentNotFoundError');
}

export function validateStopComponentResponse(value : model.StopComponentResponse) : void {
    eventstream_rpc_utils.validateValueAsString(value.stopStatus, 'stopStatus', 'StopComponentResponse');
    eventstream_rpc_utils.validateValueAsOptionalString(value.message, 'message', 'StopComponentResponse');
}

export function validateStopComponentRequest(value : model.StopComponentRequest) : void {
    eventstream_rpc_utils.validateValueAsString(value.componentName, 'componentName', 'StopComponentRequest');
}

export function validateListLocalDeploymentsResponse(value : model.ListLocalDeploymentsResponse) : void {
    eventstream_rpc_utils.validateValueAsOptionalArray(value.localDeployments, validateLocalDeployment, 'localDeployments', 'ListLocalDeploymentsResponse');
}

export function validateListLocalDeploymentsRequest(value : model.ListLocalDeploymentsRequest) : void {
}

export function validateSubscribeToComponentUpdatesResponse(value : model.SubscribeToComponentUpdatesResponse) : void {
}

export function validateSubscribeToComponentUpdatesRequest(value : model.SubscribeToComponentUpdatesRequest) : void {
}

export function validateListNamedShadowsForThingResponse(value : model.ListNamedShadowsForThingResponse) : void {
    eventstream_rpc_utils.validateValueAsArray(value.results, eventstream_rpc_utils.validateValueAsString, 'results', 'ListNamedShadowsForThingResponse');
    eventstream_rpc_utils.validateValueAsDate(value.timestamp, 'timestamp', 'ListNamedShadowsForThingResponse');
    eventstream_rpc_utils.validateValueAsOptionalString(value.nextToken, 'nextToken', 'ListNamedShadowsForThingResponse');
}

export function validateListNamedShadowsForThingRequest(value : model.ListNamedShadowsForThingRequest) : void {
    eventstream_rpc_utils.validateValueAsString(value.thingName, 'thingName', 'ListNamedShadowsForThingRequest');
    eventstream_rpc_utils.validateValueAsOptionalString(value.nextToken, 'nextToken', 'ListNamedShadowsForThingRequest');
    eventstream_rpc_utils.validateValueAsOptionalInteger(value.pageSize, 'pageSize', 'ListNamedShadowsForThingRequest');
}

export function validateCancelLocalDeploymentResponse(value : model.CancelLocalDeploymentResponse) : void {
    eventstream_rpc_utils.validateValueAsOptionalString(value.message, 'message', 'CancelLocalDeploymentResponse');
}

export function validateCancelLocalDeploymentRequest(value : model.CancelLocalDeploymentRequest) : void {
    eventstream_rpc_utils.validateValueAsOptionalString(value.deploymentId, 'deploymentId', 'CancelLocalDeploymentRequest');
}

export function validateUpdateStateResponse(value : model.UpdateStateResponse) : void {
}

export function validateUpdateStateRequest(value : model.UpdateStateRequest) : void {
    eventstream_rpc_utils.validateValueAsString(value.state, 'state', 'UpdateStateRequest');
}

export function validateGetSecretValueResponse(value : model.GetSecretValueResponse) : void {
    eventstream_rpc_utils.validateValueAsString(value.secretId, 'secretId', 'GetSecretValueResponse');
    eventstream_rpc_utils.validateValueAsString(value.versionId, 'versionId', 'GetSecretValueResponse');
    eventstream_rpc_utils.validateValueAsArray(value.versionStage, eventstream_rpc_utils.validateValueAsString, 'versionStage', 'GetSecretValueResponse');
    eventstream_rpc_utils.validateValueAsUnion(value.secretValue, _SecretValuePropertyValidators);
}

export function validateGetSecretValueRequest(value : model.GetSecretValueRequest) : void {
    eventstream_rpc_utils.validateValueAsString(value.secretId, 'secretId', 'GetSecretValueRequest');
    eventstream_rpc_utils.validateValueAsOptionalString(value.versionId, 'versionId', 'GetSecretValueRequest');
    eventstream_rpc_utils.validateValueAsOptionalString(value.versionStage, 'versionStage', 'GetSecretValueRequest');
    eventstream_rpc_utils.validateValueAsOptionalBoolean(value.refresh, 'refresh', 'GetSecretValueRequest');
}

export function validateGetLocalDeploymentStatusResponse(value : model.GetLocalDeploymentStatusResponse) : void {
    eventstream_rpc_utils.validateValueAsObject(value.deployment, validateLocalDeployment, 'deployment', 'GetLocalDeploymentStatusResponse');
}

export function validateGetLocalDeploymentStatusRequest(value : model.GetLocalDeploymentStatusRequest) : void {
    eventstream_rpc_utils.validateValueAsString(value.deploymentId, 'deploymentId', 'GetLocalDeploymentStatusRequest');
}

export function validateRestartComponentResponse(value : model.RestartComponentResponse) : void {
    eventstream_rpc_utils.validateValueAsString(value.restartStatus, 'restartStatus', 'RestartComponentResponse');
    eventstream_rpc_utils.validateValueAsOptionalString(value.message, 'message', 'RestartComponentResponse');
}

export function validateRestartComponentRequest(value : model.RestartComponentRequest) : void {
    eventstream_rpc_utils.validateValueAsString(value.componentName, 'componentName', 'RestartComponentRequest');
}

export function validateInvalidTokenError(value : model.InvalidTokenError) : void {
    eventstream_rpc_utils.validateValueAsOptionalString(value.message, 'message', 'InvalidTokenError');
}

export function validateValidateAuthorizationTokenResponse(value : model.ValidateAuthorizationTokenResponse) : void {
    eventstream_rpc_utils.validateValueAsBoolean(value.isValid, 'isValid', 'ValidateAuthorizationTokenResponse');
}

export function validateValidateAuthorizationTokenRequest(value : model.ValidateAuthorizationTokenRequest) : void {
    eventstream_rpc_utils.validateValueAsString(value.token, 'token', 'ValidateAuthorizationTokenRequest');
}

export function validateFailedUpdateConditionCheckError(value : model.FailedUpdateConditionCheckError) : void {
    eventstream_rpc_utils.validateValueAsOptionalString(value.message, 'message', 'FailedUpdateConditionCheckError');
}

export function validateConflictError(value : model.ConflictError) : void {
    eventstream_rpc_utils.validateValueAsOptionalString(value.message, 'message', 'ConflictError');
}

export function validateUpdateConfigurationResponse(value : model.UpdateConfigurationResponse) : void {
}

export function validateUpdateConfigurationRequest(value : model.UpdateConfigurationRequest) : void {
    eventstream_rpc_utils.validateValueAsOptionalArray(value.keyPath, eventstream_rpc_utils.validateValueAsString, 'keyPath', 'UpdateConfigurationRequest');
    eventstream_rpc_utils.validateValueAsDate(value.timestamp, 'timestamp', 'UpdateConfigurationRequest');
    eventstream_rpc_utils.validateValueAsAny(value.valueToMerge, 'valueToMerge', 'UpdateConfigurationRequest');
}

export function validateUpdateThingShadowResponse(value : model.UpdateThingShadowResponse) : void {
    eventstream_rpc_utils.validateValueAsBlob(value.payload, 'payload', 'UpdateThingShadowResponse');
}

export function validateUpdateThingShadowRequest(value : model.UpdateThingShadowRequest) : void {
    eventstream_rpc_utils.validateValueAsString(value.thingName, 'thingName', 'UpdateThingShadowRequest');
    eventstream_rpc_utils.validateValueAsOptionalString(value.shadowName, 'shadowName', 'UpdateThingShadowRequest');
    eventstream_rpc_utils.validateValueAsBlob(value.payload, 'payload', 'UpdateThingShadowRequest');
}

export function validateSendConfigurationValidityReportResponse(value : model.SendConfigurationValidityReportResponse) : void {
}

export function validateSendConfigurationValidityReportRequest(value : model.SendConfigurationValidityReportRequest) : void {
    eventstream_rpc_utils.validateValueAsObject(value.configurationValidityReport, validateConfigurationValidityReport, 'configurationValidityReport', 'SendConfigurationValidityReportRequest');
}

export function validateGetThingShadowResponse(value : model.GetThingShadowResponse) : void {
    eventstream_rpc_utils.validateValueAsBlob(value.payload, 'payload', 'GetThingShadowResponse');
}

export function validateGetThingShadowRequest(value : model.GetThingShadowRequest) : void {
    eventstream_rpc_utils.validateValueAsString(value.thingName, 'thingName', 'GetThingShadowRequest');
    eventstream_rpc_utils.validateValueAsOptionalString(value.shadowName, 'shadowName', 'GetThingShadowRequest');
}

export function validateCreateDebugPasswordResponse(value : model.CreateDebugPasswordResponse) : void {
    eventstream_rpc_utils.validateValueAsString(value.password, 'password', 'CreateDebugPasswordResponse');
    eventstream_rpc_utils.validateValueAsString(value.username, 'username', 'CreateDebugPasswordResponse');
    eventstream_rpc_utils.validateValueAsDate(value.passwordExpiration, 'passwordExpiration', 'CreateDebugPasswordResponse');
    eventstream_rpc_utils.validateValueAsOptionalString(value.certificateSHA256Hash, 'certificateSHA256Hash', 'CreateDebugPasswordResponse');
    eventstream_rpc_utils.validateValueAsOptionalString(value.certificateSHA1Hash, 'certificateSHA1Hash', 'CreateDebugPasswordResponse');
}

export function validateCreateDebugPasswordRequest(value : model.CreateDebugPasswordRequest) : void {
}

export function validateListComponentsResponse(value : model.ListComponentsResponse) : void {
    eventstream_rpc_utils.validateValueAsOptionalArray(value.components, validateComponentDetails, 'components', 'ListComponentsResponse');
}

export function validateListComponentsRequest(value : model.ListComponentsRequest) : void {
}

export function validateInvalidClientDeviceAuthTokenError(value : model.InvalidClientDeviceAuthTokenError) : void {
    eventstream_rpc_utils.validateValueAsOptionalString(value.message, 'message', 'InvalidClientDeviceAuthTokenError');
}

export function validateAuthorizeClientDeviceActionResponse(value : model.AuthorizeClientDeviceActionResponse) : void {
    eventstream_rpc_utils.validateValueAsBoolean(value.isAuthorized, 'isAuthorized', 'AuthorizeClientDeviceActionResponse');
}

export function validateAuthorizeClientDeviceActionRequest(value : model.AuthorizeClientDeviceActionRequest) : void {
    eventstream_rpc_utils.validateValueAsString(value.clientDeviceAuthToken, 'clientDeviceAuthToken', 'AuthorizeClientDeviceActionRequest');
    eventstream_rpc_utils.validateValueAsString(value.operation, 'operation', 'AuthorizeClientDeviceActionRequest');
    eventstream_rpc_utils.validateValueAsString(value.resource, 'resource', 'AuthorizeClientDeviceActionRequest');
}

export function validateVerifyClientDeviceIdentityResponse(value : model.VerifyClientDeviceIdentityResponse) : void {
    eventstream_rpc_utils.validateValueAsBoolean(value.isValidClientDevice, 'isValidClientDevice', 'VerifyClientDeviceIdentityResponse');
}

export function validateVerifyClientDeviceIdentityRequest(value : model.VerifyClientDeviceIdentityRequest) : void {
    eventstream_rpc_utils.validateValueAsUnion(value.credential, _ClientDeviceCredentialPropertyValidators);
}

export function validateSubscribeToCertificateUpdatesResponse(value : model.SubscribeToCertificateUpdatesResponse) : void {
}

export function validateSubscribeToCertificateUpdatesRequest(value : model.SubscribeToCertificateUpdatesRequest) : void {
    eventstream_rpc_utils.validateValueAsObject(value.certificateOptions, validateCertificateOptions, 'certificateOptions', 'SubscribeToCertificateUpdatesRequest');
}

export function validatePublishToTopicResponse(value : model.PublishToTopicResponse) : void {
}

export function validatePublishToTopicRequest(value : model.PublishToTopicRequest) : void {
    eventstream_rpc_utils.validateValueAsString(value.topic, 'topic', 'PublishToTopicRequest');
    eventstream_rpc_utils.validateValueAsUnion(value.publishMessage, _PublishMessagePropertyValidators);
}

export function validateInvalidCredentialError(value : model.InvalidCredentialError) : void {
    eventstream_rpc_utils.validateValueAsOptionalString(value.message, 'message', 'InvalidCredentialError');
}

export function validateGetClientDeviceAuthTokenResponse(value : model.GetClientDeviceAuthTokenResponse) : void {
    eventstream_rpc_utils.validateValueAsString(value.clientDeviceAuthToken, 'clientDeviceAuthToken', 'GetClientDeviceAuthTokenResponse');
}

export function validateGetClientDeviceAuthTokenRequest(value : model.GetClientDeviceAuthTokenRequest) : void {
    eventstream_rpc_utils.validateValueAsUnion(value.credential, _CredentialDocumentPropertyValidators);
}

export function validateGetComponentDetailsResponse(value : model.GetComponentDetailsResponse) : void {
    eventstream_rpc_utils.validateValueAsObject(value.componentDetails, validateComponentDetails, 'componentDetails', 'GetComponentDetailsResponse');
}

export function validateGetComponentDetailsRequest(value : model.GetComponentDetailsRequest) : void {
    eventstream_rpc_utils.validateValueAsString(value.componentName, 'componentName', 'GetComponentDetailsRequest');
}

export function validateSubscribeToTopicResponse(value : model.SubscribeToTopicResponse) : void {
    eventstream_rpc_utils.validateValueAsOptionalString(value.topicName, 'topicName', 'SubscribeToTopicResponse');
}

export function validateSubscribeToTopicRequest(value : model.SubscribeToTopicRequest) : void {
    eventstream_rpc_utils.validateValueAsString(value.topic, 'topic', 'SubscribeToTopicRequest');
    eventstream_rpc_utils.validateValueAsOptionalString(value.receiveMode, 'receiveMode', 'SubscribeToTopicRequest');
}

export function validateGetConfigurationResponse(value : model.GetConfigurationResponse) : void {
    eventstream_rpc_utils.validateValueAsOptionalString(value.componentName, 'componentName', 'GetConfigurationResponse');
    eventstream_rpc_utils.validateValueAsOptionalAny(value.value, 'value', 'GetConfigurationResponse');
}

export function validateGetConfigurationRequest(value : model.GetConfigurationRequest) : void {
    eventstream_rpc_utils.validateValueAsOptionalString(value.componentName, 'componentName', 'GetConfigurationRequest');
    eventstream_rpc_utils.validateValueAsArray(value.keyPath, eventstream_rpc_utils.validateValueAsString, 'keyPath', 'GetConfigurationRequest');
}

export function validateSubscribeToValidateConfigurationUpdatesResponse(value : model.SubscribeToValidateConfigurationUpdatesResponse) : void {
}

export function validateSubscribeToValidateConfigurationUpdatesRequest(value : model.SubscribeToValidateConfigurationUpdatesRequest) : void {
}

export function validateDeferComponentUpdateResponse(value : model.DeferComponentUpdateResponse) : void {
}

export function validateDeferComponentUpdateRequest(value : model.DeferComponentUpdateRequest) : void {
    eventstream_rpc_utils.validateValueAsString(value.deploymentId, 'deploymentId', 'DeferComponentUpdateRequest');
    eventstream_rpc_utils.validateValueAsOptionalString(value.message, 'message', 'DeferComponentUpdateRequest');
    eventstream_rpc_utils.validateValueAsOptionalInteger(value.recheckAfterMs, 'recheckAfterMs', 'DeferComponentUpdateRequest');
}

export function validatePutComponentMetricResponse(value : model.PutComponentMetricResponse) : void {
}

export function validatePutComponentMetricRequest(value : model.PutComponentMetricRequest) : void {
    eventstream_rpc_utils.validateValueAsArray(value.metrics, validateMetric, 'metrics', 'PutComponentMetricRequest');
}

export function validateDeleteThingShadowResponse(value : model.DeleteThingShadowResponse) : void {
    eventstream_rpc_utils.validateValueAsBlob(value.payload, 'payload', 'DeleteThingShadowResponse');
}

export function validateDeleteThingShadowRequest(value : model.DeleteThingShadowRequest) : void {
    eventstream_rpc_utils.validateValueAsString(value.thingName, 'thingName', 'DeleteThingShadowRequest');
    eventstream_rpc_utils.validateValueAsOptionalString(value.shadowName, 'shadowName', 'DeleteThingShadowRequest');
}

export function validateSubscribeToConfigurationUpdateResponse(value : model.SubscribeToConfigurationUpdateResponse) : void {
}

export function validateSubscribeToConfigurationUpdateRequest(value : model.SubscribeToConfigurationUpdateRequest) : void {
    eventstream_rpc_utils.validateValueAsOptionalString(value.componentName, 'componentName', 'SubscribeToConfigurationUpdateRequest');
    eventstream_rpc_utils.validateValueAsArray(value.keyPath, eventstream_rpc_utils.validateValueAsString, 'keyPath', 'SubscribeToConfigurationUpdateRequest');
}

export function validatePublishToIoTCoreResponse(value : model.PublishToIoTCoreResponse) : void {
}

export function validatePublishToIoTCoreRequest(value : model.PublishToIoTCoreRequest) : void {
    eventstream_rpc_utils.validateValueAsString(value.topicName, 'topicName', 'PublishToIoTCoreRequest');
    eventstream_rpc_utils.validateValueAsString(value.qos, 'qos', 'PublishToIoTCoreRequest');
    eventstream_rpc_utils.validateValueAsOptionalBlob(value.payload, 'payload', 'PublishToIoTCoreRequest');
    eventstream_rpc_utils.validateValueAsOptionalBoolean(value.retain, 'retain', 'PublishToIoTCoreRequest');
    eventstream_rpc_utils.validateValueAsOptionalArray(value.userProperties, validateUserProperty, 'userProperties', 'PublishToIoTCoreRequest');
    eventstream_rpc_utils.validateValueAsOptionalInteger(value.messageExpiryIntervalSeconds, 'messageExpiryIntervalSeconds', 'PublishToIoTCoreRequest');
    eventstream_rpc_utils.validateValueAsOptionalBlob(value.correlationData, 'correlationData', 'PublishToIoTCoreRequest');
    eventstream_rpc_utils.validateValueAsOptionalString(value.responseTopic, 'responseTopic', 'PublishToIoTCoreRequest');
    eventstream_rpc_utils.validateValueAsOptionalString(value.payloadFormat, 'payloadFormat', 'PublishToIoTCoreRequest');
    eventstream_rpc_utils.validateValueAsOptionalString(value.contentType, 'contentType', 'PublishToIoTCoreRequest');
}

export function validateResumeComponentResponse(value : model.ResumeComponentResponse) : void {
}

export function validateResumeComponentRequest(value : model.ResumeComponentRequest) : void {
    eventstream_rpc_utils.validateValueAsString(value.componentName, 'componentName', 'ResumeComponentRequest');
}

export function validateSubscribeToIoTCoreResponse(value : model.SubscribeToIoTCoreResponse) : void {
}

export function validateSubscribeToIoTCoreRequest(value : model.SubscribeToIoTCoreRequest) : void {
    eventstream_rpc_utils.validateValueAsString(value.topicName, 'topicName', 'SubscribeToIoTCoreRequest');
    eventstream_rpc_utils.validateValueAsString(value.qos, 'qos', 'SubscribeToIoTCoreRequest');
}

export function deserializeUserProperty(value : model.UserProperty) : model.UserProperty {
    return value;
}

export function deserializeSystemResourceLimits(value : model.SystemResourceLimits) : model.SystemResourceLimits {
    return value;
}

export function deserializeDeploymentStatusDetails(value : model.DeploymentStatusDetails) : model.DeploymentStatusDetails {
    return value;
}

export function deserializeMessageContext(value : model.MessageContext) : model.MessageContext {
    return value;
}

export function deserializeRunWithInfo(value : model.RunWithInfo) : model.RunWithInfo {
    eventstream_rpc_utils.setDefinedProperty(value, 'systemResourceLimits', value.systemResourceLimits, deserializeSystemResourceLimits);
    return value;
}

export function deserializeLocalDeployment(value : model.LocalDeployment) : model.LocalDeployment {
    eventstream_rpc_utils.setDefinedProperty(value, 'deploymentStatusDetails', value.deploymentStatusDetails, deserializeDeploymentStatusDetails);
    return value;
}

export function deserializePostComponentUpdateEvent(value : model.PostComponentUpdateEvent) : model.PostComponentUpdateEvent {
    return value;
}

export function deserializePreComponentUpdateEvent(value : model.PreComponentUpdateEvent) : model.PreComponentUpdateEvent {
    return value;
}

export function deserializeComponentDetails(value : model.ComponentDetails) : model.ComponentDetails {
    return value;
}

export function deserializeCertificateUpdate(value : model.CertificateUpdate) : model.CertificateUpdate {
    return value;
}

export function deserializeBinaryMessage(value : model.BinaryMessage) : model.BinaryMessage {
    eventstream_rpc_utils.setDefinedProperty(value, 'message', value.message, eventstream_rpc_utils.transformStringAsPayload);
    eventstream_rpc_utils.setDefinedProperty(value, 'context', value.context, deserializeMessageContext);
    return value;
}

export function deserializeJsonMessage(value : model.JsonMessage) : model.JsonMessage {
    eventstream_rpc_utils.setDefinedProperty(value, 'context', value.context, deserializeMessageContext);
    return value;
}

export function deserializeMQTTCredential(value : model.MQTTCredential) : model.MQTTCredential {
    return value;
}

export function deserializeValidateConfigurationUpdateEvent(value : model.ValidateConfigurationUpdateEvent) : model.ValidateConfigurationUpdateEvent {
    return value;
}

export function deserializeMetric(value : model.Metric) : model.Metric {
    return value;
}

export function deserializeConfigurationUpdateEvent(value : model.ConfigurationUpdateEvent) : model.ConfigurationUpdateEvent {
    return value;
}

export function deserializeMQTTMessage(value : model.MQTTMessage) : model.MQTTMessage {
    eventstream_rpc_utils.setDefinedProperty(value, 'payload', value.payload, eventstream_rpc_utils.transformStringAsPayload);
    eventstream_rpc_utils.setDefinedArrayProperty(value, 'userProperties', value.userProperties, deserializeUserProperty);
    eventstream_rpc_utils.setDefinedProperty(value, 'correlationData', value.correlationData, eventstream_rpc_utils.transformStringAsPayload);
    return value;
}

export function deserializeComponentUpdatePolicyEvents(value : model.ComponentUpdatePolicyEvents) : model.ComponentUpdatePolicyEvents {
    eventstream_rpc_utils.setDefinedProperty(value, 'preUpdateEvent', value.preUpdateEvent, deserializePreComponentUpdateEvent);
    eventstream_rpc_utils.setDefinedProperty(value, 'postUpdateEvent', value.postUpdateEvent, deserializePostComponentUpdateEvent);
    return value;
}

export function deserializeSecretValue(value : model.SecretValue) : model.SecretValue {
    eventstream_rpc_utils.setDefinedProperty(value, 'secretBinary', value.secretBinary, eventstream_rpc_utils.transformStringAsPayload);
    return value;
}

export function deserializeConfigurationValidityReport(value : model.ConfigurationValidityReport) : model.ConfigurationValidityReport {
    return value;
}

export function deserializeClientDeviceCredential(value : model.ClientDeviceCredential) : model.ClientDeviceCredential {
    return value;
}

export function deserializeCertificateUpdateEvent(value : model.CertificateUpdateEvent) : model.CertificateUpdateEvent {
    eventstream_rpc_utils.setDefinedProperty(value, 'certificateUpdate', value.certificateUpdate, deserializeCertificateUpdate);
    return value;
}

export function deserializeCertificateOptions(value : model.CertificateOptions) : model.CertificateOptions {
    return value;
}

export function deserializePublishMessage(value : model.PublishMessage) : model.PublishMessage {
    eventstream_rpc_utils.setDefinedProperty(value, 'jsonMessage', value.jsonMessage, deserializeJsonMessage);
    eventstream_rpc_utils.setDefinedProperty(value, 'binaryMessage', value.binaryMessage, deserializeBinaryMessage);
    return value;
}

export function deserializeCredentialDocument(value : model.CredentialDocument) : model.CredentialDocument {
    eventstream_rpc_utils.setDefinedProperty(value, 'mqttCredential', value.mqttCredential, deserializeMQTTCredential);
    return value;
}

export function deserializeSubscriptionResponseMessage(value : model.SubscriptionResponseMessage) : model.SubscriptionResponseMessage {
    eventstream_rpc_utils.setDefinedProperty(value, 'jsonMessage', value.jsonMessage, deserializeJsonMessage);
    eventstream_rpc_utils.setDefinedProperty(value, 'binaryMessage', value.binaryMessage, deserializeBinaryMessage);
    return value;
}

export function deserializeValidateConfigurationUpdateEvents(value : model.ValidateConfigurationUpdateEvents) : model.ValidateConfigurationUpdateEvents {
    eventstream_rpc_utils.setDefinedProperty(value, 'validateConfigurationUpdateEvent', value.validateConfigurationUpdateEvent, deserializeValidateConfigurationUpdateEvent);
    return value;
}

export function deserializeConfigurationUpdateEvents(value : model.ConfigurationUpdateEvents) : model.ConfigurationUpdateEvents {
    eventstream_rpc_utils.setDefinedProperty(value, 'configurationUpdateEvent', value.configurationUpdateEvent, deserializeConfigurationUpdateEvent);
    return value;
}

export function deserializeIoTCoreMessage(value : model.IoTCoreMessage) : model.IoTCoreMessage {
    eventstream_rpc_utils.setDefinedProperty(value, 'message', value.message, deserializeMQTTMessage);
    return value;
}

export function deserializeInvalidArgumentsError(value : model.InvalidArgumentsError) : model.InvalidArgumentsError {
    return value;
}

export function deserializeInvalidArtifactsDirectoryPathError(value : model.InvalidArtifactsDirectoryPathError) : model.InvalidArtifactsDirectoryPathError {
    return value;
}

export function deserializeInvalidRecipeDirectoryPathError(value : model.InvalidRecipeDirectoryPathError) : model.InvalidRecipeDirectoryPathError {
    return value;
}

export function deserializeServiceError(value : model.ServiceError) : model.ServiceError {
    return value;
}

export function deserializeCreateLocalDeploymentResponse(value : model.CreateLocalDeploymentResponse) : model.CreateLocalDeploymentResponse {
    return value;
}

export function deserializeCreateLocalDeploymentRequest(value : model.CreateLocalDeploymentRequest) : model.CreateLocalDeploymentRequest {
    eventstream_rpc_utils.setDefinedObjectPropertyAsMap(value, 'componentToRunWithInfo', value.componentToRunWithInfo, undefined, deserializeRunWithInfo);
    return value;
}

export function deserializeResourceNotFoundError(value : model.ResourceNotFoundError) : model.ResourceNotFoundError {
    return value;
}

export function deserializeUnauthorizedError(value : model.UnauthorizedError) : model.UnauthorizedError {
    return value;
}

export function deserializePauseComponentResponse(value : model.PauseComponentResponse) : model.PauseComponentResponse {
    return value;
}

export function deserializePauseComponentRequest(value : model.PauseComponentRequest) : model.PauseComponentRequest {
    return value;
}

export function deserializeComponentNotFoundError(value : model.ComponentNotFoundError) : model.ComponentNotFoundError {
    return value;
}

export function deserializeStopComponentResponse(value : model.StopComponentResponse) : model.StopComponentResponse {
    return value;
}

export function deserializeStopComponentRequest(value : model.StopComponentRequest) : model.StopComponentRequest {
    return value;
}

export function deserializeListLocalDeploymentsResponse(value : model.ListLocalDeploymentsResponse) : model.ListLocalDeploymentsResponse {
    eventstream_rpc_utils.setDefinedArrayProperty(value, 'localDeployments', value.localDeployments, deserializeLocalDeployment);
    return value;
}

export function deserializeListLocalDeploymentsRequest(value : model.ListLocalDeploymentsRequest) : model.ListLocalDeploymentsRequest {
    return value;
}

export function deserializeSubscribeToComponentUpdatesResponse(value : model.SubscribeToComponentUpdatesResponse) : model.SubscribeToComponentUpdatesResponse {
    return value;
}

export function deserializeSubscribeToComponentUpdatesRequest(value : model.SubscribeToComponentUpdatesRequest) : model.SubscribeToComponentUpdatesRequest {
    return value;
}

export function deserializeListNamedShadowsForThingResponse(value : model.ListNamedShadowsForThingResponse) : model.ListNamedShadowsForThingResponse {
    eventstream_rpc_utils.setDefinedProperty(value, 'timestamp', value.timestamp, eventstream_rpc_utils.transformNumberAsDate);
    return value;
}

export function deserializeListNamedShadowsForThingRequest(value : model.ListNamedShadowsForThingRequest) : model.ListNamedShadowsForThingRequest {
    return value;
}

export function deserializeCancelLocalDeploymentResponse(value : model.CancelLocalDeploymentResponse) : model.CancelLocalDeploymentResponse {
    return value;
}

export function deserializeCancelLocalDeploymentRequest(value : model.CancelLocalDeploymentRequest) : model.CancelLocalDeploymentRequest {
    return value;
}

export function deserializeUpdateStateResponse(value : model.UpdateStateResponse) : model.UpdateStateResponse {
    return value;
}

export function deserializeUpdateStateRequest(value : model.UpdateStateRequest) : model.UpdateStateRequest {
    return value;
}

export function deserializeGetSecretValueResponse(value : model.GetSecretValueResponse) : model.GetSecretValueResponse {
    eventstream_rpc_utils.setDefinedProperty(value, 'secretValue', value.secretValue, deserializeSecretValue);
    return value;
}

export function deserializeGetSecretValueRequest(value : model.GetSecretValueRequest) : model.GetSecretValueRequest {
    return value;
}

export function deserializeGetLocalDeploymentStatusResponse(value : model.GetLocalDeploymentStatusResponse) : model.GetLocalDeploymentStatusResponse {
    eventstream_rpc_utils.setDefinedProperty(value, 'deployment', value.deployment, deserializeLocalDeployment);
    return value;
}

export function deserializeGetLocalDeploymentStatusRequest(value : model.GetLocalDeploymentStatusRequest) : model.GetLocalDeploymentStatusRequest {
    return value;
}

export function deserializeRestartComponentResponse(value : model.RestartComponentResponse) : model.RestartComponentResponse {
    return value;
}

export function deserializeRestartComponentRequest(value : model.RestartComponentRequest) : model.RestartComponentRequest {
    return value;
}

export function deserializeInvalidTokenError(value : model.InvalidTokenError) : model.InvalidTokenError {
    return value;
}

export function deserializeValidateAuthorizationTokenResponse(value : model.ValidateAuthorizationTokenResponse) : model.ValidateAuthorizationTokenResponse {
    return value;
}

export function deserializeValidateAuthorizationTokenRequest(value : model.ValidateAuthorizationTokenRequest) : model.ValidateAuthorizationTokenRequest {
    return value;
}

export function deserializeFailedUpdateConditionCheckError(value : model.FailedUpdateConditionCheckError) : model.FailedUpdateConditionCheckError {
    return value;
}

export function deserializeConflictError(value : model.ConflictError) : model.ConflictError {
    return value;
}

export function deserializeUpdateConfigurationResponse(value : model.UpdateConfigurationResponse) : model.UpdateConfigurationResponse {
    return value;
}

export function deserializeUpdateConfigurationRequest(value : model.UpdateConfigurationRequest) : model.UpdateConfigurationRequest {
    eventstream_rpc_utils.setDefinedProperty(value, 'timestamp', value.timestamp, eventstream_rpc_utils.transformNumberAsDate);
    return value;
}

export function deserializeUpdateThingShadowResponse(value : model.UpdateThingShadowResponse) : model.UpdateThingShadowResponse {
    eventstream_rpc_utils.setDefinedProperty(value, 'payload', value.payload, eventstream_rpc_utils.transformStringAsPayload);
    return value;
}

export function deserializeUpdateThingShadowRequest(value : model.UpdateThingShadowRequest) : model.UpdateThingShadowRequest {
    eventstream_rpc_utils.setDefinedProperty(value, 'payload', value.payload, eventstream_rpc_utils.transformStringAsPayload);
    return value;
}

export function deserializeSendConfigurationValidityReportResponse(value : model.SendConfigurationValidityReportResponse) : model.SendConfigurationValidityReportResponse {
    return value;
}

export function deserializeSendConfigurationValidityReportRequest(value : model.SendConfigurationValidityReportRequest) : model.SendConfigurationValidityReportRequest {
    eventstream_rpc_utils.setDefinedProperty(value, 'configurationValidityReport', value.configurationValidityReport, deserializeConfigurationValidityReport);
    return value;
}

export function deserializeGetThingShadowResponse(value : model.GetThingShadowResponse) : model.GetThingShadowResponse {
    eventstream_rpc_utils.setDefinedProperty(value, 'payload', value.payload, eventstream_rpc_utils.transformStringAsPayload);
    return value;
}

export function deserializeGetThingShadowRequest(value : model.GetThingShadowRequest) : model.GetThingShadowRequest {
    return value;
}

export function deserializeCreateDebugPasswordResponse(value : model.CreateDebugPasswordResponse) : model.CreateDebugPasswordResponse {
    eventstream_rpc_utils.setDefinedProperty(value, 'passwordExpiration', value.passwordExpiration, eventstream_rpc_utils.transformNumberAsDate);
    return value;
}

export function deserializeCreateDebugPasswordRequest(value : model.CreateDebugPasswordRequest) : model.CreateDebugPasswordRequest {
    return value;
}

export function deserializeListComponentsResponse(value : model.ListComponentsResponse) : model.ListComponentsResponse {
    eventstream_rpc_utils.setDefinedArrayProperty(value, 'components', value.components, deserializeComponentDetails);
    return value;
}

export function deserializeListComponentsRequest(value : model.ListComponentsRequest) : model.ListComponentsRequest {
    return value;
}

export function deserializeInvalidClientDeviceAuthTokenError(value : model.InvalidClientDeviceAuthTokenError) : model.InvalidClientDeviceAuthTokenError {
    return value;
}

export function deserializeAuthorizeClientDeviceActionResponse(value : model.AuthorizeClientDeviceActionResponse) : model.AuthorizeClientDeviceActionResponse {
    return value;
}

export function deserializeAuthorizeClientDeviceActionRequest(value : model.AuthorizeClientDeviceActionRequest) : model.AuthorizeClientDeviceActionRequest {
    return value;
}

export function deserializeVerifyClientDeviceIdentityResponse(value : model.VerifyClientDeviceIdentityResponse) : model.VerifyClientDeviceIdentityResponse {
    return value;
}

export function deserializeVerifyClientDeviceIdentityRequest(value : model.VerifyClientDeviceIdentityRequest) : model.VerifyClientDeviceIdentityRequest {
    eventstream_rpc_utils.setDefinedProperty(value, 'credential', value.credential, deserializeClientDeviceCredential);
    return value;
}

export function deserializeSubscribeToCertificateUpdatesResponse(value : model.SubscribeToCertificateUpdatesResponse) : model.SubscribeToCertificateUpdatesResponse {
    return value;
}

export function deserializeSubscribeToCertificateUpdatesRequest(value : model.SubscribeToCertificateUpdatesRequest) : model.SubscribeToCertificateUpdatesRequest {
    eventstream_rpc_utils.setDefinedProperty(value, 'certificateOptions', value.certificateOptions, deserializeCertificateOptions);
    return value;
}

export function deserializePublishToTopicResponse(value : model.PublishToTopicResponse) : model.PublishToTopicResponse {
    return value;
}

export function deserializePublishToTopicRequest(value : model.PublishToTopicRequest) : model.PublishToTopicRequest {
    eventstream_rpc_utils.setDefinedProperty(value, 'publishMessage', value.publishMessage, deserializePublishMessage);
    return value;
}

export function deserializeInvalidCredentialError(value : model.InvalidCredentialError) : model.InvalidCredentialError {
    return value;
}

export function deserializeGetClientDeviceAuthTokenResponse(value : model.GetClientDeviceAuthTokenResponse) : model.GetClientDeviceAuthTokenResponse {
    return value;
}

export function deserializeGetClientDeviceAuthTokenRequest(value : model.GetClientDeviceAuthTokenRequest) : model.GetClientDeviceAuthTokenRequest {
    eventstream_rpc_utils.setDefinedProperty(value, 'credential', value.credential, deserializeCredentialDocument);
    return value;
}

export function deserializeGetComponentDetailsResponse(value : model.GetComponentDetailsResponse) : model.GetComponentDetailsResponse {
    eventstream_rpc_utils.setDefinedProperty(value, 'componentDetails', value.componentDetails, deserializeComponentDetails);
    return value;
}

export function deserializeGetComponentDetailsRequest(value : model.GetComponentDetailsRequest) : model.GetComponentDetailsRequest {
    return value;
}

export function deserializeSubscribeToTopicResponse(value : model.SubscribeToTopicResponse) : model.SubscribeToTopicResponse {
    return value;
}

export function deserializeSubscribeToTopicRequest(value : model.SubscribeToTopicRequest) : model.SubscribeToTopicRequest {
    return value;
}

export function deserializeGetConfigurationResponse(value : model.GetConfigurationResponse) : model.GetConfigurationResponse {
    return value;
}

export function deserializeGetConfigurationRequest(value : model.GetConfigurationRequest) : model.GetConfigurationRequest {
    return value;
}

export function deserializeSubscribeToValidateConfigurationUpdatesResponse(value : model.SubscribeToValidateConfigurationUpdatesResponse) : model.SubscribeToValidateConfigurationUpdatesResponse {
    return value;
}

export function deserializeSubscribeToValidateConfigurationUpdatesRequest(value : model.SubscribeToValidateConfigurationUpdatesRequest) : model.SubscribeToValidateConfigurationUpdatesRequest {
    return value;
}

export function deserializeDeferComponentUpdateResponse(value : model.DeferComponentUpdateResponse) : model.DeferComponentUpdateResponse {
    return value;
}

export function deserializeDeferComponentUpdateRequest(value : model.DeferComponentUpdateRequest) : model.DeferComponentUpdateRequest {
    return value;
}

export function deserializePutComponentMetricResponse(value : model.PutComponentMetricResponse) : model.PutComponentMetricResponse {
    return value;
}

export function deserializePutComponentMetricRequest(value : model.PutComponentMetricRequest) : model.PutComponentMetricRequest {
    eventstream_rpc_utils.setDefinedArrayProperty(value, 'metrics', value.metrics, deserializeMetric);
    return value;
}

export function deserializeDeleteThingShadowResponse(value : model.DeleteThingShadowResponse) : model.DeleteThingShadowResponse {
    eventstream_rpc_utils.setDefinedProperty(value, 'payload', value.payload, eventstream_rpc_utils.transformStringAsPayload);
    return value;
}

export function deserializeDeleteThingShadowRequest(value : model.DeleteThingShadowRequest) : model.DeleteThingShadowRequest {
    return value;
}

export function deserializeSubscribeToConfigurationUpdateResponse(value : model.SubscribeToConfigurationUpdateResponse) : model.SubscribeToConfigurationUpdateResponse {
    return value;
}

export function deserializeSubscribeToConfigurationUpdateRequest(value : model.SubscribeToConfigurationUpdateRequest) : model.SubscribeToConfigurationUpdateRequest {
    return value;
}

export function deserializePublishToIoTCoreResponse(value : model.PublishToIoTCoreResponse) : model.PublishToIoTCoreResponse {
    return value;
}

export function deserializePublishToIoTCoreRequest(value : model.PublishToIoTCoreRequest) : model.PublishToIoTCoreRequest {
    eventstream_rpc_utils.setDefinedProperty(value, 'payload', value.payload, eventstream_rpc_utils.transformStringAsPayload);
    eventstream_rpc_utils.setDefinedArrayProperty(value, 'userProperties', value.userProperties, deserializeUserProperty);
    eventstream_rpc_utils.setDefinedProperty(value, 'correlationData', value.correlationData, eventstream_rpc_utils.transformStringAsPayload);
    return value;
}

export function deserializeResumeComponentResponse(value : model.ResumeComponentResponse) : model.ResumeComponentResponse {
    return value;
}

export function deserializeResumeComponentRequest(value : model.ResumeComponentRequest) : model.ResumeComponentRequest {
    return value;
}

export function deserializeSubscribeToIoTCoreResponse(value : model.SubscribeToIoTCoreResponse) : model.SubscribeToIoTCoreResponse {
    return value;
}

export function deserializeSubscribeToIoTCoreRequest(value : model.SubscribeToIoTCoreRequest) : model.SubscribeToIoTCoreRequest {
    return value;
}

export function deserializeEventstreamMessageToConflictError(message: eventstream.Message) : model.ConflictError {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.ConflictError = JSON.parse(payload_text) as model.ConflictError;

    return deserializeConflictError(response);
}

export function deserializeEventstreamMessageToCreateDebugPasswordResponse(message: eventstream.Message) : model.CreateDebugPasswordResponse {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.CreateDebugPasswordResponse = JSON.parse(payload_text) as model.CreateDebugPasswordResponse;

    return deserializeCreateDebugPasswordResponse(response);
}

export function deserializeEventstreamMessageToSubscriptionResponseMessage(message: eventstream.Message) : model.SubscriptionResponseMessage {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.SubscriptionResponseMessage = JSON.parse(payload_text) as model.SubscriptionResponseMessage;

    return deserializeSubscriptionResponseMessage(response);
}

export function deserializeEventstreamMessageToFailedUpdateConditionCheckError(message: eventstream.Message) : model.FailedUpdateConditionCheckError {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.FailedUpdateConditionCheckError = JSON.parse(payload_text) as model.FailedUpdateConditionCheckError;

    return deserializeFailedUpdateConditionCheckError(response);
}

export function deserializeEventstreamMessageToListNamedShadowsForThingResponse(message: eventstream.Message) : model.ListNamedShadowsForThingResponse {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.ListNamedShadowsForThingResponse = JSON.parse(payload_text) as model.ListNamedShadowsForThingResponse;

    return deserializeListNamedShadowsForThingResponse(response);
}

export function deserializeEventstreamMessageToComponentNotFoundError(message: eventstream.Message) : model.ComponentNotFoundError {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.ComponentNotFoundError = JSON.parse(payload_text) as model.ComponentNotFoundError;

    return deserializeComponentNotFoundError(response);
}

export function deserializeEventstreamMessageToCertificateUpdateEvent(message: eventstream.Message) : model.CertificateUpdateEvent {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.CertificateUpdateEvent = JSON.parse(payload_text) as model.CertificateUpdateEvent;

    return deserializeCertificateUpdateEvent(response);
}

export function deserializeEventstreamMessageToGetSecretValueResponse(message: eventstream.Message) : model.GetSecretValueResponse {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.GetSecretValueResponse = JSON.parse(payload_text) as model.GetSecretValueResponse;

    return deserializeGetSecretValueResponse(response);
}

export function deserializeEventstreamMessageToSubscribeToIoTCoreResponse(message: eventstream.Message) : model.SubscribeToIoTCoreResponse {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.SubscribeToIoTCoreResponse = JSON.parse(payload_text) as model.SubscribeToIoTCoreResponse;

    return deserializeSubscribeToIoTCoreResponse(response);
}

export function deserializeEventstreamMessageToInvalidRecipeDirectoryPathError(message: eventstream.Message) : model.InvalidRecipeDirectoryPathError {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.InvalidRecipeDirectoryPathError = JSON.parse(payload_text) as model.InvalidRecipeDirectoryPathError;

    return deserializeInvalidRecipeDirectoryPathError(response);
}

export function deserializeEventstreamMessageToListLocalDeploymentsResponse(message: eventstream.Message) : model.ListLocalDeploymentsResponse {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.ListLocalDeploymentsResponse = JSON.parse(payload_text) as model.ListLocalDeploymentsResponse;

    return deserializeListLocalDeploymentsResponse(response);
}

export function deserializeEventstreamMessageToResumeComponentResponse(message: eventstream.Message) : model.ResumeComponentResponse {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.ResumeComponentResponse = JSON.parse(payload_text) as model.ResumeComponentResponse;

    return deserializeResumeComponentResponse(response);
}

export function deserializeEventstreamMessageToInvalidArgumentsError(message: eventstream.Message) : model.InvalidArgumentsError {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.InvalidArgumentsError = JSON.parse(payload_text) as model.InvalidArgumentsError;

    return deserializeInvalidArgumentsError(response);
}

export function deserializeEventstreamMessageToGetComponentDetailsResponse(message: eventstream.Message) : model.GetComponentDetailsResponse {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.GetComponentDetailsResponse = JSON.parse(payload_text) as model.GetComponentDetailsResponse;

    return deserializeGetComponentDetailsResponse(response);
}

export function deserializeEventstreamMessageToPutComponentMetricResponse(message: eventstream.Message) : model.PutComponentMetricResponse {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.PutComponentMetricResponse = JSON.parse(payload_text) as model.PutComponentMetricResponse;

    return deserializePutComponentMetricResponse(response);
}

export function deserializeEventstreamMessageToComponentUpdatePolicyEvents(message: eventstream.Message) : model.ComponentUpdatePolicyEvents {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.ComponentUpdatePolicyEvents = JSON.parse(payload_text) as model.ComponentUpdatePolicyEvents;

    return deserializeComponentUpdatePolicyEvents(response);
}

export function deserializeEventstreamMessageToIoTCoreMessage(message: eventstream.Message) : model.IoTCoreMessage {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.IoTCoreMessage = JSON.parse(payload_text) as model.IoTCoreMessage;

    return deserializeIoTCoreMessage(response);
}

export function deserializeEventstreamMessageToUpdateStateResponse(message: eventstream.Message) : model.UpdateStateResponse {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.UpdateStateResponse = JSON.parse(payload_text) as model.UpdateStateResponse;

    return deserializeUpdateStateResponse(response);
}

export function deserializeEventstreamMessageToDeferComponentUpdateResponse(message: eventstream.Message) : model.DeferComponentUpdateResponse {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.DeferComponentUpdateResponse = JSON.parse(payload_text) as model.DeferComponentUpdateResponse;

    return deserializeDeferComponentUpdateResponse(response);
}

export function deserializeEventstreamMessageToListComponentsResponse(message: eventstream.Message) : model.ListComponentsResponse {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.ListComponentsResponse = JSON.parse(payload_text) as model.ListComponentsResponse;

    return deserializeListComponentsResponse(response);
}

export function deserializeEventstreamMessageToSubscribeToComponentUpdatesResponse(message: eventstream.Message) : model.SubscribeToComponentUpdatesResponse {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.SubscribeToComponentUpdatesResponse = JSON.parse(payload_text) as model.SubscribeToComponentUpdatesResponse;

    return deserializeSubscribeToComponentUpdatesResponse(response);
}

export function deserializeEventstreamMessageToVerifyClientDeviceIdentityResponse(message: eventstream.Message) : model.VerifyClientDeviceIdentityResponse {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.VerifyClientDeviceIdentityResponse = JSON.parse(payload_text) as model.VerifyClientDeviceIdentityResponse;

    return deserializeVerifyClientDeviceIdentityResponse(response);
}

export function deserializeEventstreamMessageToResourceNotFoundError(message: eventstream.Message) : model.ResourceNotFoundError {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.ResourceNotFoundError = JSON.parse(payload_text) as model.ResourceNotFoundError;

    return deserializeResourceNotFoundError(response);
}

export function deserializeEventstreamMessageToInvalidArtifactsDirectoryPathError(message: eventstream.Message) : model.InvalidArtifactsDirectoryPathError {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.InvalidArtifactsDirectoryPathError = JSON.parse(payload_text) as model.InvalidArtifactsDirectoryPathError;

    return deserializeInvalidArtifactsDirectoryPathError(response);
}

export function deserializeEventstreamMessageToSendConfigurationValidityReportResponse(message: eventstream.Message) : model.SendConfigurationValidityReportResponse {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.SendConfigurationValidityReportResponse = JSON.parse(payload_text) as model.SendConfigurationValidityReportResponse;

    return deserializeSendConfigurationValidityReportResponse(response);
}

export function deserializeEventstreamMessageToGetThingShadowResponse(message: eventstream.Message) : model.GetThingShadowResponse {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.GetThingShadowResponse = JSON.parse(payload_text) as model.GetThingShadowResponse;

    return deserializeGetThingShadowResponse(response);
}

export function deserializeEventstreamMessageToInvalidClientDeviceAuthTokenError(message: eventstream.Message) : model.InvalidClientDeviceAuthTokenError {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.InvalidClientDeviceAuthTokenError = JSON.parse(payload_text) as model.InvalidClientDeviceAuthTokenError;

    return deserializeInvalidClientDeviceAuthTokenError(response);
}

export function deserializeEventstreamMessageToPublishToIoTCoreResponse(message: eventstream.Message) : model.PublishToIoTCoreResponse {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.PublishToIoTCoreResponse = JSON.parse(payload_text) as model.PublishToIoTCoreResponse;

    return deserializePublishToIoTCoreResponse(response);
}

export function deserializeEventstreamMessageToSubscribeToTopicResponse(message: eventstream.Message) : model.SubscribeToTopicResponse {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.SubscribeToTopicResponse = JSON.parse(payload_text) as model.SubscribeToTopicResponse;

    return deserializeSubscribeToTopicResponse(response);
}

export function deserializeEventstreamMessageToInvalidTokenError(message: eventstream.Message) : model.InvalidTokenError {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.InvalidTokenError = JSON.parse(payload_text) as model.InvalidTokenError;

    return deserializeInvalidTokenError(response);
}

export function deserializeEventstreamMessageToGetClientDeviceAuthTokenResponse(message: eventstream.Message) : model.GetClientDeviceAuthTokenResponse {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.GetClientDeviceAuthTokenResponse = JSON.parse(payload_text) as model.GetClientDeviceAuthTokenResponse;

    return deserializeGetClientDeviceAuthTokenResponse(response);
}

export function deserializeEventstreamMessageToCreateLocalDeploymentResponse(message: eventstream.Message) : model.CreateLocalDeploymentResponse {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.CreateLocalDeploymentResponse = JSON.parse(payload_text) as model.CreateLocalDeploymentResponse;

    return deserializeCreateLocalDeploymentResponse(response);
}

export function deserializeEventstreamMessageToPublishToTopicResponse(message: eventstream.Message) : model.PublishToTopicResponse {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.PublishToTopicResponse = JSON.parse(payload_text) as model.PublishToTopicResponse;

    return deserializePublishToTopicResponse(response);
}

export function deserializeEventstreamMessageToValidateAuthorizationTokenResponse(message: eventstream.Message) : model.ValidateAuthorizationTokenResponse {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.ValidateAuthorizationTokenResponse = JSON.parse(payload_text) as model.ValidateAuthorizationTokenResponse;

    return deserializeValidateAuthorizationTokenResponse(response);
}

export function deserializeEventstreamMessageToUpdateThingShadowResponse(message: eventstream.Message) : model.UpdateThingShadowResponse {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.UpdateThingShadowResponse = JSON.parse(payload_text) as model.UpdateThingShadowResponse;

    return deserializeUpdateThingShadowResponse(response);
}

export function deserializeEventstreamMessageToAuthorizeClientDeviceActionResponse(message: eventstream.Message) : model.AuthorizeClientDeviceActionResponse {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.AuthorizeClientDeviceActionResponse = JSON.parse(payload_text) as model.AuthorizeClientDeviceActionResponse;

    return deserializeAuthorizeClientDeviceActionResponse(response);
}

export function deserializeEventstreamMessageToGetConfigurationResponse(message: eventstream.Message) : model.GetConfigurationResponse {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.GetConfigurationResponse = JSON.parse(payload_text) as model.GetConfigurationResponse;

    return deserializeGetConfigurationResponse(response);
}

export function deserializeEventstreamMessageToInvalidCredentialError(message: eventstream.Message) : model.InvalidCredentialError {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.InvalidCredentialError = JSON.parse(payload_text) as model.InvalidCredentialError;

    return deserializeInvalidCredentialError(response);
}

export function deserializeEventstreamMessageToGetLocalDeploymentStatusResponse(message: eventstream.Message) : model.GetLocalDeploymentStatusResponse {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.GetLocalDeploymentStatusResponse = JSON.parse(payload_text) as model.GetLocalDeploymentStatusResponse;

    return deserializeGetLocalDeploymentStatusResponse(response);
}

export function deserializeEventstreamMessageToPauseComponentResponse(message: eventstream.Message) : model.PauseComponentResponse {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.PauseComponentResponse = JSON.parse(payload_text) as model.PauseComponentResponse;

    return deserializePauseComponentResponse(response);
}

export function deserializeEventstreamMessageToUnauthorizedError(message: eventstream.Message) : model.UnauthorizedError {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.UnauthorizedError = JSON.parse(payload_text) as model.UnauthorizedError;

    return deserializeUnauthorizedError(response);
}

export function deserializeEventstreamMessageToSubscribeToCertificateUpdatesResponse(message: eventstream.Message) : model.SubscribeToCertificateUpdatesResponse {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.SubscribeToCertificateUpdatesResponse = JSON.parse(payload_text) as model.SubscribeToCertificateUpdatesResponse;

    return deserializeSubscribeToCertificateUpdatesResponse(response);
}

export function deserializeEventstreamMessageToUpdateConfigurationResponse(message: eventstream.Message) : model.UpdateConfigurationResponse {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.UpdateConfigurationResponse = JSON.parse(payload_text) as model.UpdateConfigurationResponse;

    return deserializeUpdateConfigurationResponse(response);
}

export function deserializeEventstreamMessageToRestartComponentResponse(message: eventstream.Message) : model.RestartComponentResponse {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.RestartComponentResponse = JSON.parse(payload_text) as model.RestartComponentResponse;

    return deserializeRestartComponentResponse(response);
}

export function deserializeEventstreamMessageToDeleteThingShadowResponse(message: eventstream.Message) : model.DeleteThingShadowResponse {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.DeleteThingShadowResponse = JSON.parse(payload_text) as model.DeleteThingShadowResponse;

    return deserializeDeleteThingShadowResponse(response);
}

export function deserializeEventstreamMessageToSubscribeToConfigurationUpdateResponse(message: eventstream.Message) : model.SubscribeToConfigurationUpdateResponse {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.SubscribeToConfigurationUpdateResponse = JSON.parse(payload_text) as model.SubscribeToConfigurationUpdateResponse;

    return deserializeSubscribeToConfigurationUpdateResponse(response);
}

export function deserializeEventstreamMessageToSubscribeToValidateConfigurationUpdatesResponse(message: eventstream.Message) : model.SubscribeToValidateConfigurationUpdatesResponse {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.SubscribeToValidateConfigurationUpdatesResponse = JSON.parse(payload_text) as model.SubscribeToValidateConfigurationUpdatesResponse;

    return deserializeSubscribeToValidateConfigurationUpdatesResponse(response);
}

export function deserializeEventstreamMessageToServiceError(message: eventstream.Message) : model.ServiceError {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.ServiceError = JSON.parse(payload_text) as model.ServiceError;

    return deserializeServiceError(response);
}

export function deserializeEventstreamMessageToConfigurationUpdateEvents(message: eventstream.Message) : model.ConfigurationUpdateEvents {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.ConfigurationUpdateEvents = JSON.parse(payload_text) as model.ConfigurationUpdateEvents;

    return deserializeConfigurationUpdateEvents(response);
}

export function deserializeEventstreamMessageToStopComponentResponse(message: eventstream.Message) : model.StopComponentResponse {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.StopComponentResponse = JSON.parse(payload_text) as model.StopComponentResponse;

    return deserializeStopComponentResponse(response);
}

export function deserializeEventstreamMessageToValidateConfigurationUpdateEvents(message: eventstream.Message) : model.ValidateConfigurationUpdateEvents {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.ValidateConfigurationUpdateEvents = JSON.parse(payload_text) as model.ValidateConfigurationUpdateEvents;

    return deserializeValidateConfigurationUpdateEvents(response);
}

export function deserializeEventstreamMessageToCancelLocalDeploymentResponse(message: eventstream.Message) : model.CancelLocalDeploymentResponse {
    const payload_text : string = toUtf8(new Uint8Array(message.payload as ArrayBuffer));
    let response : model.CancelLocalDeploymentResponse = JSON.parse(payload_text) as model.CancelLocalDeploymentResponse;

    return deserializeCancelLocalDeploymentResponse(response);
}

export function serializeGetComponentDetailsRequestToEventstreamMessage(request : model.GetComponentDetailsRequest) : eventstream.Message {
    return {
        type: eventstream.MessageType.ApplicationMessage,
        payload: JSON.stringify(normalizeGetComponentDetailsRequest(request))
    };
}

export function serializePublishToTopicRequestToEventstreamMessage(request : model.PublishToTopicRequest) : eventstream.Message {
    return {
        type: eventstream.MessageType.ApplicationMessage,
        payload: JSON.stringify(normalizePublishToTopicRequest(request))
    };
}

export function serializeCreateDebugPasswordRequestToEventstreamMessage(request : model.CreateDebugPasswordRequest) : eventstream.Message {
    return {
        type: eventstream.MessageType.ApplicationMessage,
        payload: JSON.stringify(normalizeCreateDebugPasswordRequest(request))
    };
}

export function serializeUpdateThingShadowRequestToEventstreamMessage(request : model.UpdateThingShadowRequest) : eventstream.Message {
    return {
        type: eventstream.MessageType.ApplicationMessage,
        payload: JSON.stringify(normalizeUpdateThingShadowRequest(request))
    };
}

export function serializeResumeComponentRequestToEventstreamMessage(request : model.ResumeComponentRequest) : eventstream.Message {
    return {
        type: eventstream.MessageType.ApplicationMessage,
        payload: JSON.stringify(normalizeResumeComponentRequest(request))
    };
}

export function serializeStopComponentRequestToEventstreamMessage(request : model.StopComponentRequest) : eventstream.Message {
    return {
        type: eventstream.MessageType.ApplicationMessage,
        payload: JSON.stringify(normalizeStopComponentRequest(request))
    };
}

export function serializeVerifyClientDeviceIdentityRequestToEventstreamMessage(request : model.VerifyClientDeviceIdentityRequest) : eventstream.Message {
    return {
        type: eventstream.MessageType.ApplicationMessage,
        payload: JSON.stringify(normalizeVerifyClientDeviceIdentityRequest(request))
    };
}

export function serializeAuthorizeClientDeviceActionRequestToEventstreamMessage(request : model.AuthorizeClientDeviceActionRequest) : eventstream.Message {
    return {
        type: eventstream.MessageType.ApplicationMessage,
        payload: JSON.stringify(normalizeAuthorizeClientDeviceActionRequest(request))
    };
}

export function serializeListLocalDeploymentsRequestToEventstreamMessage(request : model.ListLocalDeploymentsRequest) : eventstream.Message {
    return {
        type: eventstream.MessageType.ApplicationMessage,
        payload: JSON.stringify(normalizeListLocalDeploymentsRequest(request))
    };
}

export function serializeSendConfigurationValidityReportRequestToEventstreamMessage(request : model.SendConfigurationValidityReportRequest) : eventstream.Message {
    return {
        type: eventstream.MessageType.ApplicationMessage,
        payload: JSON.stringify(normalizeSendConfigurationValidityReportRequest(request))
    };
}

export function serializeValidateAuthorizationTokenRequestToEventstreamMessage(request : model.ValidateAuthorizationTokenRequest) : eventstream.Message {
    return {
        type: eventstream.MessageType.ApplicationMessage,
        payload: JSON.stringify(normalizeValidateAuthorizationTokenRequest(request))
    };
}

export function serializeGetClientDeviceAuthTokenRequestToEventstreamMessage(request : model.GetClientDeviceAuthTokenRequest) : eventstream.Message {
    return {
        type: eventstream.MessageType.ApplicationMessage,
        payload: JSON.stringify(normalizeGetClientDeviceAuthTokenRequest(request))
    };
}

export function serializePauseComponentRequestToEventstreamMessage(request : model.PauseComponentRequest) : eventstream.Message {
    return {
        type: eventstream.MessageType.ApplicationMessage,
        payload: JSON.stringify(normalizePauseComponentRequest(request))
    };
}

export function serializePublishToIoTCoreRequestToEventstreamMessage(request : model.PublishToIoTCoreRequest) : eventstream.Message {
    return {
        type: eventstream.MessageType.ApplicationMessage,
        payload: JSON.stringify(normalizePublishToIoTCoreRequest(request))
    };
}

export function serializeDeleteThingShadowRequestToEventstreamMessage(request : model.DeleteThingShadowRequest) : eventstream.Message {
    return {
        type: eventstream.MessageType.ApplicationMessage,
        payload: JSON.stringify(normalizeDeleteThingShadowRequest(request))
    };
}

export function serializeGetConfigurationRequestToEventstreamMessage(request : model.GetConfigurationRequest) : eventstream.Message {
    return {
        type: eventstream.MessageType.ApplicationMessage,
        payload: JSON.stringify(normalizeGetConfigurationRequest(request))
    };
}

export function serializeDeferComponentUpdateRequestToEventstreamMessage(request : model.DeferComponentUpdateRequest) : eventstream.Message {
    return {
        type: eventstream.MessageType.ApplicationMessage,
        payload: JSON.stringify(normalizeDeferComponentUpdateRequest(request))
    };
}

export function serializeGetSecretValueRequestToEventstreamMessage(request : model.GetSecretValueRequest) : eventstream.Message {
    return {
        type: eventstream.MessageType.ApplicationMessage,
        payload: JSON.stringify(normalizeGetSecretValueRequest(request))
    };
}

export function serializeListComponentsRequestToEventstreamMessage(request : model.ListComponentsRequest) : eventstream.Message {
    return {
        type: eventstream.MessageType.ApplicationMessage,
        payload: JSON.stringify(normalizeListComponentsRequest(request))
    };
}

export function serializeSubscribeToTopicRequestToEventstreamMessage(request : model.SubscribeToTopicRequest) : eventstream.Message {
    return {
        type: eventstream.MessageType.ApplicationMessage,
        payload: JSON.stringify(normalizeSubscribeToTopicRequest(request))
    };
}

export function serializeCancelLocalDeploymentRequestToEventstreamMessage(request : model.CancelLocalDeploymentRequest) : eventstream.Message {
    return {
        type: eventstream.MessageType.ApplicationMessage,
        payload: JSON.stringify(normalizeCancelLocalDeploymentRequest(request))
    };
}

export function serializeSubscribeToCertificateUpdatesRequestToEventstreamMessage(request : model.SubscribeToCertificateUpdatesRequest) : eventstream.Message {
    return {
        type: eventstream.MessageType.ApplicationMessage,
        payload: JSON.stringify(normalizeSubscribeToCertificateUpdatesRequest(request))
    };
}

export function serializeSubscribeToValidateConfigurationUpdatesRequestToEventstreamMessage(request : model.SubscribeToValidateConfigurationUpdatesRequest) : eventstream.Message {
    return {
        type: eventstream.MessageType.ApplicationMessage,
        payload: JSON.stringify(normalizeSubscribeToValidateConfigurationUpdatesRequest(request))
    };
}

export function serializeCreateLocalDeploymentRequestToEventstreamMessage(request : model.CreateLocalDeploymentRequest) : eventstream.Message {
    return {
        type: eventstream.MessageType.ApplicationMessage,
        payload: JSON.stringify(normalizeCreateLocalDeploymentRequest(request))
    };
}

export function serializePutComponentMetricRequestToEventstreamMessage(request : model.PutComponentMetricRequest) : eventstream.Message {
    return {
        type: eventstream.MessageType.ApplicationMessage,
        payload: JSON.stringify(normalizePutComponentMetricRequest(request))
    };
}

export function serializeSubscribeToConfigurationUpdateRequestToEventstreamMessage(request : model.SubscribeToConfigurationUpdateRequest) : eventstream.Message {
    return {
        type: eventstream.MessageType.ApplicationMessage,
        payload: JSON.stringify(normalizeSubscribeToConfigurationUpdateRequest(request))
    };
}

export function serializeSubscribeToComponentUpdatesRequestToEventstreamMessage(request : model.SubscribeToComponentUpdatesRequest) : eventstream.Message {
    return {
        type: eventstream.MessageType.ApplicationMessage,
        payload: JSON.stringify(normalizeSubscribeToComponentUpdatesRequest(request))
    };
}

export function serializeRestartComponentRequestToEventstreamMessage(request : model.RestartComponentRequest) : eventstream.Message {
    return {
        type: eventstream.MessageType.ApplicationMessage,
        payload: JSON.stringify(normalizeRestartComponentRequest(request))
    };
}

export function serializeListNamedShadowsForThingRequestToEventstreamMessage(request : model.ListNamedShadowsForThingRequest) : eventstream.Message {
    return {
        type: eventstream.MessageType.ApplicationMessage,
        payload: JSON.stringify(normalizeListNamedShadowsForThingRequest(request))
    };
}

export function serializeUpdateConfigurationRequestToEventstreamMessage(request : model.UpdateConfigurationRequest) : eventstream.Message {
    return {
        type: eventstream.MessageType.ApplicationMessage,
        payload: JSON.stringify(normalizeUpdateConfigurationRequest(request))
    };
}

export function serializeGetLocalDeploymentStatusRequestToEventstreamMessage(request : model.GetLocalDeploymentStatusRequest) : eventstream.Message {
    return {
        type: eventstream.MessageType.ApplicationMessage,
        payload: JSON.stringify(normalizeGetLocalDeploymentStatusRequest(request))
    };
}

export function serializeGetThingShadowRequestToEventstreamMessage(request : model.GetThingShadowRequest) : eventstream.Message {
    return {
        type: eventstream.MessageType.ApplicationMessage,
        payload: JSON.stringify(normalizeGetThingShadowRequest(request))
    };
}

export function serializeSubscribeToIoTCoreRequestToEventstreamMessage(request : model.SubscribeToIoTCoreRequest) : eventstream.Message {
    return {
        type: eventstream.MessageType.ApplicationMessage,
        payload: JSON.stringify(normalizeSubscribeToIoTCoreRequest(request))
    };
}

export function serializeUpdateStateRequestToEventstreamMessage(request : model.UpdateStateRequest) : eventstream.Message {
    return {
        type: eventstream.MessageType.ApplicationMessage,
        payload: JSON.stringify(normalizeUpdateStateRequest(request))
    };
}

