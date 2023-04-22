# Greengrass IPC Beta
This document provides information about the unofficial beta for the SDK's Greengrass IPC client.  This document has been
written "after-the-fact" and may contain errors.  Holler in slack and I will update as appropriate.  

This document and its informal, internal language will be replaced by a proper user guide upon public release.

My testing has been limited to Linux only.  If someone is able to test on Windows, that would be fantastic.

*__Jump To:__*
* [Getting Started](#Getting-Started)
* [Design Notes](#Design-Notes)
* [Component Development](#Component-Development)
* [Feedback](#Feedback)
* [FAQ](#FAQ)

## Getting Started

The Greengrass IPC client is not currently public.  Until public dev-preview release, it can only be used from the
*GreengrassIpcBeta* branch of the v2 JS SDK:

```shell
git clone https://github.com/aws/aws-iot-device-sdk-js-v2
cd aws-iot-device-sdk-js-v2
git checkout GreengrassIpcBeta
npm install
```

## Design Notes

### Overview
The Javascript Greengrass IPC client should be equivalent to the V2 IPC clients of Python and Java.  There is currently 
one notable exception to this equivalence (discrimination of inbound unions).  

Request-response operations are simple async API
calls.  Streaming operations are a little more complex, but still straightforward: invoke the API call, attach event
listeners as desired, and call activate() (in fact, due to return-value chaining, this can be done in a single 
statement, which I am irrationally pleased by).  In all cases, there are no gotchas around threading like the way the v1 IPC clients
cannot be waited upon in a callback.

### Tenets

#### Handlers Bad, Events Good
The other SDK IPC implementations use handler classes to respond to IPC events like disconnections, errors, and streaming
messages.  This is not a criticism of that approach; it may well have been the best possible choice for that language.  Javascript
already has a built-in event system that supports this functionality without requiring you to define/extend auxiliary classes 
and override interface methods.  

The Greengrass IPC implementation uses events on the client object (disconnection, errors) and streaming operation 
type (messages, errors, closed).  Attach event listeners as needed to the appropriate IPC object and you're golden.

#### Plain-Old-Data Service Model
The Greengrass IPC service model is defined solely with Plain-Old-Data (or Plain-Old-Object to be more accurate) types.  In typescript
this works out to be just interfaces containing simple, modeled, or collection type members. This leads to a simple 
style where you use literal JSON to perform API calls and
auxiliary functionality (serialization, deserialization, validation, etc...) does not appear in the public service model.

It does have a drawback though where any augmentation or helper functionality for output types is not easy to add.  See
the Design sub-section of the Feedback section for more details.

#### Client-side Validation and Normalization
I've gone to significant lengths to perform just the right amount of validation on input to the client.  This validation
includes type validation -- while we use typescript internally, our customers may not.  Ultimately you should be able
to pass anything into the client that meets the modeled interface contract and it will do the right thing.  If you pass
in bad data, the resulting error should tell you where the problem is and exactly what you did wrong.  Unmodeled 
fields will be stripped and ignored and modeled fields will be checked for type and value up to the limits of backwards 
compatibility guarantees (ie enum values are not checked).

#### Error Handling
I find Javascript errors uncomfortable because it's hard to work with them when they can be a variety of sub-classes of
the base error type.  For this reason, all errors, whether rejected promises or emitted events, are of the RpcError 
type.  This includes exceptions generated from internal conditions and exceptions triggered by modeled errors sent by 
the Greengrass IPC service.  If you ever encounter a scenario where an exception escapes the Greengrass IPC system 
(client, operation, streaming operation) that is not an RpcError then that is a Correctness bug and must be addressed.

RpcError contains fields for error type, a description, any associated inner error, and any associated modeled service 
error.

#### Binary Data
Inbound data that may be binary (**blob** in service model language) is always surfaced as an `ArrayBuffer`.  Even if it's
utf-8, you must manually convert it yourself on receipt (the client doesn't know it's utf-8).  See the message handler
in the [IPC example](./samples/node/gg_ipc/index.ts) for this conversion process in action.

On a more relaxed note, outbound blob data can be any of `string | ArrayBuffer | ArrayBufferView`.

## Component Development

### Background
Since the IPC client does not yet exist in the SDK's npm package, you will need to go through some tedious additional
steps to use the client.  In particular, you will need to reference
the SDK via a path (relative preferred over absolute, for permissions reasons) rather than a version.  Path references
are handled by npm as a symlink in the node_modules directory and, unfortunately, symlinks are not followed during
local component deployments.  Naively deploying your component directory as an artifact after an `npm install` 
leaves you with an empty aws-iot-device-sdk-v2 directory beneath the deployed node_modules directory and a `MODULE_NOT_FOUND`
error in your logs.

There are many ways to get around this.  The next section explicitly outlines a single possibility but others exist.  Feel
free to use (and share) your own approaches.  In particular, I did not explore using NODE_PATH as a way to source modules
from completely independent directories; that could end up yielding the simplest work-around.

### SDK Path Reference Workaround Example

For my testing, I arranged my component's artifacts directory as follows:

```shell
artifacts/<component name>/1.0.0/<component_directory>/
artifacts/<component_name>/1.0.0/aws-iot-device-sdk-js-v2/
```

The SDK directory is on the Greengrass IPC Beta branch and has had `npm install` invoked on it.

The component directory contains `package.json`, `index.ts` (or index.js), etc... and has had `npm install` invoked on it.  

The component's package.json contains a reference to the SDK via a relative path:

```json
    "dependencies": {
        "aws-iot-device-sdk-v2": "../aws-iot-device-sdk-js-v2",
        ...
    }
```

Finally, the component recipe contains a fixup step during the install process that will copy the deployed SDK into the
correct final spot for the component:  
```json
      "Lifecycle": {
        "Install": "cp -r {artifacts:path}/aws-iot-device-sdk-js-v2/* {artifacts:path}/component/node_modules/aws-iot-device-sdk-v2",    
        "Run": "node {artifacts:path}/component/dist/index.js"
      }
```
Note
that the destination directory is the module name (`aws-iot-device-sdk-v2`) which is slightly different than the repository name (`aws-iot-device-sdk-js-v2`).
Don't be like me and mess that up and get confused.

### (Quasi-)Sample

A simple IoT Core Pub Sub [IPC example](./samples/node/gg_ipc/index.ts) can be found in the `samples/node/gg_ipc` 
directory, including an associated recipe with proper
permissions (obviously that is not the right place for the recipe when making an actual component).  

Note that the relative path to the SDK in the sample is based on being embedded in the samples directory of the SDK rather than the directory
structure outlined above.  An actual component would need to change the SDK reference in `package.json` to 
`../aws-iot-device-sdk-js-v2`.

### Component-less Testing
You can bypass component development/deployment entirely if you have the correct values for the environment
variables used by Greengrass IPC to configure the IPC client to be able to connect to the nucleus:
* **AWS_GG_NUCLEUS_DOMAIN_SOCKET_FILEPATH_FOR_COMPONENT** - This is the path of the domain socket that the nucleus is listening for IPC connections on.  This is always (for now) `/greengrass/v2/ipc.socket`
* **SVCUID** - This is a per-component auth token and is regenerated every time the component is restarted.  The nucleus will reject connection attempts that do not include this. 

I did initial testing without components by modifying the HelloWorld component in the Getting Started of the AWS 
documentation to print out these two values.  After pulling them from the component log, I could run a Greengrass IPC 
application directly from the command line or IDE by setting the corresponding environment variables.

## Feedback
Feedback can be sent via DM or TT, but the beta slack channel is preferred for knowledge propagation purposes.  All feedback is welcome, but
at a minimum I've love to see it on (by priority):
* **Correctness** - Stability and expected behavior
* **Ease-of-use** - Is anything unnecessarily complex?  Can anything be simplified?  What is hard to understand or do?
* **Idiomaticness** - Does the public API contract feel right/natural for Javascript?
* **Polish/Misc** - Everything else

### Issues and Discussion Points
If this set gets too unwieldy, we can move it to TT, but for now I'm putting them here to help orientation.

#### Minor Issues
* Multiple Doc Comments - (**Polish/Misc**) The Greengrass service model uses multiple documentation annotations in a few spots.  These are not rendered well by the codegen (it compiles, but it looks dumb)
* Incorrect Doc Annotations - (**Polish/Misc**) The Greengrass service model has some incorrect documentation annotations in it.  This has already been fixed internally, but the fix has been applied to a version of the model that contains unreleased changes (MQTT5 support) and so I don't want to use it until there's a public version of Greengrass that those changes would be handled in.
* Integer Size Validation - (**Correctness**) Modeled integer fields do not currently perform range checks on their value during validation, only is-a-number and is-an-integer.
#### Design Deficiencies
* Undiscriminated Inbound Unions - (**Ease of Use**) Per the Design Notes, the JS IPC modeling approach uses Plain-Old-Data (POD) types.  Most of the costs of this choice are paid internally by the client code generaation, but there is one downside currently in the user experience.  When handling a response or a streaming message that contains or is a union, no indication is given as to which member of the union is set.  There are several possibilities for how we might assist the user or simplify this scenario, but nothing is concrete or particularly satisfactory yet.
#### Design Debates
* Non-uniformity - (**Idiomaticness**) The JS IPC implementation has intentionally prioritized idiomaticness over cross-SDK uniformity.  The "handler" concept from the other SDKs has been rejected in favor of the Javascript event system.  I am extremely happy with this choice (and have some strong opinions on the general tension between uniformity and idiomaticness), but others may not be.

## FAQ
(Q and A to be added if discussion develops)


