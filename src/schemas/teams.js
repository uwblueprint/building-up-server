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
    }

    extend type Mutation {
        createTeam(name: String!, organization: String!): Team
        deleteTeam(id: Int!) : Boolean
        modifyName(id: Int!, value: String!): Boolean
        modifyAmountRaised(id: Int!, value: Int!): Team
        modifyOrganization(id: Int!, value: String!): Team

    }
`

exports.teamsTypeDefs = teamsTypeDefs

