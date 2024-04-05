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
exports.ADSClientStub = void 0;
const events_1 = require("events");
class ADSClientStub extends events_1.EventEmitter {
    constructor(config, variables) {
        super();
        this.isConnected = false;
        this.config = config;
        this.variables = variables;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            this.isConnected = true;
            console.log(`ADSClientStub: Simulated connection to PLC established - ${this.config.targetAmsNetId}`);
            return true;
        });
    }
    readVariables() {
        return __awaiter(this, void 0, void 0, function* () {
            for (let variable of this.variables) {
                if (!this.isConnected)
                    break;
                console.log(`ADSClientStub: Simulating reading of variable '${variable}'.`);
                const payload = {
                    timestamp: new Date().toISOString(),
                    value: Math.random(),
                };
                console.log(`${variable}: ${JSON.stringify(payload)}`);
                this.emit('variableRead', variable, payload);
            }
        });
    }
    onVariableRead(callback) {
        this.on('variableRead', callback);
    }
    shutdown() {
        return __awaiter(this, void 0, void 0, function* () {
            this.isConnected = false;
            console.log('ADSClientStub: Simulated disconnection from PLC.');
        });
    }
}
exports.ADSClientStub = ADSClientStub;
