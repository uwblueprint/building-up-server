const { Model } = require('sequelize');
const en = require('nanoid-good/locale/en');
const fr = require('nanoid-good/locale/fr');
const customAlphabet = require('nanoid-good').customAlphabet(en, fr);

// Based on documentation here https://github.com/ai/nanoid
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const generator = customAlphabet(alphabet, 6);

module.exports = (sequelize, DataTypes) => {
  class Team extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Team.hasMany(models.User);
      Team.hasMany(models.Order);
    }
  }
  Team.init(
    {
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,
        defaultValue: generator,
      },
      name: {
        type: DataTypes.STRING,
      },
      organization: {
        type: DataTypes.STRING,
      },
      amountRaised: {
        type: DataTypes.DECIMAL(20, 2),
      },
      itemsSold: {
        type: DataTypes.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: 'Team',
    },
  );
  return Team;
};
