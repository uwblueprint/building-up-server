const bcrypt = require('bcryptjs');
const models = require('../models');
const { createVerificationEmail, sendEmail } = require('../services/sendEmail');
const { CLIENT_URL } = require('../config/config');
const {
  authenticateResetPasswordToken,
  createNewAccessToken,
  createNewRefreshToken,
  createNewPasswordResetToken,
  addAccessTokenCookie,
  addRefreshTokenCookie,
  clearAccessTokenCookie,
  clearRefreshTokenCookie,
} = require('../middleware/auth');
const { DASHBOARD_ROOT_PATH } = require('../constants/client-routes');

const RESET_PASSWORD_TEMPLATE_ID = 'd-b444d727384e40f38efad1175b6681e7';

const createResetPasswordEmail = ({ name }, resetToken) => {
  const resetPasswordUrl = `${CLIENT_URL}/${DASHBOARD_ROOT_PATH}/resetPassword/${resetToken}`;
  return {
    template_id: RESET_PASSWORD_TEMPLATE_ID,
    dynamic_template_data: {
      resetPasswordUrl,
      name,
    },
  };
};

const createResetAttemptEmail = () => {
  return {
    subject: `Raising the Roof Password Reset Attempt`,
    html: `Someone recently attempted to reset your password at ${CLIENT_URL}, however, you do not have an account with us.`,
  };
};

const sendResetPasswordLink = ({ email, firstName, lastName }, resetToken) => {
  const message = resetToken
    ? createResetPasswordEmail({ name: `${firstName} ${lastName}` }, resetToken)
    : createResetAttemptEmail();
  const resetEmail = { to: { email }, ...message };
  return sendEmail(resetEmail);
};

const authResolvers = {
  Query: {
    getActiveUser: (_, __, { req }) => {
      if (!req.userId) {
        return null;
      }
      return models.User.findByPk(req.userId);
    },
    sendResetPasswordEmail: (_, { email }) => {
      try {
        return models.User.findOne({ where: { email } }).then(user => {
          const resetToken = user ? createNewPasswordResetToken(user.id) : null;
          sendResetPasswordLink(user, resetToken);
          return true;
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
      return false;
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
          const message = createVerificationEmail(`${firstName} ${lastName}`, user.verificationHash);
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
    async resetPassword(root, { jwtToken, password }) {
      try {
        const id = authenticateResetPasswordToken(jwtToken);
        const user = await models.User.findByPk(id);

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
        user.password = hashedPassword;

        await user.save();
        return true;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        return false;
      }
    },
  },
};

exports.authResolvers = authResolvers;
