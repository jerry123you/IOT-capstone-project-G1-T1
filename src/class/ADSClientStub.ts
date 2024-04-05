import { EventEmitter } from 'events';
import { IADSConfig } from 'interface/IConfiguration';
import { IMQTTPayload } from 'interface/IMQTTPayload';

export class ADSClientStub extends EventEmitter {
  private isConnected: boolean = false;
  private config: IADSConfig;
  private variables: string[];

  constructor(config: IADSConfig, variables: string[]) {
    super();
    this.config = config;
    this.variables = variables;
  }

  public async connect(): Promise < boolean | undefined > {
    this.isConnected = true;
    console.log(`ADSClientStub: Simulated connection to PLC established - ${this.config.targetAmsNetId}`);
    return true;
  }

  public async readVariables(): Promise < void > {
    for(let variable of this.variables) {
      if (!this.isConnected) break;
      console.log(`ADSClientStub: Simulating reading of variable '${variable}'.`);
      const payload: IMQTTPayload = { 
        timestamp: new Date().toISOString(), 
        value: Math.random(),
      };
      console.log(`${variable}: ${JSON.stringify(payload)}`);
      this.emit('variableRead', variable, payload);
    }
  }

  public onVariableRead(callback: (variable: string, payload: IMQTTPayload) => void): void {
    this.on('variableRead', callback);
  }

  public async shutdown(): Promise < void > {
    this.isConnected = false;
    console.log('ADSClientStub: Simulated disconnection from PLC.');
  }
}