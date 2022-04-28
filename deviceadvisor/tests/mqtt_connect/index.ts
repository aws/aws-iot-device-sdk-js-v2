/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */

import { TestType } from '../utils/datest_utils'

const datest_utils = require('../utils/datest_utils');

async function main() {
    // validate environment variables set for testing
    if(!datest_utils.validate_vars(TestType.CONNECT))
    {
        process.exit(-1)
    }
    const connection = datest_utils.build_direct_mqtt_connection();

    // force node to wait 60 seconds before killing itself, promises do not keep node alive
    // ToDo: we can get rid of this but it requires a refactor of the native connection binding that includes
    //    pinning the libuv event loop while the connection is active or potentially active.
    const timer = setInterval(() => { }, 60 * 1000);
    try
    {
        await connection.connect();
        await connection.disconnect();
    } catch
    {
        process.exit(-1);
    }

    // Allow node to die if the promise above resolved
    clearTimeout(timer);

    process.exit(0);
}


main();
