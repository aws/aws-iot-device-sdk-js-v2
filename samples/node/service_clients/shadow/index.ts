import { iotshadow, mqtt5, iot } from 'aws-iot-device-sdk-v2';
import readline from 'readline';
import {once} from "events";
import { v4 as uuidv4 } from 'uuid';

interface SampleContext {
    thingName: string,
    client: iotshadow.IotShadowClientv2
}

const TIMEOUT = 100000;

// --------------------------------- ARGUMENT PARSING -----------------------------------------
const args = require('yargs')
    .option('endpoint', {
        alias: 'e',
        description: 'IoT endpoint hostname',
        type: 'string',
        required: true
    })
    .option('cert', {
        alias: 'c',
        description: 'Path to the certificate file to use during mTLS connection establishment',
        type: 'string',
        required: true
    })
    .option('key', {
        alias: 'k',
        description: 'Path to the private key file to use during mTLS connection establishment',
        type: 'string',
        required: true
    })
    .option('client_id', {
        alias: 'C',
        description: 'Client ID',
        type: 'string',
        default: `shadow-sample-${uuidv4().substring(0, 8)}`
    })
    .option('thing_name', {
        alias: 't',
        description: 'Thing name',
        type: 'string',
        required: true
    })
    .help()
    .argv;

// --------------------------------- ARGUMENT PARSING END -----------------------------------------

function printHelp() {
    console.log('Supported commands:');
    console.log("  get - gets the current value of the IoT thing's shadow");
    console.log("  delete - deletes the IoT thing's shadow");
    console.log("  update-desired <state-as-JSON> - updates the desired state of the IoT thing's shadow.  If the shadow does not exist, it will be created.");
    console.log("  update-reported <state-as-JSON> - updates the reported state of the IoT thing's shadow.  If the shadow does not exist, it will be created.");
    console.log("  quit - quits the sample application\n");
}

async function handleCommand(context: SampleContext, input: string) : Promise<boolean> {
    try {
        let command = input.split(' ')[0];
        let remaining = input.substring(command.length);
        console.log("");

        switch (command) {
            case "get":
                let getResponse = await context.client.getShadow({
                    thingName: context.thingName
                });
                console.log(`Get response: ${JSON.stringify(getResponse)}\n`);
                break;

            case "delete":
                let deleteResponse = await context.client.deleteShadow({
                    thingName: context.thingName
                });
                console.log(`\nDelete response: ${JSON.stringify(deleteResponse)}\n`);
                break;

            case "update-desired":
                let updateDesiredResponse = await context.client.updateShadow({
                    thingName: context.thingName,
                    state: {
                        desired: JSON.parse(remaining)
                    }
                });
                console.log(`Update Desired response: ${JSON.stringify(updateDesiredResponse)}\n`);
                break;

            case "update-reported":
                let updateReportedResponse = await context.client.updateShadow({
                    thingName: context.thingName,
                    state: {
                        reported: JSON.parse(remaining)
                    }
                });
                console.log(`Update Reported response: ${JSON.stringify(updateReportedResponse)}\n`);
                break;

            case "quit":
                return true;

            case "help":
                printHelp();
                break;

            default:
                console.log(`Unknown command: ${command}\n`);
                printHelp();
                break;
        }
    } catch (error) {
        console.log(`Error processing command: ${JSON.stringify(error)}\n`);
    }

    return false;
}

async function main() {
    console.log("Connecting...");

    // Create MQTT5 client using mutual TLS via X509 Certificate and Private Key
    const builder = iot.AwsIotMqtt5ClientConfigBuilder.newDirectMqttBuilderWithMtlsFromPath(
        args.endpoint,
        args.cert,
        args.key
    );

    builder.withConnectProperties({
        clientId: args.client_id,
        keepAliveIntervalSeconds: 1200
    });

    const config = builder.build();
    const protocolClient = new mqtt5.Mqtt5Client(config);

    const connectionSuccess = once(protocolClient, "connectionSuccess");
    protocolClient.start();
    
    await Promise.race([
        connectionSuccess,
        new Promise((_, reject) => setTimeout(() => reject(new Error("Connection timeout")), TIMEOUT))
    ]);
    console.log("Connected!");

    let shadowClient = iotshadow.IotShadowClientv2.newFromMqtt5(protocolClient, {
        maxRequestResponseSubscriptions: 5,
        maxStreamingSubscriptions: 2,
        operationTimeoutInSeconds: 60
    });

    let context: SampleContext = {
        thingName: args.thing_name,
        client: shadowClient
    };

    // invoked when the shadow state changes
    let shadowUpdatedStream = shadowClient.createShadowUpdatedStream({
        thingName: context.thingName
    });
    shadowUpdatedStream.on('incomingPublish', (event) => {
        console.log(`Received ShadowUpdated event: ${JSON.stringify(event.message)}\n`)
    })
    shadowUpdatedStream.open();

    // invoked when there's a change to the delta between reported and desired
    let shadowDeltaUpdatedStream = shadowClient.createShadowDeltaUpdatedStream({
        thingName: context.thingName
    });
    shadowDeltaUpdatedStream.on('incomingPublish', (event) => {
        console.log(`Received ShadowDeltaUpdated event: ${JSON.stringify(event.message)}\n`)
    })
    shadowDeltaUpdatedStream.open();

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    try {
        let done = false;
        while (!done) {
            const userInput : string = await new Promise((resolve) => rl.question("Enter command:\n", resolve));
            done = await handleCommand(context, userInput.trimStart());
        }
    } catch (error) {
        console.log(error);
    }

    shadowClient.close();
    console.log("Disconnecting..");

    let stopped = once(protocolClient, "stopped");
    protocolClient.stop();
    await stopped;
    protocolClient.close();

    console.log("Stopped");
    // Quit NodeJS
    process.exit(0);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
