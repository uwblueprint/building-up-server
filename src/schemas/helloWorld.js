const { gql } = require('apollo-server')

const helloWorldTypeDefs = gql`
    type Query {
        hello: String
    }
`;

exports.helloWorldTypeDefs = helloWorldTypeDefs