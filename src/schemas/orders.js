const { gql } = require('apollo-server-express');

const ordersTypeDefs = gql`
  type Orders {
    id: ID!
    orderNumber: Int!
    teamId: String
    price: Float!
    donationAmount: Float!
    numberOfItems: Int!
    createdAt: String!
    updatedAt: String!
  }
`;
exports.ordersTypeDefs = ordersTypeDefs;
