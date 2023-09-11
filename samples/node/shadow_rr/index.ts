import { mqtt, mqtt5, iotshadow } from 'aws-iot-device-sdk-v2';
import {once} from "events";


const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

type Args = { [index: string]: any };
const yargs = require('yargs');

// The relative path is '../../util/cli_args' from here, but the compiled javascript file gets put one level
// deeper inside the 'dist' folder
const common_args = require('../../../util/cli_args');

yargs.command('*', false, (yargs: any) => {
    common_args.add_direct_connection_establishment_arguments(yargs);
    common_args.add_shadow_arguments(yargs);
}, main).parse();

/*
async function get_current_shadow_state(client: iotshadow.IotShadowClientv2, thingName: string) : Promise<iotshadow.model.GetShadowResponse> {
    return client.getShadow({
        thingName: thingName
    });
}
 */

async function get_current_shadow_state(client: iotshadow.IotShadowClient, thingName: string, clientToken: string) : Promise<iotshadow.model.GetShadowResponse> {
    let resultPromise = new Promise<iotshadow.model.GetShadowResponse>(async (resolve, reject) => {

        function getAccepted(error?: iotshadow.IotShadowError, response?: iotshadow.model.GetShadowResponse) {
            if (error || !response) {
                return;
            }

            if (!response.clientToken || response.clientToken !== clientToken) {
                return;
            }

            resolve(response);
        }

        function getRejected(error?: iotshadow.IotShadowError, response?: iotshadow.model.ErrorResponse) {
            if (error || !response) {
                return;
            }

            if (!response.clientToken || response.clientToken !== clientToken) {
                return;
            }

            reject(error);
        }

        const getShadowSubRequest: iotshadow.model.GetShadowSubscriptionRequest = {
            thingName: thingName
        };

        await client.subscribeToGetShadowRejected(
            getShadowSubRequest,
            mqtt.QoS.AtLeastOnce,
            (error, response) => getRejected(error, response));

        await client.subscribeToGetShadowAccepted(
            getShadowSubRequest,
            mqtt.QoS.AtLeastOnce,
            (error, response) => getAccepted(error, response));


        const getShadow: iotshadow.model.GetShadowRequest = {
            thingName: thingName,
            clientToken: clientToken,
        }

        await client.publishGetShadow(
            getShadow,
            mqtt.QoS.AtLeastOnce);
    });

    return resultPromise;
}

async function main(argv: Args) {
    common_args.apply_sample_arguments(argv);

    let client : mqtt5.Mqtt5Client = common_args.build_mqtt5_client_from_cli_args(argv);
    let shadow = iotshadow.IotShadowClient.newFromMqtt5Client(client);

    const connectionSuccess = once(client, "connectionSuccess");

    client.start();

    await connectionSuccess;

    try {
        let shadow_value = await get_current_shadow_state(shadow, argv.thing_name, "abcdefghj");
        console.log(`Shadow value: ${JSON.stringify(shadow_value)}`);

        await sleep(500); // wait half a second

    } catch (error) {
        console.log(error);
    }

    console.log("Disconnecting..");

    let stopped = once(client, "stopped");
    client.stop();
    await stopped;
    client.close();

    // force node to wait a second before quitting to finish any promises
    await sleep(1000);
    console.log("Disconnected");
    // Quit NodeJS
    process.exit(0);
}
