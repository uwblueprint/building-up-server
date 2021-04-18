const { generator } = require('../services/customAlphabet');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    // await queryInterface.removeColumn('Orders', 'UserId');
    // await queryInterface.removeColumn('Orders', 'TeamId');
    await queryInterface.removeColumn('Orders', 'userId');
    await queryInterface.changeColumn('Orders', 'teamId', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: generator,
    });
    await queryInterface.addColumn('Orders', 'donationAmount', {
      type: Sequelize.DECIMAL(20, 2),
      allowNull: false,
      default: 0,
    });
    await queryInterface.addConstraint('Orders', {
      references: { table: 'Teams', field: 'id' },
      type: 'foreign key',
      name: 'orders_fk__teamId',
      onDelete: 'cascade',
      onUpdate: 'cascade',
      fields: ['teamId'],
    });
  },
  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.addColumn('Orders', 'userId', {
      type: Sequelize.INTEGER,
    });
    await queryInterface.removeColumn('Orders', 'teamId');
    await queryInterface.addColumn('Orders', 'teamId', {
      type: Sequelize.INTEGER,
    });
    await queryInterface.removeColumn('Orders', 'donationAmount');
    await queryInterface.removeConstraint('Orders', 'orders_fk__teamId');
  },
};
