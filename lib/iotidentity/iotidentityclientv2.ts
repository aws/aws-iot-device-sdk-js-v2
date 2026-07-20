/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 *
 * This file is generated
 */

/**
 * @packageDocumentation
 * @module identity
 */

import {mqtt, mqtt5} from 'aws-crt';
import {mqtt_request_response as mqtt_rr_internal} from 'aws-crt';
import * as mqtt_request_response_utils from '../mqtt_request_response_utils';
import * as model from './model';
import * as v2utils from './v2utils';

/**
 * An AWS IoT service that assists with provisioning a device and installing unique client certificates on it
 *
 * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/provision-wo-cert.html
 *
 * @category IotIdentity
 */
export class IotIdentityClientv2 {
    private rrClient : mqtt_rr_internal.RequestResponseClient;
    private serviceModel : mqtt_request_response_utils.RequestResponseServiceModel;

    private constructor(rrClient: mqtt_rr_internal.RequestResponseClient) {
        this.rrClient = rrClient;
        this.serviceModel = v2utils.makeServiceModel();
    }

    /**
     * Creates a new service client that will use an SDK MQTT 311 client as transport.
     *
     * @param protocolClient the MQTT 311 client to use for transport
     * @param options additional service client configuration options
     *
     * @return a new service client
     *
     */
    static newFromMqtt311(protocolClient: mqtt.MqttClientConnection, options: mqtt_rr_internal.RequestResponseClientOptions) : IotIdentityClientv2 {
        let rrClient = mqtt_rr_internal.RequestResponseClient.newFromMqtt311(protocolClient, options);
        return new IotIdentityClientv2(rrClient);
    }

    /**
     * Creates a new service client that will use an SDK MQTT 5 client as transport.
     *
     * @param protocolClient the MQTT 5 client to use for transport
     * @param options additional service client configuration options
     *
     * @return a new service client
     *
     */
    static newFromMqtt5(protocolClient: mqtt5.Mqtt5Client, options: mqtt_rr_internal.RequestResponseClientOptions) : IotIdentityClientv2 {
        let rrClient = mqtt_rr_internal.RequestResponseClient.newFromMqtt5(protocolClient, options);
        return new IotIdentityClientv2(rrClient);
    }

    /**
     * Triggers cleanup of all resources associated with the service client.  Closing a client will fail
     * all incomplete requests and close all unclosed streaming operations.
     *
     * This must be called when finished with a client; otherwise, native resources will leak.
     */
    close() {
        this.rrClient.close();
    }

    /**
     * Creates a certificate from a certificate signing request (CSR). AWS IoT provides client certificates that are signed by the Amazon Root certificate authority (CA). The new certificate has a PENDING_ACTIVATION status. When you call RegisterThing to provision a thing with this certificate, the certificate status changes to ACTIVE or INACTIVE as described in the template.
     *
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/provision-wo-cert.html#fleet-provision-api
     *
     * @param request operation to perform
     *
     * @return Promise which resolves into the response to the request
     *
     * @category IotIdentity
     */
    async createCertificateFromCsr(request: model.CreateCertificateFromCsrRequest) : Promise<model.CreateCertificateFromCsrResponse> {

        let config = {
            operationName: "createCertificateFromCsr",
            serviceModel: this.serviceModel,
            client: this.rrClient,
            request: request
        };

        return await mqtt_request_response_utils.doRequestResponse<model.CreateCertificateFromCsrResponse>(config);
    }

    /**
     * Creates new keys and a certificate. AWS IoT provides client certificates that are signed by the Amazon Root certificate authority (CA). The new certificate has a PENDING_ACTIVATION status. When you call RegisterThing to provision a thing with this certificate, the certificate status changes to ACTIVE or INACTIVE as described in the template.
     *
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/provision-wo-cert.html#fleet-provision-api
     *
     * @param request operation to perform
     *
     * @return Promise which resolves into the response to the request
     *
     * @category IotIdentity
     */
    async createKeysAndCertificate(request: model.CreateKeysAndCertificateRequest) : Promise<model.CreateKeysAndCertificateResponse> {

        let config = {
            operationName: "createKeysAndCertificate",
            serviceModel: this.serviceModel,
            client: this.rrClient,
            request: request
        };

        return await mqtt_request_response_utils.doRequestResponse<model.CreateKeysAndCertificateResponse>(config);
    }

    /**
     * Provisions an AWS IoT thing using a pre-defined template.
     *
     *
     * AWS documentation: https://docs.aws.amazon.com/iot/latest/developerguide/provision-wo-cert.html#fleet-provision-api
     *
     * @param request operation to perform
     *
     * @return Promise which resolves into the response to the request
     *
     * @category IotIdentity
     */
    async registerThing(request: model.RegisterThingRequest) : Promise<model.RegisterThingResponse> {

        let config = {
            operationName: "registerThing",
            serviceModel: this.serviceModel,
            client: this.rrClient,
            request: request
        };

        return await mqtt_request_response_utils.doRequestResponse<model.RegisterThingResponse>(config);
    }

}
