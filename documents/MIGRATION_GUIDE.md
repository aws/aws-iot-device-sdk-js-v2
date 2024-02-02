# Migrate from V1 to V2 of the AWS IoT SDK for JavaScript

> [!TIP]  
> If you can't find necessary information in this guide, the [How to Get Help](#how-to-get-help) section will guide you.

The V2 AWS IoT SDK for JavaScript is a major rewrite of the V1 code base. It includes many updates, such as improved
consistency, ease of use, more detailed information about client status, an offline operation queue control, etc. This
guide describes the major features that are new in V2, and provides guidance on how to migrate your code to V2 from V1.

> [!NOTE]
> Sometimes V1 SDK documentation uses V2 terminology. It refers to the released versions of V1 SDK after v2.0.0.

## What’s new in V2 SDK

* V2 SDK client is truly async. Operations return `CompletableFuture` objects.
    Blocking calls can be emulated by waiting for the returned `CompletableFuture` object to be resolved.
* V2 SDK provides implementation for MQTT5 protocol, the next step in evolution of the MQTT protocol.
* Public API terminology has changed. You explicitly `start()` or `stop()` the MQTT5 client. This removes the semantic
confusion with the connect/disconnect as the client-level controls vs. internal recurrent networking events.
* Support Fleet Provisioning AWS IoT Core service.

Public API for almost all actions and operations has changed significantly. For more details about the new features and
to see specific code examples, refer to the other sections of this guide.


## How To Get Started with V2 SDK

There are differences between IoT JavaScript V1 SDK and IoT JavaScript V2 SDK. Below are changes you need to make to use
IoT JavaScript V2 SDK features. For more information about MQTT5, visit [MQTT5 User Guide](https://github.com/awslabs/aws-crt-nodejs/blob/main/MQTT5-UserGuide.md).

### Package name change

A noticeable change from the V1 SDK to V2 SDK is the package name change. V2 SDK package is [aws-iot-device-sdk-v2](https://www.npmjs.com/package/aws-iot-device-sdk-v2).
V1 SDK is [aws-iot-device-sdk](https://www.npmjs.com/package/aws-iot-device-sdk).


### MQTT Protocol

V1 SDK uses an MQTT version 3.1.1 client by default. It’s possible to enable MQTT 5 protocol by setting `protocolVersion` option.

V2 SDK provides MQTT version 3.1.1 and MQTT version 5.0 client implementations. This guide focuses on the MQTT5 since
this version is significant improvement over MQTT3. See [MQTT5 features](https://quip-amazon.com/MOyaAuhEZf1c/Migrate-from-V1-to-V2-of-the-AWS-IoT-SDK-for-JavaScript#temp:C:YQJ834e2b4d3628482c942f53abe)
section.


### Browser Applications

Browser applications connect to AWS IoT using [MQTT over the Secure WebSocket Protocol](http://docs.aws.amazon.com/iot/latest/developerguide/protocols.html).
There are some important differences between Node.js and browser environments: for example, when running in a browser
environment, the SDK doesn't have access to the filesystem or process environment variables. 

V1 SDK supports only Node.js applications out of the box. But it can be packaged to run in a browser using [browserify](http://browserify.org/)
or [webpack](https://webpack.js.org/). Readme file for V1 SDK contains a [section](https://github.com/aws/aws-iot-device-sdk-js?tab=readme-ov-file#browser)
describing how to prepare SDK to work in browser environment.

V2 SDK provides a designated [API for browser](https://aws.github.io/aws-iot-device-sdk-js-v2/browser/index.html)
applications. The MQTT5 implementation for the browser supports MQTT-over-websockets using either Sigv4 authentication
or AWS IoT Core Custom Authentication (see [Connection Types and Features](https://quip-amazon.com/MOyaAuhEZf1c#temp:C:YQJ2d518319db9d47949042aef90)
for more details).

> [!NOTE]
> The V2 SDK will access the native API by default, so you should configure the path in the `tsconfig.json` file to ensure that the app utilizes the browser API.


### Client Builder

To access the AWS IoT service, you must initialize an MQTT client.

In V1 SDK, the [awsIot.device](https://github.com/aws/aws-iot-device-sdk-js?tab=readme-ov-file#device) module represents
an MQTT client. You instantiate the client directly passing all the required parameters to the class constructor. It’s
possible to change client settings after its creation using `set*` methods, e.g. `setKeepAliveInterval` or `setMaxConnectionRetries`.

In V2 SDK, the [Mqtt5Client](https://aws.github.io/aws-iot-device-sdk-js-v2/node/classes/mqtt5.Mqtt5Client.html) class
represents an MQTT client, specifically MQTT5 protocol. V2 SDK provides an [MQTT5 client builder](https://aws.github.io/aws-iot-device-sdk-js-v2/node/classes/iot.AwsIotMqtt5ClientConfigBuilder.html)
designed to easily create common configuration types such as direct MQTT or WebSocket connections. Once an MQTT5 client
is built and finalized, the resulting MQTT5 client cannot have its settings modified.

<details>
<summary>Example of creating a client in V1</summary>

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

</details>

<details>
<summary>Example of creating a client in V2</summary>

V2 SDK supports different connection types. Given the same input parameters as in the V1 example above, the most suitable
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

</details>

Refer to the [Connection Types and Features](https://quip-amazon.com/MOyaAuhEZf1c#temp:C:YQJ2d518319db9d47949042aef90)
section for other connection types supported by V2 SDK.


### Connection Types and Features

V1 SDK supports three types of connections to connect to the AWS IoT service: MQTT with X.509 certificate, MQTT over
Secure WebSocket with SigV4 authentication, and MQTT over Secure WebSocket using a custom authorization function to
authenticate.

V2 SDK adds a collection of connection types and cryptography formats (e.g. [PKCS #11](https://en.wikipedia.org/wiki/PKCS_11)),
credential providers (e.g. [Windows Certificate Store](https://learn.microsoft.com/en-us/windows-hardware/drivers/install/certificate-stores)),
and other connection-related features.\
Refer to the ["Connecting to AWS IoT Core"](https://github.com/awslabs/aws-crt-nodejs/blob/main/MQTT5-UserGuide.md#connecting-to-aws-iot-core)
section of the MQTT5 user guide for detailed information and code snippets on each connection type and connection feature.

> [!NOTE]
> Both V1 and V2 SDKs support only SigV4 and Custom authentication in browser environment.

| Connection Type/Feature                                                | V1 SDK - Node.js                      | V1 SDK - Browser                      |V2 SDK - Node.js                  | V2 SDK - Browser                 |User guide section|
|------------------------------------------------------------------------|---------------------------------------|---------------------------------------|----------------------------------|----------------------------------|------------------|
| MQTT over Secure WebSocket with AWS SigV4 authentication               | $${\Large\color{green}&#10004}$$      | $${\Large\color{green}&#10004}$$      | $${\Large\color{green}&#10004}$$ | $${\Large\color{green}&#10004}$$ | [Node.js section](https://github.com/awslabs/aws-crt-nodejs/blob/main/MQTT5-UserGuide.md#mqtt-over-websockets-with-sigv4-authentication) [Browser section](https://github.com/awslabs/aws-crt-nodejs/blob/main/MQTT5-UserGuide.md#mqtt-over-websockets-with-sigv4-authentication-1) |
| MQTT over Secure WebSocket with Cognito Authentication Method          | $${\Large\color{green}&#10004}$$      | $${\Large\color{green}&#10004}$$      | $${\Large\color{green}&#10004}$$ | $${\Large\color{green}&#10004}$$ | [Node.js section](https://github.com/awslabs/aws-crt-nodejs/blob/main/MQTT5-UserGuide.md#mqtt-over-websockets-with-sigv4-authentication) |
| MQTT over Secure WebSocket with Custom Authentication                  | $${\Large\color{green}&#10004}$$      | $${\Large\color{green}&#10004}$$      | $${\Large\color{green}&#10004}$$ | $${\Large\color{green}&#10004}$$ | [Node.js section](https://github.com/awslabs/aws-crt-nodejs/blob/main/MQTT5-UserGuide.md#direct-mqtt-with-custom-authentication) [Browser section](https://github.com/awslabs/aws-crt-nodejs/blob/main/MQTT5-UserGuide.md#mqtt-over-websockets-with-custom-authentication) |
| MQTT (over TLS 1.2) with X.509 certificate based mutual authentication | $${\Large\color{green}&#10004}$$      | $${\Large\color{red}&#10008}$$        | $${\Large\color{green}&#10004}$$ | $${\Large\color{red}&#10008}$$   | [Node.js section](https://github.com/awslabs/aws-crt-nodejs/blob/main/MQTT5-UserGuide.md#direct-mqtt-with-x509-based-mutual-tls) |
| MQTT with PKCS12 Method                                                | $${\Large\color{orange}&#10004\*}$$   | $${\Large\color{red}&#10008}$$        | $${\Large\color{green}&#10004}$$ | $${\Large\color{red}&#10008}$$   | [Node.js section](https://github.com/awslabs/aws-crt-nodejs/blob/main/MQTT5-UserGuide.md#direct-mqtt-with-pkcs12-method) |
| MQTT with Windows Certificate Store Method                             | $${\Large\color{red}&#10008}$$        | $${\Large\color{red}&#10008}$$        | $${\Large\color{green}&#10004}$$ | $${\Large\color{red}&#10008}$$   | TODO Node.js section |
| MQTT with PKCS11 Method                                                | $${\Large\color{red}&#10008}$$        | $${\Large\color{red}&#10008}$$        | $${\Large\color{green}&#10004}$$ | $${\Large\color{red}&#10008}$$   | [Node.js section](https://github.com/awslabs/aws-crt-nodejs/blob/main/MQTT5-UserGuide.md#direct-mqtt-with-pkcs11-method) |
| HTTP Proxy                                                             | $${\Large\color{orange}&#10004\*\*}$$ | $${\Large\color{orange}&#10004\*\*}$$ | $${\Large\color{green}&#10004}$$ | $${\Large\color{green}&#10004}$$ | [Node.js section](https://github.com/awslabs/aws-crt-nodejs/blob/main/MQTT5-UserGuide.md#http-proxy) [Browser section](https://github.com/awslabs/aws-crt-nodejs/blob/main/MQTT5-UserGuide.md#http-proxy-1) |

${\Large\color{orange}&#10004\*}$ - In order to get this connection type work in V1 SDK, you need to create KeyStore.\
${\Large\color{orange}&#10004\*\*}$ - Though V1 does not allow to specify HTTP proxy, it is possible to configure systemwide proxy.

<details>
<summary>Example of creating connection in V1</summary>

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

</details>

<details>
<summary>Example of creating connection in V2</summary>

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

// Connection must be started explicitly.
client.start();
```

</details>


### Lifecycle Events

Both V1 and V2 SDKs provide lifecycle events for the MQTT clients.

V1 SDK provides a rich set of lifecycle events: "connect", "reconnect", "close", "disconnect", "offline", "error", "end".
You can supply a custom callback function via `on` method of the `device` instance. It is recommended to use lifecycle
events callbacks to help determine the state of the MQTT client during operation.

V2 SDK defines its own set of lifecycle events: "AttemptingConnect", "ConnectionSuccess", "ConnectionFailure", "Disconnect",
and "Stopped". Refer to the [MQTT5 user guide](https://github.com/awslabs/aws-crt-nodejs/blob/main/MQTT5-UserGuide.md#client-events)
for the detailed description of each event.

<details>
<summary>Example of setting lifecycle events in V1</summary>

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

</details>

<details>
<summary>Example of setting lifecycle events in V2</summary>

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

</details>


### Publish

The result of the publish operation in V1 SDK can be reported via a callback. If you try to publish to a topic that is not
allowed by a policy, AWS IoT Core service will close the connection.

In V2 SDK, the [publish](https://aws.github.io/aws-iot-device-sdk-js-v2/node/classes/mqtt5.Mqtt5Client.html#publish)
operation takes a description of the PUBLISH packet you wish to send and returns a promise of polymorphic value.

* If the PUBLISH was a QoS 0 (mqtt5_packet.QoS.AtMostOnce) publish, then the promise has a unit (void) value and is
completed as soon as the packet has been written to the socket.
* If the PUBLISH was a QoS 1 (mqtt5_packet.QoS.AtLeastOnce) publish, then the promise has a PUBACK packet value and is
completed as soon as the PUBACK is received from the broker.

If the operation fails for any reason before these respective completion events, the promise is rejected with a descriptive
error. You should always check the reason code of a PUBACK completion to determine if a QoS 1 publish operation actually
succeeded.

<details>
<summary>Example of publishing in V1</summary>

```typescript
device.publish(
    "my/topic",
    JSON.stringify("This is a qos 0 payload"),
    { qos: 1 },  // Default QoS level is 0.
    function (err, resp) { console.log("PUBACK received"); });
```

</details>

<details>
<summary>Example of publishing in V2</summary>

```typescript
const res = await client.publish({
    qos: mqtt5.QoS.AtLeastOnce,
    topicName: "my/topic",
    payload: JSON.stringify("This is a qos 0 payload")
});

console.log('QoS 1 Publish result: ' + JSON.stringify(res));
```

</details>


### Subscribe

To subscribe to topic in V1, you should provide one or multiple topics to the [subscribe](https://github.com/mqttjs/MQTT.js/blob/master/README.md#subscribe)
operation. If you try to subscribe to a topic that is not allowed by a policy, AWS IoT Core service will close the connection.

In V2 SDK, the [subscribe](https://aws.github.io/aws-iot-device-sdk-js-v2/node/classes/mqtt5.Mqtt5Client.html#subscribe)
operation takes a description of the SUBSCRIBE packet you wish to send and returns a promise that resolves successfully
with the corresponding SUBACK returned by the broker; the promise is rejected with an error if anything goes wrong before
the SUBACK is received. You should always check the reason codes of a SUBACK completion to determine if the subscribe
operation actually succeeded.

<details>
<summary>Example of subscribing in V1</summary>

```typescript
device
    .on('message', function(topic, payload) {
        console.log('message', topic, payload.toString());
    });

device.subscribe('my/topic');
```

</details>

<details>
<summary>Example of subscribing in V2</summary>

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

</details>


### Unsubscribe

To unsubscribe from topic in V1 SDK, you should provide one or multiple topics to the [unsubscribe](https://github.com/mqttjs/MQTT.js/blob/master/README.md#unsubscribe)
operation. You can provide an optional callback that will be fired on receiving UNSUBACK packet.

In V2 SDK, the [unsubscribe](https://aws.github.io/aws-iot-device-sdk-js-v2/browser/classes/mqtt5.Mqtt5Client.html#unsubscribe)
operation takes a description of the [UnsubscribePacket](https://aws.github.io/aws-iot-device-sdk-js-v2/browser/interfaces/mqtt5.UnsubscribePacket.html)
you wish to send and returns a promise that resolves successfully with the corresponding [UnsubAckPacket](https://aws.github.io/aws-iot-device-sdk-js-v2/browser/interfaces/mqtt5.UnsubackPacket.html)
returned by the broker; the promise is rejected with an error if anything goes wrong before the [UnsubAckPacket](https://aws.github.io/aws-iot-device-sdk-js-v2/browser/interfaces/mqtt5.UnsubackPacket.html)
is received. You should always check the reason codes of an UNSUBACK completion to determine if the unsubscribe operation
actually succeeded.

<details>
<summary>Example of unsubscribing in V1</summary>

```typescript
device.unsubscribe("my/topic", function(err) {
    console.log("Unsubscribed");
});
```

</details>

<details>
<summary>Example of unsubscribing in V2</summary>

```typescript
let unsuback = await client.unsubscribe({
    topicFilters: [ "my/topic" ]
});
console.log('Unsuback result: ' + JSON.stringify(unsuback));
```

</details>


### Client Stop

In V1 SDK, the `end` method in the `device` class disconnects the client. The force parameter determines whether to close
the connection immediately, or wait for in-flight messages to be sent.

In V2 SDK, an MQTT5 client can stop a session by calling the [stop](https://aws.github.io/aws-iot-device-sdk-js-v2/browser/classes/mqtt5.Mqtt5Client.html#stop)
method. You can provide an optional [DisconnectPacket](https://aws.github.io/aws-iot-device-sdk-js-v2/browser/interfaces/mqtt5.DisconnectPacket.html)
parameter. A closed client can be started again by calling [start](https://aws.github.io/aws-iot-device-sdk-js-v2/browser/classes/mqtt5.Mqtt5Client.html#start).

<details>
<summary>Example of disconnecting a client in V1</summary>

```typescript
device.end();
```

</details>

<details>
<summary>Example of disconnecting a client in V2</summary>

```typescript
client.stop();
```

</details>


### Client Shutdown

V1 SDK automatically cleans resources on shutdown.

In V2 SDK, when an MQTT5 client is not needed anymore, your program **must** close it explicitly via a [close](https://aws.github.io/aws-iot-device-sdk-js-v2/browser/classes/mqtt5.Mqtt5Client.html#close) call.

<details>
<summary>Example of closing a client in V2</summary>

```typescript
// Shutdown and clean up.
const stopped = once(client, Mqtt5Client.STOPPED);
client.stop();
await stopped;

// Release any native resources associated with the client.
client.close();
```

</details>


### Reconnects

In V1 SDK, `reconnectPeriod` option enables reconnection. The default value is 1000 ms which means it will try to
reconnect 1 second after losing the connection.

V2 attempts to reconnect automatically until connection succeeds or `client.stop()` is called. The reconnection parameters,
such as min/max delays and [jitter modes](https://aws.github.io/aws-iot-device-sdk-js-v2/node/classes/iot.AwsIotMqtt5ClientConfigBuilder.html#withRetryJitterMode),
are configurable through [AwsIotMqtt5ClientConfigBuilder](https://aws.github.io/aws-iot-device-sdk-js-v2/node/classes/iot.AwsIotMqtt5ClientConfigBuilder.html).


<details>
<summary>Example of tweaking reconnection settings in V1</summary>

```typescript
var device = deviceModule({
    certPath: "<certificate file>",
    // ...
    reconnectPeriod: 1000,          // ms
    minimumConnectionTimeMs: 2500,  // ms
    maximumReconnectTimeMs: 10000   // ms
});
```

</details>

<details>
<summary>Example of tweaking reconnection settings in V2</summary>

```typescript
configBbuilder.withMinReconnectDelayMs(2500);
configBbuilder.withMaxReconnectDelayMs(10000);
configBbuilder.withRetryJitterMode(mqtt5.RetryJitterMode.Full);

let config : mqtt5.Mqtt5ClientConfig = configBuilder.build();
let client : mqtt5.Mqtt5Client = new mqtt5.Mqtt5Client(config);
```

</details>


### Offline Operations Queue

V1 SDK provides a set of options to configure behavior when a client is offline. By default, the number of queued messages
are not limited.

V2 SDK does not limit the number of in-flight messages. Additionally, V2 SDK provides a way to configure which kind of
packets will be placed into the offline queue when the client is in the disconnected state. The following code snippet
demonstrates how to enable storing all packets except QOS0 publish packets in the offline queue on disconnect:

<details>
<summary>Example of configuring the offline queue in V1</summary>

```typescript
var device = deviceModule({
    // ...
    offlineQueueing: true,
    offlineQueueMaxSize: 0,  // no limit
    offlineQueueDropBehavior: "oldest",
    drainTimeMs: 250,  // ms
});
```

</details>

<details>
<summary>Example of configuring the offline queue in V2</summary>

```typescript
configBuilder.withOfflineQueueBehavior(mqtt5.ClientOperationQueueBehavior.FailQos0PublishOnDisconnect);
let config : mqtt5.Mqtt5ClientConfig = configBuilder.build();
let client : mqtt5.Mqtt5Client = new mqtt5.Mqtt5Client(config);
```

</details>

> [!NOTE]
> AWS IoT Core [limits the number of allowed operations per second](https://docs.aws.amazon.com/general/latest/gr/iot-core.html#message-broker-limits).
> The [getOperationStatistics](https://aws.github.io/aws-iot-device-sdk-js-v2/node/classes/mqtt5.Mqtt5Client.html#getOperationalStatistics)
> method returns  the current state of an `Mqtt5Client` object’s queue of operations, which may help with tracking the number
> of in-flight messages.

<details>
<summary>Example of getting client operational statistics in V2</summary>

```typescript
let statistics : mqtt5.ClientStatistics = client.getOperationalStatistics();
console.log(statistics.incompleteOperationCount);
console.log(statistics.incompleteOperationSize);
console.log(unackedOperationCount);
console.log(unackedOperationSize);
```

</details>

See [withOfflineQueueBehavior](https://aws.github.io/aws-iot-device-sdk-js-v2/node/classes/iot.AwsIotMqtt5ClientConfigBuilder.html#withOfflineQueueBehavior)
documentation for more details.\
See [ClientOfflineQueueBehavior](https://aws.github.io/aws-iot-device-sdk-js-v2/node/enums/mqtt5.ClientOperationQueueBehavior.html)
documentation to find the list of the supported offline queue behaviors and their description.


### Logging

To enable verbose logging in V1 SDK, you should provide `debug` option when instantiating `device`.

V2 SDK uses a custom logger allowing to control the logging process simultaneously for all layers of the SDK.

<details>
<summary>Example of enabling logging in V1</summary>
To change the console logging level, the property file *logging.properties* should contain the following lines:

```typescript
var device = deviceModule({
    // ...
    debug: true
});
```

</details>

<details>
<summary>Example of enabling logging in V2</summary>

```typescript
import { io } from "aws-crt";
io.enable_logging(io.logLevel.DEBUG);
```

</details>


### Client for Device Shadow Service

V1 SDK is built with [AWS IoT device shadow support](http://docs.aws.amazon.com/iot/latest/developerguide/iot-thing-shadows.html),
providing access to thing shadows (sometimes referred as device shadows) through [thingShadow](https://github.com/aws/aws-iot-device-sdk-js?tab=readme-ov-file#thing-shadow-class)
class.

V2 SDK supports device shadow service as well, but with completely different API.\
First, you subscribe to special topics to get data and feedback from a service. The service client provides API for that.
For example, `SubscribeToGetShadowAccepted`  subscribes to a topic to which AWS IoT Core will publish a shadow document;
and via the `SubscribeToGetShadowRejected` the server will notify you if it cannot send you a requested document.\
After subscribing to all the required topics, the service client can start interacting with the server, for example update
the status or request for data. These actions are also performed via client API calls. For example, `PublishGetShadow`
sends a request to AWS IoT Core to get a shadow document. The requested Shadow document will be received in a callback
specified in the `SubscribeToGetShadowAccepted` call.

AWS IoT Core [documentation for Device Shadow](https://docs.aws.amazon.com/iot/latest/developerguide/device-shadow-mqtt.html)
service provides detailed descriptions for the topics used to interact with the service.

<details>
<summary>Example of creating a Device Shadow service client in V1</summary>

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

</details>

<details>
<summary>Example of creating a Device Shadow service client in V2</summary>

A thing name in V2 SDK shadow client is specified for the operations with shadow documents.

```typescript
let client : mqtt5.Mqtt5Client = new mqtt5.Mqtt5Client(config);
let shadow = iotshadow.IotShadowClient.newFromMqtt5Client(client);

const connectionSuccess = once(client, "connectionSuccess");
client.start();
```

</details>


<details>
<summary>Example of getting a shadow document in V1</summary>

```typescript
thingShadow.on('status', function(thingName, statusType, clientToken, stateObject) {
    // This callback will be fired when `get` completes.
});
token = thingShadows.get("<thing name>");
```

</details>

<details>
<summary>Example of getting a shadow document in V2</summary>

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

</details>


<details>
<summary>Example of updating a shadow document in V1</summary>

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

</details>

<details>
<summary>Example of updating a shadow document in V2</summary>

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

</details>

See API documentation for V2 SDK [Device Shadow](https://aws.github.io/aws-iot-device-sdk-js-v2/node/classes/shadow.IotShadowClient.html)
service client for more details.\
Refer to the V2 SDK [Device Shadow sample](https://github.com/aws/aws-iot-device-sdk-js-v2/tree/main/samples/node/shadow)
for code example.


### Client for Jobs Service

V1 SDK is built with [AWS IoT Jobs](https://docs.aws.amazon.com/iot/latest/developerguide/iot-jobs.html) support, which
helps with defining a set of remote operations that can be sent to and run on one or more devices connected to AWS IoT.

V2 SDK supports Jobs service as well, but with completely different API. First, you subscribe to special topics to get
data and feedback from a service. The service client provides API for that. After subscribing to all the required topics,
the service client can start interacting with the server, for example update the status or request for data. These actions
are also performed via client API calls.

AWS IoT Core documentation for [Jobs](https://docs.aws.amazon.com/iot/latest/developerguide/jobs-mqtt-api.html) service
provides detailed descriptions for the topics used to interact with the service.

<details>
<summary>Example of creating a Jobs service client in V1</summary>

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

</details>

<details>
<summary>Example of creating a Jobs service client in V2</summary>

```typescript
let client : mqtt5.Mqtt5Client = new mqtt5.Mqtt5Client(config);
jobs = iotjobs.IotJobsClient.newFromMqtt5Client(client);

const connectionSuccess = once(client, "connectionSuccess");
client.start();
```

</details>


<details>
<summary>Example of subscribing to jobs in V1</summary>

```typescript
jobs.subscribeToJobs("<thing name>", function(err, job) {
    // This callback will be fired when a job executions is available.
    // job.document contains a description of the job.
});
```

</details>

<details>
<summary>Example of subscribing to jobs in V2</summary>

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

</details>


<details>
<summary>Example of starting job in V1</summary>

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

</details>

<details>
<summary>Example of starting job in V2</summary>

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

</details>


See API documentation for V2 SDK [Jobs](https://aws.github.io/aws-iot-device-sdk-js-v2/browser/classes/jobs.IotJobsClient.html)
service clients for more details.\
Refer to the V2 SDK [Jobs sample](https://github.com/aws/aws-iot-device-sdk-js-v2/tree/main/samples/node/jobs) for code example.


### Client for Fleet Provisioning Service

V2 SDK expands support of AWS IoT Core services implementing a service client for the [Fleet Provisioning](https://docs.aws.amazon.com/iot/latest/developerguide/provision-wo-cert.html)
service (also known as Identity Service). By using AWS IoT fleet provisioning, AWS IoT can generate and securely deliver
device certificates and private keys to your devices when they connect to AWS IoT for the first time.

The Fleet Provisioning service client provides API similar to API provided by [Client for Device Shadow Service](https://quip-amazon.com/MOyaAuhEZf1c#temp:C:YQJefaf2e415d1241d18a51a05f6).
First, you subscribe to special topics to get data and feedback from a service. The service client provides API for that.
After subscribing to all the required topics, the service client can start interacting with the server, for example update
the status or request for data. These actions are also performed via client API calls.

AWS IoT Core documentation for [Fleet Provisioning](https://docs.aws.amazon.com/iot/latest/developerguide/fleet-provision-api.html)
service provides detailed descriptions for the topics used to interact with the service.

See API documentation for V2 SDK  [Fleet Provisioning](https://aws.github.io/aws-iot-device-sdk-js-v2/browser/classes/identity.IotIdentityClient.html)
service client for more details.\
Refer to the V2 SDK [Fleet Provisioning sample](https://github.com/aws/aws-iot-device-sdk-js-v2/tree/main/samples/node/fleet_provisioning)
for code examples.


### Example

It’s always helpful to look at a working example to see how new functionality works, to be able to tweak different options,
to compare with existing code. For that reasons, we implemented a [Publish/Subscribe example](https://github.com/aws/aws-iot-device-sdk-js-v2/tree/main/samples/node/pub_sub_mqtt5)
([source code](https://github.com/aws/aws-iot-device-sdk-js-v2/blob/main/samples/node/pub_sub_mqtt5/index.ts)) in V2 SDK
similar to a sample provided by V1 SDK (see a corresponding [readme section](https://github.com/aws/aws-iot-device-sdk-js?tab=readme-ov-file#device-examplejs)
and [source code](https://github.com/aws/aws-iot-device-sdk-js/blob/master/examples/device-example.js)).


## How to get help

Questions? You can look for an answer in the [discussions](https://github.com/aws/aws-iot-device-sdk-js-v2/discussions?discussions_q=label%3Amigration)
page. Or, you can always open a [new discussion](https://github.com/aws/aws-iot-device-sdk-js-v2/discussions/new?category=q-a&labels=migration),
and we will be happy to help you.


## Appendix

### MQTT5 Features

**Clean Start and Session Expiry**
You can use Clean Start and Session Expiry to handle your persistent sessions with more flexibility.
Refer to [Mqtt5ClientOptions.ClientSessionBehavior](https://aws.github.io/aws-iot-device-sdk-js-v2/browser/enums/mqtt5.ClientSessionBehavior.html)
enum and [NegotiatedSettings.getSessionExpiryInterval](https://aws.github.io/aws-iot-device-sdk-js-v2/browser/interfaces/mqtt5.NegotiatedSettings.html#sessionExpiryInterval)
method for details.

**Reason Code on all ACKs**
You can debug or process error messages more easily using the reason codes. Reason codes are returned by the message broker
based on the type of interaction with the broker (Subscribe, Publish, Acknowledge). See [PubackReasonCode](https://aws.github.io/aws-iot-device-sdk-js-v2/browser/enums/mqtt5.PubackReasonCode.html),
[SubackReasonCode](https://aws.github.io/aws-iot-device-sdk-js-v2/browser/enums/mqtt5.SubackReasonCode.html),
[UnsubackReasonCode](https://aws.github.io/aws-iot-device-sdk-js-v2/browser/enums/mqtt5.UnsubackReasonCode.html),
[ConnectReasonCode](https://aws.github.io/aws-iot-device-sdk-js-v2/browser/enums/mqtt5.ConnectReasonCode.html),
[DisconnectReasonCode](https://aws.github.io/aws-iot-device-sdk-js-v2/browser/enums/mqtt5.DisconnectReasonCode.html). 

**Topic Aliases**
You can substitute a topic name with a topic alias, which is a two-byte integer.
 Set [topicAlias](https://aws.github.io/aws-iot-device-sdk-js-v2/browser/interfaces/mqtt5.PublishPacket.html#topicAlias)
 field when creating a PUBLISH packet.

**Message Expiry**
You can add message expiry values to published messages. Set [messageExpiryIntervalSeconds](https://aws.github.io/aws-iot-device-sdk-js-v2/browser/interfaces/mqtt5.PublishPacket.html#messageExpiryIntervalSeconds)
field in PublishPacket class.

**Server disconnect**
When a disconnection happens, the server can proactively send the client a DISCONNECT to notify connection closure with
a reason code for disconnection. Refer to [DisconnectPacket](https://aws.github.io/aws-iot-device-sdk-js-v2/browser/interfaces/mqtt5.DisconnectPacket.html)
class for details.

**Request/Response**
Publishers can request a response be sent by the receiver to a publisher-specified topic upon reception. Set [responseTopic](https://aws.github.io/aws-iot-device-sdk-js-v2/browser/interfaces/mqtt5.PublishPacket.html#responseTopic)
field in PublishPacket class.

**Maximum Packet Size**
Client and Server can independently specify the maximum packet size that they support. See [ConnectPacket.maximumPacketSizeBytes](https://aws.github.io/aws-iot-device-sdk-js-v2/browser/interfaces/mqtt5.ConnectPacket.html#maximumPacketSizeBytes),
[NegotiatedSettings.maximumPacketSizeToServer](https://aws.github.io/aws-iot-device-sdk-js-v2/browser/interfaces/mqtt5.NegotiatedSettings.html#maximumPacketSizeToServer),
and [ConnAckPacket.maximumPacketSize](https://aws.github.io/aws-iot-device-sdk-js-v2/browser/interfaces/mqtt5.ConnackPacket.html#maximumPacketSize)
fields.

**Payload format and content type**
You can specify the payload format (binary, text) and content type when a message is published. These are forwarded to
the receiver of the message. Use [contentType](https://aws.github.io/aws-iot-device-sdk-js-v2/browser/interfaces/mqtt5.PublishPacket.html#contentType)
field in PublishPacket class.

**Shared Subscriptions**
Shared Subscriptions allow multiple clients to share a subscription to a topic and only one client will receive messages
published to that topic using a random distribution. Refer to a [shared subscription sample](https://github.com/aws/aws-iot-device-sdk-js-v2/tree/main/samples/node/shared_subscription)
in V2 SDK.\
**NOTE** AWS IoT Core provides this functionality for MQTT3 as well.
