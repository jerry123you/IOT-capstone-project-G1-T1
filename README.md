# TwinCAT to MQTT Service

This project is a Node.js application written in TypeScript that reads variables from a TwinCAT PLC using the `ads-client` npm module and publishes the read data to an MQTT broker. It's designed to work even in the absence of a real PLC by simulating PLC behavior through stubs.

## Prerequisites

- Node.js (version 12 or higher recommended)
- TwinCAT PLC environment (for production use)
- MQTT Broker
- TwinCAT Requirements
  - PLC has TCP port ```48898``` open (default router port)
  - Local ```localAmsNetId``` and ```localAdsPort``` are assigned manually that are not already in use

### Adding static route to the PLC 

For the node.js service to connect to ADS Webservice, a static route needs to be added to the PLC. If the client is running from IP address ```10.178.164.130```, add the static route by editing ```TwinCAT\3.1\Target\StaticRoutes.xml ``` file:

```xml
<RemoteConnections>
  ...
  <Route>
    <Name>nodejs-client</Name>
    <Address>10.178.164.130</Address>
    <NetId>10.178.164.130.1.1</NetId>
    <Type>TCP_IP</Type>
    <Flags>64</Flags>
  </Route>
</RemoteConnections>
```
    
## Installation

1. Install dependencies:
    ```sh
    npm install
    ```

2. Create a `variables.txt` file that contains list of PLC variables to read. The path to this file is provided using ```variablesFilePath``` attribute in ```config.json``` file:

    ```txt
    HMI_GVL.M.Rob1.ROBOTPOS.X
    HMI_GVL.M.Rob1.ROBOTPOS.Y
    HMI_GVL.M.Rob1.ROBOTPOS.Z

    HMI_GVL.M.Rob2.ROBOTPOS.X
    HMI_GVL.M.Rob2.ROBOTPOS.Y
    HMI_GVL.M.Rob2.ROBOTPOS.Z

    HMI_GVL.M.Rob3.ROBOTPOS.X
    HMI_GVL.M.Rob3.ROBOTPOS.Y
    HMI_GVL.M.Rob3.ROBOTPOS.Z

    ```

3. Configure your environment by editing the `config.json` file with your TwinCAT and MQTT settings. 


    | Param Name            | Description                                                                  | Example Value                |
    |-----------------------|------------------------------------------------------------------------------|------------------------------|
    | `localAmsNetId`       | The local AMS Net ID of the node.js client.                                  | `10.178.164.130.1.1`         |
    | `localAdsPort`        | The local ADS port of the node.js client. Should be unique in the network.   | `32750`                      |
    | `targetAmsNetId`      | The target AMS Net ID of the remote TwinCAT system to connect to.            | `10.193.21.105.1.1`          |
    | `targetAdsPort`       | The target ADS port on the remote TwinCAT system.                            | `851`                        |
    | `routerAddress`       | The IP address of the router.                                                | `10.178.161.133`             |
    | `routerTcpPort`       | The TCP port used by the router.                                             | `48898`                      |
    | `variablesFilePath`   | The file path where the variables to be read are listed.                     | `C:\path\to\variables.txt`   |
    | `brokerUrl`           | The URL of the MQTT broker to connect to.                                    | `mqtt://localhost`           |
    | `mqttPort`            | The port of the MQTT broker.                                                 | `6883`                       |
    | `baseTopic`           | The base MQTT topic under which the variables will be published.             | `plc/`                       |
    | `samplingInterval`    | The time interval (in milliseconds) between successive readings.             | `5000`                       |

## Building and Running the Application

To build the ADS client, use the following command:

```bash
npm run build
```

To run the application, use the following command:

```sh
npm start
```

