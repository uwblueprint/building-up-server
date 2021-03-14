const retry = require('retry-as-promised');
const { Sequelize } = require('sequelize');
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
      return models.Order.findAll({
        attributes: ['orderNumber', 'price', 'purchaseDate'],
        where: {
          id,
        },
        order: [['purchaseDate', 'DESC']],
        limit: amountPrev,
      });
    },
    async getSalesInfoForTeam(root, { id }) {
      return models.Team.findOne({
        attributes: ['itemsSold', 'amountRaised'],
        where: {
          id,
        },
      });
    },
    async getGlobalLeaderboard(root, args) {
      return models.Team.findAll({
        attributes: ['name', 'amountRaised', 'itemsSold'],
        order: [['itemsSold', 'DESC']],
      });
    },
  },

  Mutation: {
    async createTeam(root, { name, organization, amountRaised, itemsSold }) {
      return retry(
        () => {
          return sequelize.transaction(async t => {
            return models.Team.create(
              {
                name,
                organization,
                amountRaised,
                itemsSold,
              },
              {
                transaction: t,
              },
            );
          });
        },
        {
          max: 999,
          match: [Sequelize.UniqueConstraintError],
        },
      );
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
