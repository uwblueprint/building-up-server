const { gql } = require('apollo-server-express');

const teamsTypeDefs = gql`
  type Team {
    id: String!
    name: String!
    organization: String!
    amountRaised: Float!
    itemsSold: Int!
    isArchived: Boolean!
  }
  extend type Query {
    getTeam(id: String!): Team
    getAllTeams: [Team!]!
    getLatestOrders(id: String!, amountPrev: Int): [Orders!]!
    getSalesInfoForTeam(id: String!): [Orders!]!
    getGlobalLeaderboard: [Team!]!
  }

  extend type Mutation {
    createTeam(name: String!, organization: String!, amountRaised: Int!, itemsSold: Int!): Team
    deleteTeam(id: String!): Boolean
    updateTeamNameOrg(id: String!, name: String, organization: String): Team
    inviteUsersToTeam(emails: [String!], teamId: String!): Boolean
  }
`;

exports.teamsTypeDefs = teamsTypeDefs;
