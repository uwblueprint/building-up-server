const models = require('../models');

const incrementTeamScore = (teamId, quantity) => {
  models.Team.increment(['itemsSold'], { by: quantity, where: { id: teamId } });
};

const decrementTeamScore = (teamId, quantity) => {
  models.Team.decrement(['itemsSold'], { by: Math.abs(quantity), where: { id: teamId } });
};

export { incrementTeamScore, decrementTeamScore };
