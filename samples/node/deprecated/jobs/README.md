# Node: Jobs

[**Return to main sample list**](../../../README.md)

This sample uses the AWS IoT [Jobs](https://docs.aws.amazon.com/iot/latest/developerguide/iot-jobs.html) Service to describe jobs to execute. [Jobs](https://docs.aws.amazon.com/iot/latest/developerguide/iot-jobs.html) is a service that allows you to define and respond to remote operation requests defined through the AWS IoT Core website or via any other device (or CLI command) that can access the [Jobs](https://docs.aws.amazon.com/iot/latest/developerguide/iot-jobs.html) service.

Note: This sample requires you to create jobs for your device to execute. See
[instructions here](https://docs.aws.amazon.com/iot/latest/developerguide/create-manage-jobs.html) for how to make jobs.

On startup, the sample describes the jobs that are pending execution and pretends to process them, marking each job as complete as it does so.

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

## How to run

To run the Jobs sample, go to the `node/jobs` folder and run the following commands:

``` sh
npm install
node dist/index --endpoint <endpoint> --cert <path to certificate> --key <path to private key> --thing_name <thing name>
```

You can also pass `--mqtt5` to run the sample with Mqtt5 Client
```sh
npm install
node dist/index --endpoint <endpoint> --cert <path to certificate> --key <path to private key> --thing_name <thing name> --mqtt5
```

You can also pass a Certificate Authority file (CA) if your certificate and key combination requires it:

``` sh
npm install
node dist/index --endpoint <endpoint> --cert <path to certificate> --key <path to private key> --thing_name <thing name> --ca_file <path to root CA>
```

## Service Client Notes
### Differences between MQTT5 and MQTT311
The service client with Mqtt5 client is almost identical to Mqtt3 one. The only difference is that you would need setup up a Mqtt5 Client and pass it to the service client.
For how to setup a Mqtt5 Client, please refer to [MQTT5 User Guide](https://github.com/awslabs/aws-crt-nodejs/blob/main/MQTT5-UserGuide.md) and [MQTT5 PubSub Sample](../pub_sub_mqtt5/README.md)

<table>
<tr>
<th>Create a IotJobsClient with Mqtt5</th>
<th>Create a IotJobsClient with Mqtt311</th>
</tr>
<tr>
<td>

```js
  // Create a Mqtt5 Client
  config_builder = iot.AwsIotMqtt5ClientConfigBuilder.newDirectMqttBuilderWithMtlsFromPath(argv.endpoint, argv.cert, argv.key);
  client = new mqtt5.Mqtt5Client(config_builder.build());

  // Create the jobs client from Mqtt5 Client
  jobs = iotjobs.IotJobsClient.newFromMqtt5Client(client5);
```

</td>
<td>

```js
    // Create a Mqtt311 Connection from the command line data
    config_builder = iot.AwsIotMqttConnectionConfigBuilder.new_mtls_builder_from_path(argv.cert, argv.key);
    config_builder.with_client_id(argv.client_id || "test-" + Math.floor(Math.random() * 100000000));
    config_builder.with_endpoint(argv.endpoint);
    client = new mqtt.MqttClient();
    connection = client.new_connection(config);

    // Create the jobs client from Mqtt311 Connection
    jobs = new iotjobs.IotJobsClient(connection);
```

</td>
</tr>
</table>

### mqtt5.QoS v.s. mqtt.QoS
As the service client interface is unchanged for both Mqtt3 Connection and Mqtt5 Client,the service client will use mqtt.QoS instead of mqtt5.QoS even with a Mqtt5 Client.
