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
        deleteTeam(id: Int!) : Boolean
        modifyTeam(id: Int!): Team
    }
`

exports.teamsTypeDefs = teamsTypeDefs

