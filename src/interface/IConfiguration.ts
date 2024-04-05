export interface IConfiguraton {
  ads: IADSConfig;
  variablesFilePath: string;
  mqtt: IMQTTConfig
  samplingInterval: number;
}

export interface IADSConfig {
  localAmsNetId: string;
  localAdsPort: number;
  targetAmsNetId: string;
  targetAdsPort: number;
  routerAddress: string;
  routerTcpPort: number;
}

export interface IMQTTConfig {
  brokerUrl: string;
  mqttPort: number;
  baseTopic: string;
};