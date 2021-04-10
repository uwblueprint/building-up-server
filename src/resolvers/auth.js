const bcrypt = require('bcryptjs');
const models = require('../models');
const { sendEmail } = require('../services/sendEmail');

const {
  authenticateResetToken,
  createNewAccessToken,
  createNewRefreshToken,
  createNewResetToken,
  addAccessTokenCookie,
  addRefreshTokenCookie,
  clearAccessTokenCookie,
  clearRefreshTokenCookie,
} = require('../middleware/auth');

const { CLIENT_URL } = require('../config/config');


const createResetTokenedEmail = (resetToken) => {
  const resetPasswordUrl = `${CLIENT_URL}/resetPassword?${resetToken}`;
  return {
    from: 'kevinzhang@uwblueprint.org',
    subject: `Raising the Roof Password Reset Attempt`,
    html: `Reset your password here: ${resetPasswordUrl}`,
  };
};

const createResetAttemptEmail = () => {
  return {
    from: 'kevinzhang@uwblueprint.org',
    subject: `Raising the Roof Password Reset Attempt`,
    html: `Someone recently attempted to reset your password at ${CLIENT_URL}, however, you do not have an account with us`,
  };
};

const sendResetLink = async (email, resetToken) => {
  const message = resetToken ? createResetTokenedEmail(resetToken) : createResetAttemptEmail();
  const invitationEmail = { to: { email }, ...message };
  return new Promise(() => {
      sendEmail(invitationEmail);
      return invitationEmail;
    }
  )
};

const authResolvers = {
  Query: {
    getActiveUser: (_, __, { req }) => {
      if (!req.userId) {
        return null;
      }
      return models.User.findByPk(req.userId);
    },
    sendPasswordEmail: (_, {email}, __) => {
      try {
        return models.User.findOne({ where: { email:email } }).then((user) => {
          // eslint-disable-next-line no-console
        console.log(user)
        const resetToken = user ? createNewResetToken(user.id) : null;
        // eslint-disable-next-line no-console
        console.log(authenticateResetToken(resetToken));
        const resetPasswordUrl = `${CLIENT_URL}/resetPassword/${resetToken}`;
        // sendResetLink(email, resetToken)["html"];
        // return true;
        return resetPasswordUrl;
        });
      } catch (error) {
        //eslint-disable-next-line no-console
        console.log(error);
      }
      return "fuck";
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
        const id = authenticateResetToken(jwtToken);
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
