import cron from 'node-cron';

import { discoverDevices } from './network-discovery';

export const startDeviceDiscoveryScheduler = () => {
  console.log('🌱 Bud started the device discovery scheduler');
  discoverDevices();

  cron.schedule('*/5 * * * *', () => {
    console.log('🌿 Bud is updating the device cache');
    discoverDevices();
  });
};
