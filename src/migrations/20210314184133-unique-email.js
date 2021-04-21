module.exports = {
  up: async queryInterface => {
    await queryInterface.addConstraint('Users', {
      fields: ['email'],
      type: 'unique',
      name: 'Users_email_key',
    });
  },

  down: async queryInterface => {
    await queryInterface.removeConstraint('Users', 'Users_email_key');
  },
};
