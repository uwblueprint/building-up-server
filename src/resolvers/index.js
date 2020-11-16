const { helloWorldResolvers } = require('./helloWorld');
const { teamsResolvers } = require('./teams');
const { authResolvers } = require('./auth');
const { paymentsResolvers } = require("./payments");
const { leaderboardResolvers } = require("./leaderboard");

exports.helloWorldResolvers = helloWorldResolvers;
exports.teamsResolvers = teamsResolvers;
exports.authResolvers = authResolvers;
exports.paymentsResolvers = paymentsResolvers;
exports.leaderboardResolvers = leaderboardResolvers;
