const { UserInputError } = require('apollo-server-errors');
const models = require('../models');

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
  },
};

exports.usersResolvers = usersResolvers;
