const { gql } = require('apollo-server-express')

const authTypeDefs = gql`
    extend type Query {
        getActiveUser: User
    }

    extend type Mutation {
        register(firstName: String!, lastName: String!, email: String!, password: String!): User
        login(email: String!, password: String!): User
    }
`

exports.authTypeDefs = authTypeDefs