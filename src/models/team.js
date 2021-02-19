const { Model } = require('sequelize');

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
      }
    },
    {
      sequelize,
      modelName: 'Team',
    },
  );
  return Team;
};
