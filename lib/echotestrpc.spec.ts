/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */


import * as eventstream_rpc from "./eventstream_rpc";
import * as echo_rpc from "./echotestrpc";
import assert from "assert";
import * as model_utils from "./echotestrpc/model_utils";
import {once} from "events";

jest.setTimeout(10000);


function hasEchoServerEnvironment() : boolean {
    if (process.env.AWS_TEST_EVENT_STREAM_ECHO_SERVER_HOST === undefined) {
        return false;
    }

    if (process.env.AWS_TEST_EVENT_STREAM_ECHO_SERVER_PORT === undefined) {
        return false;
    }

    return true;
}

const conditional_test = (condition : boolean) => condition ? it : it.skip;


function makeGoodConfig() : eventstream_rpc.RpcClientConfig {
    let config : eventstream_rpc.RpcClientConfig = {
        hostName: process.env.AWS_TEST_EVENT_STREAM_ECHO_SERVER_HOST ?? "",
        port: parseInt(process.env.AWS_TEST_EVENT_STREAM_ECHO_SERVER_PORT ?? "0"),
    };

    return config;
}

async function doEchoRequestResponseSuccessTest(request: echo_rpc.model.EchoMessageRequest) {
    return new Promise<void>(async (resolve, reject) => {
        try {
            let client: echo_rpc.Client = echo_rpc.createClient(makeGoodConfig());

            let disconnected = once(client, echo_rpc.Client.DISCONNECTION);

            await client.connect();

            let response: echo_rpc.model.EchoMessageResponse = await client.echoMessage(request);

            expect(response).toBeDefined();
            assert.deepStrictEqual(request, response, "Mismatch between echo request and echo response");

            client.close();

            await(disconnected);

            resolve();
        } catch (err) {
            reject(err);
        }
    });
}

conditional_test(hasEchoServerEnvironment())('Request-response echo success test - string message', async () => {
    await doEchoRequestResponseSuccessTest({
        message: {
            stringMessage : "Test!"
        }
    });
});


conditional_test(hasEchoServerEnvironment())('Request-response echo success test - boolean message', async () => {
    await doEchoRequestResponseSuccessTest({
        message: {
            booleanMessage : true
        }
    });
});

conditional_test(hasEchoServerEnvironment())('Request-response echo success test - time message', async () => {
    await doEchoRequestResponseSuccessTest({
        message: {
            timeMessage : new Date()
        }
    });
});

conditional_test(hasEchoServerEnvironment())('Request-response echo success test - document message', async () => {
    await doEchoRequestResponseSuccessTest({
        message: {
            documentMessage : {
                key1: ["value1", 5.0 ],
                key2: {
                    subKey: {
                        subSubKey : true
                    }
                }
            }
        }
    });
});

conditional_test(hasEchoServerEnvironment())('Request-response echo success test - enum message', async () => {
    await doEchoRequestResponseSuccessTest({
        message: {
            enumMessage : echo_rpc.model.FruitEnum.APPLE
        }
    });
});

async function doEchoRequestResponseSuccessTestBlob(request: echo_rpc.model.EchoMessageRequest, blobAsBuffer: Buffer) {
    return new Promise<void>(async (resolve, reject) => {
        try {
            let client: echo_rpc.Client = echo_rpc.createClient(makeGoodConfig());

            await client.connect();

            let response: echo_rpc.model.EchoMessageResponse = await client.echoMessage(request);

            expect(response).toBeDefined();
            let responseBuffer = Buffer.from(response.message?.blobMessage as ArrayBuffer);
            expect(responseBuffer).toEqual(blobAsBuffer);

            client.close();

            resolve();
        } catch (err) {
            reject(err);
        }
    });
}

conditional_test(hasEchoServerEnvironment())('Request-response echo success test - blob message as string', async () => {

    let stringPayload : string = "Not Binary";
    let payloadBuffer = Buffer.from(stringPayload, "utf-8");
    await doEchoRequestResponseSuccessTestBlob({
            message: {
                blobMessage: stringPayload
            }
        },
        payloadBuffer
    );
});

conditional_test(hasEchoServerEnvironment())('Request-response echo success test - blob message as buffer', async () => {

    let payloadBuffer = Buffer.from("This is binary", "utf-8");
    await doEchoRequestResponseSuccessTestBlob({
            message: {
                blobMessage: payloadBuffer
            }
        },
        payloadBuffer
    );
});

conditional_test(hasEchoServerEnvironment())('Request-response echo success test - string list message empty', async () => {
    await doEchoRequestResponseSuccessTest({
        message: {
            stringListMessage : []
        }
    });
});

conditional_test(hasEchoServerEnvironment())('Request-response echo success test - string list message non-empty', async () => {
    await doEchoRequestResponseSuccessTest({
        message: {
            stringListMessage : ["PUBACK", "Hello", "World"]
        }
    });
});

conditional_test(hasEchoServerEnvironment())('Request-response echo success test - key-value list message empty', async () => {
    await doEchoRequestResponseSuccessTest({
        message: {
            keyValuePairList : []
        }
    });
});

conditional_test(hasEchoServerEnvironment())('Request-response echo success test - key-value list message non-empty', async () => {
    await doEchoRequestResponseSuccessTest({
        message: {
            keyValuePairList : [{ key: "Key1", value : "Value1"}, { key: "Key2", value : "Value2"}]
        }
    });
});

conditional_test(hasEchoServerEnvironment())('Request-response echo success test - string-to-value map message empty', async () => {
    await doEchoRequestResponseSuccessTest({
        message: {
            stringToValue : new Map<string, echo_rpc.model.Product>()
        }
    });
});

conditional_test(hasEchoServerEnvironment())('Request-response echo success test - string-to-value map message non-empty', async () => {
    await doEchoRequestResponseSuccessTest({
        message: {
            stringToValue : new Map<string, echo_rpc.model.Product>([['firstWidget', {name: 'Widget', price: 3}], ['secondWidget', {name: 'PS10', price: 500000}]])
        }
    });
});

conditional_test(hasEchoServerEnvironment())('Request-response getAllProducts success test', async () => {
    let client: echo_rpc.Client = echo_rpc.createClient(makeGoodConfig());

    await client.connect();

    let response: echo_rpc.model.GetAllProductsResponse = await client.getAllProducts({});

    expect(response).toBeDefined();

    client.close();
});

conditional_test(hasEchoServerEnvironment())('Request-response getAllCustomers success test', async () => {
    let client: echo_rpc.Client = echo_rpc.createClient(makeGoodConfig());

    await client.connect();

    let response: echo_rpc.model.GetAllCustomersResponse = await client.getAllCustomers({});

    expect(response).toBeDefined();

    client.close();
});

function doValidationFailureCheck(shape: any, shapeName: string) : void {
    let model = model_utils.makeServiceModel();
    let validator = model.validators.get(shapeName);
    expect(validator).toBeDefined();

    // @ts-ignore
    expect(() => { validator(shape); }).toThrow();
}

test('Echo RPC Pair Validation Failure - missing required property', async () => {
    // @ts-ignore
    let badPair : model.Pair = {
        key : "NoValue"
    };

    doValidationFailureCheck(badPair, "awstest#Pair");
});

test('Echo RPC Pair Validation Failure - invalid string property', async () => {
    let badPair : echo_rpc.model.Pair = {
        key : "MyKey",
        // @ts-ignore
        value : 5
    };

    doValidationFailureCheck(badPair, "awstest#Pair");
});

function doNormalizationCheck(messyValue: any, expectedNormalizedValue: any, shapeName: string) {
    let model = model_utils.makeServiceModel();
    let normalizer = model.normalizers.get(shapeName);

    // @ts-ignore
    assert.deepStrictEqual(normalizer(messyValue), expectedNormalizedValue, "Normalized value not equivalent")
}

test('Echo RPC Pair Normalization - prune unmodeled properties', async () => {
    let moreThanAPair : echo_rpc.model.Pair = {
        key : "MyKey",
        value : "MyValue",
        // @ts-ignore
        derp : [ "StripMe"],
        weird : {
            value: 5
        }
    };

    let expectedNormalizationResult : echo_rpc.model.Pair = {
        key : "MyKey",
        value : "MyValue"
    }

    doNormalizationCheck(moreThanAPair, expectedNormalizationResult, "awstest#Pair");
});

test('Echo RPC Product Validation Failure - invalid number property', async () => {
    let badProduct : echo_rpc.model.Product = {
        name : "Ronco Yogurt Slicer",
        // @ts-ignore
        price : "3.50"
    };

    doValidationFailureCheck(badProduct, "awstest#Product");
});

test('Echo RPC Product Normalization - prune unmodeled properties', async () => {
    let moreThanAProduct : echo_rpc.model.Product = {
        name : "Acme Back Scratcher",
        price : 10,
        // @ts-ignore
        derp : [ "StripMe"],
        weird : {
            value: 5
        }
    };

    let expectedNormalizationResult : echo_rpc.model.Product = {
        name : "Acme Back Scratcher",
        price : 10
    }

    doNormalizationCheck(moreThanAProduct, expectedNormalizationResult, "awstest#Product");
});

test('Echo RPC MessageData Validation Failure - invalid boolean property', async () => {
    let badMessageData : echo_rpc.model.MessageData = {
        // @ts-ignore
        booleanMessage : "I'm not a boolean"
    };

    doValidationFailureCheck(badMessageData, "awstest#MessageData");
});

test('Echo RPC MessageData Validation Failure - invalid timestamp property', async () => {
    let badMessageData : echo_rpc.model.MessageData = {
        // @ts-ignore
        timeMessage : "I'm not a Date"
    };

    doValidationFailureCheck(badMessageData, "awstest#MessageData");
});

test('Echo RPC MessageData Validation Failure - invalid blob property', async () => {
    let badMessageData : echo_rpc.model.MessageData = {
        // @ts-ignore
        blobMessage : 5
    };

    doValidationFailureCheck(badMessageData, "awstest#MessageData");
});

test('Echo RPC MessageData Validation Failure - invalid string list property, not an array', async () => {
    let badMessageData : echo_rpc.model.MessageData = {
        // @ts-ignore
        stringListMessage : 5
    };

    doValidationFailureCheck(badMessageData, "awstest#MessageData");
});

test('Echo RPC MessageData Validation Failure - invalid string list property, element not a string', async () => {
    let badMessageData : echo_rpc.model.MessageData = {
        // @ts-ignore
        stringListMessage : ["Hello", 4]
    };

    doValidationFailureCheck(badMessageData, "awstest#MessageData");
});

test('Echo RPC MessageData Validation Failure - invalid Pair list property, element an invalid Pair', async () => {
    let badMessageData : echo_rpc.model.MessageData = {

        keyValuePairList : [
            {key: "AKey", value: "AValue"},
            //@ts-ignore
            {key: "Wrong", value: []}
        ]
    };

    doValidationFailureCheck(badMessageData, "awstest#MessageData");
});

test('Echo RPC MessageData Validation Failure - invalid Map, key validation failure', async () => {
    let badMessageData : echo_rpc.model.MessageData = {

        // @ts-ignore
        stringToValue: new Map<string, model.Product>([
            ["Hello", {}],
            [5, {name: "Apple Peeler"}]
        ])
    };

    doValidationFailureCheck(badMessageData, "awstest#MessageData");
});

test('Echo RPC MessageData Validation Failure - invalid Map, value validation failure', async () => {
    let badMessageData : echo_rpc.model.MessageData = {

        // @ts-ignore
        stringToValue: new Map<string, model.Product>([
            ["Hello", {}],
            ["There", {name: 6}]
        ])
    };

    doValidationFailureCheck(badMessageData, "awstest#MessageData");
});

test('Echo RPC MessageData Validation Failure - enum property not a string', async () => {
    let badMessageData : echo_rpc.model.MessageData = {
        // @ts-ignore
        enumMessage : 5
    };

    doValidationFailureCheck(badMessageData, "awstest#MessageData");
});

conditional_test(hasEchoServerEnvironment())('echoMessage failure test - client side validation', async () => {
    let client: echo_rpc.Client = echo_rpc.createClient(makeGoodConfig());

    await client.connect();

    let badRequest : echo_rpc.model.EchoMessageRequest = {
        message: {
            // @ts-ignore
            stringMessage : [5]
        }
    }

    await expect(client.echoMessage(badRequest)).rejects.toBeDefined();

    client.close();
});

conditional_test(hasEchoServerEnvironment())('echoMessage failure test - server side internal service error', async () => {
    let client: echo_rpc.Client = echo_rpc.createClient(makeGoodConfig());

    await client.connect();

    let badRequest : echo_rpc.model.EchoMessageRequest = {
        message: {
            // @ts-ignore
            stringMessage : [5]
        }
    }

    // jest doesn't expose a reliable API for arbitrarily digging into errors via promises
    // (https://github.com/facebook/jest/issues/8140).

    let error : eventstream_rpc.RpcError | undefined = undefined;
    try {
        await client.echoMessage(badRequest, {disableValidation : true});
    } catch (err) {
        error = err as eventstream_rpc.RpcError;
    }

    expect(error).toBeDefined();
    expect(error?.description).toMatch("InternalServerError");

    client.close();
});

conditional_test(hasEchoServerEnvironment())('causeServiceError (failure) test with modeled service error', async () => {
    let client: echo_rpc.Client = echo_rpc.createClient(makeGoodConfig());

    await client.connect();

    // jest doesn't expose a reliable API for arbitrarily digging into errors via promises
    // (https://github.com/facebook/jest/issues/8140).

    let error : eventstream_rpc.RpcError | undefined = undefined;
    try {
        await client.causeServiceError({});
    } catch (err) {
        error = err as eventstream_rpc.RpcError;
    }

    expect(error).toBeDefined();
    expect(error?.serviceError).toBeDefined();

    let serviceError : echo_rpc.model.ServiceError = error?.serviceError as echo_rpc.model.ServiceError;
    expect(serviceError.message).toMatch("Intentionally thrown");

    client.close();
});

test('Eventstream validate union type success - message data', () => {
    let streamMessage : echo_rpc.model.EchoStreamingMessage = {
        streamMessage: {
            stringMessage : "a string",
            booleanMessage : true,
            timeMessage: new Date(),
            documentMessage: {key: "Akey", value: "Avalue"},
            enumMessage: echo_rpc.model.FruitEnum.ORANGE,
            blobMessage: "not binary",
            stringListMessage: ["Hello", "world"],
            keyValuePairList: [{key: "Akey", value: "Avalue"}],
            stringToValue: new Map<string, echo_rpc.model.Product>([["Acme", {name: "Toilet Plunger"}]])
        }
    };

    model_utils.validateEchoStreamingMessage(streamMessage);
});

test('Eventstream validate union type success - key value pair', () => {
    let streamMessage : echo_rpc.model.EchoStreamingMessage = {
        keyValuePair: {
            key: "What",
            value: "is love"
        }
    };

    model_utils.validateEchoStreamingMessage(streamMessage);
});


test('Eventstream validate union type failure - nothing set', () => {
    expect(() => {model_utils.validateEchoStreamingMessage({})}).toThrow();
});

test('Eventstream validate union type failure - multiple set', () => {
    let streamingMessage : echo_rpc.model.EchoStreamingMessage = {
        streamMessage: {},
        keyValuePair: {
            key: "What",
            value: "is love"
        }
    };
    expect(() => {model_utils.validateEchoStreamingMessage(streamingMessage)}).toThrow();
});

test('Eventstream validate union type failure - nested object failure', () => {
    let streamingMessage : echo_rpc.model.EchoStreamingMessage = {
        streamMessage: {
            // @ts-ignore
            stringListMessage: [5, "world"]
        }
    };
    expect(() => {model_utils.validateEchoStreamingMessage(streamingMessage)}).toThrow();
});

test('Eventstream normalize EchoStreamingMessage', () => {
    let streamingMessage : echo_rpc.model.EchoStreamingMessage = {
        streamMessage: {
            stringListMessage: ["hello", "world"],
            // @ts-ignore
            alsoNotAValidProperty : 6,
        },
        keyValuePair : {
            key : "key",
            value: "value",
            // @ts-ignore
            shouldntBeHere : []
        },
        // @ts-ignore
        notAProperty: "Oof"
    };

    let expectedNormalizedValue : echo_rpc.model.EchoStreamingMessage = {
        streamMessage: {
            stringListMessage: ["hello", "world"]
        },
        keyValuePair : {
            key : "key",
            value: "value"
        }
    }

    expect(model_utils.normalizeEchoStreamingMessage(streamingMessage)).toEqual(expectedNormalizedValue);
});

async function doStreamingEchoSuccessTest(streamingMessage: echo_rpc.model.EchoStreamingMessage) {
    return new Promise<void>(async (resolve, reject) =>{
        let client: echo_rpc.Client = echo_rpc.createClient(makeGoodConfig());

        await client.connect();

        let streamingOperation = client.echoStreamMessages({});

        let streamingResponsePromise = once(streamingOperation, eventstream_rpc.StreamingOperation.MESSAGE);

        await streamingOperation.activate();

        await streamingOperation.sendMessage(streamingMessage);

        let response : echo_rpc.model.EchoStreamingMessage = (await streamingResponsePromise)[0];

        expect(response).toEqual(streamingMessage);

        await streamingOperation.close();

        client.close();
        resolve();
    });
}

conditional_test(hasEchoServerEnvironment())('echoStreamingMessage Success - send and receive a streamMessage', async () => {
    let streamingMessage : echo_rpc.model.EchoStreamingMessage = {
        streamMessage: {
            stringMessage : "a string",
            booleanMessage : true,
            timeMessage: new Date(),
            documentMessage: {key: "Akey", value: "Avalue"},
            enumMessage: echo_rpc.model.FruitEnum.ORANGE,
            stringListMessage: ["Hello", "world"],
            keyValuePairList: [{key: "Akey", value: "Avalue"}],
            stringToValue: new Map<string, echo_rpc.model.Product>([["Acme", {name: "Toilet Plunger", price: 3}]])
        }
    };

    await doStreamingEchoSuccessTest(streamingMessage);
});

conditional_test(hasEchoServerEnvironment())('echoStreamingMessage Success - send and receive a keyValuePair', async () => {
    let streamingMessage : echo_rpc.model.EchoStreamingMessage = {
        keyValuePair : {
            key : "AKey",
            value : "AValue"
        }
    };

    await doStreamingEchoSuccessTest(streamingMessage);
});

conditional_test(hasEchoServerEnvironment())('echoStreamingMessage Failure - invalid activation request', async () => {
    let client: echo_rpc.Client = echo_rpc.createClient(makeGoodConfig());

    await client.connect();

    //@ts-ignore
    expect(() => {client.echoStreamMessages(undefined);}).toThrow();

    client.close();
});

conditional_test(hasEchoServerEnvironment())('echoStreamingMessage validation Failure - invalid sendMessage request', async () => {
    let client: echo_rpc.Client = echo_rpc.createClient(makeGoodConfig());

    await client.connect();

    let streamingOperation = client.echoStreamMessages({});
    await streamingOperation.activate();

    let streamingMessage : echo_rpc.model.EchoStreamingMessage = {
        keyValuePair: {
            key: "AKey",
            // @ts-ignore
            value: [5]
        }
    };

    await expect(streamingOperation.sendMessage(streamingMessage)).rejects.toBeDefined();

    await streamingOperation.close();

    client.close();
});

conditional_test(hasEchoServerEnvironment())('echoStreamingMessage failure - internal server error due to bad sendMessage request', async () => {
    let client: echo_rpc.Client = echo_rpc.createClient(makeGoodConfig());

    await client.connect();

    let streamingOperation = client.echoStreamMessages({}, {disableValidation:true});
    await streamingOperation.activate();

    let streamingError = once(streamingOperation, eventstream_rpc.StreamingOperation.STREAM_ERROR);
    let streamEnded = once(streamingOperation, eventstream_rpc.StreamingOperation.ENDED);

    let streamingMessage : echo_rpc.model.EchoStreamingMessage = {
        keyValuePair: {
            key: "AKey",
            // @ts-ignore
            value: [5]
        }
    };

    await streamingOperation.sendMessage(streamingMessage);

    let error = (await streamingError)[0];
    expect(error).toBeDefined();
    expect(error?.description).toMatch("InternalServerError");

    await streamEnded;

    await streamingOperation.close();

    client.close();
});

conditional_test(hasEchoServerEnvironment())('causeStreamServiceToError failure - modeled error', async () => {
    let client: echo_rpc.Client = echo_rpc.createClient(makeGoodConfig());

    await client.connect();

    let streamingOperation = client.causeStreamServiceToError({});
    await streamingOperation.activate();

    let streamingError = once(streamingOperation, eventstream_rpc.StreamingOperation.STREAM_ERROR);
    let streamEnded = once(streamingOperation, eventstream_rpc.StreamingOperation.ENDED);

    let streamingMessage : echo_rpc.model.EchoStreamingMessage = {
        keyValuePair: {
            key: "AKey",
            value: "Derp"
        }
    };

    await streamingOperation.sendMessage(streamingMessage);

    let error = (await streamingError)[0];
    expect(error).toBeDefined();

    let rpcError : eventstream_rpc.RpcError = error as eventstream_rpc.RpcError;
    expect(rpcError.serviceError).toBeDefined();
    expect(rpcError.serviceError.message).toMatch("Intentionally caused ServiceError on stream");

    await streamEnded;

    await streamingOperation.close();

    client.close();
});
