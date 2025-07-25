# Node: Shadow

[**Return to main sample list**](../../../README.md)

This sample uses the AWS IoT [Device Shadow](https://docs.aws.amazon.com/iot/latest/developerguide/iot-device-shadows.html) Service to keep a property in sync between device and server. Imagine a light whose color may be changed through an app, or set by a local user.

Once connected, type a value in the terminal and press Enter to update the property's "reported" value. The sample also responds when the "desired" value changes on the server. To observe this, edit the Shadow document in the AWS Console and set a new "desired" value.

On startup, the sample requests the shadow document to learn the property's initial state. The sample also subscribes to "delta" events from the server, which are sent when a property's "desired" value differs from its "reported" value. When the sample learns of a new desired value, that value is changed on the device and an update is sent to the server with the new "reported" value.

Your IoT Core Thing's [Policy](https://docs.aws.amazon.com/iot/latest/developerguide/iot-policies.html) must provide privileges for this sample to connect, subscribe, publish, and receive. Below is a sample policy that can be used on your IoT Core Thing that will allow this sample to run as intended.

<details>
<summary>Sample Policy</summary>
<pre>
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "iot:Publish"
      ],
      "Resource": [
        "arn:aws:iot:<b>region</b>:<b>account</b>:topic/$aws/things/<b>thingname</b>/shadow/get",
        "arn:aws:iot:<b>region</b>:<b>account</b>:topic/$aws/things/<b>thingname</b>/shadow/update"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "iot:Receive"
      ],
      "Resource": [
        "arn:aws:iot:<b>region</b>:<b>account</b>:topic/$aws/things/<b>thingname</b>/shadow/get/accepted",
        "arn:aws:iot:<b>region</b>:<b>account</b>:topic/$aws/things/<b>thingname</b>/shadow/get/rejected",
        "arn:aws:iot:<b>region</b>:<b>account</b>:topic/$aws/things/<b>thingname</b>/shadow/update/accepted",
        "arn:aws:iot:<b>region</b>:<b>account</b>:topic/$aws/things/<b>thingname</b>/shadow/update/rejected",
        "arn:aws:iot:<b>region</b>:<b>account</b>:topic/$aws/things/<b>thingname</b>/shadow/update/delta"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "iot:Subscribe"
      ],
      "Resource": [
        "arn:aws:iot:<b>region</b>:<b>account</b>:topicfilter/$aws/things/<b>thingname</b>/shadow/get/accepted",
        "arn:aws:iot:<b>region</b>:<b>account</b>:topicfilter/$aws/things/<b>thingname</b>/shadow/get/rejected",
        "arn:aws:iot:<b>region</b>:<b>account</b>:topicfilter/$aws/things/<b>thingname</b>/shadow/update/accepted",
        "arn:aws:iot:<b>region</b>:<b>account</b>:topicfilter/$aws/things/<b>thingname</b>/shadow/update/rejected",
        "arn:aws:iot:<b>region</b>:<b>account</b>:topicfilter/$aws/things/<b>thingname</b>/shadow/update/delta"
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

To run the Shadow sample, go to the `node/shadow` folder and run the following commands:

``` sh
npm install
node dist/index.js --endpoint <endpoint> --cert <path to the certificate> --key <path to the private key> --thing_name <thing name> --shadow_property <shadow property name>
```

You can also pass `--mqtt5` to run the sample with Mqtt5 Client
```sh
npm install
node dist/index.js --endpoint <endpoint> --cert <path to the certificate> --key <path to the private key> --thing_name <thing name> --shadow_property <shadow property name> --mqtt5
```

You can also pass a Certificate Authority file (CA) if your certificate and key combination requires it:

``` sh
npm install
node dist/index.js --endpoint <endpoint> --cert <path to the certificate> --key <path to the private key> --thing_name <thing name> --shadow_property <shadow property name> --ca_file <path to root CA1>
```


## Service Client Notes
### Differences between MQTT5 and MQTT311
The service client with Mqtt5 client is almost identical to Mqtt3 one. The only difference is that you would need setup up a Mqtt5 Client and pass it to the service client.
For how to setup a Mqtt5 Client, please refer to [MQTT5 User Guide](https://github.com/awslabs/aws-crt-nodejs/blob/main/MQTT5-UserGuide.md) and [MQTT5 PubSub Sample](../pub_sub_mqtt5/README.md)

<table>
<tr>
<th>Create a IoTShadowClient with Mqtt5</th>
<th>Create a IoTShadowClient with Mqtt311</th>
</tr>
<tr>
<td>

```js
  // Create a Mqtt5 Client
  config_builder = iot.AwsIotMqtt5ClientConfigBuilder.newDirectMqttBuilderWithMtlsFromPath(argv.endpoint, argv.cert, argv.key);
  client = new mqtt5.Mqtt5Client(config_builder.build());

  // Create the shadow client from Mqtt5 Client
  shadow = iotshadow.IotShadowClient.newFromMqtt5Client(client5);
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

    // Create the shadow client from Mqtt311 Connection
    shadow = new iotshadow.IotShadowClient(connection);
```

</td>
</tr>
</table>

### mqtt5.QoS v.s. mqtt.QoS
As the service client interface is unchanged for both Mqtt3 Connection and Mqtt5 Client,the service client will use mqtt.QoS instead of mqtt5.QoS even with a Mqtt5 Client.
