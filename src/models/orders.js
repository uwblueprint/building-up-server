const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Orders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Orders.init(
    {
      orderNumber: DataTypes.INTEGER,
      userID: DataTypes.INTEGER,
      teamID: DataTypes.STRING,
      teamName: DataTypes.STRING,
      price: DataTypes.DECIMAL(20, 2),
      numberOfItems: DataTypes.INTEGER,
      purchaseDate: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Orders',
    },
  );
  return Orders;
};