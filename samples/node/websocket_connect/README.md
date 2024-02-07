# Websocket Connect

[**Return to main sample list**](../../README.md)

This sample makes an MQTT connection via Websockets and then disconnects. On startup, the device connects to the server via Websockets and then disconnects right after. This sample is for reference on connecting via Websockets. This sample demonstrates the most straightforward way to connect via Websockets by querying the AWS credentials for the connection from the device's environment variables or local files.

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

For this sample, using Websockets will attempt to fetch the AWS credentials to authorize the connection from your environment variables or local files. See the [authorizing direct AWS](https://docs.aws.amazon.com/iot/latest/developerguide/authorizing-direct-aws.html) page for documentation on how to get the AWS credentials, which then you can set to the `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AWS_SESSION_TOKEN` environment variables.

</details>

## How to run

To run the websocket connect sample, go to the `node/websocket_connect` folder and run the following commands:

``` sh
npm install
node dist/index.js --endpoint <endpoint> --ca_file <file> --signing_region <signing region>
```

## Alternate connection configuration methods supported by AWS IoT Core

### MQTT over WebSockets with static AWS credentials

With a help of a static credentials provider your application can use a fixed set of AWS credentials. For that, you need
to instantiate the `StaticCredentialsProviderBuilder` class and provide it with the AWS credentials. The following code
snippet demonstrates how to set up an MQTT3 connection using static AWS credentials for SigV4-based authentication.

```typescript
function build_connection(argv: Args): mqtt.MqttClientConnection {
    let config_builder = iot.AwsIotMqttConnectionConfigBuilder.new_with_websockets({
        region: argv.signing_region,
        credentials_provider: auth.AwsCredentialsProvider.newStatic("<access key>", "<secret key>", "<session token>")
    });

    config_builder.with_clean_session(false);
    config_builder.with_client_id(argv.client_id || "test-" + Math.floor(Math.random() * 100000000));
    config_builder.with_endpoint(argv.endpoint);
    const config = config_builder.build();

    const client = new mqtt.MqttClient();
    return client.new_connection(config);
}
```

### MQTT over WebSockets with Custom Authorizer

An MQTT3 direct connection can be made using a [Custom Authorizer](https://docs.aws.amazon.com/iot/latest/developerguide/custom-authentication.html).
When making a connection to a Custom Authorizer, the MQTT3 client can optionally passing username, password, and/or token
signature arguments based on the configuration of the Custom Authorizer on AWS IoT Core.

You will need to setup your Custom Authorizer so that the lambda function returns a policy document to properly connect.
See [this page](https://docs.aws.amazon.com/iot/latest/developerguide/config-custom-auth.html) on the documentation for
more details and example return results.

If your Custom Authorizer does not use signing, you don't specify anything related to the token signature and can use
the following code:

```typescript
function build_connection(argv: Args): mqtt.MqttClientConnection {
    let config_builder = iot.AwsIotMqttConnectionConfigBuilder.new_with_websockets({
        region: argv.signing_region
    });

    with_custom_authorizer(username : string, authorizer_name : string, authorizer_signature : string, password : string, token_key_name? : string, token_value? : string) {

    config_builder.with_custom_authorizer(
        argv.custom_auth_username,
        argv.custom_auth_authorizer_name,
        undefined,
        argv.custom_auth_password);

    config_builder.with_clean_session(false);
    config_builder.with_client_id(argv.client_id || "test-" + Math.floor(Math.random() * 100000000));
    config_builder.with_endpoint(argv.endpoint);
    const config = config_builder.build();

    const client = new mqtt.MqttClient();
    return client.new_connection(config);
}
```

To run the websocket connect with custom authorizer use the following command:

```sh
npm install
node dist/index.js --endpoint <endpoint> \
--ca_file <file> \
--signing_region <signing region> \
--custom_auth_username <username> \
--custom_auth_authorizer_name <authorizer name> \
--custom_auth_password <password> \
```

If your custom authorizer uses signing, you must specify the three signed token properties as well. It is your responsibility
to URI-encode the username, authorizerName, and tokenKeyName parameters.

```typescript
function build_connection(argv: Args): mqtt.MqttClientConnection {
    let config_builder = iot.AwsIotMqttConnectionConfigBuilder.new_with_websockets({
        region: argv.signing_region
    });

    with_custom_authorizer(username : string, authorizer_name : string, authorizer_signature : string, password : string, token_key_name? : string, token_value? : string) {

    config_builder.with_custom_authorizer(
        argv.custom_auth_username,
        argv.custom_auth_authorizer_name,
        argv.custom_auth_authorizer_signature,
        argv.custom_auth_password,
        argv.custom_auth_token_key_name,
        argv.custom_auth_token_value);

    config_builder.with_clean_session(false);
    config_builder.with_client_id(argv.client_id || "test-" + Math.floor(Math.random() * 100000000));
    config_builder.with_endpoint(argv.endpoint);
    const config = config_builder.build();

    const client = new mqtt.MqttClient();
    return client.new_connection(config);
}
```

To run the websocket connect with custom authorizer using signing use the following command:

```sh
npm install
node dist/index.js --endpoint <endpoint> \
--ca_file <file> \
--signing_region <signing region> \
--custom_auth_username <username> \
--custom_auth_authorizer_name <authorizer name> \
--custom_auth_authorizer_signature <authorizer signature> \
--custom_auth_password <password> \
--custom_auth_token_key_name <token key name> \
--custom_auth_token_key_value <token key value>
```
