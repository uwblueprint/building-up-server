module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn('Orders', 'donationAmount', {
      type: Sequelize.DECIMAL(20, 2),
      allowNull: false,
    });
  },

  down: async queryInterface => {
    queryInterface.removeColumn('Orders', 'donationAmount');
  },
};
