const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
require('dotenv').config();

const authResolvers = {
  Query: {
    getActiveUser: (_, __, { req }, {models}) => {
      if (!req.userId) {
        return null;
      }

      return User.findOne(req.userId);
    }
  },
  Mutation: {
    async register(root, {firstName, lastName, email, password }, { models }) {
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log(hashedPassword);
      console.log("hello");
      return models.User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword
      });
    },
    async login(root, { email, password }, {models}, { res }){
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return null;
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return null;
      }

      const refreshToken = jwt.sign(
        { userId: user.id },
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: "7d"
        }
      );
      const accessToken = jwt.sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15min"
      });

      res.cookie("refresh-token", refreshToken);
      res.cookie("access-token", accessToken);

      return user;
    }
  }
};

exports.authResolvers = authResolvers