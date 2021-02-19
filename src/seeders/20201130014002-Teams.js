module.exports = {
  up: async queryInterface => {
    return queryInterface.bulkInsert('Teams', [
      {
        name: 'Test User 1',
        organization: 'BP',
        amountRaised: 150,
        itemsSold: 200,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Test User 2',
        organization: 'BP2',
        amountRaised: 42809,
        itemsSold: 424,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Test User 3',
        organization: 'BP3',
        amountRaised: 42,
        itemsSold: 96,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Test User 4',
        organization: 'BP4',
        amountRaised: 1020,
        itemsSold: 200,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Test User 5',
        organization: 'BP5',
        amountRaised: 10090,
        itemsSold: 200,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Test User 6',
        organization: 'BP6',
        amountRaised: 1640,
        itemsSold: 34500,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
  },

  down: async queryInterface => {
    return queryInterface.bulkDelete('Users', null, {});
  },
};
