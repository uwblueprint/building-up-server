const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.belongsTo(models.Team, {
        foreignKey: 'teamId',
      });
    }
  }
  Order.init(
    {
      // The order ID is used for querying the shopify API
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      // The order number is what you see in the store interface, i.e. #1234
      // See https://shopify.dev/docs/admin-api/rest/reference/orders/order for more info
      orderNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      price: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
      },
      donationAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
      },
      numberOfItems: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
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
