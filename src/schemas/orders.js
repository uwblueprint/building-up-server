const { gql } = require('apollo-server-express');

const ordersTypeDefs = gql`
  type Orders {
    orderNumber: Int!
    userId: Int!
    teamId: Int!
    teamName: String!
    price: Int!
    numberOfItems: Int!
    purchaseDate: String!
  }
`;
exports.ordersTypeDefs = ordersTypeDefs;
