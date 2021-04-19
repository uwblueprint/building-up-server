const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.belongsTo(models.User, {
        foreignKey: 'userId',
        allowNull: false,
      });
      Order.belongsTo(models.Team, {
        foreignKey: 'teamId',
      });
    }
  }
  Order.init(
    {
      orderNumber: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      price: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
      },
      numberOfItems: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      purchaseDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      donationAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Order',
    },
  );
  return Order;
};
