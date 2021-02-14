const { sequelize } = require('../models');
const models = require('../models');

const teamsResolvers = {
  Query: {
    async getTeam(root, { id }) {
      const team = await models.Team.findByPk(id);
      if (team == null) {
        throw new Error('Team not found');
      }
      return team;
    },
    async getAllTeams(root, args) {
      return models.Team.findAll();
    },
    async latestOrders(root, { id, amountPrev }) {
      return models.Orders.findAll({
        attributes: ['orderNumber', 'price', 'purchaseDate'],
        where: {
          id: id,
        },
        order: [['purchaseDate', 'DESC']],
        limit: amountPrev,
      });
    },
    async getItemsSold(root, { id }) {
      return models.Orders.findAll({
        attributes: ['id, numberOfItems', [sequelize.fn('SUM', sequelize.col('numberOfItems')), 'itemsSold']],
        where: {
          id: id,
        },
        group: ['id'],
      });
    },
  },

  Mutation: {
    async createTeam(root, { name, organization, amountRaised, itemsSold }) {
      return models.Team.create({
        name,
        organization,
        amountRaised,
        itemsSold,
      });
    },
    async deleteTeam(root, { id }) {
      models.Team.destroy({
        where: {
          id,
        },
      });
      return true;
    },

    async updateTeam(root, { id, name, organization, amountRaised, itemsSold }) {
      const team = await models.Team.findOne({ where: { id } });
      if (team === null) {
        throw new Error('Team Not Found');
      }
      team.name = name;
      team.organization = organization;
      team.amountRaised = amountRaised;
      team.itemsSold = itemsSold;

      await team.save();
      return team;
    },
  },
};

exports.teamsResolvers = teamsResolvers;
