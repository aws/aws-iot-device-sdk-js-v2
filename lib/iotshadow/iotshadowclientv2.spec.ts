/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */


import {iot, mqtt5, mqtt as mqtt311, mqtt_request_response} from "aws-crt";
import {v4 as uuid} from "uuid";
import {StreamingOperation} from "../mqtt_request_response";
import {once} from "events";
import {IotShadowClientv2} from "./iotshadowclientv2";
import * as model from "./model";

jest.setTimeout(1000000);

function hasTestEnvironment() : boolean {
    if (process.env.AWS_TEST_MQTT5_IOT_CORE_HOST === undefined) {
        return false;
    }

    if (process.env.AWS_TEST_MQTT5_IOT_CORE_RSA_CERT === undefined) {
        return false;
    }

    if (process.env.AWS_TEST_MQTT5_IOT_CORE_RSA_KEY === undefined) {
        return false;
    }

    return true;
}

const conditional_test = (condition : boolean) => condition ? it : it.skip;

function build_protocol_client_mqtt5() : mqtt5.Mqtt5Client {
    let builder = iot.AwsIotMqtt5ClientConfigBuilder.newDirectMqttBuilderWithMtlsFromPath(
        // @ts-ignore
        process.env.AWS_TEST_MQTT5_IOT_CORE_HOST,
        process.env.AWS_TEST_MQTT5_IOT_CORE_RSA_CERT,
        process.env.AWS_TEST_MQTT5_IOT_CORE_RSA_KEY
    );

    builder.withConnectProperties({
        clientId : uuid(),
        keepAliveIntervalSeconds: 1200,
    });

    return new mqtt5.Mqtt5Client(builder.build());
}

function build_protocol_client_mqtt311() : mqtt311.MqttClientConnection {
    // @ts-ignore
    let builder = iot.AwsIotMqttConnectionConfigBuilder.new_mtls_builder_from_path(process.env.AWS_TEST_MQTT5_IOT_CORE_RSA_CERT, process.env.AWS_TEST_MQTT5_IOT_CORE_RSA_KEY);
    // @ts-ignore
    builder.with_endpoint(process.env.AWS_TEST_MQTT5_IOT_CORE_HOST);
    builder.with_client_id(uuid());

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

class ShadowTestingContext {

    mqtt311Client?: mqtt311.MqttClientConnection;
    mqtt5Client?: mqtt5.Mqtt5Client;

    client: IotShadowClientv2;

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

            this.client = IotShadowClientv2.newFromMqtt5(this.mqtt5Client, rrOptions);
        } else {
            this.mqtt311Client = build_protocol_client_mqtt311();

            let rrOptions : mqtt_request_response.RequestResponseClientOptions = {
                maxRequestResponseSubscriptions : 6,
                maxStreamingSubscriptions : 2,
                operationTimeoutInSeconds : options.timeoutSeconds ?? 60,
            }

            this.client = IotShadowClientv2.newFromMqtt311(this.mqtt311Client, rrOptions);
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
    let context = new ShadowTestingContext({
        version: version
    });
    await context.open();

    await context.close();
}

conditional_test(hasTestEnvironment())('shadowv2 - create destroy mqtt5', async () => {
    await doCreateDestroyTest(ProtocolVersion.Mqtt5);
});

conditional_test(hasTestEnvironment())('shadowv2 - create destroy mqtt311', async () => {
    await doCreateDestroyTest(ProtocolVersion.Mqtt311);
});

async function getNonexistentShadow(client: IotShadowClientv2, thingName: string, shadowName: string) {
    let request : model.GetNamedShadowRequest = {
        thingName: thingName,
        shadowName: shadowName,
    };

    try {
        await client.getNamedShadow(request);
        expect(false);
    } catch (err: any) {
        expect(err.message).toContain("failed with modeled service error");
        expect(err.modeledError).toBeDefined();
        expect(err.modeledError.code).toEqual(404);
        expect(err.modeledError.message).toContain("No shadow exists with name");
    }
}

async function doGetNonexistentShadowTest(version: ProtocolVersion) {
    let context = new ShadowTestingContext({
        version: version
    });
    await context.open();

    await getNonexistentShadow(context.client, uuid(), uuid());

    await context.close();
}

conditional_test(hasTestEnvironment())('shadowv2 - get non-existent shadow mqtt5', async () => {
    await doGetNonexistentShadowTest(ProtocolVersion.Mqtt5);
});

conditional_test(hasTestEnvironment())('shadowv2 - get non-existent shadow mqtt311', async () => {
    await doGetNonexistentShadowTest(ProtocolVersion.Mqtt311);
});

async function createShadow(client: IotShadowClientv2, thingName: string, shadowName: string, document: any) {
    let request : model.UpdateNamedShadowRequest = {
        thingName: thingName,
        shadowName: shadowName,
        state: {
            desired: document,
            reported: document,
        }
    };

    try {
        let response = await client.updateNamedShadow(request);
        expect(response.state).toBeDefined();
        // @ts-ignore
        expect(response.state.desired).toBeDefined();
        // @ts-ignore
        expect(response.state.desired).toEqual(document);
        // @ts-ignore
        expect(response.state.reported).toBeDefined();
        // @ts-ignore
        expect(response.state.reported).toEqual(document);
    } catch (err) {
        throw err;
    }
}

async function getShadow(client: IotShadowClientv2, thingName: string, shadowName: string, expectedDocument: any) {
    let request : model.GetNamedShadowRequest = {
        thingName: thingName,
        shadowName: shadowName,
    };

    let response = await client.getNamedShadow(request);
    expect(response.state).toBeDefined();
    // @ts-ignore
    expect(response.state.desired).toBeDefined();
    // @ts-ignore
    expect(response.state.desired).toEqual(expectedDocument);
    // @ts-ignore
    expect(response.state.reported).toBeDefined();
    // @ts-ignore
    expect(response.state.reported).toEqual(expectedDocument);
}

async function deleteShadow(client: IotShadowClientv2, thingName: string, shadowName: string, expectedVersion: number) {
    let request : model.DeleteNamedShadowRequest = {
        thingName: thingName,
        shadowName: shadowName,
    };

    let response = await client.deleteNamedShadow(request);
    expect(response.version).toEqual(expectedVersion);
}

async function doCreateDeleteShadowTest(version: ProtocolVersion) {
    let context = new ShadowTestingContext({
        version: version
    });
    await context.open();

    let thingName = uuid();
    let shadowName = uuid();
    let document = {
        color: "green",
        on: true,
    };

    // shouldn't exist yet
    await getNonexistentShadow(context.client, thingName, shadowName);

    try {
        await createShadow(context.client, thingName, shadowName, document);

        await getShadow(context.client, thingName, shadowName, document);
    } finally {
        await deleteShadow(context.client, thingName, shadowName, 1);
    }

    await getNonexistentShadow(context.client, thingName, shadowName);

    await context.close();
}

conditional_test(hasTestEnvironment())('shadowv2 - create-destroy shadow mqtt5', async () => {
    await doCreateDeleteShadowTest(ProtocolVersion.Mqtt5);
});

conditional_test(hasTestEnvironment())('shadowv2 - create-destroy shadow mqtt311', async () => {
    await doCreateDeleteShadowTest(ProtocolVersion.Mqtt311);
});

async function updateShadowDesired(client: IotShadowClientv2, thingName: string, shadowName: string, document: any) {
    let request : model.UpdateNamedShadowRequest = {
        thingName: thingName,
        shadowName: shadowName,
        state: {
            desired: document,
        },
    };

    try {
        let response = await client.updateNamedShadow(request);
        expect(response.state).toBeDefined();
        // @ts-ignore
        expect(response.state.desired).toBeDefined();
        // @ts-ignore
        expect(response.state.desired).toEqual(document);
    } catch (err) {
        throw err;
    }
}

async function updateShadowReported(client: IotShadowClientv2, thingName: string, shadowName: string, document: any) {
    let request : model.UpdateNamedShadowRequest = {
        thingName: thingName,
        shadowName: shadowName,
        state: {
            reported: document,
        },
    };

    try {
        let response = await client.updateNamedShadow(request);
        expect(response.state).toBeDefined();
        // @ts-ignore
        expect(response.state.reported).toBeDefined();
        // @ts-ignore
        expect(response.state.reported).toEqual(document);
    } catch (err) {
        throw err;
    }
}

async function doUpdateShadowTest(version: ProtocolVersion) {
    let context = new ShadowTestingContext({
        version: version
    });
    await context.open();

    let thingName = uuid();
    let shadowName = uuid();
    let document = {
        color: "green",
        on: true,
    };

    let deltaEventStream = context.client.createNamedShadowDeltaUpdatedStream({
        thingName: thingName,
        shadowName: shadowName,
    });
    let deltaStatusUpdate = once(deltaEventStream, StreamingOperation.SUBSCRIPTION_STATUS);
    deltaEventStream.open();
    let deltaStatus = (await deltaStatusUpdate)[0];
    expect(deltaStatus.type).toEqual(mqtt_request_response.SubscriptionStatusEventType.SubscriptionEstablished);

    let stateStream = context.client.createNamedShadowDeltaUpdatedStream({
        thingName: thingName,
        shadowName: shadowName,
    });
    let stateStatusUpdate = once(stateStream, StreamingOperation.SUBSCRIPTION_STATUS);
    stateStream.open();
    let stateStatus = (await stateStatusUpdate)[0];
    expect(stateStatus.type).toEqual(mqtt_request_response.SubscriptionStatusEventType.SubscriptionEstablished);

    // shouldn't exist yet
    await getNonexistentShadow(context.client, thingName, shadowName);

    try {
        await createShadow(context.client, thingName, shadowName, document);

        await getShadow(context.client, thingName, shadowName, document);

        let updateDocument = {
            color: "blue",
            on: false,
        };

        let deltaEvent = once(deltaEventStream, StreamingOperation.INCOMING_PUBLISH);
        let stateEvent = once(stateStream, StreamingOperation.INCOMING_PUBLISH);

        await updateShadowDesired(context.client, thingName, shadowName, updateDocument);

        let deltaResult = (await deltaEvent)[0];
        expect(deltaResult).toBeDefined();
        expect(deltaResult.message.state).toEqual(updateDocument);

        let stateResult = (await stateEvent)[0];
        expect(stateResult).toBeDefined();
        expect(stateResult.message.state).toEqual(updateDocument);

        await updateShadowReported(context.client, thingName, shadowName, updateDocument);

        await getShadow(context.client, thingName, shadowName, updateDocument);

    } finally {
        deltaEventStream.close();
        stateStream.close();

        await deleteShadow(context.client, thingName, shadowName, 3);
    }

    await getNonexistentShadow(context.client, thingName, shadowName);

    await context.close();
}

conditional_test(hasTestEnvironment())('shadowv2 - update shadow mqtt5', async () => {
    await doUpdateShadowTest(ProtocolVersion.Mqtt5);
});

conditional_test(hasTestEnvironment())('shadowv2 - update shadow mqtt311', async () => {
    await doUpdateShadowTest(ProtocolVersion.Mqtt311);
});