/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */


import * as model from './model';
import * as eventstream_rpc from "../eventstream_rpc";
import * as echo_rpc from "./echo_rpc";
import assert from "assert";
import * as model_utils from "./model_utils";

jest.setTimeout(10000000);


// test stuff
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

async function doEchoRequestResponseSuccessTest(request: model.EchoMessageRequest) {
    return new Promise<void>(async (resolve, reject) => {
        try {
            let client: echo_rpc.Client = new echo_rpc.Client(makeGoodConfig());

            await client.connect();

            let response: model.EchoMessageResponse = await client.echoMessage(request);

            expect(response).toBeDefined();
            assert.deepStrictEqual(request, response, "Mismatch between echo request and echo response");

            client.close();

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
            enumMessage : "PUBACK"
        }
    });
});

async function doEchoRequestResponseSuccessTestBlob(request: model.EchoMessageRequest, blobAsBuffer: Buffer) {
    return new Promise<void>(async (resolve, reject) => {
        try {
            let client: echo_rpc.Client = new echo_rpc.Client(makeGoodConfig());

            await client.connect();

            let response: model.EchoMessageResponse = await client.echoMessage(request);

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
            stringToValue : new Map<string, model.Product>()
        }
    });
});

conditional_test(hasEchoServerEnvironment())('Request-response echo success test - string-to-value map message non-empty', async () => {
    await doEchoRequestResponseSuccessTest({
        message: {
            stringToValue : new Map<string, model.Product>([['firstWidget', {name: 'Widget', price: 3}], ['secondWidget', {name: 'PS10', price: 500000}]])
        }
    });
});

conditional_test(hasEchoServerEnvironment())('Request-response getAllProducts success test', async () => {
    let client: echo_rpc.Client = new echo_rpc.Client(makeGoodConfig());

    await client.connect();

    let response: model.GetAllProductsResponse = await client.getAllProducts({});

    expect(response).toBeDefined();

    client.close();
});

conditional_test(hasEchoServerEnvironment())('Request-response getAllCustomers success test', async () => {
    let client: echo_rpc.Client = new echo_rpc.Client(makeGoodConfig());

    await client.connect();

    let response: model.GetAllCustomersResponse = await client.getAllCustomers({});

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
    let badPair : model.Pair = {
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
    let moreThanAPair : model.Pair = {
        key : "MyKey",
        value : "MyValue",
        // @ts-ignore
        derp : [ "StripMe"],
        weird : {
            value: 5
        }
    };

    let expectedNormalizationResult : model.Pair = {
        key : "MyKey",
        value : "MyValue"
    }

    doNormalizationCheck(moreThanAPair, expectedNormalizationResult, "awstest#Pair");
});

test('Echo RPC Product Validation Failure - invalid number property', async () => {
    let badProduct : model.Product = {
        name : "Ronco Yogurt Slicer",
        // @ts-ignore
        price : "3.50"
    };

    doValidationFailureCheck(badProduct, "awstest#Product");
});

test('Echo RPC Product Normalization - prune unmodeled properties', async () => {
    let moreThanAProduct : model.Product = {
        name : "Acme Back Scratcher",
        price : 10,
        // @ts-ignore
        derp : [ "StripMe"],
        weird : {
            value: 5
        }
    };

    let expectedNormalizationResult : model.Product = {
        name : "Acme Back Scratcher",
        price : 10
    }

    doNormalizationCheck(moreThanAProduct, expectedNormalizationResult, "awstest#Product");
});

test('Echo RPC MessageData Validation Failure - invalid boolean property', async () => {
    let badMessageData : model.MessageData = {
        // @ts-ignore
        booleanMessage : "I'm not a boolean"
    };

    doValidationFailureCheck(badMessageData, "awstest#MessageData");
});

test('Echo RPC MessageData Validation Failure - invalid timestamp property', async () => {
    let badMessageData : model.MessageData = {
        // @ts-ignore
        timeMessage : "I'm not a Date"
    };

    doValidationFailureCheck(badMessageData, "awstest#MessageData");
});

test('Echo RPC MessageData Validation Failure - invalid blob property', async () => {
    let badMessageData : model.MessageData = {
        // @ts-ignore
        blobMessage : 5
    };

    doValidationFailureCheck(badMessageData, "awstest#MessageData");
});

test('Echo RPC MessageData Validation Failure - invalid string list property, not an array', async () => {
    let badMessageData : model.MessageData = {
        // @ts-ignore
        stringListMessage : 5
    };

    doValidationFailureCheck(badMessageData, "awstest#MessageData");
});

test('Echo RPC MessageData Validation Failure - invalid string list property, element not a string', async () => {
    let badMessageData : model.MessageData = {
        // @ts-ignore
        stringListMessage : ["Hello", 4]
    };

    doValidationFailureCheck(badMessageData, "awstest#MessageData");
});