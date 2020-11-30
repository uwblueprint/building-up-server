const {
  makeExecutableSchema,
  addSchemaLevelResolveFunction,
  gql
} = require("apollo-server");
const { merge } = require("lodash");
const {
  helloWorldTypeDefs,
  teamsTypeDefs,
  ordersTypeDefs,
  paymentsTypeDefs,
  authTypeDefs,
  leaderboardTypeDefs,
  usersTypeDefs
} = require("./schemas");
const {
  helloWorldResolvers,
  teamsResolvers,
  paymentsResolvers,
  authResolvers,
  leaderboardResolvers,
  usersResolvers
} = require("./resolvers");

// Base query schema, other queries extend this
const Query = gql`
  type Query {
    _empty: String
  }
`;

// Base mutation schema, other mutations extend this
const Mutation = gql`
  type Mutation {
    _empty: String
  }
`;

const schema = makeExecutableSchema({
    typeDefs: [
        Query,
        Mutation,
        helloWorldTypeDefs,
        teamsTypeDefs,
        ordersTypeDefs,
        authTypeDefs,
        paymentsTypeDefs,
        leaderboardTypeDefs,
        usersTypeDefs
    ],
    resolvers: merge(
        helloWorldResolvers,
        teamsResolvers,
        authResolvers,
        paymentsResolvers,
        leaderboardResolvers,
        usersResolvers
    )
})

const rootResolveFunction = (parent, args, context, info) => {
  //Any actions to perform before any other resolvers can be put here. For Example, JWT Token Authentication
};

addSchemaLevelResolveFunction(schema, rootResolveFunction);

exports.schema = schema;
