"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MQTTClient = void 0;
const mqtt = __importStar(require("mqtt"));
class MQTTClient {
    constructor(config) {
        this.config = config;
        this.mqttClient = null;
        this.isShuttingDown = false;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.mqttClient = yield mqtt.connectAsync(this.config.brokerUrl, { port: this.config.mqttPort });
                console.log('Connected to MQTT broker');
                return true;
            }
            catch (error) {
                console.error("Failed to connect to MQTT Broker");
                console.error(error);
            }
            return undefined;
        });
    }
    publish(variable, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isShuttingDown)
                return;
            let topic = `${this.config.baseTopic}/${variable}`;
            topic = topic.replace(/\/\//g, '/');
            if (this.mqttClient !== null) {
                yield this.mqttClient.publishAsync(topic, JSON.stringify(payload), { qos: 2 });
                console.log(`Published to ${topic}: ${JSON.stringify(payload)}`);
            }
            else {
                console.error('MQTT client is not connected');
            }
        });
    }
    shutdown() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                this.isShuttingDown = true;
                yield ((_a = this.mqttClient) === null || _a === void 0 ? void 0 : _a.endAsync());
                console.log('Disconnected from MQTT broker');
            }
            catch (error) {
                console.error("Failed to disconnect from MQTT Broker:", error);
            }
        });
    }
}
exports.MQTTClient = MQTTClient;
