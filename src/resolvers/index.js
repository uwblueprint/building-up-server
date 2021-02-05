const { teamsResolvers } = require('./teams');
const { authResolvers } = require('./auth');
const { paymentsResolvers } = require('./payments');
const { leaderboardResolvers } = require('./leaderboard');
const { usersResolvers } = require('./users');

exports.teamsResolvers = teamsResolvers;
exports.authResolvers = authResolvers;
exports.paymentsResolvers = paymentsResolvers;
exports.leaderboardResolvers = leaderboardResolvers;
exports.usersResolvers = usersResolvers;
