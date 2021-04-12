const bcrypt = require('bcryptjs');
const models = require('../models');
const { sendEmail } = require('../services/sendEmail');

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

const { CLIENT_URL } = require('../config/config');

const createResetPasswordEmail = (resetToken) => {
  const resetPasswordUrl = `${CLIENT_URL}/resetPassword/${resetToken}`;
  console.log(resetPasswordUrl)
  return {
    from: 'kevinzhang@uwblueprint.org',
    subject: `Raising the Roof Password Reset Attempt`,
    html: `Reset your password <a href="${resetPasswordUrl}"> here </a>`,
  };
};

const createResetAttemptEmail = () => {
  return {
    from: 'kevinzhang@uwblueprint.org',
    subject: `Raising the Roof Password Reset Attempt`,
    html: `Someone recently attempted to reset your password at ${CLIENT_URL}, however, you do not have an account with us`,
  };
};

const sendResetPasswordLink = (email, resetToken) => {
  const message = resetToken ? createResetPasswordEmail(resetToken) : createResetAttemptEmail();
  const invitationEmail = { to: { email }, ...message };
  return sendEmail(invitationEmail);
};

const authResolvers = {
  Query: {
    getActiveUser: (_, __, { req }) => {
      if (!req.userId) {
        return null;
      }
      return models.User.findByPk(req.userId);
    },
    sendResetPasswordEmail: (_, {email}, __) => {
      try {
        return models.User.findOne({ where: { email:email } }).then((user) => {
        const resetToken = user ? createNewPasswordResetToken(user.id) : null;
        sendResetPasswordLink(email, resetToken)
        return true;
        })
      } catch (error) {
        //eslint-disable-next-line no-console
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
    async resetPassword(root, {jwtToken, password}, ___){
      try{
        const id = authenticateResetPasswordToken(jwtToken);
        return models.User.findByPk(id).then((user) => {
          const salt = bcrypt.genSaltSync(10);
          const hashedPassword = bcrypt.hashSync(password, salt);
          user.password = hashedPassword;
          return user.save().then(() => {
            return true;
          });
        });
      }catch(error){
        // eslint-disable-next-line no-console
        console.log(error);
        return false;
      }
    }
  },
};

exports.authResolvers = authResolvers;
