const { teamsResolvers } = require('./teams');
const { authResolvers } = require('./auth');
const { usersResolvers } = require('./users');
const { ordersResolvers } = require('./orders');

exports.teamsResolvers = teamsResolvers;
exports.authResolvers = authResolvers;
exports.usersResolvers = usersResolvers;
exports.ordersResolvers = ordersResolvers;
