import { exec } from 'child_process';
import { promisify } from 'util';
import dns from 'dns';

const execAsync = promisify(exec);

type Device = {
  name: string;
  ipAddress: string;
  macAddress: string;
};

// In-memory cache to store discovered devices
const deviceCache: Device[] = [];

export async function discoverDevices(): Promise<void> {
  // Ping individual IP addresses (assumes a /24 subnet)
  const baseIP = process.env.BASE_IP || '192.168.1';
  await Promise.all(
    Array.from({ length: 254 }, (_, i) => i + 1).map(async (ipIndex) => {
      try {
        await execAsync(`ping -c 1 -W 1 ${baseIP}.${ipIndex}`);
      } catch {} // Ignore failed pings
    })
  );

  // Get the ARP table
  const { stdout } = await execAsync('arp -a');
  const arpEntries = stdout.trim().split('\n').slice(1);

  // Parse the ARP table and perform reverse DNS lookups
  const devices: Device[] = await Promise.all(
    arpEntries.map(async (entry) => {
      const match = entry.match(/^.*\s((?:\d{1,3}\.){3}\d{1,3}).*\s(([0-9a-fA-F]{2}[:-]){5}[0-9a-fA-F]{2})\s.*$/);

      if (!match) {
        return Promise.reject(new Error('Failed to parse ARP entry'));
      }

      // [lineIndex, ipAddress, macAddress] regex matches
      const [, ipAddress, macAddress] = match;

      // Perform reverse DNS lookup for ipAddress
      const name = await new Promise<string>((resolve) => {
        dns.reverse(ipAddress, (error, hostnames) => {
          resolve(error ? ipAddress : hostnames[0]);
        });
      });

      return { name, ipAddress, macAddress };
    })
  );

  // Store the discovered devices in the cache
  devices.forEach((device) => deviceCache.push(device));
}

// New getDevices function that retrieves the devices from the cache
export function getDevices(): Device[] {
  return deviceCache;
}
