"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ads_client_1 = __importDefault(require("ads-client"));
const config_json_1 = __importDefault(require("./config.json"));
const client = new ads_client_1.default.Client(config_json_1.default.ads);
client.connect()
    .then((res) => {
    console.log(`Connected to the ${res.targetAmsNetId}`);
    console.log(`Router assigned us AmsNetId ${res.localAmsNetId} and port ${res.localAdsPort}`);
    client.readSymbol('HMI_GVL.M.Rob3.ROBOTPOS.X')
        // client.readSymbol('HMI_GVL.M.Rob3.MACTTORQUE')
        .then((res) => {
        console.log(`Value read: ${res.value}`);
        return client.disconnect();
    })
        .catch((err) => {
        console.log('Something failed:', err);
    });
})
    .then(() => {
    console.log('Disconnected');
})
    .catch(err => {
    console.log('Something failed:', err);
});
