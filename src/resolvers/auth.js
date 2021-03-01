const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const models = require('../models');

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = require('../config/config');

const authResolvers = {
  Query: {
    getActiveUser: (_, __, { req }) => {
      if (!req.userId) {
        return null;
      }
      return models.User.findByPk(req.userId);
    },
  },
  Mutation: {
    async register(root, { firstName, lastName, email, password }) {
      try {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
        return models.User.create({
          firstName,
          lastName,
          email,
          password: hashedPassword,
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    },
    async login(root, { email, password }, { req, res }) {
      try {
        const user = await models.User.findOne({ where: { email } });

        if (!user) {
          return null;
        }
        const valid = bcrypt.compareSync(password, user.password);
        if (!valid) {
          return null;
        }

        const refreshToken = jwt.sign({ userId: user.id }, REFRESH_TOKEN_SECRET, {
          expiresIn: '7d',
        });
        const accessToken = jwt.sign({ userId: user.id }, ACCESS_TOKEN_SECRET, {
          expiresIn: '15min',
        });

        res.cookie('refresh-token', refreshToken);
        res.cookie('access-token', accessToken);
        return user;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    },
    async logout(root, __, { req, res }) {
      try {
        res.clearCookie('refresh-token');
        res.clearCookie('access-token');
        return true;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
      return false;
    },
  },
};

exports.authResolvers = authResolvers;
