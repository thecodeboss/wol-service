import * as dgram from 'dgram';

function macToBytes(mac: string): number[] {
  return mac.split(':').map((hexStr) => parseInt(hexStr, 16));
}

function createMagicPacket(macAddress: string): Buffer {
  const macBytes = macToBytes(macAddress);
  const magicPacket = Buffer.alloc(6 + 6 * 16);

  // Fill the first 6 bytes with 0xFF
  for (let i = 0; i < 6; i++) {
    magicPacket[i] = 0xff;
  }

  // Repeat the MAC address 16 times
  for (let i = 1; i <= 16; i++) {
    macBytes.forEach((byte, j) => {
      magicPacket[6 + (i - 1) * 6 + j] = byte;
    });
  }

  return magicPacket;
}

export async function awaken(macAddress: string): Promise<void> {
  const magicPacket = createMagicPacket(macAddress);
  const socket = dgram.createSocket('udp4');

  return new Promise((resolve, reject) => {
    socket.send(magicPacket, 0, magicPacket.length, 9, '255.255.255.255', (error, _bytes) => {
      if (error) {
        reject(error);
      } else {
        socket.close();
        resolve();
      }
    });
  });
}
