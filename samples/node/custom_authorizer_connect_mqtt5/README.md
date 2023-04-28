# Node: Custom Authorizer Connect MQTT5

[**Return to main sample list**](../../README.md)

This sample makes an MQTT5 connection and connects through a [Custom Authorizer](https://docs.aws.amazon.com/iot/latest/developerguide/custom-authentication.html). On startup, the device connects to the server and then disconnects. This sample is for reference on connecting using a Custom Authorizer with MQTT5. Using a Custom Authorizer allows you to perform your own authorization using an AWS Lambda function. See [Custom Authorizer](https://docs.aws.amazon.com/iot/latest/developerguide/custom-authentication.html) for more information.

You will need to setup your Custom Authorizer so that the lambda function returns a policy document. See [this page on the documentation](https://docs.aws.amazon.com/iot/latest/developerguide/config-custom-auth.html) for more details and example return result. You can customize this lambda function as needed for your application to provide your own security measures based on the needs of your application.

MQTT5 introduces additional features and enhancements that improve the development experience with MQTT. You can read more about MQTT5 in the Javascript V2 SDK by checking out the [MQTT5 user guide](https://github.com/awslabs/aws-crt-nodejs/blob/main/MQTT5-UserGuide.md).

Note: MQTT5 support is currently in **developer preview**. We encourage feedback at all times, but feedback during the preview window is especially valuable in shaping the final product. During the preview period we may make backwards-incompatible changes to the public API, but in general, this is something we will try our best to avoid.

Your IoT Core Thing's [Policy](https://docs.aws.amazon.com/iot/latest/developerguide/iot-policies.html) must provide privileges for this sample to connect. Below is a sample policy that can be used on your IoT Core Thing that will allow this sample to run as intended.

<details>
<summary>(see sample policy)</summary>
<pre>
{
  "Version": "2012-10-17",
  "Statement": [
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

Replace with the following with the data from your AWS account:
* `<region>`: The AWS IoT Core region where you created your AWS IoT Core thing you wish to use with this sample. For example `us-east-1`.
* `<account>`: Your AWS IoT Core account ID. This is the set of numbers in the top right next to your AWS account name when using the AWS IoT Core website.

Note that in a real application, you may want to avoid the use of wildcards in your ClientID or use them selectively. Please follow best practices when working with AWS on production applications using the SDK. Also, for the purposes of this sample, please make sure your policy allows a client ID of `test-*` to connect or use `--client_id <client ID here>` to send the client ID your policy supports.

</details>

# How to run

To run the Custom Authorizer connect sample, go to the `node/custom_authorizer_connect_mqtt5` folder and run the following commands:

``` sh
npm install
node dist/index.js --endpoint <endpoint> --custom_auth_authorizer_name <custom authorizer name>
```

**Note** The sample also allows passing additional arguments (`--custom_auth_username`, `--custom_auth_password`, `custom_auth_authorizer_signature`, `custom_auth_token_key_name` and `custom_auth_token_value`) to fullfil the additional data your custom authorizer may need. The examples above assume that the custom authorizer does not need these additional parameters.
