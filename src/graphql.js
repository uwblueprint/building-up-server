const { makeExecutableSchema, addSchemaLevelResolveFunction } = require('apollo-server')
const { merge } = require('lodash')
const {
    helloWorldTypeDefs
} = require("./schemas")
const {
    helloWorldResolvers
} = require("./resolvers")

const schema = makeExecutableSchema({
    typeDefs: [
        helloWorldTypeDefs
    ],
    resolvers: merge(
        helloWorldResolvers
    )
})

const rootResolveFunction = (parent, args, context, info) => {
    //Any actions to perform before any other resolvers can be put here. For Example, JWT Token Authentication
}

addSchemaLevelResolveFunction(schema, rootResolveFunction)

exports.schema = schema