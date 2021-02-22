const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const {
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_REQUIRE_SSL,
} = require('../config/config');

const basename = path.basename(__filename);
const db = {};

const sequelize = new Sequelize({
  database: POSTGRES_DB,
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  host: POSTGRES_HOST,
  port: POSTGRES_PORT,
  dialect: 'postgres',
  dialectOptions: {
    ssl:
      POSTGRES_REQUIRE_SSL === 1
        ? {
            require: true,
            rejectUnauthorized: false,
          }
        : undefined,
  },
});

fs.readdirSync(__dirname)
  .filter(file => {
    return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
