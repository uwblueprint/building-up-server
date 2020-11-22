const { gql } = require('apollo-server-express')

const usersTypeDefs = gql`
    type Users {
        id: Int!,
        firstName: String!,
        lastName: String!,
        email: String!,
        password: String!,
        role: String!,
        teamId: Int!
    }
    extend type Query {
        Users(): [Users]
    }

    extend type Mutation {
        
    }
`

exports.usersTypeDefs = usersTypeDefs

