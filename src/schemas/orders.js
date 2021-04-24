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
  extend type Query {
    getOrder(id: ID!): Orders
    getOrderByOrderNumber(orderNumber: Int!): Orders
    getAllOrders: [Orders!]!
  }
`;

exports.ordersTypeDefs = ordersTypeDefs;
