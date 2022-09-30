import { mqtt, iotjobs } from 'aws-iot-device-sdk-v2';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

type Args = { [index: string]: any };
const yargs = require('yargs');

// The relative path is '../../util/cli_args' from here, but the compiled javascript file gets put one level
// deeper inside the 'dist' folder
const common_args = require('../../../util/cli_args');

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
    process.exit(1)
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

async function main(argv: Args) {
    common_args.apply_sample_arguments(argv);

    const connection = common_args.build_connection_from_cli_args(argv);
    const jobs = new iotjobs.IotJobsClient(connection);

    console.log("Connecting...");
    await connection.connect()
    console.log("Connected!");

    // Subscribe to necessary topics and get pending jobs
    try {

        var pending_subscription_request : iotjobs.model.GetPendingJobExecutionsSubscriptionRequest = {
            thingName: argv.thing_name
        };
        await jobs.subscribeToGetPendingJobExecutionsAccepted(pending_subscription_request, mqtt.QoS.AtLeastOnce, on_get_pending_job_execution_accepted);
        await jobs.subscribeToGetPendingJobExecutionsRejected(pending_subscription_request, mqtt.QoS.AtLeastOnce, on_rejected_error);

        var pending_publish_request : iotjobs.model.GetPendingJobExecutionsRequest = {
            thingName: argv.thing_name
        };
        await jobs.publishGetPendingJobExecutions(pending_publish_request, mqtt.QoS.AtLeastOnce);

        await sleep(500); // wait half a second
    } catch (error) {
        console.log(error);
        process.exit(1)
    }

    // Check if there are jobs to do
    try {
        if (available_jobs.length <= 0) {
            console.log("No jobs queued, no further work to do");

            if (argv.is_ci == true) {
                console.log("ERROR: No jobs queued in CI! At least one job should be queued!");
                process.exit(1);
            }
        }
    } catch (error) {
        console.log(error);
        process.exit(1)
    }

    // Get descriptions of each job
    try {
        for (var i = 0; i < available_jobs.length; ++i) {
            var description_subscription_request : iotjobs.model.DescribeJobExecutionRequest = {
                thingName: argv.thing_name,
                jobId: available_jobs[i]
            }
            await jobs.subscribeToDescribeJobExecutionAccepted(description_subscription_request, mqtt.QoS.AtLeastOnce, on_describe_job_execution_accepted);
            await jobs.subscribeToDescribeJobExecutionRejected(description_subscription_request, mqtt.QoS.AtLeastOnce, on_rejected_error);

            var description_publish_request : iotjobs.model.DescribeJobExecutionRequest = {
                thingName: argv.thing_name,
                jobId: available_jobs[i],
                includeJobDocument: true,
                executionNumber: 1
            }
            await jobs.publishDescribeJobExecution(description_publish_request, mqtt.QoS.AtLeastOnce);
        }
    } catch (error) {
        console.log(error);
        process.exit(-1)
    }

    // Wait a half second before starting to process each job
    await sleep(500);

    // Pretend to do each job
    try {
        if (argv.is_ci == false) {
            for (var job_idx = 0; job_idx < available_jobs.length; ++job_idx) {

                // Start the next pending job
                // ==================================================
                var start_next_subscription_request : iotjobs.model.StartNextPendingJobExecutionSubscriptionRequest = {
                    thingName: argv.thing_name
                }

                await jobs.subscribeToStartNextPendingJobExecutionAccepted(start_next_subscription_request, mqtt.QoS.AtLeastOnce, on_start_next_pending_job_execution_accepted);
                await jobs.subscribeToStartNextPendingJobExecutionRejected(start_next_subscription_request, mqtt.QoS.AtLeastOnce, on_rejected_error);

                var start_next_publish_request : iotjobs.model.StartNextPendingJobExecutionRequest = {
                    thingName: argv.thing_name,
                    stepTimeoutInMinutes: 15
                }
                await jobs.publishStartNextPendingJobExecution(start_next_publish_request, mqtt.QoS.AtLeastOnce);
                // ==================================================

                // Update the service to let it know we're executing
                // ==================================================
                var executing_subscription_request : iotjobs.model.UpdateJobExecutionSubscriptionRequest = {
                    thingName: argv.thing_name,
                    jobId: jobs_data.current_job_id
                }
                await jobs.subscribeToUpdateJobExecutionAccepted(executing_subscription_request, mqtt.QoS.AtLeastOnce,
                    (error?: iotjobs.IotJobsError, response?: iotjobs.model.UpdateJobExecutionResponse) => {
                        console.log("Marked job " + jobs_data.current_job_id + " IN_PROGRESS");
                    });
                await jobs.subscribeToUpdateJobExecutionRejected(executing_subscription_request, mqtt.QoS.AtLeastOnce, on_rejected_error);

                var executing_publish_request : iotjobs.model.UpdateJobExecutionRequest = {
                    thingName: argv.thing_name,
                    jobId: jobs_data.current_job_id,
                    executionNumber: jobs_data.current_execution_number,
                    status: iotjobs.model.JobStatus.IN_PROGRESS,
                    expectedVersion: jobs_data.current_version_number++
                };
                await jobs.publishUpdateJobExecution(executing_publish_request, mqtt.QoS.AtLeastOnce);
                // ==================================================

                // Fake doing something
                await sleep(argv.job_time * 1000);

                // Update the service to let it know we are done
                // ==================================================
                var done_subscription_request : iotjobs.model.UpdateJobExecutionSubscriptionRequest = {
                    thingName: argv.thing_name,
                    jobId: jobs_data.current_job_id
                }
                await jobs.subscribeToUpdateJobExecutionAccepted(done_subscription_request, mqtt.QoS.AtLeastOnce,
                    (error?: iotjobs.IotJobsError, response?: iotjobs.model.UpdateJobExecutionResponse) => {
                        console.log("Marked job " + jobs_data.current_job_id + " SUCCEEDED");
                    });
                await jobs.subscribeToUpdateJobExecutionRejected(done_subscription_request, mqtt.QoS.AtLeastOnce, on_rejected_error);

                var done_publish_request : iotjobs.model.UpdateJobExecutionRequest = {
                    thingName: argv.thing_name,
                    jobId: jobs_data.current_job_id,
                    executionNumber: jobs_data.current_execution_number,
                    status: iotjobs.model.JobStatus.SUCCEEDED,
                    expectedVersion: jobs_data.current_version_number++
                };
                await jobs.publishUpdateJobExecution(done_publish_request, mqtt.QoS.AtLeastOnce);
                // ==================================================
            }
        }
    } catch (error) {
        console.log(error);
        process.exit(-1)
    }

    console.log("Disconnecting...");
    await connection.disconnect();
    // force node to wait a second before quitting to finish any promises
    await sleep(1000);
    console.log("Disconnected");
    // Quit NodeJS
    process.exit(0);
}
