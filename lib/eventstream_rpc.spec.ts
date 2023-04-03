/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */


import * as echo_rpc_model from './echo_rpc/model';
import * as eventstream_rpc from "./eventstream_rpc";
import * as echo_rpc from "./echo_rpc/echo_rpc";
import assert from "assert";

jest.setTimeout(10000);

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

async function doEchoRequestResponseSuccessTest(request: echo_rpc_model.EchoMessageRequest) {
    return new Promise<void>(async (resolve, reject) => {
        try {
            let client: echo_rpc.Client = new echo_rpc.Client(makeGoodConfig());

            await client.connect();

            let response: echo_rpc_model.EchoMessageResponse = await client.echoMessage(request);

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

async function doEchoRequestResponseSuccessTestBlob(request: echo_rpc_model.EchoMessageRequest, blobAsBuffer: Buffer) {
    return new Promise<void>(async (resolve, reject) => {
        try {
            let client: echo_rpc.Client = new echo_rpc.Client(makeGoodConfig());

            await client.connect();

            let response: echo_rpc_model.EchoMessageResponse = await client.echoMessage(request);

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
            stringToValue : new Map<string, echo_rpc_model.Product>()
        }
    });
});

conditional_test(hasEchoServerEnvironment())('Request-response echo success test - string-to-value map message non-empty', async () => {
    await doEchoRequestResponseSuccessTest({
        message: {
            stringToValue : new Map<string, echo_rpc_model.Product>([['firstWidget', {name: 'Widget', price: 3}], ['secondWidget', {name: 'PS10', price: 500000}]])
        }
    });
});