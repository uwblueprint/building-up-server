const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const {
  POSTGRES_PROD_DB,
  POSTGRES_PROD_USER,
  POSTGRES_PROD_PASSWORD,
  POSTGRES_PROD_HOST,
  POSTGRES_PROD_PORT,
} = require('../config/config');

const basename = path.basename(__filename);
const db = {};

const sequelize = new Sequelize({
  database: POSTGRES_PROD_DB,
  username: POSTGRES_PROD_USER,
  password: POSTGRES_PROD_PASSWORD,
  host: POSTGRES_PROD_HOST,
  port: 5432,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
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
