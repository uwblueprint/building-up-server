const { gql } = require('apollo-server-express');

const usersTypeDefs = gql`
  type User {
    id: Int!
    firstName: String!
    lastName: String!
    email: String!
    password: String!
    role: String
    teamId: String
  }
  extend type Query {
    Users(teamId: String!): [User]
    getUser(id: Int!): User
    getAllUsers: [User!]!
  }
  extend type Mutation {
    addUser(
      firstName: String!
      lastName: String!
      email: String!
      password: String!
      role: String!
      teamId: String!
    ): User
    updateUser(
      id: Int!
      firstName: String
      lastName: String
      email: String
      password: String
      role: String
      teamId: String
    ): User
  }
`;

exports.usersTypeDefs = usersTypeDefs;
exports.usersTypeDefs = usersTypeDefs;
