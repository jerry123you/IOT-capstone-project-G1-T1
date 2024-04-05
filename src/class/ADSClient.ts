import {EventEmitter} from 'events';
import {Client, SymbolData} from 'ads-client';
import { IADSConfig } from 'interface/IConfiguration';
import * as fs from 'fs';
import { IMQTTPayload } from 'interface/IMQTTPayload';

export class ADSClient extends EventEmitter{
  private client: Client;
  private config: IADSConfig;
  private variables: string[];
  private isShuttingDown = false;

  constructor(config: IADSConfig, variables: string[]) {
    super();
    this.config = config;
    this.client = new Client(this.config);
    this.variables = variables;    
  }

  public async connect(): Promise<boolean | undefined> {
    try {
      const res = await this.client.connect();
      console.log(`Connected to the ${res.targetAmsNetId}`);
      console.log(`Router assigned AmsNetId ${res.localAmsNetId} and port ${res.localAdsPort}`);
      return true;
    } catch (error) {
      console.error("Failed to connect to ADS");
      console.error(error);
    }
    return undefined;
  }

  public async readVariables(): Promise<void> {
    for (const variable of this.variables) {
      // If the client is shutting down, do not read variables
      if (this.isShuttingDown) break;
      try {
        const symbolData: SymbolData = await this.client.readSymbol(variable);
        const payload: IMQTTPayload = { 
          timestamp: new Date().toISOString(), 
          value: symbolData.value 
        };
        console.log(`${variable}: ${JSON.stringify(payload)}`);
        this.emit('variableRead', variable, payload);
      } catch (error) {
        console.error(`Error reading variable ${variable}:`, error);
        continue;
      }
    }
  }

  public onVariableRead(callback: (variable: string, payload: IMQTTPayload) => void): void {
    this.on('variableRead', callback);
  }

  public async shutdown(): Promise < void > {
    try {
      this.isShuttingDown = true;
      await this.client.disconnect();
      console.log("Disconnected");
    } catch (error) {
      console.error("Failed to disconnect from ADS:", error);
    }
  }
}


