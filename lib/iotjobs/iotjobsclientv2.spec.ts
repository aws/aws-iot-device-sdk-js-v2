/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */


import {iot, mqtt as mqtt311, mqtt5, mqtt_request_response} from "aws-crt";
import {v4 as uuid} from "uuid";
import {once} from "events";
import {IotJobsClientv2} from "./iotjobsclientv2";
import {
    AddThingToThingGroupCommand,
    CreateJobCommand,
    CreateThingCommand,
    CreateThingGroupCommand,
    DeleteJobCommand,
    DeleteThingCommand,
    DeleteThingGroupCommand,
    IoTClient
} from "@aws-sdk/client-iot";
import * as model from "./model";

jest.setTimeout(30000);

function hasTestEnvironment() : boolean {
    if (process.env.AWS_TEST_MQTT5_IOT_CORE_HOST === undefined) {
        return false;
    }

    if (process.env.AWS_TEST_MQTT5_IOT_CERTIFICATE_PATH === undefined) {
        return false;
    }

    if (process.env.AWS_TEST_MQTT5_IOT_KEY_PATH === undefined) {
        return false;
    }

    return true;
}

const conditional_test = (condition : boolean) => condition ? it : it.skip;

function build_protocol_client_mqtt5() : mqtt5.Mqtt5Client {
    let builder = iot.AwsIotMqtt5ClientConfigBuilder.newDirectMqttBuilderWithMtlsFromPath(
        // @ts-ignore
        process.env.AWS_TEST_MQTT5_IOT_CORE_HOST,
        process.env.AWS_TEST_MQTT5_IOT_CERTIFICATE_PATH,
        process.env.AWS_TEST_MQTT5_IOT_KEY_PATH
    );

    builder.withConnectProperties({
        clientId : `test-${uuid()}`,
        keepAliveIntervalSeconds: 1200,
    });

    return new mqtt5.Mqtt5Client(builder.build());
}

function build_protocol_client_mqtt311() : mqtt311.MqttClientConnection {
    // @ts-ignore
    let builder = iot.AwsIotMqttConnectionConfigBuilder.new_mtls_builder_from_path(process.env.AWS_TEST_MQTT5_IOT_CERTIFICATE_PATH, process.env.AWS_TEST_MQTT5_IOT_KEY_PATH);
    // @ts-ignore
    builder.with_endpoint(process.env.AWS_TEST_MQTT5_IOT_CORE_HOST);
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

interface TestResources {
    thingGroupName?: string,
    thingGroupArn?: string,
    thingName?: string,

    jobId1?: string,
}

//@ts-ignore
let jobResources : TestResources = {};

async function createJob(client : IoTClient, index: number) : Promise<string> {
    let jobId = 'jobid-' + uuid();
    let jobDocument = {
        test: `do-something${index}`
    };

    const createJobCommand = new CreateJobCommand({
        jobId: jobId,
        targets: [ jobResources.thingGroupArn ?? "" ],
        document: JSON.stringify(jobDocument),
        targetSelection: "CONTINUOUS"
    });

    await client.send(createJobCommand);

    return jobId;
}

async function deleteJob(client: IoTClient, jobId: string | undefined) : Promise<void> {
    if (jobId) {
        const command = new DeleteJobCommand({
            jobId: jobId,
            force: true
        });

        await client.send(command);
    }
}

beforeEach(async () => {
    jobResources = {}
    const client = new IoTClient({});

    let thingGroupName = 'tgn-' + uuid();

    const createThingGroupCommand = new CreateThingGroupCommand({
        thingGroupName: thingGroupName
    });

    const createThingGroupResponse = await client.send(createThingGroupCommand);
    jobResources.thingGroupName = thingGroupName;
    jobResources.thingGroupArn = createThingGroupResponse.thingGroupArn;

    let thingName = 't-' + uuid();
    const createThingCommand = new CreateThingCommand({
        thingName: thingName
    });

    await client.send(createThingCommand);
    jobResources.thingName = thingName;

    await new Promise(r => setTimeout(r, 1000));

    jobResources.jobId1 = await createJob(client, 1);

    await new Promise(r => setTimeout(r, 1000));
});

afterEach(async () => {
    const client = new IoTClient({});

    await new Promise(r => setTimeout(r, 1000));

    await deleteJob(client, jobResources.jobId1);

    await new Promise(r => setTimeout(r, 1000));

    if (jobResources.thingName) {
        const command = new DeleteThingCommand({
            thingName: jobResources.thingName
        });

        await client.send(command);

        await new Promise(r => setTimeout(r, 1000));
    }

    if (jobResources.thingGroupName) {
        const command = new DeleteThingGroupCommand({
            thingGroupName: jobResources.thingGroupName
        });

        await client.send(command);
    }

    jobResources = {}
});

async function verifyNoJobExecutions(context: JobsTestingContext) {
    let response = await context.client.getPendingJobExecutions({
        thingName: jobResources.thingName ?? ""
    });
    // @ts-ignore
    expect(response.inProgressJobs.length).toEqual(0);
    // @ts-ignore
    expect(response.queuedJobs.length).toEqual(0);
}

async function attachThingToThingGroup(client: IoTClient) {

    const addThingToThingGroupCommand = new AddThingToThingGroupCommand({
        thingName: jobResources.thingName,
        thingGroupName: jobResources.thingGroupName
    });

    await client.send(addThingToThingGroupCommand);
}

async function doProcessingTest(version: ProtocolVersion) {
    const client = new IoTClient({});

    let context = new JobsTestingContext({
        version: version
    });
    await context.open();

    // set up streaming operations for our test's thing
    let jobExecutionChangedStream = context.client.createJobExecutionsChangedStream({
       thingName: jobResources.thingName ?? ""
    });
    jobExecutionChangedStream.open();

    let nextJobExecutionChangedStream = context.client.createNextJobExecutionChangedStream({
       thingName: jobResources.thingName ?? ""
    });
    nextJobExecutionChangedStream.open();

    let initialExecutionChangedWaiter = once(jobExecutionChangedStream, 'incomingPublish');
    let initialNextJobExecutionChangedWaiter = once(nextJobExecutionChangedStream, 'incomingPublish');

    // thing is brand new, nothing should be pending
    await verifyNoJobExecutions(context);

    // as soon as we attach the thing to the thing group which has a continuous job associated with it, a
    // job execution should become queued for our thing
    await attachThingToThingGroup(client);

    let initialJobExecutionChanged : model.JobExecutionsChangedEvent = (await initialExecutionChangedWaiter)[0].message;
    // @ts-ignore
    expect(initialJobExecutionChanged.jobs['QUEUED'].length).toEqual(1);
    // @ts-ignore
    expect(initialJobExecutionChanged.jobs['QUEUED'][0].jobId).toEqual(jobResources.jobId1);

    let initialNextJobExecutionChanged : model.NextJobExecutionChangedEvent = (await initialNextJobExecutionChangedWaiter)[0].message;
    expect(initialNextJobExecutionChanged.execution?.jobId).toEqual(jobResources.jobId1);
    expect(initialNextJobExecutionChanged.execution?.status).toEqual(model.JobStatus.QUEUED);

    let finalExecutionChangedWaiter = once(jobExecutionChangedStream, 'incomingPublish');
    let finalNextJobExecutionChangedWaiter = once(nextJobExecutionChangedStream, 'incomingPublish');

    // tell the service we'll run the next job
    let startNextResponse = await context.client.startNextPendingJobExecution({
        thingName: jobResources.thingName ?? ""
    });
    expect(startNextResponse.execution?.jobId).toEqual(jobResources.jobId1);

    // pretend to do the job
    await new Promise(r => setTimeout(r, 1000));

    // job execution should be in progress
    let describeResponse = await context.client.describeJobExecution({
        thingName: jobResources.thingName ?? "",
        jobId: jobResources.jobId1 ?? "",
    });
    expect(describeResponse.execution?.jobId).toEqual(jobResources.jobId1);
    expect(describeResponse.execution?.status).toEqual(model.JobStatus.IN_PROGRESS);

    // tell the service we completed the job successfully
    await context.client.updateJobExecution({
        thingName: jobResources.thingName ?? "",
        jobId: jobResources.jobId1 ?? "",
        status: model.JobStatus.SUCCEEDED
    });

    await new Promise(r => setTimeout(r, 3000));

    let finalJobExecutionChanged : model.JobExecutionsChangedEvent = (await finalExecutionChangedWaiter)[0].message;
    expect(finalJobExecutionChanged.jobs).toEqual({});

    let finalNextJobExecutionChanged : model.NextJobExecutionChangedEvent = (await finalNextJobExecutionChangedWaiter)[0].message;
    expect(finalNextJobExecutionChanged.timestamp).toBeDefined();

    let getPendingResponse = await context.client.getPendingJobExecutions({
        thingName: jobResources.thingName ?? ""
    });
    expect(getPendingResponse.queuedJobs?.length).toEqual(0);
    expect(getPendingResponse.inProgressJobs?.length).toEqual(0);

    context.client.close();

    await context.close();
}

conditional_test(hasTestEnvironment())('jobsv2 processing mqtt5', async () => {
    await doProcessingTest(ProtocolVersion.Mqtt5);
});

conditional_test(hasTestEnvironment())('jobsv2 processing mqtt311', async () => {
    await doProcessingTest(ProtocolVersion.Mqtt311);
});