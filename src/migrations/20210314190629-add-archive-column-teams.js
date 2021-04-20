module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Teams', 'isArchived', {
      allowNull: false,
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
  },

  down: async queryInterface => {
    await queryInterface.removeColumn('Teams', 'isArchived');
  },
};
