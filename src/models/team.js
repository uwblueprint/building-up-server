const { Model } = require('sequelize');
const models = require('../models');

function generateID(){
  let existing = await models.Team.findAll({
    attributes: ["id"]
  })
  let existing_ids = Set();
  for(let i = 0; i < existing.length; i++){
    existing_ids.add(existing[i]["ids"]);
  }
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var hash = "";
  let hashNotUnique = true;
  while(hashNotUnique){
    for(let i = 0; i < 4; i++){
      hash += letters.charAt(Math.floor(Math.random() * 26));
    }
    hashNotUnique = false
    if(existing_ids.has(hash)){
      hashNotUnique = true;
    }
  }
  return hash;
}

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
      name: DataTypes.STRING,
      organization: DataTypes.STRING,
      amountRaised: DataTypes.DECIMAL(20, 2),
      itemsSold: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Team',
    },
  );
  // https://stackoverflow.com/questions/40734263/how-to-set-primary-key-type-to-uuid-via-sequelize-cli
  Team.beforeCreate(team => team.id = generateID())
  return Team;
};
