const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const cookieParser = require('cookie-parser');

const { authenticateToken } = require('./middleware/auth');
const { schema } = require('./graphql');
const models = require('./models');
const routes = require('./routes');

const port = process.env.PORT || 4000;

const server = new ApolloServer({
  schema,
  context: ({ req, res }) => ({ req, res }),
});

const app = express();

const corsOptions = {
  origin: [
    'http://localhost:3000',
    /https:\/\/toques\.raisingtheroof\.org/,
    /https:\/\/building-up\.netlify\.app/,
    /https:\/\/deploy-preview-\d+--building-up\.netlify\.app/,
    // Temporary
    /https:\/\/deploy-preview-\d+--building-up-bp-old\.netlify\.app/,
  ],
  credentials: true,
};

app.use(cookieParser());

app.use('/shopify', routes);

app.get('/', (req, res, next) => {res.send('PONG')})

app.use(authenticateToken);

server.applyMiddleware({ app, cors: corsOptions });

models.sequelize.authenticate();
// models.sequelize.sync();

app.listen({ port }, () => {
  // eslint-disable-next-line no-console
  console.log(`🚀 Server running on port ${port}`);
  // eslint-disable-next-line no-console
  console.log(`🤾‍♂️ Playground running on localhost:${port}/graphql`);
});
