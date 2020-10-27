"use strict";
const { Model } = require("sequelize");
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
      userID: DataTypes.INTEGER,
      teamID: DataTypes.INTEGER,
      price: DataTypes.DECIMAL(20, 2),
      numberOfItems: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: "Orders"
    }
  );
  return Orders;
};

// CREATE TABLE "Orders" (
// 	id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
// 	"userID" INTEGER REFERENCES public."Users" (id),
// 	"teamID" INTEGER REFERENCES public."Teams" (id),
// 	"price" MONEY NOT NULL,
// 	"numberOfItems" INTEGER NOT NULL,
// 	"createdAt" TIMESTAMPTZ,
// 	"updatedAt" TIMESTAMPTZ
// );
