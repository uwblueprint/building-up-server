const retry = require('retry-as-promised');
const { Sequelize } = require('sequelize');
const { sequelize } = require('../models');
const models = require('../models');
const { sendEmail } = require('../services/sendEmail');
const { CLIENT_URL } = require('../config/config');

// TO DO: Edit inivitation email subject, html, and include team name (along with link)
const createTeamInviteMessage = teamId => {
  const inviteUrl = `${CLIENT_URL}/invite/${teamId}`;
  // convert teamId to teamName
  return {
    from: 'hongyichen@uwblueprint.org',
    subject: `Invitation to join a team for Raising the Roof's Toque Campaign Fundraiser`,
    html: `You have been invited to join a team for Raising the Roof's Toque Campaign Fundraiser! Please join using this link: <a href="${inviteUrl}">${inviteUrl}</a>`,
  };
};

const sendTeamInvites = async (emails, teamId) => {
  const message = createTeamInviteMessage(teamId);
  return Promise.all(
    emails.map(email => {
      const invitationEmail = { to: { email }, ...message };
      return sendEmail(invitationEmail);
    }),
  );
};

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
          teamId: id,
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
        attributes: ['id', 'name', 'organization', 'amountRaised', 'itemsSold'],
        order: [['amountRaised', 'DESC']],
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

    async updateTeam(root, { id, name, organization, amountRaised, itemsSold, isArchived }) {
      const team = await models.Team.findOne({ where: { id } });
      if (team === null) {
        throw new Error('Team Not Found');
      }
      team.name = name || team.name;
      team.organization = organization || team.organization;
      team.amountRaised = amountRaised || team.amountRaised;
      team.itemsSold = itemsSold || team.itemsSold;
      team.isArchived = isArchived || team.isArchived;

      await team.save();
      return team;
    },
    async inviteUsersToTeam(root, { emails, teamId }) {
      try {
        await sendTeamInvites(emails, teamId);
        return true;
      } catch (error) {
        console.log(error);
      }
      return false;
    },
  },
};

exports.teamsResolvers = teamsResolvers;
