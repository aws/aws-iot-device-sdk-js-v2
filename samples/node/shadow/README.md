# Node: Shadow

[**Return to main sample list**](../../README.md)

This is an interactive sample that supports a set of commands that allow you to interact with "classic" (unnamed) shadows of the AWS IoT [Device Shadow](https://docs.aws.amazon.com/iot/latest/developerguide/iot-device-shadows.html) Service.

### Commands
Once connected, the sample supports the following shadow-related commands:

* `get` - gets the current full state of the classic (unnamed) shadow.  This includes both a "desired" state component and a "reported" state component.
* `delete` - deletes the classic (unnamed) shadow completely
* `update-desired <desired-state-json-document>` - applies an update to the classic shadow's desired state component.  Properties in the JSON document set to non-null will be set to new values.  Properties in the JSON document set to null will be removed.
* `update-reported <reported-state-json-document>` - applies an update to the classic shadow's reported state component.  Properties in the JSON document set to non-null will be set to new values.  Properties in the JSON document set to null will be removed.

Two additional commands are supported:
* `help` - prints the set of supported commands
* `quit` - quits the sample application

### Prerequisites
Your IoT Core Thing's [Policy](https://docs.aws.amazon.com/iot/latest/developerguide/iot-policies.html) must provide privileges for this sample to connect, subscribe, publish, and receive. Below is a sample policy that can be used on your IoT Core Thing that will allow this sample to run as intended.

<details>
<summary>Sample Policy</summary>
<pre>
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "iot:Publish"
      ],
      "Resource": [
        "arn:aws:iot:<b>region</b>:<b>account</b>:topic/$aws/things/<b>thingname</b>/shadow/get",
        "arn:aws:iot:<b>region</b>:<b>account</b>:topic/$aws/things/<b>thingname</b>/shadow/delete",
        "arn:aws:iot:<b>region</b>:<b>account</b>:topic/$aws/things/<b>thingname</b>/shadow/update"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "iot:Receive"
      ],
      "Resource": [
        "arn:aws:iot:<b>region</b>:<b>account</b>:topic/$aws/things/<b>thingname</b>/shadow/get/*",
        "arn:aws:iot:<b>region</b>:<b>account</b>:topic/$aws/things/<b>thingname</b>/shadow/delete/*",
        "arn:aws:iot:<b>region</b>:<b>account</b>:topic/$aws/things/<b>thingname</b>/shadow/update/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "iot:Subscribe"
      ],
      "Resource": [
        "arn:aws:iot:<b>region</b>:<b>account</b>:topicfilter/$aws/things/<b>thingname</b>/shadow/get/*",
        "arn:aws:iot:<b>region</b>:<b>account</b>:topicfilter/$aws/things/<b>thingname</b>/shadow/delete/*",
        "arn:aws:iot:<b>region</b>:<b>account</b>:topicfilter/$aws/things/<b>thingname</b>/shadow/update/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": "iot:Connect",
      "Resource": "arn:aws:iot:<b>region</b>:<b>account</b>:client/test-*"
    }
  ]
}
</pre>

Replace with the following with the data from your AWS account:
* `<region>`: The AWS IoT Core region where you created your AWS IoT Core thing you wish to use with this sample. For example `us-east-1`.
* `<account>`: Your AWS IoT Core account ID. This is the set of numbers in the top right next to your AWS account name when using the AWS IoT Core website.
* `<thingname>`: The name of your AWS IoT Core thing you want the device connection to be associated with

Note that in a real application, you may want to avoid the use of wildcards in your ClientID or use them selectively. Please follow best practices when working with AWS on production applications using the SDK. Also, for the purposes of this sample, please make sure your policy allows a client ID of `test-*` to connect or use `--client_id <client ID here>` to send the client ID your policy supports.

</details>

## Walkthrough

Before building and running the sample, you must run `npm install` on the SDK itself; the sample takes a dependency on the SDK by a relative path.  

To run the Shadow sample, go to the `node/shadow` folder and run the following commands:

``` sh
npm install
node dist/index.js --endpoint <endpoint> --cert <path to the certificate> --key <path to the private key> --thing_name <thing name>
```

The sample also listens to a pair of event streams related to the classic (unnamed) shadow state of your thing, so in addition to responses, you will occasionally see output from these streaming operations as they receive events from the shadow service.

Once successfully connected, you can issue commands.

### Initialization

Start off by getting the shadow state:

```
get
```

If your thing does have shadow state, you will get its current value, which this sample has no control over.  Let's assume it was initialized
like what is described below:

```
Get response: {"state":{"desired":{"Color":"green"},"reported":{"Color":"green"}},"metadata":{"desired":{"Color":{"timestamp":1719859726}},"reported":{"Color":{"timestamp":1719859716}}},"version":16,"timestamp":1719859789,"clientToken":"7b9b5e47-60b3-497a-83a1-a0b803fe997c"}
```

If your thing does not have any shadow state, you'll get a ResourceNotFound error:

```
Error processing command: {"modeledError":{"code":404,"message":"No shadow exists with name: '<YourThingName>'","clientToken":"<Some UUID>"}}
```

To create a shadow, you can issue an update call that will initialize the shadow to a starting state:

```
update-reported {"Color":"green"}
```

which will yield output similar to:

```
Update Reported response: {"state":{"reported":{"Color":"green"}},"metadata":{"reported":{"Color":{"timestamp":1719853620}}},"version":1,"timestamp":1719853620,"clientToken":"2e073dae-7c50-458f-a495-c16fae14a406"}

Received ShadowUpdated event: {"previous":null,"current":{"state":{"reported":{"Color":"green"}},"metadata":{"reported":{"Color":{"timestamp":1719853620}}},"version":1},"timestamp":1719853620,"clientToken":"2e073dae-7c50-458f-a495-c16fae14a406"}
```

Notice that in addition to receiving a response to the update request, you also receive a `ShadowUpdated` event containing what changed about 
the shadow plus additional metadata (version, update timestamps, etc...).  Every time a shadow is updated, this 
event is triggered.  If you wish to listen and react to this event, use the `createShadowUpdatedStream` API in the shadow client to create a 
streaming operation that converts the raw MQTT publish messages into modeled data that the streaming operation emits as Javascript events.

Issue one more update to get the shadow's reported and desired states in sync:

```
update-desired {"Color":"green"}
```

yielding output similar to:

```
Update Desired response: {"state":{"desired":{"Color":"green"}},"metadata":{"desired":{"Color":{"timestamp":1719855311}}},"version":4,"timestamp":1719855312,"clientToken":"1ef3baf8-169a-4095-93f2-0b39c15a01a8"}

<ShadowUpdated event omitted>
```

### Changing Properties
A device shadow contains two independent states: reported and desired.  "Reported" represents the device's last-known local state, while
"desired" represents the state that control application(s) would like the device to change to.  In general, each application (whether on the device or running
remotely as a control process) will only update one of these two state components.  

Let's walk through the multi-step process to coordinate a change-of-state on the device.  First, a control application needs to update the shadow's desired 
state with the change it would like applied:

```
update-desired {"Color":"red"}
```

For our sample, this yields output similar to:

```
Update Desired response: {"state":{"desired":{"Color":"red"}},"metadata":{"desired":{"Color":{"timestamp":1719855498}}},"version":5,"timestamp":1719855498,"clientToken":"79737dba-2252-406e-9204-3dec049eebce"}

Received ShadowUpdated event: {"previous":{"state":{"desired":{"Color":"green"},"reported":{"Color":"green"}},"metadata":{"desired":{"Color":{"timestamp":1719855311}},"reported":{"Color":{"timestamp":1719853620}}},"version":4},"current":{"state":{"desired":{"Color":"red"},"reported":{"Color":"green"}},"metadata":{"desired":{"Color":{"timestamp":1719855498}},"reported":{"Color":{"timestamp":1719853620}}},"version":5},"timestamp":1719855498,"clientToken":"79737dba-2252-406e-9204-3dec049eebce"}

Received ShadowDeltaUpdated event: {"version":5,"timestamp":1719855498,"state":{"Color":"red"},"metadata":{"Color":{"timestamp":1719855498}},"clientToken":"79737dba-2252-406e-9204-3dec049eebce"}
```

The key thing to notice here is that in addition to the update response (which only the control application would see) and the ShadowUpdated event,
there is a new event, ShadowDeltaUpdated, which indicates properties on the shadow that are out-of-sync between desired and reported.  All out-of-sync
properties will be included in this event, including properties that became out-of-sync due to a previous update.

Like the ShadowUpdated event, ShadowDeltaUpdated events can be listened to by creating and configuring a streaming operation, this time by using 
the createShadowDeltaUpdatedStream API.  Using the ShadowDeltaUpdated events (rather than ShadowUpdated) lets a device focus on just what has 
changed without having to do complex JSON diffs on the full shadow state itself.

Assuming that the change expressed in the desired state is reasonable, the device should apply it internally and then let the service know it
has done so by updating the reported state of the shadow:

```
update-reported {"Color":"red"}
```

yielding

```
Update Reported response: {"state":{"reported":{"Color":"red"}},"metadata":{"reported":{"Color":{"timestamp":1719856038}}},"version":6,"timestamp":1719856038,"clientToken":"1317558e-0f69-40d7-8bdd-d3301a1cd6f7"}

Received ShadowUpdated event: {"previous":{"state":{"desired":{"Color":"red"},"reported":{"Color":"green"}},"metadata":{"desired":{"Color":{"timestamp":1719855498}},"reported":{"Color":{"timestamp":1719853620}}},"version":5},"current":{"state":{"desired":{"Color":"red"},"reported":{"Color":"red"}},"metadata":{"desired":{"Color":{"timestamp":1719855498}},"reported":{"Color":{"timestamp":1719856038}}},"version":6},"timestamp":1719856038,"clientToken":"1317558e-0f69-40d7-8bdd-d3301a1cd6f7"}
```

Notice that no ShadowDeltaUpdated event is generated because the reported and desired states are now back in sync.  

### Multiple Properties
Not all shadow properties represent device configuration.  To illustrate several more aspects of the Shadow service, let's add a second property to our shadow document, 
starting out in sync (output omitted):

```
update-reported {"Status":"Great"}
```

```
update-desired {"Status":"Great"}
```

Notice that shadow updates work by deltas rather than by complete state changes.  Updating the "Status" property to a value had no effect on the shadow's
"Color" property:

```
get
```

yields

```
Get response: {"state":{"desired":{"Color":"red","Status":"Great"},"reported":{"Color":"red","Status":"Great"}},"metadata":{"desired":{"Color":{"timestamp":1719855498},"Status":{"timestamp":1719856710}},"reported":{"Color":{"timestamp":1719856038},"Status":{"timestamp":1719856694}}},"version":8,"timestamp":1719856723,"clientToken":"e6e3123c-5526-404f-8006-a8cc44da0f23"}
```

Suppose something goes wrong with the device and its status is no longer "Great"

```
update-reported {"Status":"Awful"}
```

which yields something similar to:

```
Update Reported response: {"state":{"reported":{"Status":"Awful"}},"metadata":{"reported":{"Status":{"timestamp":1719857563}}},"version":9,"timestamp":1719857563,"clientToken":"05ed8956-4958-4fcc-bdd8-e454182c3a45"}

Received ShadowUpdated event: {"previous":{"state":{"desired":{"Color":"red","Status":"Great"},"reported":{"Color":"red","Status":"Great"}},"metadata":{"desired":{"Color":{"timestamp":1719855498},"Status":{"timestamp":1719856710}},"reported":{"Color":{"timestamp":1719856038},"Status":{"timestamp":1719856694}}},"version":8},"current":{"state":{"desired":{"Color":"red","Status":"Great"},"reported":{"Color":"red","Status":"Awful"}},"metadata":{"desired":{"Color":{"timestamp":1719855498},"Status":{"timestamp":1719856710}},"reported":{"Color":{"timestamp":1719856038},"Status":{"timestamp":1719857563}}},"version":9},"timestamp":1719857563,"clientToken":"05ed8956-4958-4fcc-bdd8-e454182c3a45"}

Received ShadowDeltaUpdated event: {"version":9,"timestamp":1719857563,"state":{"Status":"Great"},"metadata":{"Status":{"timestamp":1719856710}},"clientToken":"05ed8956-4958-4fcc-bdd8-e454182c3a45"}
```

Similar to how updates are delta-based, notice how the ShadowDeltaUpdated event only includes the "Status" property, leaving the "Color" property out because it 
is still in sync between desired and reported.

### Removing properties
Properties can be removed from a shadow by setting them to null.  Removing a property completely would require its removal from both the
reported and desired states of the shadow (output omitted):

```
update-reported {"Status":null}
```

```
update-desired {"Status":null}
```

If you now get the shadow state:

```
get
```

its output yields something like

```
Get response: {"state":{"desired":{"Color":"red"},"reported":{"Color":"red"}},"metadata":{"desired":{"Color":{"timestamp":1719855498}},"reported":{"Color":{"timestamp":1719856038}}},"version":11,"timestamp":1719858143,"clientToken":"72f05b90-b0a2-4ff5-8b1f-1931f7c39b9a"}
```

The Status property has been fully removed from the shadow state.

### Removing a shadow
To remove a shadow, you must invoke the DeleteShadow API (setting the reported and desired
states to null will only clear the states, but not delete the shadow resource itself).

```
delete
```

yields something like

```
Delete response: {"version":13,"timestamp":1719858420,"clientToken":"14e3c6d4-8544-4828-8e51-4abeb9058206"}
```