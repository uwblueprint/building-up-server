const { Model } = require('sequelize');
import { Team } from "./team";
import { User } from "./user";

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Order.init(
    {
      orderNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: User,
          key: 'id',
        },
        allowNull: false,
      },
      teamId: {
        type: DataTypes.INTEGER,
        references: {
          model: Team,
          key: 'id',
        },
        allowNull: false,
      },
      teamName: {
        type: DataTypes.STRING,
        allowNull: false,
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
    },
    {
      sequelize,
      modelName: 'Order',
    },
  );
  return Order;
};
