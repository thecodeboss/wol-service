import type { IResolvers } from '@graphql-tools/utils';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { getDevices } from './network-discovery';
import { awaken } from './wake-on-lan';

const PASSWORD_HASH = process.env.PASSWORD_HASH;
const JWT_SECRET = process.env.JWT_SECRET;

export const resolvers: IResolvers = {
  Query: {
    devices: (_: unknown, __: unknown, { user }: any) => {
      if (!user || !user.isAuthenticated) {
        throw new Error('Unauthorized');
      }
      return getDevices();
    },
  },

  Mutation: {
    login: async (_: unknown, { password }: { password: string }) => {
      const isValid = await bcrypt.compare(password, PASSWORD_HASH!);
      if (isValid) {
        const token = jwt.sign({ isAuthenticated: true }, JWT_SECRET!, { expiresIn: '1h' });
        return token;
      }
      throw new Error('Incorrect password.');
    },
    awaken: async (_: unknown, { mac }: { mac: string }, { user }: any) => {
      if (!user || !user.isAuthenticated) {
        throw new Error('Unauthorized');
      }
      try {
        await awaken(mac);
        console.log(`🌱 Bud sent a magic packet to device (${mac})`);
        return true;
      } catch (error) {
        const typedError = error as Error;
        throw new Error(`Failed to awaken device (${mac}): ${typedError.message}`);
      }
    },
  },
};
