const { gql } = require('apollo-server-express');

const ordersTypeDefs = gql`
  type Orders {
    orderNumber: Int!
    userID: Int!
    teamID: Int!
    teamName: String!
    price: Int!
    numberOfItems: Int!
    purchaseDate: String!
  }
`;
exports.ordersTypeDefs = ordersTypeDefs;
