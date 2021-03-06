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
    isVerified: Boolean!
    verificationHash: String
  }
  extend type Query {
    getUsersForTeam(teamId: String!): [User]
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
    leaveTeam(id: ID!, sendNotifEmail: Boolean!): User
    verifyAccount(id: ID!, hash: String!): User
    sendVerificationEmail(id: ID!): Boolean
  }
`;

exports.usersTypeDefs = usersTypeDefs;
