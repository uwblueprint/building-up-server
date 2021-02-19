const { gql } = require('apollo-server-express');

const usersTypeDefs = gql`
  type User {
    id: Int!
    firstName: String!
    lastName: String!
    email: String!
    password: String!
    role: String
    teamId: Int
  }
  extend type Query {
    Users(teamId: Int!): [User]
    getUser(id: Int!): User
    getAllUsers: [User!]!
  }
  extend type Mutation {
    addUser(firstName: String!, lastName: String!, email: String!, password: String!, role: String!, teamId: Int!): User
    updateUser(
      id: Int!
      firstName: String
      lastName: String
      email: String
      password: String
      role: String
      teamId: Int
    ): User
  }
`;

exports.usersTypeDefs = usersTypeDefs;
// CONSIDER TAKING THIS OUT
exports.usersTypeDefs = usersTypeDefs;
