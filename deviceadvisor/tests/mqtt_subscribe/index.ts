/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */
import { mqtt } from 'aws-iot-device-sdk-v2';
import { TestType } from '../utils/datest_utils'

const datest_utils = require('../utils/datest_utils');


async function main() {
    if(!datest_utils.validate_vars(TestType.SUB_PUB))
    {
        process.exit(-1)
    }
    const connection = datest_utils.build_direct_mqtt_connection();

    // force node to wait 60 seconds before killing itself, promises do not keep node alive
    // ToDo: we can get rid of this but it requires a refactor of the native connection binding that includes
    //    pinning the libuv event loop while the connection is active or potentially active.
    const timer = setInterval(() => { }, 60 * 1000);

    // connect to mqtt
    await connection.connect();
    
    // subscribe message to topic
    await connection.subscribe(datest_utils.topic, mqtt.QoS.AtMostOnce);
    
    // disconnect
    await connection.disconnect();

    // Allow node to die if the promise above resolved
    clearTimeout(timer);
    process.exit(0);
}


main();
