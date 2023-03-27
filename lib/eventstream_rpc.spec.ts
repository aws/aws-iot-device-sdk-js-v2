/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */

// import * as eventstream_rpc from './eventstream_rpc';
//import { eventstream } from 'aws-crt';

import * as echo_model from './echo_rpc/model';
import assert from "assert";

jest.setTimeout(10000);

// test stuff
test('Testy Mctest', async () => {
    let request: echo_model.EchoMessageRequest = {
        message: {
            stringMessage: "derp"
        }
    }

    let expectedNormalized : echo_model.EchoMessageRequest = {
        message: {
            stringMessage: "derp"
        }
    }

    let normalized : any = echo_model.normalizeEchoMessageRequest(request);
    expect(normalized).toBeDefined();

    assert.deepStrictEqual(normalized, expectedNormalized, "Mismatch");
});