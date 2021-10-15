# Sample apps for the AWS IoT Device SDK for JavaScript v2

* [pub_sub](#nodepub_sub)
* [pub_sub_js](#nodepub_sub_js)
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

## Node/Pub_sub

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
``` sh
npm install
node dist/index.js --endpoint <endpoint> --ca_file <file> --cert <file> --key <file>
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

## Node/pub_sub_js

This is a Javascript-only version of the PubSub sample.  If you don't want to dig through type annotations, this
sample is for you.

Run the sample like this:
``` sh
npm install
node index.js --endpoint <endpoint> --ca_file <file> --cert <file> --key <file>
```

## Fleet Provisioning

This sample uses the AWS IoT
[Fleet provisioning](https://docs.aws.amazon.com/iot/latest/developerguide/provision-wo-cert.html)
to provision devices using either a CSR or KeysAndcertificate and subsequently calls RegisterThing.

On startup, the script subscribes to topics based on the request type of either CSR or Keys topics,
publishes the request to corresponding topic and calls RegisterThing.

Source: `samples/node/fleet_provisioning`

Run the sample using CreateKeysAndCertificate:
``` sh
cd ~/samples/node/fleet_provisioning
npm install
node ./index.js --endpoint <endpoint> --ca_file <file> --cert <file> --key <file> --template_name <template name> --template_parameters <template parameters>
```

Run the sample using CreateCertificateFromCsr:
``` sh
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

### Fleet Provisioning Detailed Instructions

#### Aws Resource Setup

Fleet provisioning requires some additional AWS resources be set up first. This section documents the steps you need to take to
get the sample up and running. These steps assume you have the AWS CLI installed and the default user/credentials has
sufficient permission to perform all of the listed operations. You will also need python3 to be able to run parse_cert_set_result.py. These steps are based on provisioning setup steps
that can be found at [Embedded C SDK Setup](https://docs.aws.amazon.com/freertos/latest/lib-ref/c-sdk/provisioning/provisioning_tests.html#provisioning_system_tests_setup).

First, create the IAM role that will be needed by the fleet provisioning template. Replace `RoleName` with a name of the role you want to create. 
``` sh
aws iam create-role \
    --role-name [RoleName] \
    --assume-role-policy-document '{"Version":"2012-10-17","Statement":[{"Action":"sts:AssumeRole","Effect":"Allow","Principal":{"Service":"iot.amazonaws.com"}}]}'
```
Next, attach a policy to the role created in the first step. Replace `RoleName` with the name of the role you created previously.
``` sh
aws iam attach-role-policy \
        --role-name [RoleName] \
        --policy-arn arn:aws:iam::aws:policy/service-role/AWSIoTThingsRegistration
```
Finally, create the template resource which will be used for provisioning by the demo application. This needs to be done only 
once. To create a template, the following AWS CLI command may be used. Replace `TemplateName` with the name of the fleet 
provisioning template you want to create. Replace `RoleName` with the name of the role you created previously. Replace 
`TemplateJSON` with the template body as a JSON string (containing escape characters). Replace `account` with your AWS 
account number. 
``` sh
aws iot create-provisioning-template \
        --template-name [TemplateName] \
        --provisioning-role-arn arn:aws:iam::[account]:role/[RoleName] \
        --template-body "[TemplateJSON]" \
        --enabled 
```
The rest of the instructions assume you have used the following for the template body:
``` sh
{\"Parameters\":{\"DeviceLocation\":{\"Type\":\"String\"},\"AWS::IoT::Certificate::Id\":{\"Type\":\"String\"},\"SerialNumber\":{\"Type\":\"String\"}},\"Mappings\":{\"LocationTable\":{\"Seattle\":{\"LocationUrl\":\"https://example.aws\"}}},\"Resources\":{\"thing\":{\"Type\":\"AWS::IoT::Thing\",\"Properties\":{\"ThingName\":{\"Fn::Join\":[\"\",[\"ThingPrefix_\",{\"Ref\":\"SerialNumber\"}]]},\"AttributePayload\":{\"version\":\"v1\",\"serialNumber\":\"serialNumber\"}},\"OverrideSettings\":{\"AttributePayload\":\"MERGE\",\"ThingTypeName\":\"REPLACE\",\"ThingGroups\":\"DO_NOTHING\"}},\"certificate\":{\"Type\":\"AWS::IoT::Certificate\",\"Properties\":{\"CertificateId\":{\"Ref\":\"AWS::IoT::Certificate::Id\"},\"Status\":\"Active\"},\"OverrideSettings\":{\"Status\":\"REPLACE\"}},\"policy\":{\"Type\":\"AWS::IoT::Policy\",\"Properties\":{\"PolicyDocument\":{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Action\":[\"iot:Connect\",\"iot:Subscribe\",\"iot:Publish\",\"iot:Receive\"],\"Resource\":\"*\"}]}}}},\"DeviceConfiguration\":{\"FallbackUrl\":\"https://www.example.com/test-site\",\"LocationUrl\":{\"Fn::FindInMap\":[\"LocationTable\",{\"Ref\":\"DeviceLocation\"},\"LocationUrl\"]}}}
```
If you use a different body, you may need to pass in different template parameters.

#### Running the sample and provisioning using a certificate-key set from a provisioning claim

To run the provisioning sample, you'll need a certificate and key set with sufficient permissions. Provisioning certificates are normally 
created ahead of time and placed on your device, but for this sample, we will just create them on the fly. You can also
use any certificate set you've already created if it has sufficient IoT permissions and in doing so, you can skip the step
that calls `create-provisioning-claim`.

We've included a script in the utils folder that creates certificate and key files from the response of calling
`create-provisioning-claim`. These dynamically sourced certificates are only valid for five minutes. When running the command, 
you'll need to substitute the name of the template you previously created, and on Windows, replace the paths with something appropriate.

(Optional) Create a temporary provisioning claim certificate set:
``` sh
aws iot create-provisioning-claim \
        --template-name [TemplateName] \
        | python3 ../../../utils/parse_cert_set_result.py \
        --path /tmp \
        --filename provision
```

The provisioning claim's cert and key set have been written to `/tmp/provision*`. Now you can use these temporary keys
to perform the actual provisioning. If you are not using the temporary provisioning certificate, replace the paths for `--cert` 
and `--key` appropriately:

``` sh
node dist/index.js \
        --endpoint [your endpoint]-ats.iot.[region].amazonaws.com \
        --ca_file [pathToRootCA] \
        --cert /tmp/provision.cert.pem \
        --key /tmp/provision.private.key \
        --template_name [TemplateName] \
        --template_parameters "{\"SerialNumber\":\"1\",\"DeviceLocation\":\"Seattle\"}"
```

Notice that we provided substitution values for the two parameters in the template body, `DeviceLocation` and `SerialNumber`.

#### Run the sample using the certificate signing request workflow

To run the sample with this workflow, you'll need to create a certificate signing request.

First create a certificate-key pair:
``` sh
openssl genrsa -out /tmp/deviceCert.key 2048
```

Next create a certificate signing request from it:
``` sh
openssl req -new -key /tmp/deviceCert.key -out /tmp/deviceCert.csr
```

(Optional) As with the previous workflow, we'll create a temporary certificate set from a provisioning claim. This step can
be skipped if you're using a certificate set capable of provisioning the device:

``` sh
aws iot create-provisioning-claim \
        --template-name [TemplateName] \
        | python3 ../../../utils/parse_cert_set_result.py \
        --path /tmp \
        --filename provision
```

Finally, supply the certificate signing request while invoking the provisioning sample. As with the previous workflow, if
using a permanent certificate set, replace the paths specified in the `--cert` and `--key` arguments:
``` sh
node dist/index.js \
        --endpoint [your endpoint]-ats.iot.[region].amazonaws.com \
        --ca_file [pathToRootCA] \
        --cert /tmp/provision.cert.pem \
        --key /tmp/provision.private.key \
        --template_name [TemplateName] \
        --template_parameters "{\"SerialNumber\":\"1\",\"DeviceLocation\":\"Seattle\"}" \
        --csr_file /tmp/deviceCert.csr 
```

## Greengrass Discovery (Basic Discovery)

This sample is intended for use with the following tutorials in the AWS IoT Greengrass documentation:

* [Connect and test client devices](https://docs.aws.amazon.com/greengrass/v2/developerguide/client-devices-tutorial.html) (Greengrass V2)
* [Test client device communications](https://docs.aws.amazon.com/greengrass/v2/developerguide/test-client-device-communications.html) (Greengrass V2)
* [Getting Started with AWS IoT Greengrass](https://docs.aws.amazon.com/greengrass/latest/developerguide/gg-gs.html) (Greengrass V1)
