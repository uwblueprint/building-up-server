const { generator } = require('../services/customAlphabet');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async t => {
      await queryInterface.addColumn(
        'Users',
        'isVerified',
        {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        { transaction: t },
      );
      await queryInterface.addColumn(
        'Users',
        'verificationHash',
        {
          type: Sequelize.STRING,
          defaultValue: generator,
        },
        { transaction: t },
      );
      queryInterface.bulkUpdate('Users', {
        isVerified: true,
      });
    });
  },

  down: async queryInterface => {
    return queryInterface.sequelize.transaction(async t => {
      await queryInterface.removeColumn('Users', 'isVerified', { transaction: t });
      queryInterface.removeColumn('Users', 'verificationHash');
    });
  },
};
