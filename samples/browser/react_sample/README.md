# Browser: MQTT5 PubSub with React

[**Return to main sample list**](../../README.md)

This sample uses the
[Message Broker](https://docs.aws.amazon.com/iot/latest/developerguide/iot-message-broker.html)
for AWS IoT to send and receive messages through an MQTT connection using MQTT5/MQTT311 in the browser with React library.

MQTT5 introduces additional features and enhancements that improve the development experience with MQTT. You can read more about MQTT5 in the Java V2 SDK by checking out the [MQTT5 user guide](https://github.com/awslabs/aws-crt-nodejs/blob/main/MQTT5-UserGuide.md).

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
        "arn:aws:iot:<b>region</b>:<b>account</b>:topic/test/topic*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "iot:Subscribe"
      ],
      "Resource": [
        "arn:aws:iot:<b>region</b>:<b>account</b>:topicfilter/test/topic*",
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

Once you have a Cognito identity pool, you need to fill in the credentials in the `browser/react_sample/src/settings.ts` file with your AWS endpoint, AWS region, and Cognito identity pool.

Run `npm install` in the `browser/react_sample` folder to build the sample.
Then run `npm start` to start the dev server. The default port is `3000`. You should be able to run the sample at http://localhost:3000/ in your browser. If configured correctly, it should connect to AWS IoT Core, subscribe to a topic, and then start receiving the messages it publishes to the topic it's subscribed to.

You can adjust the port at [package.json](./package.json):
```
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "webpack serve --port 3000",
    "build": "NODE_ENV=production webpack"
  },
```

## Mqtt311 Sample
By default, the sample uses Mqtt5. To checkout the sample with Mqtt311. You can modify the [index.tsx](./src/index.tsx)
```
root.render(
  // <Mqtt5 />
  // Comment the Mqtt5 and uncomment Mqtt311 to enable the Mqtt311 component
  <Mqtt311 />
);
```
## React Q&A
### Error "Module not found: Error: Can't resolve 'LIBRARY' in webpack 5"
As webpack 5 no longer polyfills many Node APIs. We would need resolve the packages when upgrading from webpack 4 to webpack 5.
You can resolve the issue by config the `webpack.config.js`.
Example of resolve library "url" and "util":
```
  resolve:{
    fallback:
    {
      "url": require.resolve("url/"),
      "util": require.resolve("util/")
    }
  }
```
The article could be helpful: https://gist.github.com/ef4/d2cf5672a93cf241fd47c020b9b3066a
