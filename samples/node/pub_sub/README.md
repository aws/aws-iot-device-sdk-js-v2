# Node: MQTT5 PubSub

[**Return to main sample list**](../../README.md)

This sample uses the
[Message Broker](https://docs.aws.amazon.com/iot/latest/developerguide/iot-message-broker.html)
for AWS IoT to send and receive messages through an MQTT connection using MQTT5.

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

### Direct MQTT via mTLS

To Run this sample using a direct MQTT connection with a key and certificate, go to the `node/pub_sub_mqtt5` folder and run the following commands:

``` sh
npm install
node dist/index.js --endpoint <endpoint> --cert <file> --key <file>
```

You can also pass a Certificate Authority file (CA) if your certificate and key combination requires it:

``` sh
npm install
node dist/index.js --endpoint <endpoint> --cert <file> --key <file> --ca_file <path to root CA>
```

### Websockets

To Run this sample using Websockets, go to the `node/pub_sub_mqtt5` folder and run the follow commands:

``` sh
npm install
node dist/index.js --endpoint <endpoint> --region <signing region>
```

Note that to run this sample using Websockets, you will need to set your AWS credentials in your environment variables or local files. See the [authorizing direct AWS](https://docs.aws.amazon.com/iot/latest/developerguide/authorizing-direct-aws.html) page for documentation on how to get the AWS credentials, which then you can set to the `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AWS_SESSION_TOKEN` environment variables.

## Alternate Connection Configuration Methods supported by AWS IoT Core
We strongly recommend using the AwsIotMqtt5ClientConfigBuilder class to configure MQTT5 clients when connecting to AWS IoT Core.  The builder
simplifies configuration for all authentication methods supported by AWS IoT Core.  This section shows samples for all authentication
possibilities.

### Authentication Methods
* [Direct MQTT with X509-based mutual TLS](#direct-mqtt-with-x509-based-mutual-tls)
* [MQTT over Websockets with Sigv4 authentication](#mqtt-over-websockets-with-sigv4-authentication)
* [Direct MQTT with Custom Authentication](#direct-mqtt-with-custom-authentication)
* [Direct MQTT with PKCS11](#direct-mqtt-with-pkcs11-method)
* [Direct MQTT with PKCS12](#direct-mqtt-with-pkcs12-method)
### HTTP Proxy
* [Adding an HTTP Proxy](#adding-an-http-proxy)

#### Direct MQTT with X509-based mutual TLS
For X509 based mutual TLS, you can create a client where the certificate and private key are configured by path:

```typescript
    let builder = AwsIotMqtt5ClientConfigBuilder.newDirectMqttBuilderWithMtlsFromPath(
        <account-specific endpoint>,
        <path-to-X509-certificate-pem-file>,
        <path-to-private-key-pem-file>
    );

    // other builder configuration
    // ...
    let client : Mqtt5Client = new Mqtt5Client(builder.build()));
```

You can also create a client where the certificate and private key are in memory:

```typescript
    let cert = fs.readFileSync(<path to certificate pem file>,'utf8');
    let key = fs.readFileSync(<path to private key pem file>,'utf8');
    let builder = AwsIotMqtt5ClientConfigBuilder.newDirectMqttBuilderWithMtlsFromMemory(
        <account-specific endpoint>,
        cert,
        key
    );

    // other builder configuration
    // ...
    let client : Mqtt5Client = new Mqtt5Client(builder.build());
```

#### MQTT over Websockets with Sigv4 authentication
Sigv4-based authentication requires a credentials provider capable of sourcing valid AWS credentials. Sourced credentials
will sign the websocket upgrade request made by the client while connecting.  The default credentials provider chain supported by
the SDK is capable of resolving credentials in a variety of environments according to a chain of priorities:

```
    Environment -> Profile (local file system) -> STS Web Identity -> IMDS (ec2) or ECS
```

If the default credentials provider chain and built-in AWS region extraction logic are sufficient, you do not need to specify
any additional configuration:

```typescript
    let builder = AwsIotMqtt5ClientConfigBuilder.newWebsocketMqttBuilderWithSigv4Auth(
        <account-specific endpoint>
    );
    // other builder configuration
    // ...
    let client : Mqtt5Client = new Mqtt5Client(builder.build());
```

Alternatively, if you're connecting to a special region for which standard pattern matching does not work, or if you
need a specific credentials provider, you can specify advanced websocket configuration options.

```typescript
    // sourcing credentials from the Cognito service in this example
    let cognitoConfig: CognitoCredentialsProviderConfig = {
        endpoint: "<cognito endpoint to query credentials from>",
        identity: "<cognito identity to query credentials relative to>"
    };

    let overrideProvider: CredentialsProvider = AwsCredentialsProvider.newCognito(cognitoConfig);

    let wsConfig : WebsocketSigv4Config = {
        credentialsProvider: overrideProvider,
        region: "<special case region>"
    };

    let builder = AwsIotMqtt5ClientConfigBuilder.newWebsocketMqttBuilderWithSigv4Auth(
        "<account-specific endpoint>",
        wsConfig
    );
    // other builder configuration
    // ...
    let client : Mqtt5Client = new Mqtt5Client(builder.build());
```

#### Direct MQTT with Custom Authentication
AWS IoT Core Custom Authentication allows you to use a lambda to gate access to IoT Core resources.  For this authentication method,
you must supply an additional configuration structure containing fields relevant to AWS IoT Core Custom Authentication.

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

If your custom authorizer uses signing, you must specify the three signed token properties as well.  The token signature must be
the URI-encoding of the base64 encoding of the digital signature of the token value via the private key associated with the public key
that was registered with the custom authorizer.  It is your responsibility to URI-encode the token signature.

```typescript
    let customAuthConfig : MqttConnectCustomAuthConfig = {
        authorizerName: "<Name of your custom authorizer>",
        username: "<Value of the username field that should be passed to the authorizer's lambda>",
        password: <Binary data value of the password field to be passed to the authorizer lambda>,
        tokenKeyName: "<Name of the username query param that will contain the token value>",
        tokenValue: "<Value of the username query param that holds the token value that has been signed>",
        tokenSignature: "<URI-encoded base64-encoded digital signature of tokenValue>"
    };
    let builder = AwsIotMqtt5ClientConfigBuilder.newDirectMqttBuilderWithCustomAuth(
        "<account-specific endpoint>",
        customAuthConfig
    );
    let client : Mqtt5Client = new mqtt5.Mqtt5Client(builder.build());
```

In both cases, the builder will construct a final CONNECT packet username field value for you based on the values configured.  Do not add the
token-signing fields to the value of the username that you assign within the custom authentication config structure.  Similarly, do not
add any custom authentication related values to the username in the CONNECT configuration optionally attached to the client configuration.
The builder will do everything for you.

#### Direct MQTT with PKCS11 Method

A MQTT5 direct connection can be made using a PKCS11 device rather than using a PEM encoded private key, the private key for mutual TLS is stored on a PKCS#11 compatible smart card or Hardware Security Module (HSM). To create a MQTT5 builder configured for this connection, see the following code:

```typescript
    let pkcs11Options : Pkcs11Options = {
        pkcs11_lib: "<path to PKCS11 library>",
        user_pin: "<Optional pin for PKCS11 device>",
        slot_id: "<Optional slot ID containing PKCS11 token>",
        token_label: "<Optional label of the PKCS11 token>",
        private_key_object_label: "<Optional label of the private key object on the PKCS#11 token>",
        cert_file_path: "<Path to certificate file. Not necessary if cert_file_contents is used>",
        cert_file_contents: "<Contents of certificate file. Not necessary if cert_file_path is used>"
    };
    let builder = AwsIotMqtt5ClientConfigBuilder.newDirectMqttBuilderWithMtlsFromPkcs11(
        "<account-specific endpoint>",
        pkcs11Options
    );
    let client : Mqtt5Client = new mqtt5.Mqtt5Client(builder.build());
```

Note: Currently, TLS integration with PKCS#11 is only available on Unix devices.

#### Direct MQTT with PKCS12 Method

A MQTT5 direct connection can be made using a PKCS12 file rather than using a PEM encoded private key. To create a MQTT5 builder configured for this connection, see the following code:

```typescript
    let builder = AwsIotMqtt5ClientConfigBuilder.newDirectMqttBuilderWithMtlsFromPkcs12(
        "<account-specific endpoint>",
        "<PKCS12 file>",
        "<PKCS12 password>"
    );
    let client : Mqtt5Client = new mqtt5.Mqtt5Client(builder.build());
```

Note: Currently, TLS integration with PKCS#12 is only available on MacOS devices.

### Adding An HTTP Proxy
No matter what your connection transport or authentication method is, you may connect through an HTTP proxy
by applying proxy configuration to the builder:

```typescript
    let builder = AwsIoTMqtt5ClientConfigBuilder.<authentication method>(...);
    let proxyOptions : HttpProxyOptions = new HttpProxyOptions("<proxy host>", <proxy port>);
    builder.withHttpProxyOptions(proxyOptions);

    let client : Mqtt5Client = new Mqtt5Client(builder.build());
```

SDK Proxy support also includes support for basic authentication and TLS-to-proxy.  SDK proxy support does not include any additional
proxy authentication methods (kerberos, NTLM, etc...) nor does it include non-HTTP proxies (SOCKS5, for example).