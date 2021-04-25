const models = require('../models');

const incrementTeamSales = (teamId, quantity, price) => {
  models.Team.increment(['itemsSold'], { by: quantity, where: { id: teamId } });
  models.Team.increment(['amountRaised'], { by: price, where: { id: teamId } });
};

const decrementTeamSales = (teamId, quantity, price) => {
  models.Team.decrement(['itemsSold'], { by: Math.abs(quantity), where: { id: teamId } });
  models.Team.decrement(['amountRaised'], { by: price, where: { id: teamId } });
};

exports.incrementTeamSales = incrementTeamSales;
exports.decrementTeamSales = decrementTeamSales;
