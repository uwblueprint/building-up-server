const models = require('./index');

const findByOrderNumber = orderNumber => {
  return models.Order.findOne({
    where: {
      orderNumber,
    },
  });
};

exports.findByOrderNumber = findByOrderNumber;
