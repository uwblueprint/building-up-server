const { ApolloServer } = require("apollo-server-express");
const { schema } = require("./graphql");
const express = require("express");
const models = require("./models");
const routes = require("./routes");
const port = 4000;
var cookieParser = require("cookie-parser");
const { verify } = require("jsonwebtoken");
require("dotenv").config({ path: "./keys.env" });
const cors = require('cors');

const server = new ApolloServer({
  schema,
  context: ({ req, res }) => ({ req, res })
});

const app = express();

const option = { origin: 'http://localhost:3000', credentials: true}

app.use(cookieParser());

app.use("/shopify", routes);

app.use((req, _, next) => {
  const accessToken = req.cookies["access-token"];
  try {
    const data = verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req.userId = data.userId;
  } catch {}
  next();
});

server.applyMiddleware({ app, cors: option });
models.sequelize.authenticate();

models.sequelize.sync();

app.listen({ port }, () => {
  // eslint-disable-next-line no-console
  console.log(`🚀 Server running on port ${port}`);
  console.log(`🤾‍♂️ Playground running on localhost:${port}/graphql`);
});
