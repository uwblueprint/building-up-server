const { ApolloServer } = require('apollo-server-express');
const { schema } = require('./graphql')
const express = require('express');
const models = require('./models')
const app = express()    
const port = 4000

const server = new ApolloServer({ schema, context: { models } });
server.applyMiddleware({ app });
models.sequelize.authenticate();

models.sequelize.sync();

app.listen({ port }, () => {
    // eslint-disable-next-line no-console
    console.log(`🚀 Server running on port ${port}`);
    console.log(`🤾‍♂️ Playground running on localhost:${port}/graphql`)
});