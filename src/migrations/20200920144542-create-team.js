module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Teams', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.UUIDV4,
        unique: true,
      },
      name: {
        type: Sequelize.STRING,
      },
      organization: {
        type: Sequelize.STRING,
      },
      amountRaised: {
        type: Sequelize.INTEGER,
      },
      itemsSold: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async queryInterface => {
    await queryInterface.dropTable('Teams');
  },
};
