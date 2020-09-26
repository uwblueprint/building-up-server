const { ApolloServer } = require('apollo-server-express');
const { schema } = require('./graphql')
const express = require('express');
const models = require('./models')    
const port = 4000
require('dotenv').config()
var cookieParser = require('cookie-parser')
const {verify} = require('jsonwebtoken');

const server = new ApolloServer({ schema, context: { models } });

const app = express();

app.use(cookieParser());

app.use((req, _, next) => {
const accessToken = req.cookies["access-token"];
try {
    const data = verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    (req).userId = data.userId;
} catch {}
next();
});

server.applyMiddleware({ app });
models.sequelize.authenticate();

models.sequelize.sync();

app.listen({ port }, () => {
    // eslint-disable-next-line no-console
    console.log(`🚀 Server running on port ${port}`);
    console.log(`🤾‍♂️ Playground running on localhost:${port}/graphql`)
});
