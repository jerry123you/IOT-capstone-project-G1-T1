import ads from 'ads-client';
import config from './config.json';

const client = new ads.Client(config.ads);

client.connect()
  .then((res: { targetAmsNetId: any; localAmsNetId: any; localAdsPort: any }) => {
    console.log(`Connected to the ${res.targetAmsNetId}`)
    console.log(`Router assigned us AmsNetId ${res.localAmsNetId} and port ${res.localAdsPort}`)

    client.readSymbol('HMI_GVL.M.Rob3.ROBOTPOS.X')
    // client.readSymbol('HMI_GVL.M.Rob3.MACTTORQUE')
      .then((res: { value: any }) => {
        console.log(`Value read: ${res.value}`)
        return client.disconnect()
      })
      .catch((err: any) => {
        console.log('Something failed:', err)
      })

  })
  .then(() => {
    console.log('Disconnected')
  })
  .catch(err => {
    console.log('Something failed:', err)
  })