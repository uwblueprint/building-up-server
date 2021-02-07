module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      orderNumber: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
      },
      userID: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Users',
            schema: 'public',
          },
          key: 'id',
        },
        allowNull: false,
      },
      teamID: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Teams',
            schema: 'public',
          },
          key: 'id',
        },
        allowNull: false,
      },
      teamName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      price: {
        type: Sequelize.DECIMAL(20, 2),
        allowNull: false,
      },
      numberOfItems: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      purchaseDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },
  down: async queryInterface => {
    await queryInterface.dropTable('Orders');
  },
};
