const models = require('../models');

const getAllOrders = () => {
  return models.Order.findAll();
};

const findByOrderId = id => models.Order.findByPk(id);

const findByOrderNumber = orderNumber => {
  return models.Order.findOne({
    where: {
      orderNumber,
    },
  });
};

module.exports.getAllOrders = getAllOrders;
module.exports.findByOrderId = findByOrderId;
module.exports.findByOrderNumber = findByOrderNumber;
