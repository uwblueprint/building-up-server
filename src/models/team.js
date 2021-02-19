const { Model } = require('sequelize');
var en = require('nanoid-good/locale/en');
var customAlphabet = require('nanoid-good').customAlphabet(en);

// Based on documentation here https://github.com/ai/nanoid
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const generator = customAlphabet(alphabet, 6);

module.exports = (sequelize, DataTypes) => {
  class Team extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
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
      // name: DataTypes.STRING,
      // organization: DataTypes.STRING,
      // amountRaised: DataTypes.DECIMAL(20, 2),
      // itemsSold: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Team',
    },
  );
  // Team.beforeCreate(team => (team.id = String(generator())));
  return Team;
};
