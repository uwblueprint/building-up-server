const { Model, Sequelize } = require('sequelize');
const en = require('nanoid-good/locale/en');
const fr = require('nanoid-good/locale/fr');
const customAlphabet = require('nanoid-good').customAlphabet(en, fr);

// Based on documentation here https://github.com/ai/nanoid
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const generator = customAlphabet(alphabet, 32);

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsTo(models.Team);
      User.hasMany(models.Order);
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true,
        },
      },
      lastName: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true,
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      role: {
        type: DataTypes.STRING,
      },
      teamId: {
        type: DataTypes.STRING,
      },
      isVerified: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      verificationHash: {
        type: DataTypes.STRING,
        defaultValue: generator,
      },
    },
    {
      sequelize,
      modelName: 'User',
    },
  );
  return User;
};
