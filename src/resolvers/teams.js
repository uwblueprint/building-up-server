const retry = require('retry-as-promised');
const { Sequelize } = require('sequelize');
const { sequelize } = require('../models');
const models = require('../models');
const { sendEmail } = require('../services/sendEmail');
const { CLIENT_URL } = require('../config/config');
const { DASHBOARD_ROOT_PATH } = require('../constants/client-routes');

const INVITE_EMAIL_TEMPLATE_ID = 'd-9000df3a467145f5aafa0da6e8d95cae';

const createTeamInviteMessage = ({ teamId, name }) => {
  const inviteUrl = `${CLIENT_URL}/${DASHBOARD_ROOT_PATH}/invite/${teamId}`;

  return {
    template_id: INVITE_EMAIL_TEMPLATE_ID,
    dynamic_template_data: {
      inviteUrl,
      teamName: name,
    },
  };
};

const sendTeamInvites = async (emails, { teamId, name }) => {
  const message = createTeamInviteMessage({ teamId, name });
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
    async getLatestOrders(root, { id, amountPrev }) {
      return models.Order.findAll({
        where: {
          teamId: id,
        },
        order: [['createdAt', 'DESC']],
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

    async updateTeamNameOrg(root, { id, name, organization }) {
      try {
        const team = await models.Team.update(
          { name, organization },
          {
            where: { id },
            returning: true,
          },
        );
        return team[1][0].dataValues;
      } catch {
        throw new Error('Team Not Found');
      }
    },

    async inviteUsersToTeam(root, { emails, teamId }) {
      try {
        const { name } = await models.Team.findByPk(teamId);
        await sendTeamInvites(emails, { teamId, name });
        return true;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
      return false;
    },
  },
};

exports.teamsResolvers = teamsResolvers;
