"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Orders", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      orderNumber: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      userID: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "Users",
            schema: "public"
          },
          key: "id"
        },
        allowNull: false
      },
      teamID: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "Teams",
            schema: "public"
          },
          key: "id"
        },
        allowNull: false
      },
      price: {
        type: Sequelize.DECIMAL(20, 2),
        allowNull: false
      },
      numberOfItems: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Orders");
  }
};
