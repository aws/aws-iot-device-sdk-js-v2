import { mqtt, iotshadow } from 'aws-iot-device-sdk-v2';
import { stringify } from 'querystring';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const prompt = (query: string) => new Promise((resolve) => rl.question(query, resolve));
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

type Args = { [index: string]: any };
const yargs = require('yargs');

// The relative path is '../../util/cli_args' from here, but the compiled javascript file gets put one level
// deeper inside the 'dist' folder
const common_args = require('../../../util/cli_args');
var shadow_value: unknown;
var shadow_property: string;

var shadow_update_complete = false;

yargs.command('*', false, (yargs: any) => {
    common_args.add_direct_connection_establishment_arguments(yargs);
    common_args.add_shadow_arguments(yargs);
}, main).parse();

async function sub_to_shadow_update(shadow: iotshadow.IotShadowClient, argv: Args) {
    return new Promise(async (resolve, reject) => {
        try {
            function updateAccepted(error?: iotshadow.IotShadowError, response?: iotshadow.model.UpdateShadowResponse) {
                if (response) {

                    if (response.clientToken !== undefined) {
                        console.log("Succcessfully updated shadow for clientToken: " + response.clientToken + ".");
                    }
                    else {
                        console.log("Succcessfully updated shadow.");
                    }
                    if (response.state?.desired !== undefined) {
                        console.log("\t desired state: " + stringify(response.state.desired));
                    }
                    if (response.state?.reported !== undefined) {
                        console.log("\t reported state: " + stringify(response.state.reported));
                    }
                }

                if (error || !response) {
                    console.log("Updated shadow is missing the target property.");
                }
                resolve(true);
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

            await shadow.subscribeToUpdateShadowAccepted(
                updateShadowSubRequest,
                mqtt.QoS.AtLeastOnce,
                (error, response) => updateAccepted(error, response));

            await shadow.subscribeToUpdateShadowRejected(
                updateShadowSubRequest,
                mqtt.QoS.AtLeastOnce,
                (error, response) => updateRejected(error, response));

            resolve(true);
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

                if (response?.state) {
                    if (response?.state.delta) {
                        const value = response.state.delta;
                        if (value) {
                            console.log("Shadow contains delta value '" + stringify(value) + "'.");
                            change_shadow_value(shadow, argv, value);
                        }
                    }

                    if (response?.state.reported) {
                        const value_any: any = response.state.reported;
                        if (value_any) {
                            let found_property = false;
                            for (var prop in value_any) {
                                if (prop === shadow_property) {
                                    found_property = true;
                                    console.log("Shadow contains '" + prop + "'. Reported value: '" + String(value_any[prop]) + "'.");
                                    break;
                                }
                            }
                            if (found_property === false) {
                                console.log("Shadow does not contain '" + shadow_property + "' property.");
                            }
                        }
                    }
                }

                if (error || !response) {
                    console.log("Error occurred..");
                }
                shadow_update_complete = true;
                resolve(true);
            }

            function getRejected(error?: iotshadow.IotShadowError, response?: iotshadow.model.ErrorResponse) {

                if (response) {
                    console.log("In getRejected response.");
                }

                if (error) {
                    console.log("Error occurred..");
                }

                shadow_update_complete = true;
                reject(error);
            }

            console.log("Subscribing to Get events..");
            const getShadowSubRequest: iotshadow.model.GetShadowSubscriptionRequest = {
                thingName: argv.thing_name
            };

            await shadow.subscribeToGetShadowAccepted(
                getShadowSubRequest,
                mqtt.QoS.AtLeastOnce,
                (error, response) => getAccepted(error, response));

            await shadow.subscribeToGetShadowRejected(
                getShadowSubRequest,
                mqtt.QoS.AtLeastOnce,
                (error, response) => getRejected(error, response));

            resolve(true);
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
                console.log("\nReceived shadow delta event.");

                if (response?.clientToken != null) {
                    console.log("  ClientToken: " + response.clientToken);
                }

                if (response?.state !== null) {
                    let value_any: any = response?.state;
                    if (value_any === null || value_any === undefined) {
                        console.log("Delta reports that '" + shadow_property + "' was deleted. Resetting defaults..");
                        let data_to_send: any = {};
                        data_to_send[shadow_property] = argv.shadow_value;
                        change_shadow_value(shadow, argv, data_to_send);
                    }
                    else {
                        if (value_any[shadow_property] !== undefined) {
                            if (value_any[shadow_property] !== shadow_value) {
                                console.log("Delta reports that desired value is '" + value_any[shadow_property] + "'. Changing local value..");
                                let data_to_send: any = {};
                                data_to_send[shadow_property] = value_any[shadow_property];
                                change_shadow_value(shadow, argv, data_to_send);
                            }
                            else {
                                console.log("Delta did not report a change in '" + shadow_property + "'.");
                            }
                        }
                        else {
                            console.log("Desired value not found in delta. Skipping..");
                        }
                    }
                }
                else {
                    console.log("Delta did not report a change in '" + shadow_property + "'.");
                }

                resolve(true);
            }

            console.log("Subscribing to Delta events..");
            const deltaShadowSubRequest: iotshadow.model.ShadowDeltaUpdatedSubscriptionRequest = {
                thingName: argv.thing_name
            };

            await shadow.subscribeToShadowDeltaUpdatedEvents(
                deltaShadowSubRequest,
                mqtt.QoS.AtLeastOnce,
                (error, response) => deltaEvent(error, response));

            resolve(true);
        }
        catch (error) {
            reject(error);
        }
    });
}

async function get_current_shadow(shadow: iotshadow.IotShadowClient, argv: Args) {
    return new Promise(async (resolve, reject) => {
        try {
            const getShadow: iotshadow.model.GetShadowRequest = {
                thingName: argv.thing_name
            }

            shadow_update_complete = false;
            console.log("Requesting current shadow state..");
            shadow.publishGetShadow(
                getShadow,
                mqtt.QoS.AtLeastOnce);

            await get_current_shadow_update_wait();
            resolve(true);
        }
        catch (error) {
            reject(error);
        }
    });
}


async function get_current_shadow_update_wait() {
    // Wait until shadow_update_complete is true, showing the result returned
    return await new Promise(resolve => {
        const interval = setInterval(() => {
            if (shadow_update_complete == true) {
                resolve(true);
                clearInterval(interval);
            };
        }, 200);
    });
}

function change_shadow_value(shadow: iotshadow.IotShadowClient, argv: Args, new_value?: object) {
    return new Promise(async (resolve, reject) => {
        try {
            if (typeof new_value !== 'undefined') {
                let new_value_any: any = new_value;
                let skip_send = false;

                if (new_value_any !== null) {
                    if (new_value_any[shadow_property] == shadow_value) {
                        skip_send = true;
                    }
                }
                if (skip_send == false) {
                    if (new_value_any === null) {
                        shadow_value = new_value_any;
                    }
                    else {
                        shadow_value = new_value_any[shadow_property];
                    }

                    console.log("Changed local shadow value to '" + shadow_value + "'.");

                    var updateShadow: iotshadow.model.UpdateShadowRequest = {
                        state: {
                            desired: new_value,
                            reported: new_value
                        },
                        thingName: argv.thing_name
                    };

                    await shadow.publishUpdateShadow(
                        updateShadow,
                        mqtt.QoS.AtLeastOnce)

                    console.log("Update request published.");
                }
            }
        }
        catch (error) {
            console.log("Failed to publish update request.")
            reject(error);
        }
        resolve(true)
    });
}

async function main(argv: Args) {
    common_args.apply_sample_arguments(argv);

    const connection = common_args.build_connection_from_cli_args(argv);
    const shadow = new iotshadow.IotShadowClient(connection);
    shadow_property = argv.shadow_property;

    await connection.connect()

    try {
        await sub_to_shadow_update(shadow, argv);
        await sub_to_shadow_get(shadow, argv);
        await sub_to_shadow_delta(shadow, argv);
        await get_current_shadow(shadow, argv);

        await sleep(500); // wait half a second

        // Take console input when this sample is not running in CI
        if (argv.is_ci == false) {
            while (true) {
                const userInput = await prompt("Enter desired value: ");
                if (userInput === "quit") {
                    break;
                }
                else {
                    let data_to_send: any = {};

                    if (userInput == "clear_shadow") {
                        data_to_send = null;
                    }
                    else if (userInput == "null") {
                        data_to_send[shadow_property] = null;
                    }
                    else {
                        data_to_send[shadow_property] = userInput;
                    }

                    await change_shadow_value(shadow, argv, data_to_send);
                    await get_current_shadow(shadow, argv);
                }
            }
        }
        // If this is running in CI, then automatically update the shadow
        else {
            var messages_sent = 0;
            while (messages_sent < 5) {
                let data_to_send: any = {}
                data_to_send[shadow_property] = "Shadow_Value_" + messages_sent.toString()
                await change_shadow_value(shadow, argv, data_to_send);
                await get_current_shadow(shadow, argv);
                messages_sent += 1
            }
        }

    } catch (error) {
        console.log(error);
    }

    console.log("Disconnecting..");
    await connection.disconnect();
    // force node to wait a second before quitting to finish any promises
    await sleep(1000);
    console.log("Disconnected");
    // Quit NodeJS
    process.exit(0);
}
