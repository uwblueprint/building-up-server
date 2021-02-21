const models = require('../models');

const incrementTeamSales = (teamId, quantity) => {
  models.Team.increment(['itemsSold'], { by: quantity, where: { id: teamId } });
};

const decrementTeamSales = (teamId, quantity) => {
  models.Team.decrement(['itemsSold'], { by: Math.abs(quantity), where: { id: teamId } });
};

exports.incrementTeamSales = incrementTeamSales;
exports.decrementTeamSales = decrementTeamSales;
