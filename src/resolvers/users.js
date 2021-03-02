const models = require('../models');

const usersResolvers = {
  Query: {
    async Users(root, { teamId }) {
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
    async updateUser(root, { id, firstName, lastName, email, password, role, teamId }) {
      const user = await models.User.findOne({ where: { id } });
      if (user == null) {
        throw new Error('User Not Found');
      }

      user.firstName = firstName ? firstName : user.firstName;
      user.lastName = lastName ? lastName : user.lastName;
      user.email = email ? email : user.email;
      user.password = password ? password : user.password;
      user.role = role ? role : user.role;
      user.teamId = teamId ? teamId : user.teamId;

      await user.save();
      return user;
    },
  },
};

exports.usersResolvers = usersResolvers;
