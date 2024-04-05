import * as mqtt from 'mqtt';
import { IMQTTConfig} from '../interface/IConfiguration';
import { IMQTTPayload} from '../interface/IMQTTPayload';

export class MQTTClient {
  private mqttClient: mqtt.MqttClient | null;
  private config: IMQTTConfig;
  private isShuttingDown: boolean;

  constructor(config: IMQTTConfig) {
    this.config = config;
    this.mqttClient = null;
    this.isShuttingDown = false;
  }

  public async connect(): Promise<boolean | undefined> {
    try {
      this.mqttClient = await mqtt.connectAsync(this.config.brokerUrl, {port: this.config.mqttPort});
      console.log('Connected to MQTT broker');
      return true;
    } catch (error) {
      console.error("Failed to connect to MQTT Broker");
      console.error(error);
    }
    return undefined;
  }

  public async publish(variable: string, payload: IMQTTPayload): Promise <void> {    
    if (this.isShuttingDown) return;
    
    let topic = `${this.config.baseTopic}/${variable}`;
    topic = topic.replace(/\/\//g, '/');
    if(this.mqttClient !== null) {
      await this.mqttClient.publishAsync(topic, JSON.stringify(payload), { qos: 2 });
      console.log(`Published to ${topic}: ${JSON.stringify(payload)}`);
    } else {
      console.error('MQTT client is not connected');
    }
  }

  public async shutdown(): Promise<void> {
    try {
      this.isShuttingDown = true;
      await this.mqttClient?.endAsync();
      console.log('Disconnected from MQTT broker');      
    } catch (error) {
      console.error("Failed to disconnect from MQTT Broker:", error);
    }
    
  }
}
