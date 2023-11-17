/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */
import { mqtt, iotshadow } from 'aws-iot-device-sdk-v2';
import { TestType } from '../utils/datest_utils'

const datest_utils = require('../utils/datest_utils');

function change_shadow_value(shadow: iotshadow.IotShadowClient) {
    return new Promise(async (resolve, reject) => {
        try {
            let data_to_send : any = {};
            data_to_send[datest_utils.shadowProperty] = datest_utils.shadowValue;
            var updateShadow: iotshadow.model.UpdateShadowRequest = {
                state: {
                    desired: data_to_send,
                    reported: data_to_send
                },
                thingName: datest_utils.thing_name
            };

            // Since device advisor will not send back SUBACK, we use "AtMostOnce"
            // to avoid busy waiting on responds
            await shadow.publishUpdateShadow(
                updateShadow,
                mqtt.QoS.AtMostOnce)
        }
        catch (error) {
            reject(error);
        }
        resolve(true)
    });
}

async function main() {
    if(!datest_utils.validate_vars(TestType.SHADOW))
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

        // create shadow client and update shadow
        const shadow = new iotshadow.IotShadowClient(connection);
        await change_shadow_value(shadow);

        // disconnect
        await connection.disconnect();
    }
    catch
    {
        process.exit(-1)
    }


    // Allow node to die if the promise above resolved
    clearTimeout(timer);
    process.exit(0);
}


main();
