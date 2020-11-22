'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'Teams',
        'toquesSold',
        {
          type: Sequelize.INTEGER
        }
      ),
      queryInterface.addColumn(
        'Teams',
        'capsSold',
        {
          type: Sequelize.INTEGER
        }
      ),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Teams', 'toquesSold'),
      queryInterface.removeColumn('Teams', 'capsSold')
    ]);
  }
};