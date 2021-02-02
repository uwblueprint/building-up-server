const { gql } = require('apollo-server-express');

const helloWorldTypeDefs = gql`
  extend type Query {
    hello: String
  }
`;

exports.helloWorldTypeDefs = helloWorldTypeDefs;
