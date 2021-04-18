require('dotenv').config();

module.exports = {
  development: {
    username: 'alfm',
    password: 'buildingup',
    database: 'building_up_dev',
    host: 'building-up-db',
    dialect: 'postgres',
  },
  production: {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    dialect: 'postgres',
    dialectOptions: {
      ssl:
        parseInt(process.env.POSTGRES_REQUIRE_SSL, 10) === 1
          ? {
              require: true,
              rejectUnauthorized: false,
            }
          : undefined,
    },
  },
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  RESET_PASSWORD_TOKEN_SECRET: process.env.RESET_PASSWORD_TOKEN_SECRET,
  CLIENT_URL: process.env.CLIENT_URL,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || '',
};
