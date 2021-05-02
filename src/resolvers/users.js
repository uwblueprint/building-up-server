const { UserInputError } = require('apollo-server-errors');
const models = require('../models');
const { createVerificationEmail, sendEmail } = require('../services/sendEmail');

const createRemovalEmail = (teamName) => {
  return {
    subject: `Raising the Roof Team Removal`,
    html: `You were kicked off of team ${teamName}`,
  };
};

const sendLeaveTeamNotif = (email, teamName) => {
  const message = createRemovalEmail(teamName);
  const resetEmail = { to: { email }, ...message };
  return sendEmail(resetEmail);
};

const usersResolvers = {
  Query: {
    async getUsersForTeam(root, { teamId }) {
      return models.User.findAll({
        where: {
          teamId,
        },
      });
    },
    async getUser(root, { id }) {
      const user = await models.User.findByPk(id);
      if (user == null) {
        throw new Error('User Not Found');
      }
      return user;
    },
    async getAllUsers(root, args) {
      return models.User.findAll();
    },
  },
  Mutation: {
    async addUser(root, { firstName, lastName, email, password, role, teamId }) {
      return models.User.create({
        firstName,
        lastName,
        email,
        password,
        role,
        teamId,
      });
    },
    async updateUser(root, { id, firstName, lastName, email, password, role }) {
      const user = await models.User.findOne({ where: { id } });
      if (user == null) {
        throw new Error('User Not Found');
      }

      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.email = email || user.email;
      user.password = password || user.password;
      user.role = role || user.role;

      await user.save();
      return user;
    },

    async joinTeam(root, { id, teamId }) {
      const user = await models.User.findByPk(id);
      if (user == null) {
        throw new UserInputError('User Not Found');
      }
      const team = await models.Team.findByPk(teamId);
      if (team == null) {
        throw new UserInputError('Team not found');
      }
      user.teamId = teamId;
      await user.save();
      return user;
    },

    async leaveTeam(root, { id, sendNotifEmail}) {
      const user = await models.User.findByPk(id);
      if (user === null) {
        throw new UserInputError('User not found');
      }
      const team = await models.Team.findByPk(user.teamId);
      if (team === null){
        throw new UserInputError('User does not have a team')
      }
      if(sendNotifEmail){
        sendLeaveTeamNotif(user.email, team.name);
      }
      user.teamId = null;
      await user.save();
      return user;
    },

    async verifyAccount(root, { id, hash }) {
      const user = await models.User.findByPk(id);
      if (user == null) {
        throw new UserInputError('User not found');
      }

      if (user.isVerified) {
        return user;
      }

      if (user.verificationHash === hash) {
        user.isVerified = true;
        user.verificationHash = null;
        await user.save();
      }

      return user;
    },

    async sendVerificationEmail(root, { id }) {
      try {
        const user = await models.User.findByPk(id);
        if (user == null) {
          throw new UserInputError('User not found');
        }

        if (user.isVerified) {
          throw new Error('User is already verified');
        }

        const { email } = user;
        const message = createVerificationEmail(user.verificationHash);
        const verificationEmail = { to: { email }, ...message };
        sendEmail(verificationEmail);
        return true;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
      return false;
    },
  },
};

exports.usersResolvers = usersResolvers;
