const { gql } = require('apollo-server-express');

const paymentsTypeDefs = gql`
  type paymentReturn {
    id: String!
  }

  extend type Mutation {
    postPayment(unit_amount: Int!, quantity: Int!): paymentReturn
  }
`;

exports.paymentsTypeDefs = paymentsTypeDefs;
