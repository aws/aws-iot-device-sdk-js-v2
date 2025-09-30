# Node: Jobs

[**Return to main sample list**](../../README.md)

This is an interactive sample that supports a set of commands that allow you to interact with the AWS IoT [Jobs](https://docs.aws.amazon.com/iot/latest/developerguide/iot-jobs.html) Service.  The sample includes both control plane
commands (that require the AWS SDK for JS v3 and use HTTP as transport) and data plane commands (that use the v2 device SDK and use MQTT as transport).  In a real use case,
control plane commands would be issued by applications under control of the customer, while the data plane operations would be issued by software running on the
IoT device itself.  

Using the Jobs service and this sample requires an understanding of two closely-related but different service terms:
* **Job** - metadata describing a task that the user would like one or more devices to run
* **Job Execution** - metadata describing the state of a single device's attempt to execute a job

In particular, you could have many IoT devices (things) that belong to a thing group.  You could create a **Job** that targets the thing group.  Each device/thing would
manage its own individual **Job Execution** that corresponded to its attempt to fulfill the overall job request.  In the section that follows, notice that all of the data-plane
commands use `job-execution` while all of the control plane commands use `job`.

### Commands

Once connected, the sample supports the following commands:

Control Plane
* `create-job <jobId> <jobDocument-as-JSON>` - creates a new job resource that targets the thing/device the sample has been configured with.  It is up to the device application to interpret the Job document appropriately and carry out the execution it describes.
* `delete-job <jobId>` - delete a job.  A job must be in a terminal state (all executions terminal) for this command to complete successfully.

Data Plane
* `get-pending-job-executions` - gets the state of all incomplete job executions for this thing/device.
* `start-next-pending-job-execution` - if one or more pending job executions exist for this thing/device, attempts to transition the next one from QUEUED to IN_PROGRESS.  Returns information about the newly-in-progress job execution, if it exists.
* `describe-job-execution <jobId>` - gets the current state of this thing's execution of a particular job.
* `update-job-execution <jobId> <SUCCEEDED | IN_PROGRESS | FAILED | CANCELED>` - updates the status field of this thing's execution of a particular job.  SUCCEEDED, FAILED, and CANCELED are all terminal states.

Miscellaneous
* `help` - prints the set of supported commands
* `quit` - quits the sample application

## Prerequisites

Your IoT Core Thing's [Policy](https://docs.aws.amazon.com/iot/latest/developerguide/iot-policies.html) must provide privileges for this sample to connect, subscribe, publish, and receive. Below is a sample policy that can be used on your IoT Core Thing that will allow this sample to run as intended.

<details>
<summary>Sample Policy</summary>
<pre>
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "iot:Publish",
      "Resource": [
        "arn:aws:iot:<b>region</b>:<b>account</b>:topic/$aws/things/<b>thingname</b>/jobs/start-next",
        "arn:aws:iot:<b>region</b>:<b>account</b>:topic/$aws/things/<b>thingname</b>/jobs/*/update",
        "arn:aws:iot:<b>region</b>:<b>account</b>:topic/$aws/things/<b>thingname</b>/jobs/*/get",
        "arn:aws:iot:<b>region</b>:<b>account</b>:topic/$aws/things/<b>thingname</b>/jobs/get"
      ]
    },
    {
      "Effect": "Allow",
      "Action": "iot:Receive",
      "Resource": [
        "arn:aws:iot:<b>region</b>:<b>account</b>:topic/$aws/things/<b>thingname</b>/jobs/notify",
        "arn:aws:iot:<b>region</b>:<b>account</b>:topic/$aws/things/<b>thingname</b>/jobs/notify-next",
        "arn:aws:iot:<b>region</b>:<b>account</b>:topic/$aws/things/<b>thingname</b>/jobs/start-next/*",
        "arn:aws:iot:<b>region</b>:<b>account</b>:topic/$aws/things/<b>thingname</b>/jobs/*/update/*",
        "arn:aws:iot:<b>region</b>:<b>account</b>:topic/$aws/things/<b>thingname</b>/jobs/get/*",
        "arn:aws:iot:<b>region</b>:<b>account</b>:topic/$aws/things/<b>thingname</b>/jobs/*/get/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": "iot:Subscribe",
      "Resource": [
        "arn:aws:iot:<b>region</b>:<b>account</b>:topicfilter/$aws/things/<b>thingname</b>/jobs/notify",
        "arn:aws:iot:<b>region</b>:<b>account</b>:topicfilter/$aws/things/<b>thingname</b>/jobs/notify-next",
        "arn:aws:iot:<b>region</b>:<b>account</b>:topicfilter/$aws/things/<b>thingname</b>/jobs/start-next/*",
        "arn:aws:iot:<b>region</b>:<b>account</b>:topicfilter/$aws/things/<b>thingname</b>/jobs/*/update/*",
        "arn:aws:iot:<b>region</b>:<b>account</b>:topicfilter/$aws/things/<b>thingname</b>/jobs/get/*",
        "arn:aws:iot:<b>region</b>:<b>account</b>:topicfilter/$aws/things/<b>thingname</b>/jobs/*/get/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": "iot:Connect",
      "Resource": "arn:aws:iot:<b>region</b>:<b>account</b>:client/test-*"
    }
  ]
}
</pre>

Replace with the following with the data from your AWS account:
* `<region>`: The AWS IoT Core region where you created your AWS IoT Core thing you wish to use with this sample. For example `us-east-1`.
* `<account>`: Your AWS IoT Core account ID. This is the set of numbers in the top right next to your AWS account name when using the AWS IoT Core website.
* `<thingname>`: The name of your AWS IoT Core thing you want the device connection to be associated with

Note that in a real application, you may want to avoid the use of wildcards in your ClientID or use them selectively. Please follow best practices when working with AWS on production applications using the SDK. Also, for the purposes of this sample, please make sure your policy allows a client ID of `test-*` to connect or use `--client_id <client ID here>` to send the client ID your policy supports.

</details>

Additionally, the sample's control plane operations require that AWS credentials with appropriate permissions be sourceable by the default credentials provider chain
of the v3 JS SDK.  At a minimum, the following permissions must be granted:
<details>
<summary>Sample Policy</summary>
<pre>
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "iot:CreateJob",
      "Resource": [
        "arn:aws:iot:<b>region</b>:<b>account</b>:job/*",
        "arn:aws:iot:<b>region</b>:<b>account</b>:thing/<b>thingname</b>"
      ]
    },
    {
      "Effect": "Allow",
      "Action": "iot:DeleteJob",
      "Resource": [
        "arn:aws:iot:<b>region</b>:<b>account</b>:job/*",
        "arn:aws:iot:<b>region</b>:<b>account</b>:thing/<b>thingname</b>"
      ]
    }
  ]
}
</pre>

Replace with the following with the data from your AWS account:
* `<region>`: The AWS IoT Core region where you created your AWS IoT Core thing you wish to use with this sample. For example `us-east-1`.
* `<account>`: Your AWS IoT Core account ID. This is the set of numbers in the top right next to your AWS account name when using the AWS IoT Core website.
* `<thingname>`: The name of your AWS IoT Core thing you want the device connection to be associated with

Notice that you must provide `iot:CreateJob` permission to all things targeted by your jobs as well as the job itself.  In this example, we use a wildcard for the
job permission so that you can name the jobs whatever you would like.

</details>

## Walkthrough

### Run The Sample
Before building and running the sample, you must run `npm install` on the SDK itself; the sample takes a dependency on the SDK by a relative path.  

To run the Jobs sample, go to the `node/jobs` folder and run the following commands:

``` sh
npm install
node dist/index --endpoint <endpoint> --cert <path to certificate> --key <path to private key> --thing_name <thing name>
```

If an AWS IoT Thing resource with the given name does not exist, the sample will first create it.  Once the thing
exists, the sample connects via MQTT and you can issue commands to the Jobs service and inspect the results.  This walkthrough assumes a fresh thing
that has no pre-existing jobs targeting it.

### Job Creation
First, we check if there are any incomplete job executions for this device.  Assuming the thing is freshly-created, we expect there to be nothing:

```
get-pending-job-executions
```
yields output like
```
GetPendingJobExecutions Response: {"clientToken":"58920924-ccbf-43c0-8a23-79ece5ce7896","timestamp":1719940632,"inProgressJobs":[],"queuedJobs":[]}
```
from which we can see that the device has no pending job executions and no in-progress job executions.

Next, we'll create a couple of jobs that target the device:

```
create-job Job1 {"ToDo":"Reboot"}
```

which yields output similar to

```
CreateJob Response: {"$metadata":{"httpStatusCode":200,"requestId":"7e0a8283-6555-4b77-b685-f2e099547c66","attempts":1,"totalRetryDelay":0},"jobArn":"arn:aws:iot:us-east-1:123124136734:job/Job1","jobId":"Job1"}

Received JobExecutionsChanged event: {"timestamp":1719940994,"jobs":{"QUEUED":[{"jobId":"Job1","queuedAt":1719940994,"lastUpdatedAt":1719940994,"executionNumber":1,"versionNumber":1}]}}

Received NextJobExecutionChanged event: {"timestamp":1719940994,"execution":{"jobId":"Job1","status":"QUEUED","queuedAt":1719940994,"lastUpdatedAt":1719940994,"versionNumber":1,"executionNumber":1,"jobDocument":{"ToDo":"Reboot"}}}
```

In addition to the successful (HTTP) response to the CreateJob API call, our action triggered two (MQTT-based) events: a JobExecutionsChanged event and a 
NextJobExecutionChanged event.  When the sample is run, it creates and opens two streaming operations that listen for these two different events, by using the
`createJobExecutionsChangedStream` and `createNextJobExecutionChangedStream` APIs.  

A JobExecutionsChanged event is emitted every time either the queued or in-progress job execution sets change for the device.  A NextJobExecutionChanged event is emitted
only when the next job to be executed changes.  So if you create N jobs targeting a device, you'll get N JobExecutionsChanged events, but only (up to) one 
NextJobExecutionChanged event (unless the device starts completing jobs, triggering additional NextJobExecutionChanged events).
 
Let's create a second job as well:

```
create-job Job2 {"ToDo":"Delete Root User"}
```

whose output might look like

```
CreateJob Response: {"$metadata":{"httpStatusCode":200,"requestId":"950f05aa-14af-4143-91ab-3a2a74af87de","attempts":1,"totalRetryDelay":0},"jobArn":"arn:aws:iot:us-east-1:123124136734:job/Job2","jobId":"Job2"}

Received JobExecutionsChanged event: {"timestamp":1719941716,"jobs":{"QUEUED":[{"jobId":"Job1","queuedAt":1719940994,"lastUpdatedAt":1719940994,"executionNumber":1,"versionNumber":1},{"jobId":"Job2","queuedAt":1719941716,"lastUpdatedAt":1719941716,"executionNumber":1,"versionNumber":1}]}}
```

Notice how this time, there is no NextJobExecutionChanged event because the second job is behind the first, and therefore the next job execution hasn't changed.  As we will
see below, a NextJobExecutionChanged event referencing the second job will be emitted when the first job (in progress) is completed.

### Job Execution
Our device now has two jobs queued that it needs to (pretend to) execute.  Let's see how to do that, and what happens when we do.

The easiest way to start a job execution is via the `startNextPendingJobExecution` API.  This API takes the job execution at the head of the QUEUED list and moves it 
into the IN_PROGRESS state, returning its job document in the process.

```
start-next-pending-job-execution
```
```
StartNextPendingJobExecution Response: {"clientToken":"21113e5d-00ca-4fe3-bd00-2a5ce7bbe94a","timestamp":1719943388,"execution":{"jobId":"Job1","status":"IN_PROGRESS","queuedAt":1719940994,"startedAt":1719943388,"lastUpdatedAt":1719943388,"versionNumber":2,"executionNumber":1,"jobDocument":{"ToDo":"Reboot"}}}
```
Note that the response includes the job's document, which is what describes what the job actually entails.  The contents of the job document and its interpretation and
execution are the responsibility of the developer.  Notice also that no events were emitted from the action of moving a job from the QUEUED state to the IN_PROGRESS state.

If we run `getPendingJobExecutions` again, we see that Job1 is now in progress, while Job2 remains in the queued state:

```
get-pending-job-executions
```
```
GetPendingJobExecutions Response: {"clientToken":"380a66b5-b5f7-471a-92d4-bd7fbe558472","timestamp":1719943627,"inProgressJobs":[{"jobId":"Job1","queuedAt":1719940994,"lastUpdatedAt":1719943388,"startedAt":1719943388,"executionNumber":1,"versionNumber":2}],"queuedJobs":[{"jobId":"Job2","queuedAt":1719941716,"lastUpdatedAt":1719941716,"executionNumber":1,"versionNumber":1}]}
```

A real device application would perform the job execution steps as needed.  Let's assume that has been done.  We need to tell the service the job has
completed:

```
update-job-execution Job1 SUCCEEDED
```
will trigger output similar to
```
UpdateJobExecution Response: {"clientToken":"c75bfd7d-233d-47a2-8004-2ca20e5e84bf","timestamp":1719943955}

Received JobExecutionsChanged event: {"timestamp":1719943955,"jobs":{"QUEUED":[{"jobId":"Job2","queuedAt":1719941716,"lastUpdatedAt":1719941716,"executionNumber":1,"versionNumber":1}]}}

Received NextJobExecutionChanged event: {"timestamp":1719943955,"execution":{"jobId":"Job2","status":"QUEUED","queuedAt":1719941716,"lastUpdatedAt":1719941716,"versionNumber":1,"executionNumber":1,"jobDocument":{"ToDo":"Delete Root User"}}}
```
Notice we get a response as well as two events, since both 
1. The set of incomplete job executions set has changed.
1. The next job to be executed has changed.

As expected, we can move Job2's execution into IN_PROGRESS by invoking `startNextPendingJobExecution` again:

```
start-next-pending-job-execution
```
```
StartNextPendingJobExecution Response: {"clientToken":"e914371d-080a-400c-b2e8-e51e4f94ff3b","timestamp":1719947357,"execution":{"jobId":"Job2","status":"IN_PROGRESS","queuedAt":1719941716,"startedAt":1719947357,"lastUpdatedAt":1719947357,"versionNumber":2,"executionNumber":1,"jobDocument":{"ToDo":"Delete Root User"}}}
```

Let's pretend that the job execution failed.  An update variant can notify the Jobs service of this fact:

```
update-job-execution Job2 FAILED
```
triggering
```
UpdateJobExecution Response: {"clientToken":"5774e0da-1b1b-4851-8bf1-823c833b0fb9","timestamp":1719948116}

Received JobExecutionsChanged event: {"timestamp":1719948116,"jobs":{}}

Received NextJobExecutionChanged event: {"timestamp":1719948116}
```
At this point, no incomplete job executions remain.

### Job Cleanup
When all executions for a given job have reached a terminal state (SUCCEEDED, FAILED, CANCELED), you can delete the job itself.  This is a control plane operation
that requires the v3 AWS SDK for Javascript and should not be performed by the device executing jobs:

```
delete-job Job1
```
yielding
```
DeleteJob Response: {"$metadata":{"httpStatusCode":200,"requestId":"aaf51dd9-f20d-4059-9708-7388aeb46ff9","attempts":1,"totalRetryDelay":0}}
```

### Misc. Topics
#### What happens if I call `startNextPendingJobExecution` and there are no jobs to execute?
The request will not fail, but the `execution` field of the response will be empty, indicating that there is nothing to do.

#### What happens if I call `startNextPendingJobExecution` twice in a row (or while another job is in the IN_PROGRESS state)?
The service will return the execution information for the IN_PROGRESS job again.

#### What if I want my device to handle multiple job executions at once?
Since `startNextPendingJobExecution` does not help here, the device application can manually update a job execution from the QUEUED state to the IN_PROGRESS 
state in the same manner that it completes a job execution: use `getPendingJobExecutions` to get the list of queued executions and use
`updateJobExecution` to move one or more job executions into the IN_PROGRESS state.

#### What is the proper generic architecture for a job-processing application running on a device?
A device's persistent job executor should:
1. On startup, create and open streaming operations for both the JobExecutionsChanged and NextJobExecutionChanged events
2. On startup, get and cache the set of incomplete job executions using `getPendingJobExecutions`
3. Keep the cached job execution set up to date by reacting appropriately to JobExecutionsChanged and NextJobExecutionChanged events
4. While there are incomplete job executions, start and execute them one-at-a-time; otherwise wait for a new entry in the incomplete (queued) job executions set.

## ⚠️ Usage disclaimer

These code examples interact with services that may incur charges to your AWS account. For more information, see [AWS Pricing](https://aws.amazon.com/pricing/).

Additionally, example code might theoretically modify or delete existing AWS resources. As a matter of due diligence, do the following:

- Be aware of the resources that these examples create or delete.
- Be aware of the costs that might be charged to your account as a result.
- Back up your important data.