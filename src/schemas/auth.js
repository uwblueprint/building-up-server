const { gql } = require('apollo-server-express');

const authTypeDefs = gql`
  extend type Query {
    getActiveUser: User
    sendPasswordEmail(email:String!): Boolean
  }

  extend type Mutation {
    register(firstName: String!, lastName: String!, email: String!, password: String!): User
    login(email: String!, password: String!): User
    logout: Boolean
    resetPassword(jwtToken: String!, password: String!): Boolean
  }
`;

exports.authTypeDefs = authTypeDefs;
