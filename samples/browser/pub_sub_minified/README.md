# Browser: PubSub Minified

[**Return to main sample list**](../../README.md)

This sample is exactly the same as the [PubSub](../pub_sub/README.md) browser sample, but it is setup to use a Webpack minimizer. The sample is minified with Webpack using the [TerserWrapper plugin](https://webpack.js.org/plugins/terser-webpack-plugin/), which makes the source code harder to read, decreases the total file size, and provides a little extra security due to minimized code.

**Note**: While minifying makes the code more secure by making it harder to read, it does not necessarily hide secrets or sensitive information, like the AWS credentials in `settings.js` in this sample. The use of `settings.js` is for illustration and easy of use purposes only. Please always follow best practices for development and security whenever developing applications.

Your IoT Core Thing's [Policy](https://docs.aws.amazon.com/iot/latest/developerguide/iot-policies.html) must provide privileges for this sample to connect, subscribe, publish, and receive. Below is a sample policy that can be used on your IoT Core Thing that will allow this sample to run as intended.

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

Replace with the following with the data from your AWS account:
* `<region>`: The AWS IoT Core region where you created your AWS IoT Core thing you wish to use with this sample. For example `us-east-1`.
* `<account>`: Your AWS IoT Core account ID. This is the set of numbers in the top right next to your AWS account name when using the AWS IoT Core website.

Note that in a real application, you may want to avoid the use of wildcards in your ClientID or use them selectively. Please follow best practices when working with AWS on production applications using the SDK. Also, for the purposes of this sample, please make sure your policy allows a client ID of `test-*` to connect or use `--client_id <client ID here>` to send the client ID your policy supports.

</details>

## How to run

To run this sample you need to have a Cognito identity pool setup that can be used for making IoT connections. To see how to setup a Cognito identity pool, please refer to this page on the [AWS documentation](https://docs.aws.amazon.com/cognito/latest/developerguide/tutorial-create-identity-pool.html).

Once you have a Cognito identity pool, you need to fill in the credentials in the `browser/pub_sub_minified/settings.js` file with your AWS endpoint, AWS region, and Cognito identity pool. Run `npm install` in the `browser/pub_sub` folder to build the sample. open `browser/pub_sub_minified/index.html` to run the sample in your browser! If configured correctly, it should connect to AWS IoT Core, subscribe to a topic, and then start receiving the messages it publishes to the topic it's subscribed to.

### How to change the minimizer on and off

You can turn the minimizer on and off by modifying `browser/pub_sub_minified/webpack.config.js`. Open `browser/pub_sub_minified/webpack.config.js` and find the following, which should be around line 22:

~~~js
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()]
  }
~~~

You can change `minimize: true` according to whether or not you want to minimize the code for that particular build. To turn the minimizer off, change it to `minimize: false`, and then run `npm install`. Likewise, to turn it on, change it to `minimize: true` and run `npm install`.

You can check the results of the minimizer and confirm whether it is on or off by looking at `browser/pub_sub_minified/dist/index.js`. When the minimizer is on, all of the code should be heavily compressed and extremely hard to read.
