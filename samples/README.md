# Sample apps for the AWS IoT Device SDK for JavaScript v2

* [pubsub](#nodepub_sub)
* [fleet provisioning](#fleet-provisioning)
* [basic discovery](#nodebasic_discovery)

## Note

If you are installing via npm instead of building from source, please make the following change to the package.json under each sample.

``` json
From:
    "dependencies": {
        "aws-iot-device-sdk-v2": "../../../",
        "yargs": "^14.0.0"
    }

To:
    "dependencies": {
        "aws-iot-device-sdk-v2":  "<latest released version eg: ^1.3.0>",
        "yargs": "^14.0.0"
    }
```

## node/pub_sub

This sample uses the
[Message Broker](https://docs.aws.amazon.com/iot/latest/developerguide/iot-message-broker.html)
for AWS IoT to send and receive messages
through an MQTT connection. On startup, the device connects to the server,
subscribes to a topic, and begins publishing messages to that topic.
The device should receive those same messages back from the message broker,
since it is subscribed to that same topic.
Status updates are continually printed to the console.

Source: `samples/node/pub_sub`

Run the sample like this:
```
npm install
node dist/index.js --endpoint <endpoint> --root-ca <file> --cert <file> --key <file>
```

Your Thing's
[Policy](https://docs.aws.amazon.com/iot/latest/developerguide/iot-policies.html)
must provide privileges for this sample to connect, subscribe, publish,
and receive.
<details>
<summary>(see sample policy)</summary>
<pre>
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "iot:Publish",
        "iot:Receive"
      ],
      "Resource": [
        "arn:aws:iot:<b>region</b>:<b>account</b>:topic/test/topic"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "iot:Subscribe"
      ],
      "Resource": [
        "arn:aws:iot:<b>region</b>:<b>account</b>:topicfilter/test/topic"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "iot:Connect"
      ],
      "Resource": [
        "arn:aws:iot:<b>region</b>:<b>account</b>:client/test-*"
      ]
    }
  ]
}
</pre>
</details>

## fleet provisioning

This sample uses the AWS IoT
[Fleet provisioning](https://docs.aws.amazon.com/iot/latest/developerguide/provision-wo-cert.html)
to provision devices using either a CSR or KeysAndcertificate and subsequently calls RegisterThing.

On startup, the script subscribes to topics based on the request type of either CSR or Keys topics,
publishes the request to corresponding topic and calls RegisterThing.

Source: `samples/node/fleet_provisioning`

Run the sample using CreateKeysAndCertificate:
```
cd ~/samples/node/fleet_provisioning
npm install
node ./index.js --endpoint <endpoint> --ca_file <file> --cert <file> --key <file> --template_name <template name> --template_parameters <template parameters>
```

Run the sample using CreateCertificateFromCsr:
```
cd ~/samples/node/fleet_provisioning
npm install
node ./index.js --endpoint <endpoint> --ca_file <file> --cert <file> --key <file> --template_name <template name> --template_parameters <template parameters> --csr_file <csr file>
```

Your Thing's
[Policy](https://docs.aws.amazon.com/iot/latest/developerguide/iot-policies.html)
must provide privileges for this sample to connect, subscribe, publish,
and receive.

<details>
<summary>(see sample policy)</summary>
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
        "arn:aws:iot:<b>region</b>:<b>account</b>:topic/$aws/certificates/create/json",
        "arn:aws:iot:<b>region</b>:<b>account</b>:topic/$aws/certificates/create-from-csr/json",
        "arn:aws:iot:<b>region</b>:<b>account</b>:topic/$aws/provisioning-templates/<b>templatename</b>/provision/json"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "iot:Receive",
        "iot:Subscribe"
      ],
      "Resource": [
        "arn:aws:iot:<b>region</b>:<b>account</b>:topic/$aws/certificates/create/json/accepted",
        "arn:aws:iot:<b>region</b>:<b>account</b>:topic/$aws/certificates/create/json/rejected",
        "arn:aws:iot:<b>region</b>:<b>account</b>:topic/$aws/certificates/create-from-csr/json/accepted",
        "arn:aws:iot:<b>region</b>:<b>account</b>:topic/$aws/certificates/create-from-csr/json/rejected",
        "arn:aws:iot:<b>region</b>:<b>account</b>:topic/$aws/provisioning-templates/<b>templatename</b>/provision/json/accepted",
        "arn:aws:iot:<b>region</b>:<b>account</b>:topic/$aws/provisioning-templates/<b>templatename</b>/provision/json/rejected"
      ]
    },
    {
      "Effect": "Allow",
      "Action": "iot:Connect",
      "Resource": "arn:aws:iot:<b>region</b>:<b>account</b>:client/samples-client-id"
    }
  ]
}
</pre>
</details>

## node/basic_discovery

This sample intended for use directly with the
[Getting Started with AWS IoT Greengrass](https://docs.aws.amazon.com/greengrass/latest/developerguide/gg-gs.html) guide.
