const { gql } = require('apollo-server-express');

// type User has already been defined in auth.js schemas

consersTypeDefs = gql`
   User {
    Int!
    tName: String!
    Name: String!
    ail: String!
    ssword: String!
    : String!
teamId: Int!
}

extend type Query {
    Users(teamId: Int!): [User]
    getUser(id: Int!)User
    llUsers: [User!]!
  

  tend type Mutation {
    addUser(firstName: String!, lastName: String!, email: String!, password: String!, role: String!, teamId: Int!) : User
    updateUser(
      id: Int!
      firstName: String
      lastName: String
      email: String
      password: String
      role: String
      teamId: Int
    ): User
  };`;
exports.usersTypeDefs = usersTypeDefs;
