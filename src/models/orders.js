'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class orders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  orders.init({
    orderNumber: DataTypes.INTEGER,
    userID: DataTypes.INTEGER,
    teamID: DataTypes.INTEGER,
    price: DataTypes.DECIMAL(20, 2),
    numberOfItems: DataTypes.INTEGER
  }, {
      sequelize,
      modelName: 'orders',
    });
  return orders;
};
