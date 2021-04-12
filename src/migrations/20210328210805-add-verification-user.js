const { generator } = require('../services/customAlphabet');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'isVerified', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.addColumn('Users', 'verificationHash', {
      type: Sequelize.STRING,
      defaultValue: generator,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'isVerified');
    await queryInterface.removeColumn('Users', 'verificationHash');
  },
};
