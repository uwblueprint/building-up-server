const { findByOrderId, findByOrderNumber, getAllOrders } = require('../controllers/order');

const ordersResolvers = {
  Query: {
    async getOrder(_, { id }) {
      return findByOrderId(id);
    },
    async getOrderByOrderNumber(_, { orderNumber }) {
      return findByOrderNumber(orderNumber);
    },
    async getAllOrders() {
      return getAllOrders();
    },
  },

  Mutation: {},
};

exports.ordersResolvers = ordersResolvers;
