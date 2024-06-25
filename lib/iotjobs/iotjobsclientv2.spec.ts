/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */


import {iot, mqtt5, mqtt as mqtt311, mqtt_request_response} from "aws-crt";
import {v4 as uuid} from "uuid";
import {once} from "events";
import {IotJobsClientv2} from "./iotjobsclientv2";
//import * as model from "./model";

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

class JobsTestingContext {

    mqtt311Client?: mqtt311.MqttClientConnection;
    mqtt5Client?: mqtt5.Mqtt5Client;

    client: IotJobsClientv2;

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

            this.client = IotJobsClientv2.newFromMqtt5(this.mqtt5Client, rrOptions);
        } else {
            this.mqtt311Client = build_protocol_client_mqtt311();

            let rrOptions : mqtt_request_response.RequestResponseClientOptions = {
                maxRequestResponseSubscriptions : 6,
                maxStreamingSubscriptions : 2,
                operationTimeoutInSeconds : options.timeoutSeconds ?? 60,
            }

            this.client = IotJobsClientv2.newFromMqtt311(this.mqtt311Client, rrOptions);
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
    let context = new JobsTestingContext({
        version: version
    });
    await context.open();

    await context.close();
}

conditional_test(hasTestEnvironment())('jobsv2 - create destroy mqtt5', async () => {
    await doCreateDestroyTest(ProtocolVersion.Mqtt5);
});

conditional_test(hasTestEnvironment())('jobsv2 - create destroy mqtt311', async () => {
    await doCreateDestroyTest(ProtocolVersion.Mqtt311);
});