/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */

import { mqtt, iotjobs } from 'aws-iot-device-sdk-v2';
import {once} from "events";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

type Args = { [index: string]: any };
const yargs = require('yargs');

// The relative path is '../../../samples/util/cli_args' from here, but the compiled javascript file gets put one level
// deeper inside the 'dist' folder
const common_args = require('../../../../samples/util/cli_args');

yargs.command('*', false, (yargs: any) => {
    common_args.add_direct_connection_establishment_arguments(yargs);
    common_args.add_jobs_arguments(yargs);
}, main).parse();

var available_jobs : Array<string> = []
var jobs_data = {
    current_job_id: "",
    current_execution_number: 0,
    current_version_number: 0,
}

async function on_rejected_error(error?: iotjobs.IotJobsError, response?:iotjobs.model.RejectedErrorResponse) {
    if (error) {
        console.log("Request rejected error: " + error);
    }
    console.log("Request rejected: " + response?.code + ": " + response?.message);
    process.exit(-1)
}

async function on_get_pending_job_execution_accepted(error?: iotjobs.IotJobsError, response?: iotjobs.model.GetPendingJobExecutionsResponse) {
    if (error) {
        console.log("Pending Jobs Error: " + error);
        return;
    }

    if (response) {
        if (response.inProgressJobs || response.queuedJobs) {
            console.log("Pending Jobs: ")
            if (response.inProgressJobs) {
                for (var i = 0; i < response.inProgressJobs.length; i++) {
                    var job_id = response.inProgressJobs[i].jobId;
                    var job_date = response.inProgressJobs[i].lastUpdatedAt;
                    if (typeof(job_date) == 'number') {
                        // Convert Epoch time format to a Javascript Date
                        job_date = new Date(job_date * 1000);
                    }

                    if (job_id != undefined && job_date != undefined) {
                        available_jobs.push(job_id);
                        console.log("  In Progress: " + response.inProgressJobs[i].jobId + " @  " + job_date.toDateString())
                    }
                }
            }
            if (response.queuedJobs) {
                for (var i = 0; i < response.queuedJobs.length; i++) {
                    var job_id = response.queuedJobs[i].jobId;
                    var job_date = response.queuedJobs[i].lastUpdatedAt;
                    if (typeof(job_date) == 'number') {
                        // Convert Epoch time format to a Javascript Date
                        job_date = new Date(job_date * 1000);
                    }
                    if (job_id != undefined && job_date != undefined) {
                        available_jobs.push(job_id);
                        console.log("  In Progress: " + response.queuedJobs[i].jobId + " @  " + job_date.toDateString())
                    }
                }
            }
        }
        else {
            console.log("Pending Jobs: None")
        }
    }
}

async function on_describe_job_execution_accepted(error? : iotjobs.IotJobsError, response? : iotjobs.model.DescribeJobExecutionResponse) {
    if (error) {
        console.log("Describe Job Error: " + error);
        return;
    }
    if (response) {
        console.log("Describe Job: " + response.execution?.jobId + " version: " + response.execution?.versionNumber)
        if (response.execution?.jobDocument) {
            console.log(" Job document as JSON: " + JSON.stringify(response.execution.jobDocument, null, 2))
        }
        // Print a new line to flush the console
        console.log("\n");
    }
}

async function on_start_next_pending_job_execution_accepted(error? : iotjobs.IotJobsError, response? : iotjobs.model.StartNextJobExecutionResponse) {
    if (error) {
        console.log("Start Job error: " + error);
        return;
    }
    if (response) {
        console.log("Start Job: " + response.execution?.jobId);
        if (response.execution) {
            if (response.execution.jobId) {
                jobs_data.current_job_id = response.execution.jobId;
            }
            if (response.execution.executionNumber) {
                jobs_data.current_execution_number = response.execution?.executionNumber;
            }
            if (response.execution.versionNumber) {
                jobs_data.current_version_number = response.execution?.versionNumber;
            }
        }
    }
}

async function get_available_jobs(jobs_client: iotjobs.IotJobsClient, argv: Args) {
    // Subscribe to necessary topics and get pending jobs
    try {
        var pending_subscription_request : iotjobs.model.GetPendingJobExecutionsSubscriptionRequest = {
            thingName: argv.thing_name
        };
        await jobs_client.subscribeToGetPendingJobExecutionsAccepted(pending_subscription_request, mqtt.QoS.AtLeastOnce, on_get_pending_job_execution_accepted);
        await jobs_client.subscribeToGetPendingJobExecutionsRejected(pending_subscription_request, mqtt.QoS.AtLeastOnce, on_rejected_error);

        var pending_publish_request : iotjobs.model.GetPendingJobExecutionsRequest = {
            thingName: argv.thing_name
        };
        await jobs_client.publishGetPendingJobExecutions(pending_publish_request, mqtt.QoS.AtLeastOnce);

        await sleep(500);
    } catch (error) {
        console.log(error);
        process.exit(-1)
    }
}

async function describe_job(jobs_client: iotjobs.IotJobsClient, job_id: string, argv: Args) {
    var description_subscription_request : iotjobs.model.DescribeJobExecutionRequest = {
        thingName: argv.thing_name,
        jobId: job_id
    }
    await jobs_client.subscribeToDescribeJobExecutionAccepted(description_subscription_request, mqtt.QoS.AtLeastOnce, on_describe_job_execution_accepted);
    await jobs_client.subscribeToDescribeJobExecutionRejected(description_subscription_request, mqtt.QoS.AtLeastOnce, on_rejected_error);

    var description_publish_request : iotjobs.model.DescribeJobExecutionRequest = {
        thingName: argv.thing_name,
        jobId: job_id,
        includeJobDocument: true,
        executionNumber: 1
    }
    await jobs_client.publishDescribeJobExecution(description_publish_request, mqtt.QoS.AtLeastOnce);
}

async function start_next_pending_job(jobs_client: iotjobs.IotJobsClient, argv: Args) {
    var start_next_subscription_request : iotjobs.model.StartNextPendingJobExecutionSubscriptionRequest = {
        thingName: argv.thing_name
    }

    await jobs_client.subscribeToStartNextPendingJobExecutionAccepted(
            start_next_subscription_request,
            mqtt.QoS.AtLeastOnce,
            on_start_next_pending_job_execution_accepted);
    await jobs_client.subscribeToStartNextPendingJobExecutionRejected(
            start_next_subscription_request,
            mqtt.QoS.AtLeastOnce,
            on_rejected_error);

    var start_next_publish_request : iotjobs.model.StartNextPendingJobExecutionRequest = {
        thingName: argv.thing_name,
        stepTimeoutInMinutes: 15
    }
    await jobs_client.publishStartNextPendingJobExecution(start_next_publish_request, mqtt.QoS.AtLeastOnce);
}

async function update_current_job_status(jobs_client: iotjobs.IotJobsClient, status: iotjobs.model.JobStatus, argv: Args) {
    var executing_subscription_request : iotjobs.model.UpdateJobExecutionSubscriptionRequest = {
        thingName: argv.thing_name,
        jobId: jobs_data.current_job_id
    }
    await jobs_client.subscribeToUpdateJobExecutionAccepted(executing_subscription_request, mqtt.QoS.AtLeastOnce,
        (error?: iotjobs.IotJobsError, response?: iotjobs.model.UpdateJobExecutionResponse) => {
            console.log("Marked job " + jobs_data.current_job_id + " " + status);
        });
    await jobs_client.subscribeToUpdateJobExecutionRejected(executing_subscription_request, mqtt.QoS.AtLeastOnce, on_rejected_error);

    var executing_publish_request : iotjobs.model.UpdateJobExecutionRequest = {
        thingName: argv.thing_name,
        jobId: jobs_data.current_job_id,
        executionNumber: jobs_data.current_execution_number,
        status: status,
        expectedVersion: jobs_data.current_version_number++
    };
    await jobs_client.publishUpdateJobExecution(executing_publish_request, mqtt.QoS.AtLeastOnce);
}

async function main(argv: Args) {
    common_args.apply_sample_arguments(argv);

    let connection;
    let client5;
    let jobs_client;

    console.log("Connecting...");
    if (argv.mqtt_version == 5) {
        client5 = common_args.build_mqtt5_client_from_cli_args(argv);
        jobs_client = iotjobs.IotJobsClient.newFromMqtt5Client(client5);

        const connectionSuccess = once(client5, "connectionSuccess");
        client5.start();
        await connectionSuccess;
        console.log("Connected with Mqtt5 Client!");
    } else {
        connection = common_args.build_connection_from_cli_args(argv);
        jobs_client = new iotjobs.IotJobsClient(connection);

        await connection.connect()
        console.log("Connected with Mqtt3 Client!");
    }

    try {
        await get_available_jobs(jobs_client, argv);

        if (available_jobs.length == 0) {
            console.log("ERROR: No jobs queued in CI! At least one job should be queued!");
            process.exit(-1);
        }

        for (var i = 0; i < available_jobs.length; ++i) {
            await describe_job(jobs_client, available_jobs[i], argv);
        }

        for (var job_idx = 0; job_idx < available_jobs.length; ++job_idx) {
            await start_next_pending_job(jobs_client, argv);
            await update_current_job_status(jobs_client, iotjobs.model.JobStatus.IN_PROGRESS, argv);
            await sleep(1000);
            await update_current_job_status(jobs_client, iotjobs.model.JobStatus.SUCCEEDED, argv);
        }
    } catch (error) {
        console.log(error);
        process.exit(-1)
    }

    if (connection) {
        await connection.disconnect();
    } else {
        let stopped = once(client5, "stopped");
        client5.stop();
        await stopped;
        client5.close();
    }
    // Quit NodeJS
    process.exit(0);
}
