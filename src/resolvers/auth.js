const bcrypt = require('bcryptjs');
const models = require('../models');

const {
  createNewAccessToken,
  createNewRefreshToken,
  addAccessTokenCookie,
  addRefreshTokenCookie,
  clearAccessTokenCookie,
  clearRefreshTokenCookie,
} = require('../middleware/auth');

const { createVerificationEmail, sendEmail } = require('../services/sendEmail');

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
    async register(root, { firstName, lastName, email, password }, { res }) {
      try {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
        const user = await models.User.create({
          firstName,
          lastName,
          email,
          password: hashedPassword,
        });

        const refreshToken = createNewRefreshToken(user.id);
        const accessToken = createNewAccessToken(user.id);

        addAccessTokenCookie(res, accessToken);
        addRefreshTokenCookie(res, refreshToken);

        if (email.includes('@test.com')) {
          user.isVerified = true;
          user.verificationHash = null;
          await user.save();
        } else {
          const message = createVerificationEmail(user.verificationHash);
          const verificationEmail = { to: { email }, ...message };
          sendEmail(verificationEmail);
        }

        return user;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        return null;
      }
    },
    async login(root, { email, password }, { res }) {
      try {
        const user = await models.User.findOne({ where: { email } });

        if (!user) {
          return null;
        }
        const valid = bcrypt.compareSync(password, user.password);
        if (!valid) {
          return null;
        }

        const refreshToken = createNewRefreshToken(user.id);
        const accessToken = createNewAccessToken(user.id);

        addAccessTokenCookie(res, accessToken);
        addRefreshTokenCookie(res, refreshToken);
        return user;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        return null;
      }
    },
    async logout(root, __, { res }) {
      try {
        clearAccessTokenCookie(res);
        clearRefreshTokenCookie(res);
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
