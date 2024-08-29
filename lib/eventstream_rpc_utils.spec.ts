/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */

import * as eventstream_rpc_utils from "./eventstream_rpc_utils";

jest.setTimeout(5000);

test('Encode string payload as base64', async () => {
    let encodedPayload = eventstream_rpc_utils.encodePayloadAsString("HelloWorld");
    expect(encodedPayload).toEqual("SGVsbG9Xb3JsZA==");
});

test('Encode ArrayBuffer payload as base64', async () => {
    let buffer = new ArrayBuffer(10);
    let writeView = new Uint8Array(buffer);
    for (let i = 0; i < 10; i++) {
        writeView[i] = 65;
    }

    let encodedPayload = eventstream_rpc_utils.encodePayloadAsString(buffer);
    expect(encodedPayload).toEqual("QUFBQUFBQUFBQQ==");
});

test('Encode view payload as base64', async () => {
    let buffer = new ArrayBuffer(10);
    let writeView = new Uint8Array(buffer);
    for (let i = 0; i < 10; i++) {
        writeView[i] = 65;
    }

    let view = new DataView(buffer, 1, 8);

    let encodedPayload = eventstream_rpc_utils.encodePayloadAsString(view);
    expect(encodedPayload).toEqual("QUFBQUFBQUE=");
});