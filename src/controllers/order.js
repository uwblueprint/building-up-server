const models = require('../models');

const findByOrderId = id => {
  return models.Order.findByPk(id);
};

const findByOrderNumber = orderNumber => {
  return models.Order.findOne({
    where: {
      orderNumber,
    },
  });
};

module.exports.findByOrderNumber = findByOrderNumber;
module.exports.findByOrderId = findByOrderId;
