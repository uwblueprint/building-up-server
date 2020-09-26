const { gql } = require('apollo-server-express')

const authTypeDefs = gql`
    type User {
        id: Int!
        firstName: String!
        lastName: String!
        email: String!
        password: String!
    }

    extend type Query {
        getActiveUser(id: Int!): User
    }

    extend type Mutation {
        register(firstName: String!, lastName: String!, email: String!, password: String!): User
        login(email: String!, password: String!): User
    }
`

exports.authTypeDefs = authTypeDefs