var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
require('dotenv').config({path:'../keys.env'});
const models = require('../models');

const authResolvers = {
  Query: {
    getActiveUser: (_,__,{ req }) => {
      if (!req.userId) {
        return null;
      }
      return models.User.findByPk(req.userId);
    },
    getAllUsers: (_,__,{req}) => {
      return models.User.findAll();
    }
  },
  Mutation: {
    async register(root, {firstName, lastName, email, password }) {
      try {
        var salt = bcrypt.genSaltSync(10);
        var hashedPassword = bcrypt.hashSync(password, salt);        
        return models.User.create({
          firstName,
          lastName,
          email,
          password: hashedPassword,
        });
      } catch (error) {
        console.log(error)
      }
    },
    async login(root, { email, password }, { req, res }){
      try {
        const user = await models.User.findOne({ where: { email } });

        if (!user) {
          return null;
        }
        const valid = bcrypt.compareSync(password, user.password); 
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
        console.log(user);
        return user;
      } catch (error) {
        console.log(error)
      }
    },
    async logout(root, __, {req, res}){
      try {
        res.clearCookie("refresh-token");
        res.clearCookie("access-token");
        return true;
      } catch (error) {
        console.log(error)
      }
      return false;
    }
  }
};

exports.authResolvers = authResolvers