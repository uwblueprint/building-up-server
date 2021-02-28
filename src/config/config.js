module.exports = {
  development: {
    username: "alfm",
    password: "buildingup",
    database: "building_up_dev",
    host: "building-up-db",
    dialect: "postgres"
  },
  test: {
    username: "alfm",
    password: "buildingup",
    database: "building_up_dev",
    host: "localhost",
    dialect: "postgres"
  },
  production: {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    dialectOptions: {
      ssl:
        parseInt(process.env.POSTGRES_REQUIRE_SSL, 10) === 1
          ? {
              require: true,
              rejectUnauthorized: false,
            }
          : undefined,
    },
  }
};
