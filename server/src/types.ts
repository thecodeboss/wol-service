import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Query {
    devices: [Device]
  }

  type Mutation {
    login(password: String!): String
    awaken(mac: String!): Boolean
  }

  type Device {
    name: String
    mac: String
  }
`;
