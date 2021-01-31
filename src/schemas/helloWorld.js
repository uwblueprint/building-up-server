const { gql } = require('apollo-server');

const helloWorldTypeDefs = gql`
  extend type Query {
    hello: String
  }
`;

exports.helloWorldTypeDefs = helloWorldTypeDefs;
