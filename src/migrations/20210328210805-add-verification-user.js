const en = require('nanoid-good/locale/en');
const fr = require('nanoid-good/locale/fr');
const customAlphabet = require('nanoid-good').customAlphabet(en, fr);

// Based on documentation here https://github.com/ai/nanoid
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const generator = customAlphabet(alphabet, 32);

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
