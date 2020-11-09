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
        getActiveUser: User
        getAllUsers: [User!]!
    }

    extend type Mutation {
        register(firstName: String!, lastName: String!, email: String!, password: String!): User
        login(email: String!, password: String!): User
        logout: Boolean
    }
`

exports.authTypeDefs = authTypeDefs