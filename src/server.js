const { ApolloServer } = require('apollo-server-express');
const { schema } = require('./graphql')
const express = require('express')
const app = express()    
const port = 4000

const server = new ApolloServer({ schema });
server.applyMiddleware({ app });

app.listen({ port }, () => {
    // eslint-disable-next-line no-console
    console.log(`🚀 Server running on port ${port}`);
    console.log(`🤾‍♂️ Playground running on localhost:${port}/graphql`)
});