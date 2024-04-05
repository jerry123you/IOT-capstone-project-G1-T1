"use strict";
/*
 * index.ts
 *
 * This is the microservice that will extract data from the Beckhoff PLC controller using
 * Beckhoff ADSClient library
 *
 * This code is adapted from samples provided by IoT Academy instructor Prashanta Shrestha with
 * custom classes built to simplify access to ADSClient, MQTTClient and file reading operations
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import what we need to support our solution
const config_json_1 = __importDefault(require("./config.json"));
const ADSClient_1 = require("./class/ADSClient");
const MQTTClient_1 = require("./class/MQTTClient");
/*
 * STEP 1: initial test of ADS communications
 *
 * function main()
 *
 * This function (configured as asynchronous) will test a connection,
 * a read and a shutdown of the connection via the Beckhoff ADS protocol
 */
let tags = [
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
];
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let adsClient = new ADSClient_1.ADSClient(config_json_1.default.ads, tags);
        let mqttClient = new MQTTClient_1.MQTTClient(config_json_1.default.mqtt);
        if (yield adsClient.connect()) {
            if (yield mqttClient.connect()) {
                config_json_1.default.mqtt.baseTopic = "magna/iotacademy/conestoga/smart/presorter/1/robot";
                adsClient.onVariableRead((variable, payload) => __awaiter(this, void 0, void 0, function* () { return processPayload(variable, payload, mqttClient); }));
                setInterval(() => __awaiter(this, void 0, void 0, function* () { return processReadRequest(adsClient); }), 1000);
                const shutdown = () => __awaiter(this, void 0, void 0, function* () {
                    yield adsClient.shutdown();
                    yield mqttClient.shutdown();
                });
                process.on('SIGINT', shutdown);
                process.on('SIGTERM', shutdown);
            }
        }
    });
}
function processPayload(variable, payload, client) {
    return __awaiter(this, void 0, void 0, function* () {
        // console.log(JSON.stringify(payload));
        yield client.publish(variable, payload);
    });
}
function processReadRequest(client) {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.readVariables();
    });
}
main();
