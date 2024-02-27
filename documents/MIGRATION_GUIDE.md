# Migrate from v1 to v2 of the AWS IoT SDK for JavaScript

The AWS IoT SDK for JavaScript v2 is a major rewrite of the AWS IoT Device SDK for JavaScript v1 code base. It includes many updates, such as improved
consistency, ease of use, more detailed information about client status. This guide describes the major features that
are new in the v2 SDK, and provides guidance on how to migrate your code to v2 from v1 of the AWS IoT SDK for JavaScript.

> [!NOTE]
> If you can't find the information you need in this guide, visit the [How to get help](#how-to-get-help) section for more help and guidance.

* [What's new in AWS IoT Device SDK for JavaScript v2](#whats-new-in-aws-iot-device-sdk-for-javascript-v2)
* [How to get started with AWS IoT Device SDK for JavaScript v2](#how-to-get-started-with-aws-iot-device-sdk-for-javascript-v2)
    * [Package name change](#package-name-change)
    * [MQTT protocol](#mqtt-protocol)
    * [Browser applications](#browser-applications)
    * [Client builder](#client-builder)
    * [Client start](#client-start)
    * [Connection types and features](#connection-types-and-features)
    * [Lifecycle events](#lifecycle-events)
    * [Publish](#publish)
    * [Subscribe](#subscribe)
    * [Unsubscribe](#unsubscribe)
    * [Client stop](#client-stop)
    * [Client shutdown](#client-shutdown)
    * [Reconnects](#reconnects)
    * [Offline operations queue](#offline-operations-queue)
    * [Logging](#logging)
    * [Client for AWS IoT Device Shadow](#client-for-aws-iot-device-shadow)
    * [Client for AWS IoT Jobs](#client-for-aws-iot-jobs)
    * [Client for AWS IoT fleet provisioning](#client-for-aws-iot-fleet-provisioning)
    * [Example](#example)
* [How to get help](#how-to-get-help)
* [Appendix](#appendix)
    * [MQTT5 features](#mqtt5-features)

## What's new in AWS IoT Device SDK for JavaScript v2

* The v2 SDK provides an MQTT5 Client which implements the MQTT5 protocol, the next step in evolution of the MQTT protocol.
* The v2 SDK supports the fleet provisioning AWS IoT service.
* The v2 SDK provides more ways to connect to AWS IoT Core, see the [Connection types and features](#connection-types-and-features) section for details.

## How to get started with AWS IoT Device SDK for JavaScript v2

Public APIs for almost all actions and operations have changed significantly. There're differences between the v1 SDK and
the v2 SDK. This section describes the changes you need to apply to your project with the v1 SDK to start using the v2 SDK.
For more information about MQTT5, visit [MQTT5 User Guide](https://github.com/awslabs/aws-crt-nodejs/blob/main/MQTT5-UserGuide.md).

### Package name change

The v1 SDK package is [aws-iot-device-sdk](https://www.npmjs.com/package/aws-iot-device-sdk).

The v2 SDK package is [aws-iot-device-sdk-v2](https://www.npmjs.com/package/aws-iot-device-sdk-v2).


### MQTT Protocol

The v1 SDK uses an MQTT version 3.1.1 client by default. It's possible to enable MQTT5 protocol by setting `protocolVersion` option.

The v2 SDK provides MQTT version 3.1.1 and MQTT version 5.0 client implementations. This guide focuses on the MQTT5 because
this version is a significant improvement over MQTT3. For more information, see the [MQTT5 features](#mqtt5-features) section.


### Browser applications

Browser applications connect to AWS IoT using [MQTT over the Secure WebSocket Protocol](http://docs.aws.amazon.com/iot/latest/developerguide/protocols.html).
There are some important differences between Node.js and browser environments: for example, when running in a browser
environment, the SDK doesn't have access to the filesystem or process' environment variables. 

The v1 SDK supports only Node.js applications out of the box. But it can be packaged to run in a browser using [browserify](http://browserify.org/)
or [webpack](https://webpack.js.org/). Readme file for the v1 SDK contains a [section](https://github.com/aws/aws-iot-device-sdk-js?tab=readme-ov-file#browser)
describing how to prepare SDK to work in browser environment.

The v2 SDK provides a designated [API for browser](https://aws.github.io/aws-iot-device-sdk-js-v2/browser/index.html)
applications. The MQTT5 implementation for the browser supports MQTT-over-websockets using either Sigv4 authentication
or AWS IoT Core Custom Authentication (see [Connection Types and Features](#connection-types-and-features)
for more details).

> [!NOTE]
> The v2 SDK will access the Node.js API by default, so you should configure the path in the `tsconfig.json` file to ensure
that your application utilizes the browser API.


### Client Builder

To access AWS IoT services, you must initialize an MQTT client.

In the v1 SDK, the [awsIot.device](https://github.com/aws/aws-iot-device-sdk-js?tab=readme-ov-file#device) module represents
an MQTT client. You instantiate the client directly by passing all the required parameters to the class constructor. It's
possible to change the client settings after its creation using the `set*` methods like `setKeepAliveInterval` or `setMaxConnectionRetries`.

In the v2 SDK, the [Mqtt5Client](https://aws.github.io/aws-iot-device-sdk-js-v2/node/classes/mqtt5.Mqtt5Client.html) class
represents an MQTT client, specifically for MQTT5 protocol. The v2 SDK provides an [MQTT5 client builder](https://aws.github.io/aws-iot-device-sdk-js-v2/node/classes/iot.AwsIotMqtt5ClientConfigBuilder.html)
designed to easily create common configuration types such as direct MQTT or WebSocket connections. After an MQTT5 client
is built and finalized, the settings of the resulting MQTT5 client cannot be modified.

#### Example of creating a client in the v1 SDK

```typescript
var awsIot = require('aws-iot-device-sdk');

var clientEndpoint = "<prefix>-ats.iot.<region>.amazonaws.com";
var clientId = "<unique client id>";
var certificateFile = "<certificate file>";  // X.509 based certificate file
var privateKeyFile = "<private key file>";   // PEM encoded private key file

var device = awsIot.device({
        keyPath: privateKeyFile,
        certPath: certificateFile,
        clientId: clientId,
        host: clientEndpoint
});
```

#### Example of creating a client in the v2 SDK

The v2 SDK supports different connection types. Given the same input parameters as in the v1 example above, the recommended
method to create an MQTT5 client will be [newDirectMqttBuilderWithMtlsFromPath](https://aws.github.io/aws-iot-device-sdk-js-v2/node/classes/iot.AwsIotMqtt5ClientConfigBuilder.html#newDirectMqttBuilderWithMtlsFromPath). 

```typescript
import { mqtt5, iot } from "aws-iot-device-sdk-v2";

const clientEndpoint : string = "<prefix>-ats.iot.<region>.amazonaws.com";
const clientId : string = "<unique client id>";
const certificateFile : string = "<certificate file>";  // X.509 based certificate file
const privateKeyFile : string = "<private key file>";   // PEM encoded private key file

let builder = iot.AwsIotMqtt5ClientConfigBuilder.newDirectMqttBuilderWithMtlsFromPath(
        clientEndpoint,
        certificateFile,
        privateKeyFile

builder.withConnectProperties({
    clientId: clientId
});

let config : mqtt5.Mqtt5ClientConfig = builder.build();

let client : mqtt5.Mqtt5Client = new mqtt5.Mqtt5Client(config);
```

For more information, refer to the [Connection types and features](#connection-types-and-features) section for other connection types supported by the v2 SDK.

### Client start

To connect to the server in the v1 SDK, you instantiate a `device` object.

To connect to the server in the v2 SDK, you call the `start()` function of the MQTT5 client.

#### Example of connecting to a server in the v2 SDK

```typescript
let config : mqtt5.Mqtt5ClientConfig = builder.build();
let client : mqtt5.Mqtt5Client = new mqtt5.Mqtt5Client(config);
client.start();
```

### Connection types and features

The v1 SDK supports four types of connections to the AWS IoT service: MQTT with X.509 certificate, MQTT over Secure
WebSocket with SigV4 authentication, MQTT over Secure WebSocket with Cognito authentication, and MQTT over Secure
WebSocket using a custom authorization function to authenticate.

The v2 SDK adds a collection of connection types and cryptography formats (e.g. [PKCS #11](https://en.wikipedia.org/wiki/PKCS_11)),
credential providers (e.g. [Windows Certificate Store](https://learn.microsoft.com/en-us/windows-hardware/drivers/install/certificate-stores)),
and other connection-related features.\
For more information, refer to the [Connecting to AWS IoT Core](https://github.com/awslabs/aws-crt-nodejs/blob/main/MQTT5-UserGuide.md#connecting-to-aws-iot-core)
section of the MQTT5 user guide for detailed information and code snippets on each connection type and connection feature.

> [!NOTE]
> Both v1 and v2 SDKs support only SigV4 and Custom authentication in browser environment.

| Connection type/feature                                                | v1 SDK - Node.js                      | v1 SDK - browser                      |v2 SDK - Node.js                  | v2 SDK - browser                 |User guide section|
|------------------------------------------------------------------------|---------------------------------------|---------------------------------------|----------------------------------|----------------------------------|------------------|
| MQTT over Secure WebSocket with AWS SigV4 authentication               | $${\Large\color{green}&#10004}$$      | $${\Large\color{green}&#10004}$$      | $${\Large\color{green}&#10004}$$ | $${\Large\color{green}&#10004}$$ | [Node.js section](https://github.com/awslabs/aws-crt-nodejs/blob/main/MQTT5-UserGuide.md#mqtt-over-websockets-with-sigv4-authentication) [Browser section](https://github.com/awslabs/aws-crt-nodejs/blob/main/MQTT5-UserGuide.md#mqtt-over-websockets-with-sigv4-authentication-1) |
| MQTT over Secure WebSocket with Cognito Authentication Method          | $${\Large\color{green}&#10004}$$      | $${\Large\color{green}&#10004}$$      | $${\Large\color{green}&#10004}$$ | $${\Large\color{green}&#10004}$$ | [Node.js section](https://github.com/awslabs/aws-crt-nodejs/blob/main/MQTT5-UserGuide.md#mqtt-over-websockets-with-sigv4-authentication) |
| MQTT over Secure WebSocket with Custom Authentication                  | $${\Large\color{green}&#10004}$$      | $${\Large\color{green}&#10004}$$      | $${\Large\color{green}&#10004}$$ | $${\Large\color{green}&#10004}$$ | [Node.js section](https://github.com/awslabs/aws-crt-nodejs/blob/main/MQTT5-UserGuide.md#direct-mqtt-with-custom-authentication) [Browser section](https://github.com/awslabs/aws-crt-nodejs/blob/main/MQTT5-UserGuide.md#mqtt-over-websockets-with-custom-authentication) |
| MQTT (over TLS 1.2) with X.509 certificate based mutual authentication | $${\Large\color{green}&#10004}$$      | $${\Large\color{red}&#10008}$$        | $${\Large\color{green}&#10004}$$ | $${\Large\color{red}&#10008}$$   | [Node.js section](https://github.com/awslabs/aws-crt-nodejs/blob/main/MQTT5-UserGuide.md#direct-mqtt-with-x509-based-mutual-tls) |
| MQTT with PKCS12 Method                                                | $${\Large\color{orange}&#10004\*}$$   | $${\Large\color{red}&#10008}$$        | $${\Large\color{green}&#10004}$$ | $${\Large\color{red}&#10008}$$   | [Node.js section](https://github.com/awslabs/aws-crt-nodejs/blob/main/MQTT5-UserGuide.md#direct-mqtt-with-pkcs12-method) |
| MQTT with Windows Certificate Store Method                             | $${\Large\color{red}&#10008}$$        | $${\Large\color{red}&#10008}$$        | $${\Large\color{green}&#10004}$$ | $${\Large\color{red}&#10008}$$   | [Node.js section](https://github.com/awslabs/aws-crt-nodejs/blob/main/MQTT5-UserGuide.md#direct-mqtt-with-windows-certificate-store-method) |
| MQTT with PKCS11 Method                                                | $${\Large\color{red}&#10008}$$        | $${\Large\color{red}&#10008}$$        | $${\Large\color{green}&#10004}$$ | $${\Large\color{red}&#10008}$$   | [Node.js section](https://github.com/awslabs/aws-crt-nodejs/blob/main/MQTT5-UserGuide.md#direct-mqtt-with-pkcs11-method) |
| HTTP Proxy                                                             | $${\Large\color{orange}&#10004\*\*}$$ | $${\Large\color{orange}&#10004\*\*}$$ | $${\Large\color{green}&#10004}$$ | $${\Large\color{green}&#10004}$$ | [Node.js section](https://github.com/awslabs/aws-crt-nodejs/blob/main/MQTT5-UserGuide.md#http-proxy) [Browser section](https://github.com/awslabs/aws-crt-nodejs/blob/main/MQTT5-UserGuide.md#http-proxy-1) |

${\Large\color{orange}&#10004\*}$ - To get this connection type work in the v1 SDK, you need to extract a private key from a PKCS #12 file.\
${\Large\color{orange}&#10004\*\*}$ - The v1 SDK does not allow specifying HTTP proxy, but it is possible to configure systemwide proxy.

#### Example of creating connection in the v1 SDK

```typescript
var awsIot = require('aws-iot-device-sdk');

var clientEndpoint = "<prefix>-ats.iot.<region>.amazonaws.com";
var clientId = "<unique client id>";
var certificateFile = "<certificate file>";  // X.509 based certificate file
var privateKeyFile = "<private key file>";   // PEM encoded private key file

// A connection will be established on instantiating a device object.
var device = awsIot.device({
   keyPath: privateKeyFile,
  certPath: certificateFile,
  clientId: clientId,
      host: clientEndpoint
});
```

#### Example of creating connection in the v2 SDK

```typescript
import { mqtt5, iot } from "aws-iot-device-sdk-v2";

const clientEndpoint : string = "<prefix>-ats.iot.<region>.amazonaws.com";
const clientId : string = "<unique client id>";
const certificateFile : string = "<certificate file>";  // X.509 based certificate file
const privateKeyFile : string = "<private key file>";   // PEM encoded private key file

let builder = iot.AwsIotMqtt5ClientConfigBuilder.newDirectMqttBuilderWithMtlsFromPath(
        clientEndpoint,
        certificateFile,
        privateKeyFile

builder.withConnectProperties({
    clientId: clientId
});

let config : mqtt5.Mqtt5ClientConfig = builder.build();

let client : mqtt5.Mqtt5Client = new mqtt5.Mqtt5Client(config);

// Connection of client is controlled and started explicitly with start().
client.start();
```


### Lifecycle events

Both v1 and v2 SDKs provide lifecycle events for the MQTT clients.

The v1 SDK provides a set of lifecycle events: *connect*, *reconnect*, *close*, *disconnect*, *offline*, *error*, *end*.
You can supply a custom callback function via `on` method of the `device` instance. It is recommended to use lifecycle
events callbacks to help determine the state of the MQTT client during operation.

The v2 SDK defines its own set of lifecycle events: *AttemptingConnect*, *ConnectionSuccess*, *ConnectionFailure*, *Disconnect*,
and *Stopped*. For more information, refer to the [MQTT5 user guide](https://github.com/awslabs/aws-crt-nodejs/blob/main/MQTT5-UserGuide.md#client-events).

#### Example of setting lifecycle events in the v1 SDK

```typescript
device
    .on('connect', function() {
        console.log('connect');
    });
device
    .on('close', function() {
        console.log('close');
    });
device
    .on('reconnect', function() {
        console.log('reconnect');
    });
device
    .on('offline', function() {
        console.log('offline');
    });
device
    .on('error', function(error) {
        console.log('error', error);
    });
```

#### Example of setting lifecycle events in the v2 SDK

```typescript
client.on('error', (error: ICrtError) => {
    console.log("Error event: " + error.toString());
});

client.on('attemptingConnect', (eventData: mqtt5.AttemptingConnectEvent) => {
    console.log("Attempting Connect event");
});

client.on('connectionSuccess', (eventData: mqtt5.ConnectionSuccessEvent) => {
    console.log("Connection Success event");
    console.log ("Connack: " + JSON.stringify(eventData.connack));
    console.log ("Settings: " + JSON.stringify(eventData.settings));
});

client.on('connectionFailure', (eventData: mqtt5.ConnectionFailureEvent) => {
    console.log("Connection failure event: " + eventData.error.toString());
    if (eventData.connack) {
        console.log ("Connack: " + JSON.stringify(eventData.connack));
    }
});

client.on('disconnection', (eventData: mqtt5.DisconnectionEvent) => {
    console.log("Disconnection event: " + eventData.error.toString());
    if (eventData.disconnect !== undefined) {
        console.log('Disconnect packet: ' + JSON.stringify(eventData.disconnect));
    }
});

client.on('stopped', (eventData: mqtt5.StoppedEvent) => {
    console.log("Stopped event");
});
```


### Publish

The `publish` operation in the v1 SDK takes a topic and a message directly as parameters. The result of the `publish`
operation in the v1 SDK is reported via a callback.

In the v2 SDK, the [publish](https://aws.github.io/aws-iot-device-sdk-js-v2/node/classes/mqtt5.Mqtt5Client.html#publish)
operation takes a description of the PUBLISH packet you wish to send and returns a promise of polymorphic value.

* If the PUBLISH was a QoS 0 (mqtt5_packet.QoS.AtMostOnce) publish, then the promise has a unit (void) value and is
completed as soon as the packet has been written to the socket.
* If the PUBLISH was a QoS 1 (mqtt5_packet.QoS.AtLeastOnce) publish, then the promise has a PUBACK packet value and is
completed as soon as the PUBACK is received from the broker.

If the operation fails for any reason before these respective completion events, the promise is rejected with a descriptive
error. You should always check the reason code of a PUBACK completion to determine if a QoS 1 publish operation actually
succeeded.

> [!NOTE]
> If you publish using the v1 client to a topic that is not allowed by a policy, AWS IoT Core service will close the connection.
> If you publish using the v2 MQTT5 client to a topic not allowed by a policy, AWS IoT Core service will not close the connection
> and will instead send a PUBACK with the "Not authorized" reason code.

#### Example of publishing in the v1 SDK

```typescript
device.publish(
    "my/topic",
    JSON.stringify("This is a qos 0 payload"),
    { qos: 1 },  // Default QoS level is 0.
    function (err, resp) { console.log("PUBACK received"); });
```

#### Example of publishing in the v2 SDK

```typescript
const res = await client.publish({
    qos: mqtt5.QoS.AtLeastOnce,
    topicName: "my/topic",
    payload: JSON.stringify("This is a qos 0 payload")
});

console.log('QoS 1 Publish result: ' + JSON.stringify(res));
```


### Subscribe

To subscribe to a topic in the v1 SDK, you should provide one or multiple topics to the [subscribe](https://github.com/mqttjs/MQTT.js/blob/master/README.md#subscribe)
operation.

In the v2 SDK, the [subscribe](https://aws.github.io/aws-iot-device-sdk-js-v2/node/classes/mqtt5.Mqtt5Client.html#subscribe)
operation takes a description of the [SubscribePacket](https://aws.github.io/aws-iot-device-sdk-js-v2/browser/interfaces/mqtt5.SubscribePacket.html)
you wish to send and returns a promise that resolves successfully with the corresponding [SubackPacket](https://aws.github.io/aws-iot-device-sdk-js-v2/browser/interfaces/mqtt5.SubackPacket.html)
returned by the broker. The `SubscribePacket` can describe more than one topic. The promise is rejected with an error if anything goes wrong before
the [SubackPacket](https://aws.github.io/aws-iot-device-sdk-js-v2/browser/interfaces/mqtt5.SubackPacket.html) is received.
You should always check the reason codes of a SUBACK completion to determine if the subscribe operation actually succeeded.

> [!NOTE]
> If you subscribe using the v1 client to a topic that is not allowed by a policy, AWS IoT Core service will close the connection.
> If you subscribe using the v2 MQTT5 client to a topic not allowed by a policy, AWS IoT Core service will not close the connection
> and will instead send a SUBACK with the "Not authorized" reason code.

#### Example of subscribing in the v1 SDK

```typescript
device
    .on('message', function(topic, payload) {
        console.log('message', topic, payload.toString());
    });

device.subscribe('my/topic');
```

#### Example of subscribing in the v2 SDK

```typescript
client.on("messageReceived", (eventData: mqtt5.MessageReceivedEvent) : void => {
    // evntData wraps message and topic.
    console.log("message: " + JSON.stringify(eventData.message));
});

const suback: SubackPacket = await client.subscribe({
    subscriptions: [
        { qos: mqtt5_packet.QoS.AtMostOnce, topicFilter: "my/topic" }
    ]
});
```


### Unsubscribe

To unsubscribe from topic in the v1 SDK, you should provide one or multiple topics to the [unsubscribe](https://github.com/mqttjs/MQTT.js/blob/master/README.md#unsubscribe)
operation. You can provide an optional callback that will be fired on receiving UNSUBACK packet.

In the v2 SDK, the [unsubscribe](https://aws.github.io/aws-iot-device-sdk-js-v2/browser/classes/mqtt5.Mqtt5Client.html#unsubscribe)
operation takes a description of the [UnsubscribePacket](https://aws.github.io/aws-iot-device-sdk-js-v2/browser/interfaces/mqtt5.UnsubscribePacket.html)
you wish to send and returns a promise that resolves successfully with the corresponding [UnsubackPacket](https://aws.github.io/aws-iot-device-sdk-js-v2/browser/interfaces/mqtt5.UnsubackPacket.html)
returned by the broker. The `UnsubscribePacket` can describe more than one topic. The promise is rejected with an error if
anything goes wrong before the [UnsubackPacket](https://aws.github.io/aws-iot-device-sdk-js-v2/browser/interfaces/mqtt5.UnsubackPacket.html)
is received. You should always check the reason codes of an UNSUBACK completion to determine if the unsubscribe operation
actually succeeded.

#### Example of unsubscribing in the v1 SDK

```typescript
device.unsubscribe("my/topic", function(err) {
    console.log("Unsubscribed");
});
```

#### Example of unsubscribing in the v2 SDK

```typescript
let unsuback = await client.unsubscribe({
    topicFilters: [ "my/topic" ]
});
console.log('Unsuback result: ' + JSON.stringify(unsuback));
```


### Client Stop

In the v1 SDK, the `end` method in the `device` class disconnects the client. The force parameter determines whether to close
the connection immediately, or wait for in-flight messages to be sent.

In the v2 SDK, an MQTT5 client can stop a session by calling the [stop](https://aws.github.io/aws-iot-device-sdk-js-v2/browser/classes/mqtt5.Mqtt5Client.html#stop)
method. You can provide an optional [DisconnectPacket](https://aws.github.io/aws-iot-device-sdk-js-v2/browser/interfaces/mqtt5.DisconnectPacket.html)
parameter. A closed client can be started again by calling [start](https://aws.github.io/aws-iot-device-sdk-js-v2/browser/classes/mqtt5.Mqtt5Client.html#start).

#### Example of disconnecting a client in the v1 SDK

```typescript
device.end();
```

#### Example of disconnecting a client in the v2 SDK

```typescript
client.stop();
```


### Client Shutdown

The v1 SDK automatically cleans resources on shutdown.

In the v2 SDK, when an MQTT5 client is no longer required, your program **must** close it explicitly via a [close](https://aws.github.io/aws-iot-device-sdk-js-v2/browser/classes/mqtt5.Mqtt5Client.html#close) call.

#### Example of closing a client in the v2 SDK

```typescript
// Shutdown and clean up.
const stopped = once(client, Mqtt5Client.STOPPED);
client.stop();
await stopped;

// Release any resources associated with the client.
client.close();
```


### Reconnects

In the v1 SDK, the `reconnectPeriod` option enables reconnection. The default value is 1000 ms which means it will try to
reconnect one second after losing the connection.

The v2 SDK attempts to reconnect automatically until connection succeeds or `client.stop()` is called. The reconnection parameters,
such as min/max delays and [jitter modes](https://aws.github.io/aws-iot-device-sdk-js-v2/node/classes/iot.AwsIotMqtt5ClientConfigBuilder.html#withRetryJitterMode),
are configurable through [AwsIotMqtt5ClientConfigBuilder](https://aws.github.io/aws-iot-device-sdk-js-v2/node/classes/iot.AwsIotMqtt5ClientConfigBuilder.html).


#### Example of tweaking reconnection settings in the v1 SDK

```typescript
var device = deviceModule({
    certPath: "<certificate file>",
    // ...
    reconnectPeriod: 1000,          // ms
    minimumConnectionTimeMs: 2500,  // ms
    maximumReconnectTimeMs: 10000   // ms
});
```

#### Example of tweaking reconnection settings in the v2 SDK

```typescript
configBbuilder.withMinReconnectDelayMs(2500);
configBbuilder.withMaxReconnectDelayMs(10000);
configBbuilder.withRetryJitterMode(mqtt5.RetryJitterMode.Full);

let config : mqtt5.Mqtt5ClientConfig = configBuilder.build();
let client : mqtt5.Mqtt5Client = new mqtt5.Mqtt5Client(config);
```


### Offline Operations Queue

The v1 SDK provides a set of options to configure behavior when a client is offline. By default, the number of queued messages
are not limited.

The v2 SDK does not limit the number of in-flight messages. Additionally, the v2 SDK provides a way to configure which kind of
packets will be placed into the offline queue when the client is in the disconnected state. The following code snippet
demonstrates how to enable storing all packets except QOS0 publish packets in the offline queue on disconnect:

#### Example of configuring the offline queue in the v1 SDK

```typescript
var device = deviceModule({
    // ...
    offlineQueueing: true,
    offlineQueueMaxSize: 0,  // no limit
    offlineQueueDropBehavior: "oldest",
    drainTimeMs: 250,  // ms
});
```

#### Example of configuring the offline queue in the v2 SDK

```typescript
configBuilder.withOfflineQueueBehavior(mqtt5.ClientOperationQueueBehavior.FailQos0PublishOnDisconnect);
let config : mqtt5.Mqtt5ClientConfig = configBuilder.build();
let client : mqtt5.Mqtt5Client = new mqtt5.Mqtt5Client(config);
```

> [!NOTE]
> AWS IoT Core [limits the number of allowed operations per second](https://docs.aws.amazon.com/general/latest/gr/iot-core.html#message-broker-limits).
> The [getOperationStatistics](https://aws.github.io/aws-iot-device-sdk-js-v2/node/classes/mqtt5.Mqtt5Client.html#getOperationalStatistics)
> method returns the current state of an `Mqtt5Client` object's queue of operations, which may help with tracking the number
> of in-flight messages. On reconnect, the v2 MQTT5 client will throttle the messages in the offline queue to prevent sending
> too many messages too fast from the queue.

#### Example of getting client operational statistics in the v2 SDK

```typescript
let statistics : mqtt5.ClientStatistics = client.getOperationalStatistics();
console.log(statistics.incompleteOperationCount);
console.log(statistics.incompleteOperationSize);
console.log(unackedOperationCount);
console.log(unackedOperationSize);
```

For more information, see [withOfflineQueueBehavior](https://aws.github.io/aws-iot-device-sdk-js-v2/node/classes/iot.AwsIotMqtt5ClientConfigBuilder.html#withOfflineQueueBehavior).

For the list of the supported offline queue behaviors and their descriptions, see [ClientOfflineQueueBehavior](https://aws.github.io/aws-iot-device-sdk-js-v2/node/enums/mqtt5.ClientOperationQueueBehavior.html).


### Logging

To enable verbose logging in the v1 SDK, you should provide `debug` option on instantiating `device`.

The v2 SDK uses a custom logger allowing to control the logging process simultaneously for all layers of the SDK.

#### Example of enabling logging in the v1 SDK

```typescript
var device = deviceModule({
    // ...
    debug: true
});
```

#### Example of enabling logging in the v2 SDK

```typescript
import { io } from "aws-crt";
io.enable_logging(io.logLevel.DEBUG);
```


### Client for AWS IoT Device Shadow

The v1 SDK is built with [AWS IoT device shadow](http://docs.aws.amazon.com/iot/latest/developerguide/iot-thing-shadows.html) support,
which provides access to thing shadows (sometimes referred to as device shadows) through [thingShadow](https://github.com/aws/aws-iot-device-sdk-js?tab=readme-ov-file#thing-shadow-class)
class.

The v2 SDK also supports device shadow service, but with completely different API.
First, you subscribe to special topics to get data and feedback from a service. The service client provides API for that.
For example, `SubscribeToGetShadowAccepted` subscribes to a topic to which AWS IoT Core will publish a shadow document. The
server will notify you if it cannot send you a requested document via `SubscribeToGetShadowRejected`.\
After subscribing to all the required topics, the service client can start interacting with the server, for example, update
the status or request for data. These actions are also performed via client API calls. For example, `PublishGetShadow`
sends a request to AWS IoT Core to get a shadow document. The requested shadow document will be received in a callback
specified in the `SubscribeToGetShadowAccepted` call.

AWS IoT Core [documentation for Device Shadow](https://docs.aws.amazon.com/iot/latest/developerguide/device-shadow-mqtt.html)
service provides detailed descriptions for the topics used to interact with the service.

#### Example of creating a Device Shadow service client in the v1 SDK

```typescript
var awsIot = require('aws-iot-device-sdk');

var clientEndpoint = "<prefix>-ats.iot.<region>.amazonaws.com";
var clientId = "<unique client id>";
var certificateFile = "<certificate file>";  // X.509 based certificate file
var privateKeyFile = "<private key file>";   // PEM encoded private key file

// Create a shadow client just like an mqtt client.
var thingShadow = awsIot.thingShadow({
        keyPath: privateKeyFile,
        certPath: certificateFile,
        clientId: clientId,
        host: clientEndpoint
});

thingShadows.register(thingName, {
        ignoreDeltas: false
    },
    function(err, failedTopics) {
        // This callback will be fired after registration is complete.
    });
```

#### Example of creating a Device Shadow service client in the v2 SDK

A thing name in the v2 SDK shadow client is specified for the operations with shadow documents.

```typescript
let client : mqtt5.Mqtt5Client = new mqtt5.Mqtt5Client(config);
let shadow = iotshadow.IotShadowClient.newFromMqtt5Client(client);

const connectionSuccess = once(client, "connectionSuccess");
client.start();
```

#### Example of getting a shadow document in the v1 SDK

```typescript
thingShadow.on('status', function(thingName, statusType, clientToken, stateObject) {
    // This callback will be fired when `get` completes.
});
token = thingShadows.get("<thing name>");
```

#### Example of getting a shadow document in the v2 SDK

```typescript
async function sub_to_shadow_get(shadow: iotshadow.IotShadowClient, argv: Args) {
    return new Promise(async (resolve, reject) => {
        function getAccepted(error?: iotshadow.IotShadowError, response?: iotshadow.model.GetShadowResponse) {
            // The `response` contains a shadow state.
        }

        function getRejected(error?: iotshadow.IotShadowError, response?: iotshadow.model.ErrorResponse) {
            // Called when a get request failed.
        }

        const getShadowSubRequest: iotshadow.model.GetShadowSubscriptionRequest = {
            thingName: "<thing name>"
        };

        // Subscribe to the topic providing shadow documents.
        await shadow.subscribeToGetShadowAccepted(
            getShadowSubRequest,
            mqtt.QoS.AtLeastOnce,
            (error, response) => getAccepted(error, response));
        // Subscribe to the topic reporting errors.
        await shadow.subscribeToGetShadowRejected(
            getShadowSubRequest,
            mqtt.QoS.AtLeastOnce,
            (error, response) => getRejected(error, response));
            
        resolve(true);
    });
}

const getShadow: iotshadow.model.GetShadowRequest = {
    thingName: "<thing name>"
}
shadow.publishGetShadow(getShadow, mqtt.QoS.AtLeastOnce);
```

#### Example of updating a shadow document in the v1 SDK

```typescript
thingShadow.on('status', function(thingName, statusType, clientToken, stateObject) {
    // This callback will be fired when `update` completes.
});

opClientToken = thingShadows.update('TemperatureStatus', {
    state: {
        "light": "on"
    }
});
```

#### Example of updating a shadow document in the v2 SDK

```typescript
async function sub_to_shadow_update(shadow: iotshadow.IotShadowClient, argv: Args) {
    return new Promise(async (resolve, reject) => {
        function updateAccepted(error?: iotshadow.IotShadowError, response?: iotshadow.model.UpdateShadowResponse) {
            // Called when an update request succeeded.
        }
        
        function updateRejected(error?: iotshadow.IotShadowError, response?: iotshadow.model.ErrorResponse) {
            // Called when an update request failed.
        }
        
        const updateShadowSubRequest: iotshadow.model.UpdateNamedShadowSubscriptionRequest = {
            shadowName: argv.shadow_property,
            thingName: "<thing name>"
        };
        
        await shadow.subscribeToUpdateShadowAccepted(
            updateShadowSubRequest,
            mqtt.QoS.AtLeastOnce,
            (error, response) => updateAccepted(error, response));
        
        await shadow.subscribeToUpdateShadowRejected(
            updateShadowSubRequest,
            mqtt.QoS.AtLeastOnce,
            (error, response) => updateRejected(error, response));
        
        resolve(true);
    });
}

let new_value: any = {};
new_value["light"] = "on";
var updateShadow: iotshadow.model.UpdateShadowRequest = {
    state: new_value,
    thingName: "<thing name>"
};

await shadow.publishUpdateShadow(
    updateShadow,
    mqtt.QoS.AtLeastOnce);
```

For more information, see API documentation for the v2 SDK [Device Shadow](https://aws.github.io/aws-iot-device-sdk-js-v2/node/classes/shadow.IotShadowClient.html).
For code example, see the v2 SDK [Device Shadow sample](https://github.com/aws/aws-iot-device-sdk-js-v2/tree/main/samples/node/shadow) sample.


### Client for AWS IoT Jobs

The v1 SDK is built with [AWS IoT Jobs](https://docs.aws.amazon.com/iot/latest/developerguide/iot-jobs.html) support, which
helps with defining a set of remote operations that can be sent to and run on one or more devices connected to AWS IoT.

The v2 SDK also supports Jobs service, but with completely different API. First, you subscribe to special topics to get
data and feedback from a service. The service client provides API for that. After subscribing to all the required topics,
the service client can start interacting with the server, for example, update the status or request for data. These actions
are also performed via client API calls.

#### Example of creating a Jobs service client in the v1 SDK

```typescript
var awsIot = require('aws-iot-device-sdk');

var clientEndpoint = "<prefix>-ats.iot.<region>.amazonaws.com";
var clientId = "<unique client id>";
var certificateFile = "<certificate file>";  // X.509 based certificate file
var privateKeyFile = "<private key file>";   // PEM encoded private key file

// Create a jobs client just like an mqtt client.
var thingShadow = awsIot.jobs({
        keyPath: privateKeyFile,
        certPath: certificateFile,
        clientId: clientId,
        host: clientEndpoint
});
```

#### Example of creating a Jobs service client in the v2 SDK

```typescript
let client : mqtt5.Mqtt5Client = new mqtt5.Mqtt5Client(config);
jobs = iotjobs.IotJobsClient.newFromMqtt5Client(client);

const connectionSuccess = once(client, "connectionSuccess");
client.start();
```

#### Example of subscribing to jobs in the v1 SDK

```typescript
jobs.subscribeToJobs("<thing name>", function(err, job) {
    // This callback will be fired when a job executions is available.
    // job.document contains a description of the job.
});
```

#### Example of subscribing to jobs in the v2 SDK

```typescript
async function on_get_pending_job_execution_accepted(error?: iotjobs.IotJobsError, response?: iotjobs.model.GetPendingJobExecutionsResponse) {
    // response.queuedJobs contains list of available jobs.
}

async function on_rejected_error(error?: iotjobs.IotJobsError, response?:iotjobs.model.RejectedErrorResponse) {
    // This function will be fired on request rejected.
}

var pending_subscription_request : iotjobs.model.GetPendingJobExecutionsSubscriptionRequest = {
    thingName: "<thing name>"
};
await jobs.subscribeToGetPendingJobExecutionsAccepted(pending_subscription_request, mqtt.QoS.AtLeastOnce, on_get_pending_job_execution_accepted);
await jobs.subscribeToGetPendingJobExecutionsRejected(pending_subscription_request, mqtt.QoS.AtLeastOnce, on_rejected_error);
```

#### Example of starting job in the v1 SDK

```typescript
jobs.startJobNotifications("<thing name>", function(err) {
   if (isUndefined(err)) {
      console.log('job notifications initiated for thing: ' + thingName);
   }
   else {
      console.error(err);
   }
});
```

#### Example of starting job in the v2 SDK

```typescript
async function on_start_next_pending_job_execution_accepted(error? : iotjobs.IotJobsError, response? : iotjobs.model.StartNextJobExecutionResponse) {
    // The response object contains all the details about job execution.
}
async function on_rejected_error(error?: iotjobs.IotJobsError, response?:iotjobs.model.RejectedErrorResponse) {
    // This function will be fired on request rejected.
}

var start_next_subscription_request : iotjobs.model.StartNextPendingJobExecutionSubscriptionRequest = {
    thingName: argv.thing_name
}

await jobs.subscribeToStartNextPendingJobExecutionAccepted(start_next_subscription_request, mqtt.QoS.AtLeastOnce, on_start_next_pending_job_execution_accepted);
await jobs.subscribeToStartNextPendingJobExecutionRejected(start_next_subscription_request, mqtt.QoS.AtLeastOnce, on_rejected_error);

var start_next_publish_request : iotjobs.model.StartNextPendingJobExecutionRequest = {
    thingName: "<thing name>"
}
await jobs.publishStartNextPendingJobExecution(start_next_publish_request, mqtt.QoS.AtLeastOnce);
```

For detailed descriptions for the topics used to interact with the Jobs service, see AWS IoT Core documentation for the [Jobs](https://docs.aws.amazon.com/iot/latest/developerguide/jobs-mqtt-api.html) service.\
For more information about the service clients, see API documentation for the v2 SDK [Jobs](https://aws.github.io/aws-iot-device-sdk-js-v2/browser/classes/jobs.IotJobsClient.html).\
For code example, see the v2 SDK [Jobs sample](https://github.com/aws/aws-iot-device-sdk-js-v2/tree/main/samples/node/jobs).


### Client for AWS IoT fleet provisioning

The v2 SDK expands support of AWS IoT Core services implementing a service client for the [Fleet Provisioning](https://docs.aws.amazon.com/iot/latest/developerguide/provision-wo-cert.html)
service (also known as Identity Service). By using AWS IoT fleet provisioning, AWS IoT can generate and securely deliver
device certificates and private keys to your devices when they connect to AWS IoT for the first time.

The fleet provisioning service client provides an API similar to the API provided by [Client for AWS IoT Device Shadow](#client-for-aws-iot-device-shadow).
First, you subscribe to special topics to get data and feedback from a service. The service client provides API for that.
After subscribing to all the required topics, the service client can start interacting with the server, for example, update
the status or request for data. These actions are also performed via client API calls.

For detailed descriptions for the topics used to interact with the Fleet Provisioning service, see AWS IoT Core documentation for [Fleet Provisioning](https://docs.aws.amazon.com/iot/latest/developerguide/fleet-provision-api.html).

For more information about the Fleet Provisioning service client, see API documentation for the v2 SDK [Fleet Provisioning](https://aws.github.io/aws-iot-device-sdk-js-v2/browser/classes/identity.IotIdentityClient.html).\
For code examples, see the v2 SDK [Fleet Provisioning](https://github.com/aws/aws-iot-device-sdk-js-v2/tree/main/samples/node/fleet_provisioning)
sample.


### Example

It's always helpful to look at a working example to see how new functionality works, to be able to tweak different options,
to compare with existing code. For that reason, we implemented a [Publish/Subscribe example](https://github.com/aws/aws-iot-device-sdk-js-v2/tree/main/samples/node/pub_sub_mqtt5)
([source code](https://github.com/aws/aws-iot-device-sdk-js-v2/blob/main/samples/node/pub_sub_mqtt5/index.ts)) in the v2 SDK
similar to a sample provided by the v1 SDK (see a corresponding [readme section](https://github.com/aws/aws-iot-device-sdk-js?tab=readme-ov-file#device-examplejs)
and [source code](https://github.com/aws/aws-iot-device-sdk-js/blob/master/examples/device-example.js)).


## How to get help

Questions? You can look for an answer in the [discussions](https://github.com/aws/aws-iot-device-sdk-js-v2/discussions?discussions_q=label%3Amigration)
page. Or, you can always open a [new discussion](https://github.com/aws/aws-iot-device-sdk-js-v2/discussions/new?category=q-a&labels=migration),
and we will be happy to help you.


## Appendix

### MQTT5 Features

**Clean Start and Session Expiry**
You can use Clean Start and Session Expiry to handle your persistent sessions with more flexibility.
For mot information, see the [Mqtt5ClientOptions.ClientSessionBehavior](https://aws.github.io/aws-iot-device-sdk-js-v2/browser/enums/mqtt5.ClientSessionBehavior.html)
enum and the [NegotiatedSettings.getSessionExpiryInterval](https://aws.github.io/aws-iot-device-sdk-js-v2/browser/interfaces/mqtt5.NegotiatedSettings.html#sessionExpiryInterval)
property for details.

**Reason Code on all ACKs**
You can debug or process error messages more easily using the reason codes. Reason codes are returned by the message broker
based on the type of interaction with the broker (Subscribe, Publish, Acknowledge). For mot information, see [PubackReasonCode](https://aws.github.io/aws-iot-device-sdk-js-v2/browser/enums/mqtt5.PubackReasonCode.html),
[SubackReasonCode](https://aws.github.io/aws-iot-device-sdk-js-v2/browser/enums/mqtt5.SubackReasonCode.html),
[UnsubackReasonCode](https://aws.github.io/aws-iot-device-sdk-js-v2/browser/enums/mqtt5.UnsubackReasonCode.html),
[ConnectReasonCode](https://aws.github.io/aws-iot-device-sdk-js-v2/browser/enums/mqtt5.ConnectReasonCode.html),
[DisconnectReasonCode](https://aws.github.io/aws-iot-device-sdk-js-v2/browser/enums/mqtt5.DisconnectReasonCode.html). 

**Topic Aliases**
You can substitute a topic name with a topic alias, which is a two-byte integer. Set [topicAlias](https://aws.github.io/aws-iot-device-sdk-js-v2/browser/interfaces/mqtt5.PublishPacket.html#topicAlias)
property when creating a PUBLISH packet.

**Message Expiry**
You can add message expiry values to published messages. Set [messageExpiryIntervalSeconds](https://aws.github.io/aws-iot-device-sdk-js-v2/browser/interfaces/mqtt5.PublishPacket.html#messageExpiryIntervalSeconds)
field in the `PublishPacket` class.

**Server disconnect**
When a disconnection happens, the server can proactively send the client a DISCONNECT to notify connection closure with
a reason code for disconnection. For more information, see the [DisconnectPacket](https://aws.github.io/aws-iot-device-sdk-js-v2/browser/interfaces/mqtt5.DisconnectPacket.html)
class.

**Request/Response**
Publishers can request a response be sent by the receiver to a publisher-specified topic upon reception. Set [responseTopic](https://aws.github.io/aws-iot-device-sdk-js-v2/browser/interfaces/mqtt5.PublishPacket.html#responseTopic)
property in the `PublishPacket` class.

**Maximum Packet Size**
Client and Server can independently specify the maximum packet size that they support. For more information, see the [ConnectPacket.maximumPacketSizeBytes](https://aws.github.io/aws-iot-device-sdk-js-v2/browser/interfaces/mqtt5.ConnectPacket.html#maximumPacketSizeBytes),
[NegotiatedSettings.maximumPacketSizeToServer](https://aws.github.io/aws-iot-device-sdk-js-v2/browser/interfaces/mqtt5.NegotiatedSettings.html#maximumPacketSizeToServer),
and [ConnAckPacket.maximumPacketSize](https://aws.github.io/aws-iot-device-sdk-js-v2/browser/interfaces/mqtt5.ConnackPacket.html#maximumPacketSize)
properties.

**Payload format and content type**
You can specify the payload format (binary, text) and content type when a message is published. These are forwarded to
the receiver of the message. Use the [contentType](https://aws.github.io/aws-iot-device-sdk-js-v2/browser/interfaces/mqtt5.PublishPacket.html#contentType)
property in the `PublishPacket` class.

**Shared Subscriptions**
Shared Subscriptions allow multiple clients to share a subscription to a topic and only one client will receive messages
published to that topic using a random distribution. For more information, see a [shared subscription sample](https://github.com/aws/aws-iot-device-sdk-js-v2/tree/main/samples/node/shared_subscription)
in the v2 SDK.

> [!NOTE]  
> AWS IoT Core supports Shared Subscriptions for both MQTT3 and MQTT5. For more information, see [Shared Subscriptions](https://docs.aws.amazon.com/iot/latest/developerguide/mqtt.html#mqtt5-shared-subscription) from the AWS IoT Core developer guide.
