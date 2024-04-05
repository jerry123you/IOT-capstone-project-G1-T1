"use strict";
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
exports.ADSClient = void 0;
const events_1 = require("events");
const ads_client_1 = require("ads-client");
class ADSClient extends events_1.EventEmitter {
    constructor(config, variables) {
        super();
        this.isShuttingDown = false;
        this.config = config;
        this.client = new ads_client_1.Client(this.config);
        this.variables = variables;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.client.connect();
                console.log(`Connected to the ${res.targetAmsNetId}`);
                console.log(`Router assigned AmsNetId ${res.localAmsNetId} and port ${res.localAdsPort}`);
                return true;
            }
            catch (error) {
                console.error("Failed to connect to ADS");
                console.error(error);
            }
            return undefined;
        });
    }
    readVariables() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const variable of this.variables) {
                // If the client is shutting down, do not read variables
                if (this.isShuttingDown)
                    break;
                try {
                    const symbolData = yield this.client.readSymbol(variable);
                    const payload = {
                        timestamp: new Date().toISOString(),
                        value: symbolData.value
                    };
                    console.log(`${variable}: ${JSON.stringify(payload)}`);
                    this.emit('variableRead', variable, payload);
                }
                catch (error) {
                    console.error(`Error reading variable ${variable}:`, error);
                    continue;
                }
            }
        });
    }
    onVariableRead(callback) {
        this.on('variableRead', callback);
    }
    shutdown() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.isShuttingDown = true;
                yield this.client.disconnect();
                console.log("Disconnected");
            }
            catch (error) {
                console.error("Failed to disconnect from ADS:", error);
            }
        });
    }
}
exports.ADSClient = ADSClient;
