# Browser: MQTT5 PubSub

[**Return to main sample list**](../../README.md)

This sample uses the
[Message Broker](https://docs.aws.amazon.com/iot/latest/developerguide/iot-message-broker.html)
for AWS IoT to send and receive messages through an MQTT connection using MQTT5 in the browser.

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

Once you have a Cognito identity pool, you need to fill in the credentials in the `browser/pub_sub_mqtt5/settings.js` file with your AWS endpoint, AWS region, and Cognito identity pool. Run `npm install` in the `browser/pub_sub_mqtt5` folder to build the sample. open `browser/pub_sub_mqtt5/index.html` to run the sample in your browser! If configured correctly, it should connect to AWS IoT Core, subscribe to a topic, and then start receiving the messages it publishes to the topic it's subscribed to.

## Alternate Connection Configuration Methods supported by AWS IoT Core
The MQTT5 implementation for the browser supports MQTT-over-websockets using either Sigv4 authentication or AWS IoT Core Custom Authentication.
All connections are protected by TLS.

### Authentication Methods
* [MQTT over Websockets with Sigv4 authentication](#mqtt-over-websockets-with-sigv4-authentication)
* [MQTT over Websockets with Custom Authentication](#mqtt-over-websockets-with-custom-authentication)
### HTTP Proxy
* [Adding an HTTP Proxy](#adding-an-http-proxy)

#### MQTT over Websockets with Sigv4 authentication
Within the SDK, there is very limited support for browser-based credentials providers.  By default, only static credential providers are
supported:

```typescript
    let staticProvider: StaticCredentialProvider = new StaticCredentialProvider({
        aws_access_id: "<AWS Credentials Access Key>",
        aws_secret_key: "<AWS Credentials Secret Access Key>",
        aws_region: "<AWS Region>"
    });
    let wsConfig: WebsocketSigv4Config = {
        credentialsProvider: staticProvider
    };

    let builder = aws_iot_mqtt5.AwsIotMqtt5ClientConfigBuilder.newWebsocketMqttBuilderWithSigv4Auth(
        "<account-specific endpoint>",
        wsConfig
    );
    let client : Mqtt5Client = new Mqtt5Client(builder.build());
```

However, you can also create adapters to credentials providers from third party libraries (like the AWS SDK for JS v3).  Coordinating
the refresh of session-based credentials is your responsibility.

#### MQTT over Websockets with Custom Authentication
In the browser, custom authentication works exactly the same as NodeJS.  The only difference is that the browser makes the connection
via MQTT-over-websockets, while in NodeJS, we always make the connection direct-over-TCP.

If your custom authenticator does not use signing, you don't specify anything related to the token signature:

```typescript
    let customAuthConfig : MqttConnectCustomAuthConfig = {
        authorizerName: "<Name of your custom authorizer>",
        username: "<Value of the username field that should be passed to the authorizer's lambda>",
        password: <Binary data value of the password field to be passed to the authorizer lambda>
    };
    let builder = AwsIotMqtt5ClientConfigBuilder.newDirectMqttBuilderWithCustomAuth(
        "<account-specific endpoint>",
        customAuthConfig
    );
    let client : Mqtt5Client = new mqtt5.Mqtt5Client(builder.build());
```

If your custom authorizer uses signing, you must specify the three signed token properties as well.  The token signature should be
the base64 encoding of the digital signature of the token value via the private key associated with the public key
that was registered with the custom authorizer:

```typescript
    let customAuthConfig : MqttConnectCustomAuthConfig = {
        authorizerName: "<Name of your custom authorizer>",
        username: "<Value of the username field that should be passed to the authorizer's lambda>",
        password: <Binary data value of the password field to be passed to the authorizer lambda>,
        tokenKeyName: "<Name of the username query param that will contain the token value>",
        tokenValue: "<Value of the username query param that holds the token value that has been signed>",
        tokenSignature: "<base64-encoded digital signature of tokenValue>"
    };
    let builder = AwsIotMqtt5ClientConfigBuilder.newDirectMqttBuilderWithCustomAuth(
        "<account-specific endpoint>",
        customAuthConfig
    );
    let client : Mqtt5Client = new mqtt5.Mqtt5Client(builder.build());
```

In both cases, the builder will construct a final CONNECT packet username value for you based on the values configured.  Do not add the
token-signing fields to the value of the username that you assign within the custom authentication config structure.  Similarly, do not
add any custom authentication related values to the username in the CONNECT configuration optionally attached to the client configuration.
The builder will do everything for you.

### Adding an HTTP Proxy
Similar to NodeJS, you can specify http proxy options to enable connections that pass through an HTTP proxy.  Unlike NodeJS, these
options are in a form expected by the underlying third-party transport library.

```typescript
    import url from "url";
    let builder = AwsIoTMqtt5ClientConfigBuilder.<authentication method>(...);
    let urlOptions: url.UrlWithStringQuery = url.parse(`<proxy url including domain and port>`);
    let agent: HttpsProxyAgent = new HttpsProxyAgent(urlOptions);
    let wsOptions : any = {
        agent: agent
    }
    builder.withWebsocketTransportOptions(wsOptions);

    let client : Mqtt5Client = new Mqtt5Client(builder.build());
```