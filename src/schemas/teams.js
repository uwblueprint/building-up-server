const { gql } = require('apollo-server-express')

const teamsTypeDefs = gql`
    type Team {
        id: Int!
        name: String!
        organization: String!
        amountRaised: Int!
    }
    extend type Query {
        getTeam(id: Int!): Team
        getAllTeams: [Team!]!
        latestOrders(id: Int!, amountPrev: Int!): [Orders!]!
    }

    extend type Mutation {
        createTeam(name: String!, organization: String!, amountRaised: Int!): Team
        deleteTeam(id: Int!) : Boolean
        updateTeam(id: Int!, name: String, organization: String, amountRaised: Int): Team
    }
`

exports.teamsTypeDefs = teamsTypeDefs

