/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */
import { mqtt } from 'aws-iot-device-sdk-v2';
import { TestType } from '../utils/datest_utils'

const datest_utils = require('../utils/datest_utils');
function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
 }

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

    try{
        // connect to mqtt
        await connection.connect();
        
        // subscribe message to topic
        /** We dont wait for subscription because we sometime could not recieve suback from device 
         *  advisor. Instead we sleep for 30 seconds to wait for server to processing the subscription
         *  request.
         */
        connection.subscribe(datest_utils.topic, mqtt.QoS.AtMostOnce);
        sleep(30);

        // disconnect
        await connection.disconnect();
    } catch
    {
        process.exit(-1)
    }

    // Allow node to die if the promise above resolved
    clearTimeout(timer);
    process.exit(0);
}


main();
