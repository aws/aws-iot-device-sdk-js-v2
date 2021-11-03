/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */

import { mqtt, iotshadow } from 'aws-iot-device-sdk-v2';
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

type Args = { [index: string]: any };
const yargs = require('yargs');

// The relative path is '../../util/cli_args' from here, but the compiled javascript file gets put one level
// deeper inside the 'dist' folder
const common_args = require('../../../util/cli_args');
var shadow_value: unknown;

yargs.command('*', false, (yargs: any) => {
    common_args.add_connection_establishment_arguments(yargs);
    yargs
        .option('shadow_property', {
            alias: 'p',
            default: 'color',
            description: 'Name of property in shadow to keep in sync',
            type: 'string',
            required: false
        })
        .option('thing_name', {
            alias: 'n',
            default: 'color',
            description: 'Name of property in shadow to keep in sync',
            type: 'string',
            required: true
        })
}, main).parse();

async function sub_to_shadow_update(shadow: iotshadow.IotShadowClient, argv: Args) {
    return new Promise(async (resolve, reject) => {
        try {
            function updateAccepted(error?: iotshadow.IotShadowError, response?: iotshadow.model.UpdateShadowResponse) {
                if (response) {
                    console.log("Successfully updated shadow for clientToken=" + response.clientToken + "\n\t desired state:" + response.state?.desired + "\n\t reported state:" + response.state?.reported);
                    const new_value = askQuestion('Enter desired value: ');
                    change_shadow_value(shadow, argv, new_value);
                }

                if (error || !response) {
                    console.log("Updated shadow is missing the target property.");
                }
                resolve();
            }

            function updateRejected(error?: iotshadow.IotShadowError, response?: iotshadow.model.ErrorResponse) {
                if (response) {
                    console.log("Update request was rejected.");
                }

                if (error) {
                    console.log("Error occurred..")
                }
                reject(error);
            }

            console.log("Subscribing to Update events..");
            const updateShadowSubRequest: iotshadow.model.UpdateNamedShadowSubscriptionRequest = {
                shadowName: argv.shadow_property,
                thingName: argv.thing_name
            };

            await shadow.subscribeToUpdateNamedShadowAccepted(
                updateShadowSubRequest,
                mqtt.QoS.AtLeastOnce,
                (error, response) => updateAccepted(error, response));

            await shadow.subscribeToUpdateNamedShadowRejected(
                updateShadowSubRequest,
                mqtt.QoS.AtLeastOnce,
                (error, response) => updateRejected(error, response));

            resolve();
        }
        catch (error) {
            reject(error);
        }
    });
}

async function sub_to_shadow_get(shadow: iotshadow.IotShadowClient, argv: Args) {
    return new Promise(async (resolve, reject) => {
        try {
            function getAccepted(error?: iotshadow.IotShadowError, response?: iotshadow.model.GetShadowResponse) {
                console.log("Get Accepted");
                if (response?.state) {
                    if (response?.state.delta) {
                        const value = response.state.delta;
                        if (value) {
                            console.log(" Shadow constains delta value '" + value +  "'.");
                            change_shadow_value(shadow, value, argv);
                        }
                    }

                    if (response?.state.reported) {
                        const value = response.state.reported;
                        if (value) {
                            console.log(" Shadow contains reported value '" + value + "'.");
                        }
                    }
                }

                if (error || !response) {
                    console.log("Error occurred..");
                }
                resolve();
            }

            function getRejected(error?: iotshadow.IotShadowError, response?: iotshadow.model.ErrorResponse) {
                
                if (response) {
                    console.log("In getRejected response");
                }

                if (error) {
                    console.log("Error occurred..");
                }

                reject(error);
            }

            console.log("Subscribing to Get events..");
            const getShadowSubRequest: iotshadow.model.GetNamedShadowSubscriptionRequest = {
                shadowName: argv.shadow_property,
                thingName: argv.thing_name
            };

            await shadow.subscribeToGetNamedShadowAccepted(
                getShadowSubRequest,
                mqtt.QoS.AtLeastOnce,
                (error, response) => getAccepted(error, response));

            await shadow.subscribeToGetNamedShadowRejected(
                getShadowSubRequest,
                mqtt.QoS.AtLeastOnce,
                (error, response) => getRejected(error, response));

            resolve();
        }
        catch (error) {
            reject(error);
        }
    });
}

async function sub_to_shadow_delta(shadow: iotshadow.IotShadowClient, argv: Args) {
    return new Promise(async (resolve, reject) => {
        try {
            function deltaEvent(error?: iotshadow.IotShadowError, response?: iotshadow.model.GetShadowResponse) {
                if (response) {
                    //TODO: handle delta Accepted
                    console.log("delta Event");
                }

                if (error || !response) {
                    console.log("Error occurred..");
                }
                resolve();
            }

            console.log("Subscribing to Delta events..");
            const deltaShadowSubRequest: iotshadow.model.NamedShadowDeltaUpdatedSubscriptionRequest = {
                shadowName: argv.shadow_property,
                thingName: argv.thing_name
            };

            await shadow.subscribeToShadowDeltaUpdatedEvents(
                deltaShadowSubRequest,
                mqtt.QoS.AtLeastOnce,
                (error, response) => deltaEvent(error, response));

            resolve();
        }
        catch (error) {
            reject(error);
        }
    });
}

async function get_current_shadow(shadow: iotshadow.IotShadowClient, argv: Args) {
    return new Promise(async (resolve, reject) => {
        try {
            const getShadow: iotshadow.model.GetNamedShadowRequest = {
                shadowName: argv.shadow_property,
                thingName: argv.thing_name
            }

            console.log("Requesting current shadow state ..");
            await shadow.publishGetNamedShadow(
                getShadow,
                mqtt.QoS.AtLeastOnce);
            
            resolve();
        }
        catch (error) {
            reject(error);
        }
    });
}

function askQuestion(query: string) {
    return new Promise(resolve => rl.question(query, (ans: string) => {
        resolve(ans);
    }))
}

async function change_shadow_value(shadow: iotshadow.IotShadowClient, argv: Args, new_value?: object, ) { 
    return new Promise(async (resolve, reject) => {
        try {
            if (typeof new_value !== 'undefined') {
                if (new_value == shadow_value) {
                    console.log("Local shadow value is already '" + new_value + "'.");
                } else {
                    console.log("Changed local shadow value to '" + new_value + "'.");
                    shadow_value = new_value;
                    
                    console.log("Update reported shadow value to '" + new_value + "'...")
                    var updateShadow: iotshadow.model.UpdateNamedShadowRequest = {
                        shadowName: argv.shadow_property,
                        state: {
                            desired: { shadowState: new_value },
                            reported: { shadowState: new_value }
                        },
                        thingName: argv.thing_name
                    };
                    
                    await shadow.publishUpdateNamedShadow(
                        updateShadow, 
                        mqtt.QoS.AtLeastOnce)
                    
                    console.log("Update request published");
                }
                //const new_value = await askQuestion('Enter desired value: ');
            }
        }
        catch (error) {
            console.log("Failed to publish update request.")
            reject(error);
        }
        resolve
    });
}

async function main(argv: Args) {
    common_args.apply_sample_arguments(argv);

    const connection = common_args.build_connection_from_cli_args(argv);

    const shadow = new iotshadow.IotShadowClient(connection);

    // force node to wait 60 seconds before killing itself, promises do not keep node alive
    const timer = setInterval(() => {}, 60 * 1000);

    await connection.connect()

    try {
        await sub_to_shadow_update(shadow, argv);
        await sub_to_shadow_get(shadow, argv);
        await sub_to_shadow_delta(shadow, argv);
        await get_current_shadow(shadow, argv);
    } catch (error) {
        console.log(error);
    }
    
    while (true) {
        setTimeout(function(){
            console.log('gets printed only once after 3 seconds')
            //logic
        },3000);
    }
    console.log("Disconnecting");
    await connection.disconnect()

    // Allow node to die if the promise above resolved
    clearTimeout(timer);
}