# MQTT 5

# Table of contents

* [What's Different? (relative to the MQTT311 implementation)](#whats-different-relative-to-the-mqtt311-implementation)
  * [Major changes](#major-changes)
  * [Minor changes](#minor-changes)
  * [Not supported](#not-supported)
* [Client connection management](#client-connection-management)
  * [Client events](#client-events)
    * [AttemptingConnect](#attemptingconnect)
    * [ConnectionSuccess](#connectionsuccess)
    * [ConnectionFailure](#connectionfailure)
    * [Disconnect](#disconnect)
    * [Stopped](#stopped)
    * [MessageReceived](#messagereceived)
* [Connecting To AWS IoT Core](#connecting-to-aws-iot-core)
  * [NodeJS](#nodejs)
    * [Direct MQTT with X509-based mutual TLS](#direct-mqtt-with-x509-based-mutual-tls)
    * [MQTT over Websockets with Sigv4 authentication](#mqtt-over-websockets-with-sigv4-authentication)
    * [Direct MQTT with Custom Authentication](#direct-mqtt-with-custom-authentication)
    * [Direct MQTT with PKCS11](#direct-mqtt-with-pkcs11-method)
    * [Direct MQTT with PKCS12](#direct-mqtt-with-pkcs12-method)
    * [Direct MQTT with Windows Certificate Store Method](#direct-mqtt-with-windows-certificate-store-method)
    * [HTTP Proxy](#http-proxy)
  * [Browser](#browser)
    * [MQTT over Websockets with Sigv4 authentication](#mqtt-over-websockets-with-sigv4-authentication-1)
    * [MQTT over Websockets with Custom Authentication](#mqtt-over-websockets-with-custom-authentication)
    * [HTTP Proxy](#http-proxy-1)
* [Client Operations](#client-operations)
  * [Subscribe](#subscribe)
  * [Unsubscribe](#unsubscribe)
  * [Publish](#publish)
  * [Disconnect](#disconnect-1)
  * [Advanced Operations and Settings](#advanced-operations-and-settings)
    * [Manual Publish Acknowledgement](#manual-publish-acknowledgement)

Complete API documentation for the CRT's MQTT5 client can be found for
* [NodeJS](https://awslabs.github.io/aws-crt-nodejs/node/modules/mqtt5.html)
* [Browser](https://awslabs.github.io/aws-crt-nodejs/browser/modules/mqtt5.html)

## What's Different? (relative to the MQTT311 implementation)
SDK MQTT5 support comes from a separate client implementation.  By doing so, we took the opportunity to incorporate
feedback about the MQTT311 implementation that we could not apply without making breaking changes.  If you're used to the MQTT311
implementation's API contract, there are a number of differences.

### Major changes
* The MQTT5 client does not treat initial connection failures differently from later connection failures.  With the MQTT311 implementation, a failure during initial connect would halt reconnects.
* The set of client lifecycle events is expanded and contains more detailed information whenever possible.  All protocol data is exposed to the user.
* MQTT operations are completed with the full associated ACK packet when possible.
* New, optional behavioral configuration:
* * IoT Core specific validation - will validate and fail operations that break IoT Core specific restrictions
* * IoT Core specific flow control - will apply flow control to honor IoT Core specific per-connection limits and quotas
* * Flexible queue control - provides a number of options to control what happens to incomplete operations on a disconnection event
* A new API has been added to query the internal state of the client's operation queue.  This API allows the user to make more informed flow control decisions before submitting operations to the client.  Simple, let-the-client-handle-it backpressure mechanisms are planned for future development.
* Data can no longer back up on the socket.  At most one frame of data is ever pending-write on the socket.
* The MQTT5 client has a single message-received callback.  Per-subscription callbacks are not supported.

### Minor changes
* Public API terminology has changed.  You **start** or **stop** the MQTT5 client.  This removes the semantic confusion with connect/disconnect as client-level controls vs. internal recurrent networking events.
* With the MQTT311 implementation, there were two separate objects, a client and a connection.  With MQTT5, there is only the client.

### Not supported
Not all parts of the MQTT5 spec are supported by the implementation.  We currently do not support:
* AUTH packets and the authentication fields in the CONNECT packet
* QoS 2

## Client connection management
Once created, an MQTT5 client's configuration is immutable.  Invoking start() on the client will put it into an active state where it
recurrently establishes a connection to the configured remote endpoint.  Reconnecting continues until you invoke `stop()`.

```typescript
    // Create the client
    let config : Mqtt5ClientConfig = {
        ...
    };

    let client : Mqtt5Client = new Mqtt5Client(config);

    // Attach event listeners
    client.on("messageReceived",(eventData: MessageReceivedEvent) : void => {
        console.log("Message Received event: " + JSON.stringify(eventData.message));
    });
    // etc...

    // Use the client
    client.start();
    ...
```

Invoking `stop()` breaks the current connection (if any) and moves the client into an idle state. When finished with an MQTT5 client,
you **must call close()** on it or any associated native resources may leak.

```js
    // Shutdown and clean up
    const stopped = once(client, Mqtt5Client.STOPPED);
    client.stop();
    await stopped;

    // release any native resources associated with the client
    client.close();
```

## Client Events
The MQTT5 client emits a set of events related to state and network status changes.  Event listeners may be attached for each event you
wish to react to.  Each event emits a single collection of event data (which may be empty, based on the event).

#### AttemptingConnect
Emitted when the client begins to open a connection to the configured endpoint.  The AttemptingConnectEvent contains no further data.

#### ConnectionSuccess
Emitted when a connection attempt succeeds based on receipt of an affirmative CONNACK packet from the MQTT broker.  A ConnectionSuccessEvent
 includes the MQTT broker's CONNACK packet, as well as a NegotiatedSettings structure which contains the final values for all
variable MQTT session settings (based on protocol defaults, client configuration, and server response).

#### ConnectionFailure
Emitted when a connection attempt fails at any point between DNS resolution and CONNACK receipt.  In addition to an error code, additional
data may be present in the ConnectionFailureEvent based on the context.  For example, if the remote endpoint sent a CONNACK with a failing
reason code, the CONNACK packet will be included in the event data.

#### Disconnect
Emitted when the client's network connection is shut down, either by a local action, event, or a remote close or reset.  Only emitted after
a ConnectionSuccess event: a network connection that is shut down during the connecting process manifests as a ConnectionFailure event.
A DisconnectEvent will always include an error code.  If the event is due to the receipt of a server-sent DISCONNECT packet,
the packet will also be included with the event data.

#### Stopped
Emitted once the client has shutdown any associated network connection and entered an idle state where it will no longer attempt to
reconnect.  A StoppedEvent contains no additional data.  Only emitted after an invocation of `stop()` on the client.  A stopped client
may always be started again.

#### MessageReceived
Emitted for each PUBLISH packet received by the client.  MessageReceivedEvent data contains the complete PublishPacket received.

## Connecting To AWS IoT Core
We strongly recommend using the AwsIotMqtt5ClientConfigBuilder class to configure MQTT5 clients when connecting to AWS IoT Core.  The builder
simplifies configuration for all authentication methods supported by AWS IoT Core.  This section shows samples for all authentication
possibilities.  There are slight differences in the APIs for the browser implementation vs. the NodeJS implementation, so each environment
is given separate samples.

### NodeJS
The MQTT5 implementation for NodeJS supports both (direct) MQTT-over-TCP and MQTT-over-websockets.  All connections are protected by TLS.

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

#### Direct MQTT with Windows Certificate Store Method

A MQTT5 direct connection can be made with mutual TLS with the certificate and private key in the Windows certificate store,
rather than simply being files on disk. To create a MQTT5 builder configured for this connection, see the following code:

```typescript
    // Certificate store path below is an example.
    let certificateStorePath : string = "CurrentUser\\MY\\A11F8A9B5DF5B98BA3508FBCA575D09570E0D2C6";
    let builder = AwsIotMqtt5ClientConfigBuilder.newDirectMqttBuilderWithMtlsFromWindowsCertStorePath(
        "<account-specific endpoint>",
        certificateStorePath
    );
    let client : Mqtt5Client = new mqtt5.Mqtt5Client(builder.build());
```

Note: Windows Certificate Store connection support is only available on Windows devices.

#### HTTP Proxy
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

### Browser
The MQTT5 implementation for the browser supports MQTT-over-websockets using either Sigv4 authentication or AWS IoT Core Custom Authentication.
All connections are protected by TLS.

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

#### HTTP Proxy
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

## Client Operations
There are four basic MQTT operations you can perform with the MQTT5 client.

### Subscribe
The Subscribe operation takes a description of the SUBSCRIBE packet you wish to send and returns a promise that resolves successfully with
the corresponding SUBACK returned by the broker; the promise is rejected with an error if anything goes wrong before the SUBACK is received.
You should always check the reason codes of a SUBACK completion to determine if the subscribe operation actually succeeded.

```typescript
    const suback: SubackPacket = await client.subscribe({
        subscriptions: [
            { qos: mqtt5_packet.QoS.AtLeastOnce, topicFilter: "hello/world/qos1" }
        ]
    });
```

A fully-accurate SUBACK is only available in NodeJS.  The third-party browser MQTT library does not expose the full SUBACK packet.

### Unsubscribe
The Unsubscribe operation takes a description of the UNSUBSCRIBE packet you wish to send and returns a promise that resolves successfully with
the corresponding UNSUBACK returned by the broker; the promise is rejected with an error if anything goes wrong before the UNSUBACK is received.
You should always check the reason codes of an UNSUBACK completion to determine if the unsubscribe operation actually succeeded.

```typescript
    let unsuback: UnsubackPacket = await client.unsubscribe({
        topicFilters: [
            "hello/world/qos1"
        ]
    });
```

An accurate UNSUBACK is only available in NodeJS. The third-party browser MQTT library does not expose the UNSUBACK packet.

### Publish
The Publish operation takes a description of the PUBLISH packet you wish to send and returns a promise of polymorphic value.

* If the PUBLISH was a QoS 0 publish, then the promise has a unit (void) value and is completed as soon as the packet has been written to the socket.
* If the PUBLISH was a QoS 1 publish, then the promise has a PUBACK packet value and is completed as soon as the PUBACK is received from the broker.

If the operation fails for any reason before these respective completion events, the promise is rejected with a descriptive error.
You should always check the reason code of a PUBACK completion to determine if a QoS 1 publish operation actually succeeded.

```typescript
    const publishResult = await client.publish({
        qos: mqtt5_packet.QoS.AtLeastOnce,
        topicName: "hello/world/qos1",
        payload: "This is the payload of a QoS 1 publish"
    });

    // on successful broker response, publishResult will be a PubackPacket
```

### Disconnect
The `stop()` API supports a DISCONNECT packet as an optional parameter.  If supplied, the DISCONNECT packet will be sent to the server
prior to closing the socket.  The DISCONNECT packet will not be sent if there is no network connection currently active.

There is no promise returned by a call to `stop()` but you may listen for the 'stopped' event on the client.

```typescript
let disconnect: DisconnectPacket = {
    reasonCode: DisconnectReasonCode.DisconnectWithWillMessage,
    sessionExpiryIntervalSeconds: 3600
};
client.stop(disconnect);
```

## Advanced Operations and Settings

### Manual Publish Acknowledgement

By default, the MQTT5 client automatically sends a PUBACK for every QoS 1 PUBLISH it receives, immediately after all `messageReceived` event listeners have been called. Manual publish acknowledgement gives you control over when that PUBACK is sent, allowing you to defer acknowledgement until after your application has fully processed the message — for example, after persisting it to a database or forwarding it to another service.

When a QoS 1 PUBLISH is received, the `MessageReceivedEvent` will include an `acknowledgementControl` field of type `PublishAcknowledgementHandleWrapper`. To take manual control of the PUBACK, call `acknowledgementControl.acquireHandle()` **within** the `messageReceived` event listener. This returns a `PublishAcknowledgementHandle` that you can store and use later to send the PUBACK by calling `handle.invokeAcknowledgement()`.

**Important constraints:**
* `acquireHandle()` must be called **synchronously** within a `messageReceived` event listener. Once a listener returns (or yields via `await`), the window to acquire the handle has closed. Calling `acquireHandle()` after all listeners have synchronously returned — including from asynchronous continuations within a listener — will return `null`.
* `acquireHandle()` may only be called once. Subsequent calls return `null`.
* This is only relevant for QoS 1 messages. For QoS 0 messages, `acknowledgementControl` will be `undefined`.
* If `acquireHandle()` is not called by any listener, the client will automatically send the PUBACK after all listeners have returned.

The following example shows how to acquire the acknowledgement handle within the event listener and invoke it later:

```typescript
import { mqtt5, mqtt5_packet } from "aws-crt";

// A variable to hold the acknowledgement handle for later use
let pendingAck: mqtt5.PublishAcknowledgementHandle | null = null;

client.on('messageReceived', (eventData: mqtt5.MessageReceivedEvent): void => {
    console.log("Message received on topic: " + eventData.message.topicName);

    if (eventData.message.qos === mqtt5_packet.QoS.AtLeastOnce && eventData.acknowledgementControl) {
        // Acquire manual control of the PUBACK for this QoS 1 message.
        // This must be called within the event listener. After all listeners
        // have returned, acquireHandle() will return null.
        pendingAck = eventData.acknowledgementControl.acquireHandle();

        // The PUBACK will NOT be sent automatically because we acquired the handle.
        // Process the message here (e.g., persist to storage, forward to another service).
    }
});

// ... connect and subscribe ...

// After processing is complete, send the PUBACK by invoking the acknowledgement.
if (pendingAck !== null) {
    pendingAck.invokeAcknowledgement();
    pendingAck = null;
}
```

**AWS IoT broker redelivery behavior**

The AWS IoT broker will periodically resend unacknowledged QoS 1 PUBLISH packets. These redeliveries should be treated as duplicates even if the DUP flag in the PUBLISH packet is not set. If `acknowledgementControl.acquireHandle()` is not called again for a redelivered packet, the acknowledgement will be sent automatically.

**Session resumption after disconnect/reconnect**

Upon a disconnect and reconnect of the MQTT5 client, if a session is resumed, any previously acquired `PublishAcknowledgementHandle` is void. The broker will resend the unacknowledged PUBLISH packet, and `acknowledgementControl.acquireHandle()` must be called again within the event listener for that resent packet. If the resent packet is not handled for manual acknowledgement, the acknowledgement will be sent automatically.
