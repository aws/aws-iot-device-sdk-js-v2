import { iotjobs } from 'aws-iot-device-sdk-v2';
import readline from 'readline';
import {once} from "events";
import {
    CreateJobCommand,
    CreateThingCommand,
    DeleteJobCommand,
    DescribeThingCommand,
    IoTClient
} from "@aws-sdk/client-iot";

interface SampleContext {
    thingName: string,
    jobsClient: iotjobs.IotJobsClientv2,
    controlPlaneClient: IoTClient,
    thingArn?: string,
}

type Args = { [index: string]: any };
const yargs = require('yargs');

// The relative path is '../../util/cli_args' from here, but the compiled javascript file gets put one level
// deeper inside the 'dist' folder
const common_args = require('../../../util/cli_args');

yargs.command('*', false, (yargs: any) => {
    common_args.add_direct_connection_establishment_arguments(yargs);
    common_args.add_jobs_arguments(yargs);
}, main).parse();

function printHelp() {
    console.log('IoT control plane commands:');
    console.log('  create-job <jobId> <job-document-as-json> -- create a new job with the specified job id and (JSON) document');
    console.log('  delete-job <jobId> -- deletes a job with the specified job id');
    console.log('MQTT Jobs service commands:');
    console.log('  describe-job-execution <jobId> -- deletes a job with the specified job id');
    console.log('  get-pending-job-executions -- gets all incomplete job executions');
    console.log('  start-next-pending-job-execution -- moves the next pending job execution into the IN_PROGRESS state');
    console.log('  update-job-execution <jobId> <SUCCEEDED | IN_PROGRESS | FAILED | CANCELED> -- updates a job execution with a new status');
    console.log('Miscellaneous commands:')
    console.log("  quit - quits the sample application\n");
}

async function handleCommand(context: SampleContext, input: string) : Promise<boolean> {
    try {
        let words = input.split(' ');
        let command = words[0];
        console.log("");

        switch (command) {
            case "create-job":
                if (words.length < 3) {
                    throw new Error("create-job requires 2 arguments, jobId and jobDocument");
                }

                let document = words.slice(2).join(' ');
                let createJobCommand = new CreateJobCommand({
                    jobId: words[1],
                    targets: [ context.thingArn ?? "" ],
                    document: document,
                    targetSelection: "SNAPSHOT"
                });
                let createJobResponse = await context.controlPlaneClient.send(createJobCommand);
                console.log(`CreateJob Response: ${JSON.stringify(createJobResponse)}`);
                break;

            case "delete-job":
                if (words.length != 2) {
                    throw new Error("delete-job requires 1 argument, the jobId");
                }

                let deleteJobCommand = new DeleteJobCommand({
                    jobId: words[1],
                });
                let deleteJobResponse = await context.controlPlaneClient.send(deleteJobCommand);
                console.log(`DeleteJob Response: ${JSON.stringify(deleteJobResponse)}`);
                break;

            case "describe-job-execution":
                if (words.length != 2) {
                    throw new Error("describe-job-execution requires 1 argument, the jobId");
                }

                let describeJobExecutionResponse = await context.jobsClient.describeJobExecution({
                    thingName: context.thingName,
                    jobId: words[1]
                });
                console.log(`DescribeJobExecution Response: ${JSON.stringify(describeJobExecutionResponse)}`);
                break;

            case "get-pending-job-executions":
                let getPendingJobExecutionsResponse = await context.jobsClient.getPendingJobExecutions({
                    thingName: context.thingName
                });
                console.log(`GetPendingJobExecutions Response: ${JSON.stringify(getPendingJobExecutionsResponse)}`);
                break;

            case "start-next-pending-job-execution":
                let startNextPendingJobExecutionResponse = await context.jobsClient.startNextPendingJobExecution({
                    thingName: context.thingName
                });
                console.log(`StartNextPendingJobExecution Response: ${JSON.stringify(startNextPendingJobExecutionResponse)}`);
                break;

            case "update-job-execution":
                if (words.length != 3) {
                    throw new Error("update-job-execution requires 2 arguments, jobId and status (??)");
                }

                let updateJobExecutionResponse = await context.jobsClient.updateJobExecution({
                    thingName: context.thingName,
                    jobId: words[1],
                    // @ts-ignore
                    status: words[2]
                });
                console.log(`UpdateJobExecution Response: ${JSON.stringify(updateJobExecutionResponse)}`);
                break;

            case "quit":
                return true;

            case "help":
                printHelp();
                break;

            default:
                console.log(`Unknown command: ${command}\n`);
                printHelp();
                break;
        }
    } catch (error) {
        console.log(`Error processing command: ${JSON.stringify(error)}\n`);
    }

    return false;
}

async function createThingIfNeeded(context: SampleContext) {
    try {
        let describeThingCommand = new DescribeThingCommand({
            thingName: context.thingName
        });

        let describeThingResponse = await context.controlPlaneClient.send(describeThingCommand);
        context.thingArn = describeThingResponse.thingArn;
        return;
    } catch (error) {}

    console.log(`Thing "${context.thingName}" not found, creating...`);

    let createThingCommand = new CreateThingCommand({
        thingName: context.thingName
    });
    let createThingResponse = await context.controlPlaneClient.send(createThingCommand);
    context.thingArn = createThingResponse.thingArn;

    console.log(`Thing "${context.thingName}" successfully created`);
}

async function main(argv: Args) {
    common_args.apply_sample_arguments(argv);

    let controlPlaneClient = new IoTClient({});
    let protocolClient = common_args.build_mqtt5_client_from_cli_args(argv);
    let jobsClient = iotjobs.IotJobsClientv2.newFromMqtt5(protocolClient, {
        maxRequestResponseSubscriptions: 5,
        maxStreamingSubscriptions: 2,
        operationTimeoutInSeconds: 60
    });

    let context: SampleContext = {
        thingName: argv.thing_name,
        jobsClient: jobsClient,
        controlPlaneClient: controlPlaneClient
    };

    await createThingIfNeeded(context);

    console.log("Connecting...");

    const connectionSuccess = once(protocolClient, "connectionSuccess");
    protocolClient.start();
    await connectionSuccess;
    console.log("Connected!");


    // invoked when
    let jobExecutionsChangedStream = jobsClient.createJobExecutionsChangedStream({
        thingName: context.thingName
    });
    jobExecutionsChangedStream.on('incomingPublish', (event) => {
        console.log(`Received JobExecutionsChanged event: ${JSON.stringify(event.message)}\n`)
    })
    jobExecutionsChangedStream.open();

    // invoked when
    let nextJobExecutionChangedStream = jobsClient.createNextJobExecutionChangedStream({
        thingName: context.thingName
    });
    nextJobExecutionChangedStream.on('incomingPublish', (event) => {
        console.log(`Received NextJobExecutionChanged event: ${JSON.stringify(event.message)}\n`)
    })
    nextJobExecutionChangedStream.open();

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    try {
        let done = false;
        while (!done) {
            const userInput : string = await new Promise((resolve) => rl.question("Enter command:\n", resolve));
            done = await handleCommand(context, userInput.trimStart());
        }
    } catch (error) {
        console.log(error);
    }

    jobsClient.close();
    console.log("Disconnecting..");

    let stopped = once(protocolClient, "stopped");
    protocolClient.stop();
    await stopped;
    protocolClient.close();

    console.log("Stopped");
    // Quit NodeJS
    process.exit(0);
}
