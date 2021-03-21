const { gql } = require('apollo-server-express');

const usersTypeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    password: String!
    role: String
    teamId: String
  }
  extend type Query {
    Users(teamId: String!): [User]
    getUser(id: ID!): User
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
    updateUser(id: ID!, firstName: String, lastName: String, email: String, password: String, role: String): User
    joinTeam(id: ID!, teamId: String): User
    leaveTeam(id: ID!): User
  }
`;

exports.usersTypeDefs = usersTypeDefs;
