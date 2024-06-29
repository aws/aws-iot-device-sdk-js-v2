/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */


import {iot, mqtt as mqtt311, mqtt5, mqtt_request_response} from "aws-crt";
import {once} from "events";
import {v4 as uuid} from "uuid";
import {
    DeleteCertificateCommand,
    DeleteThingCommand,
    IoTClient
} from "@aws-sdk/client-iot";

import {IotIdentityClientv2} from "./iotidentityclientv2";

jest.setTimeout(1000000);

function hasTestEnvironment() : boolean {
    if (process.env.AWS_TEST_IOT_CORE_PROVISIONING_HOST === undefined) {
        return false;
    }

    if (process.env.AWS_TEST_IOT_CORE_PROVISIONING_CERTIFICATE_PATH === undefined) {
        return false;
    }

    if (process.env.AWS_TEST_IOT_CORE_PROVISIONING_KEY_PATH === undefined) {
        return false;
    }

    if (process.env.AWS_TEST_IOT_CORE_PROVISIONING_TEMPLATE_NAME === undefined) {
        return false;
    }

    return true;
}

const conditional_test = (condition : boolean) => condition ? it : it.skip;

function build_protocol_client_mqtt5() : mqtt5.Mqtt5Client {
    let builder = iot.AwsIotMqtt5ClientConfigBuilder.newDirectMqttBuilderWithMtlsFromPath(
        // @ts-ignore
        process.env.AWS_TEST_IOT_CORE_PROVISIONING_HOST,
        process.env.AWS_TEST_IOT_CORE_PROVISIONING_CERTIFICATE_PATH,
        process.env.AWS_TEST_IOT_CORE_PROVISIONING_KEY_PATH
    );

    builder.withConnectProperties({
        clientId : `test-${uuid()}`,
        keepAliveIntervalSeconds: 1200,
    });

    return new mqtt5.Mqtt5Client(builder.build());
}

function build_protocol_client_mqtt311() : mqtt311.MqttClientConnection {
    // @ts-ignore
    let builder = iot.AwsIotMqttConnectionConfigBuilder.new_mtls_builder_from_path(process.env.AWS_TEST_IOT_CORE_PROVISIONING_CERTIFICATE_PATH, process.env.AWS_TEST_IOT_CORE_PROVISIONING_KEY_PATH);
    // @ts-ignore
    builder.with_endpoint(process.env.AWS_TEST_IOT_CORE_PROVISIONING_HOST);
    builder.with_client_id(`test-${uuid()}`);

    let client = new mqtt311.MqttClient();
    return client.new_connection(builder.build());
}

enum ProtocolVersion {
    Mqtt311,
    Mqtt5
}

interface TestingOptions {
    version: ProtocolVersion,
    timeoutSeconds?: number,
}

class IdentityTestingContext {

    mqtt311Client?: mqtt311.MqttClientConnection;
    mqtt5Client?: mqtt5.Mqtt5Client;

    client: IotIdentityClientv2;

    private protocolStarted : boolean = false;

    async startProtocolClient() {
        if (!this.protocolStarted) {
            this.protocolStarted = true;
            if (this.mqtt5Client) {
                let connected = once(this.mqtt5Client, mqtt5.Mqtt5Client.CONNECTION_SUCCESS);
                this.mqtt5Client.start();

                await connected;
            }

            if (this.mqtt311Client) {
                await this.mqtt311Client.connect();
            }
        }
    }

    async stopProtocolClient() {
        if (this.protocolStarted) {
            this.protocolStarted = false;
            if (this.mqtt5Client) {
                let stopped = once(this.mqtt5Client, mqtt5.Mqtt5Client.STOPPED);
                this.mqtt5Client.stop();
                await stopped;

                this.mqtt5Client.close();
            }

            if (this.mqtt311Client) {
                await this.mqtt311Client.disconnect();
            }
        }
    }

    constructor(options: TestingOptions) {
        if (options.version == ProtocolVersion.Mqtt5) {
            this.mqtt5Client = build_protocol_client_mqtt5();

            let rrOptions : mqtt_request_response.RequestResponseClientOptions = {
                maxRequestResponseSubscriptions : 6,
                maxStreamingSubscriptions : 2,
                operationTimeoutInSeconds : options.timeoutSeconds ?? 60,
            }

            this.client = IotIdentityClientv2.newFromMqtt5(this.mqtt5Client, rrOptions);
        } else {
            this.mqtt311Client = build_protocol_client_mqtt311();

            let rrOptions : mqtt_request_response.RequestResponseClientOptions = {
                maxRequestResponseSubscriptions : 6,
                maxStreamingSubscriptions : 2,
                operationTimeoutInSeconds : options.timeoutSeconds ?? 60,
            }

            this.client = IotIdentityClientv2.newFromMqtt311(this.mqtt311Client, rrOptions);
        }
    }

    async open() {
        await this.startProtocolClient();
    }

    async close() {
        this.client.close();
        await this.stopProtocolClient();
    }
}

async function doCreateDestroyTest(version: ProtocolVersion) {
    let context = new IdentityTestingContext({
        version: version
    });
    await context.open();

    await context.close();
}

conditional_test(hasTestEnvironment())('identityv2 - create destroy mqtt5', async () => {
    await doCreateDestroyTest(ProtocolVersion.Mqtt5);
});

conditional_test(hasTestEnvironment())('identityv2 - create destroy mqtt311', async () => {
    await doCreateDestroyTest(ProtocolVersion.Mqtt311);
});

interface TestResources {
    certificateId?: string,
    thingName?: string
}

//@ts-ignore
let identityResources : TestResources = {};

beforeEach(async () => {
    identityResources = {}
});

afterEach(async () => {
    const client = new IoTClient({});

    if (identityResources.certificateId) {
        const command = new DeleteCertificateCommand({
            certificateId: identityResources.certificateId,
        });

        await client.send(command);
    }
    
    if (identityResources.thingName) {
        const command = new DeleteThingCommand({
            thingName: identityResources.thingName
        });

        await client.send(command);
    }

    identityResources = {}
});

import {io} from "aws-crt";

async function doProvisioningTest(version: ProtocolVersion) {

    io.enable_logging(io.LogLevel.TRACE);

    let context = new IdentityTestingContext({
        version: version
    });
    await context.open();

    let createKeysResponse = await context.client.createKeysAndCertificate({});
    identityResources.certificateId = createKeysResponse.certificateId;
    expect(createKeysResponse.certificateId).toBeDefined();
    expect(createKeysResponse.certificatePem).toBeDefined();
    expect(createKeysResponse.privateKey).toBeDefined();
    expect(createKeysResponse.certificateOwnershipToken).toBeDefined();

    const params: { [key: string]: string } = JSON.parse(`{"SerialNumber":"${uuid()}"}`);

    let registerThingResponse = await context.client.registerThing({
        // @ts-ignore
        templateName: process.env.AWS_TEST_IOT_CORE_PROVISIONING_TEMPLATE_NAME,
        certificateOwnershipToken: createKeysResponse.certificateOwnershipToken,
        parameters: params
    });
    identityResources.thingName = registerThingResponse.thingName;
    expect(registerThingResponse.thingName).toBeDefined();

    context.client.close();

    await context.close();
}

test('identityv2 provisioning mqtt5', async () => {
    await doProvisioningTest(ProtocolVersion.Mqtt5);
});

/*
conditional_test(hasTestEnvironment())('identityv2 provisioning mqtt311', async () => {
    await doProvisioningTest(ProtocolVersion.Mqtt311);
});*/