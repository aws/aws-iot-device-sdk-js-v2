# Browser: Custom Authorizer Connect

[**Return to main sample list**](../../README.md)

This sample makes an MQTT connection and connects through a [Custom Authorizer](https://docs.aws.amazon.com/iot/latest/developerguide/custom-authentication.html) in the browser. On startup, the device connects to the server and then disconnects. This sample is for reference on connecting using a Custom Authorizer. Using a Custom Authorizer allows you to perform your own authorization using an AWS Lambda function. See [Custom Authorizer](https://docs.aws.amazon.com/iot/latest/developerguide/custom-authentication.html) for more information.

You will need to setup your Custom Authorizer so that the lambda function returns a policy document. See [this page on the documentation](https://docs.aws.amazon.com/iot/latest/developerguide/config-custom-auth.html) for more details and example return result. You can customize this lambda function as needed for your browser application to provide your own security measures based on the needs of your browser application.

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

First, make sure your Custom Authorizer, Lambda, and policy are all setup using the links provided in this document. Then, modify the `browser/custom_authorizer_connect/settings.js` so that it points to your AWS endpoint and is configured for your Custom Authorizer. Note that any setting marked as `Optional` can be left without modifications and it will be ignored/not-used when running the sample. Once you have these steps complete, you are ready to run the sample.

Run `npm install` in the `browser/custom_authorizer_connect` folder to build the sample. Once the sample is built, open `browser/custom_authorizer_connect/index.html` to run the sample in your browser! If configured correctly, it should connect to the Custom Authorizer you setup in `browser/custom_authorizer_connect/settings.js`!
