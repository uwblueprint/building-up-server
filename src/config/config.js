require('dotenv').config();

module.exports = {
  POSTGRES_DB: process.env.POSTGRES_DB,
  POSTGRES_USER: process.env.POSTGRES_USER,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
  POSTGRES_HOST: process.env.POSTGRES_HOST,
  POSTGRES_PORT: process.env.POSTGRES_PORT,
  POSTGRES_REQUIRE_SSL: parseInt(process.env.POSTGRES_REQUIRE_SSL, 10),
  PGDATA: process.env.PGDATA,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  SHOPIFY_KEY: process.env.SHOPIFY_KEY,
};
