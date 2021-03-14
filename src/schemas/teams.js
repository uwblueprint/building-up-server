const { gql } = require('apollo-server-express');

const teamsTypeDefs = gql`
  type Team {
    id: String!
    name: String!
    organization: String!
    amountRaised: Float!
    itemsSold: Int!
  }
  extend type Query {
    getTeam(id: String!): Team
    getAllTeams: [Team!]!
    latestOrders(id: String!, amountPrev: Int!): [Orders!]!
    getSalesInfoForTeam(id: String!): [Orders!]!
    getGlobalLeaderboard: [Team!]!
  }

  extend type Mutation {
    createTeam(name: String!, organization: String!, amountRaised: Int!, itemsSold: Int!): Team
    deleteTeam(id: String!): Boolean
    updateTeam(id: String!, name: String, organization: String, amountRaised: Int, itemsSold: Int): Team
    inviteTeam(emails: [String!], teamId: String!): Boolean
  }
`;

exports.teamsTypeDefs = teamsTypeDefs;
