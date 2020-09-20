const { gql } = require('apollo-server-express')

const teamsTypeDefs = gql`
    type Team {
        id: Int!
        name: String!
        organization: String!
    }

    extend type Query {
        getTeam(id: Int!): Team
        getAllTeams: [Team!]!
    }

    extend type Mutation {
        createTeam(name: String!, organization: String!): Team
    }
`

exports.teamsTypeDefs = teamsTypeDefs

