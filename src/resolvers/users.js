const { UserInputError } = require('apollo-server-errors');
const models = require('../models');
const { createVerificationEmail, sendEmail } = require('../services/sendEmail');

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

    async leaveTeam(root, { id }) {
      const user = await models.User.findByPk(id);
      if (user == null) {
        throw new UserInputError('User not found');
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
        // TODO: already verified?
      }

      if (user.verificationHash === hash) {
        user.isVerified = true;
        user.verificationHash = null;
        await user.save();
      } else {
        // TODO: do we want to error out? do we want to just let frontend check user.isVerified
      }

      return user;
    },

    async sendVerificationEmail(root, { id }) {
      try {
        const user = models.User.findByPk(id);
        if (user == null) {
          throw new UserInputError('User not found');
        }

        if (user.isVerified) {
          // TODO: already verified?
        }

        const { email } = user;
        const message = createVerificationEmail(id);
        const invitationEmail = { to: { ...email }, ...message };
        sendEmail(invitationEmail);
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
