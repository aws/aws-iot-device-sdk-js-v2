# Greengrass IPC in the v2 Javascript SDK

# Table of contents
* [Cross-SDK API Differences](#cross-sdk-differences)
* [Example](#greengrass-ipc-example)
* [Greengrass IPC Client](#greengrass-ipc-client)
  * [Client Setup](#client-setup)
  * [Client Shutdown](#client-shutdown)
  * [Client Events](#client-events)
  * [Client Error Handling](#client-error-handling)
* [Greengrass IPC Operations](#greengrass-ipc-operations)
  * [Request-Response Operations](#request-response-operations)
  * [Streaming Operations](#streaming-operations)
  * [Operation Error Handling](#operation-error-handling)
* [Miscellaneous Topics](#miscellaneous-topics)
  * [Binary Data](#binary-data)

Complete API documentation for Javascript Greengrass IPC can be found on [Github](https://aws.github.io/aws-iot-device-sdk-js-v2/node/modules/greengrasscoreipc)

Greengrass IPC is intended for use in developing Greengrass components.  This guide does 
not give any guidance on component development.  See the
[Greengrass component](https://docs.aws.amazon.com/greengrass/v2/developerguide/greengrass-components.html) AWS 
documentation for more details on that subject.

This guide is a work in progress.  Feedback is welcomed.

## Cross-SDK Differences
The Javascript Greengrass IPC implementation has several differences relative to the IPC implementations in the other v2 IoT SDKs:
* No handler types - Javascript Greengrass IPC uses Javascript's event system (events, listeners, emitters) for all asynchronous notifications.
* Single client - Other v2 IoT SDKs have both a v1 and v2 client, where the v1 client is low-level and more verbose (and complex) in usage, while the v2 client is streamlined and less prone to accidental misuse.  Javascript Greengrass IPC skips the v1 client and starts directly with the v2 client approach.

## Greengrass IPC Example
For those who prefer to dive right in, you can start with our [Greengrass IPC example](https://github.com/aws/aws-iot-device-sdk-js-v2/blob/main/samples/node/gg_ipc).  
The associated [README](https://github.com/aws/aws-iot-device-sdk-js-v2/blob/main/samples/node/gg_ipc/README.md) contains instructions for how to perform a local greengrass deployment of the sample
as a component.

## Greengrass IPC Client
All Greengrass IPC is initiated from a Greengrass IPC Client.  A single client should be sufficient for all use cases,
regardless of concurrency requirements.

### Client Setup

While advanced configuration options exist, under typical circumstances creating a Greengrass IPC client is quite easy:

```typescript
import * as greengrascoreipc from 'aws-iot-device-sdk-v2';

let client = greengrascoreipc.createClient();
```

Once created, call the `connect` API to establish a connection from your component to its Greengrass Nucleus:
```typescript
await client.connect();
```

`connect` may only be called once.  If a client becomes disconnected and you wish to continue to use Greengrass IPC, you must
create a new client.  If `connect` fails, the associated Promise will be rejected with an 
[RpcError](https://aws.github.io/aws-iot-device-sdk-js-v2/node//classes/eventstream_rpc.RpcError.html) value.  See 
[Client Error Handling](#Client-Error-Handling) for more information on `RpcError`.

### Client Shutdown
When finished with the client, you must call the `close` API, regardless of whether the network connection is still active.
`close` also releases native resources used by the client, and without invoking it, they will leak:

```typescript
await client.close();
```

As part of the asynchronous `close` process, all unclosed streaming operations associated with the client will also
be closed.

Once a client has been closed, it cannot be used further.

### Client Events
The Greengrass IPC client provides a single event that can be listened to, the `disconnection` event.  A `disconnection`
is emitted when the underlying connection is torn down.  A `disconnection` event will only be emitted if a call to 
`connect` previously succeeded; connection establishment failures only manifest as a rejected promise.

Calling `close` on a connected client will cause a `disconnection` event to be emitted as part of the shutdown process.

### Client Error Handling
All errors thrown from the Greengrass IPC implementation are of the 
[RpcError](https://aws.github.io/aws-iot-device-sdk-js-v2/node//classes/eventstream_rpc.RpcError.html) type.  The RpcError class 
contains properties for the type of error, a description, an optional, potentially-recursive inner error, and an 
optional modeled error.  Modeled errors represent failures sent by the Greengrass nucleus.

All client input is heavily validated for conformance to the Greengrass RPC service contract.  Some validation (like enum
values) is skipped to allow for model evolution while retaining backwards compatibility.

## Greengrass IPC Operations
Once connected, a client can be used to perform IPC operations.
Greengrass IPC operations fall into two categories: request-response and streaming.

### Request-Response Operations
All IPC operations that conform to a single request and single response use the standard asynchronous request-response
pattern.  Invoking these operations is a simple matter of await-ing on the client API call:

```typescript
await client.publishToIotCore({
    topicName: "hello/world",
    payload: "Hello from a component!",
    qos : greengrasscoreipc.model.QOS.AT_LEAST_ONCE    
});
```

If a request-response operation fails, the associated promise will be rejected with an 
[RpcError](https://aws.github.io/aws-iot-device-sdk-js-v2/node//classes/eventstream_rpc.RpcError.html) value that 
contains more information about what went wrong.

### Streaming Operations
While streaming operations can in theory be bi-directional, the Greengrass RPC service model currently only contains
operations with streaming output.

A streaming operation is not performed automatically when the client API is invoked (otherwise the user would not have
an opportunity to attach event listeners beforehand, potentially missing streaming events).  Instead the client API
creates and returns a `StreamingOperation` object.

A `StreamingOperation` object supports several events:
* `message` - event emitted every time a message is successfully received on the stream from the server.  The data included with this event is specific to each streaming operation type.
* `streamError` - event emitted when either the deserialization of an incoming message failed, or the deserialization resulted in a modeled service error.  The data included with this event is an [RpcError](https://aws.github.io/aws-iot-device-sdk-js-v2/node//classes/eventstream_rpc.RpcError.html).
* `ended` - event emitted when the stream has been closed for any reason.  Only emitted for operations that were successfully activated.

Once a streaming operation has been created and configured with event listeners, you must call `activate` on it in order
to begin the stream.  A typical usage pattern looks like:

```typescript
    // subscribe to an MQTT topic on IoT Core
    let streamingSubscription = client.subscribeToIoTCore({
        topicName: "hello/world",
        qos: greengrasscoreipc.model.QOS.AT_LEAST_ONCE
    });

    // handle incoming publishes
    streamingSubscription.on("message", (message: greengrasscoreipc.model.IoTCoreMessage) => {
        // handle the received MQTT publish message
    });
    
    // start the stream
    await streamingSubscription.activate();
```

Like a Greengrass IPC client, a streaming operation must be closed, via the `close()` API, when finished with.  The Greengrass IPC client will
close all open streaming operations when it itself is closed, but we recommend closing streaming operations as soon
as they are no longer needed to help minimize overall resource consumption.

### Operation Error Handling
Operations throw errors via either rejected promises or emitting an `streamError` event (streaming operation only).  
In both cases, the error data is an instance
of [RpcError](https://aws.github.io/aws-iot-device-sdk-js-v2/node//classes/eventstream_rpc.RpcError.html).

## Miscellaneous Topics

### Binary Data
In Greengrass RPC, operation payloads are sent as JSON.  This means binary-value fields must be base64 encoded first.  In Javascript Greengrass IPC, 
you can specify the value of a binary field with several different types (`string | ArrayBuffer | ArraBufferView`).  The
SDK will look at the value, convert it as appropriate to binary and then base64 encode it, before sending it to the Greengrass Nucleus.
Unfortunately, the SDK has no way of knowing what type it should convert received binary data to.  So in all cases, binary
data received from the Greengrass Nucleus is decoded from base64 and then left as an ArrayBuffer.  If you know the data
is valid utf-8, you will need to convert the received `ArrayBuffer`.  The gg_ipc sample contains an example of this:

```typescript
    console.log(`Message received on topic '${message.message.topicName}': '${toUtf8(new Uint8Array(message.message.payload as ArrayBuffer))}'`);
```

In the Greengrass model, the MQTT message's payload is a binary blob, so it must be converted from an ArrayBuffer even though
we submitted the message payload as a utf-8 string in the `PublishToIotCore` operation.