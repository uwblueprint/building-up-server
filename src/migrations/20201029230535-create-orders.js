module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Orders', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      orderNumber: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: false,
      },
      teamId: {
        type: Sequelize.STRING,
        references: {
          model: 'Teams',
          key: 'id',
        },
      },
      price: {
        type: Sequelize.DECIMAL(20, 2),
        allowNull: false,
      },
      numberOfItems: {
        type: Sequelize.INTEGER,
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
