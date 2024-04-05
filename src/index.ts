/*
 * index.ts
 *
 * This is the microservice that will extract data from the Beckhoff PLC controller using
 * Beckhoff ADSClient library
 *
 * This code is adapted from samples provided by IoT Academy instructor Prashanta Shrestha with
 * custom classes built to simplify access to ADSClient, MQTTClient and file reading operations
 */


// import what we need to support our solution
import config from './config.json';
import { ADSClient } from './class/ADSClient';
import {IMQTTPayload } from 'interface/IMQTTPayload';
import {MQTTClient} from './class/MQTTClient';



/*
 * STEP 1: initial test of ADS communications
 *
 * function main()
 *
 * This function (configured as asynchronous) will test a connection,
 * a read and a shutdown of the connection via the Beckhoff ADS protocol
 */

let tags:string[] = [
    "HMI_GVL.M.INITIALIZED",
    "HMI_GVL.M.RUNNING",
    "HMI_GVL.M.MERROR",
    "HMI_GVL.M.PAUSED",
    "HMI_GVL.M.SPEEDPERCENTAGE",
    "HMI_GVL.M.Rob3.INITIALIZED",
    "HMI_GVL.M.Rob3.RUNNING",
    "HMI_GVL.M.Rob3.MERROR",
    "HMI_GVL.M.Rob3.WSVIOLATION",
    "HMI_GVL.M.Rob3.PAUSED",
    "HMI_GVL.M.Rob3.SPEEDPERCENTAGE",
    "HMI_GVL.M.Rob3.FINISHEDPARTNUM",
    "HMI_GVL.M.Rob3.ROBOTPOS.X",
    "HMI_GVL.M.Rob3.ROBOTPOS.Y",
    "HMI_GVL.M.Rob3.ROBOTPOS.Z",
    "HMI_GVL.M.Rob3.MACTTORQUE",
    "HMI_GVL.M.Rob3.MACTTORQUE[1]",
    "HMI_GVL.M.Rob3.MACTTORQUE[2]",
    "HMI_GVL.M.Rob3.MACTTORQUE[3]",
    "HMI_GVL.M.Rob3.MACTTORQUE[4]"
]

async function main()
{

	let adsClient = new ADSClient (config.ads, tags);
    let mqttClient = new MQTTClient (config.mqtt);
	if (await adsClient.connect()) {
        if(await mqttClient.connect()) {
            config.mqtt.baseTopic = "magna/iotacademy/conestoga/smart/presorter/1/robot";
            adsClient.onVariableRead(async(variable, payload) =>processPayload(variable, payload,mqttClient));
            setInterval(async()=> processReadRequest(adsClient), 1000);
		    const shutdown = async() => {
                await adsClient.shutdown();
                await mqttClient.shutdown();}
            process.on('SIGINT', shutdown);
            process.on('SIGTERM', shutdown);
	    }

    }
            

}

async function processPayload (variable: string, payload: IMQTTPayload, client: MQTTClient) {

	// console.log(JSON.stringify(payload));
    await client.publish(variable, payload);
}
async function processReadRequest(client: ADSClient) {
	await client.readVariables();
}

main();