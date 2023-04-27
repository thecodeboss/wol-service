import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Query {
    devices: [Device]
  }

  type Mutation {
    login(password: String!): String
    awaken(macAddress: String!): Boolean
  }

  type Device {
    ipAddress: String
    macAddress: String
    name: String
  }
`;
