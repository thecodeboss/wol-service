import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import jwt from 'jsonwebtoken';

import { typeDefs } from './types';
import { resolvers } from './resolvers';
import { startDeviceDiscoveryScheduler } from './scheduler';

const JWT_SECRET = process.env.JWT_SECRET;
const app = express();

const checkAuthMiddleware = (req: express.Request, _res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  try {
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      const user = jwt.verify(token, JWT_SECRET!);
      (req as any).user = user;
    } else if (req.body.operationName !== 'login') {
      throw new Error('Authorization token must be provided');
    }
  } catch (err) {
    throw new Error('Authentication failed');
  }

  next();
};

app.use(express.json());
app.use(checkAuthMiddleware);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ user: (req as any).user }),
});

const PORT = process.env.PORT || 4000;

(async () => {
  await server.start();
  server.applyMiddleware({ app });

  app.listen(PORT, () => {
    console.log(`🌱 Bud is now sprouting on port ${PORT}`);
    startDeviceDiscoveryScheduler();
  });
})();
