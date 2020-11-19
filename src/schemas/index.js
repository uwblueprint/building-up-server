const { helloWorldTypeDefs } = require('./helloWorld')
const { teamsTypeDefs } = require('./teams')
const { ordersTypeDefs } = require('./orders');
const { authTypeDefs } = require('./auth')
const { paymentsTypeDefs } = require("./payments");
const { leaderboardTypeDefs } = require("./leaderboard");

exports.helloWorldTypeDefs = helloWorldTypeDefs;
exports.teamsTypeDefs = teamsTypeDefs;
exports.ordersTypeDefs = ordersTypeDefs;
exports.authTypeDefs = authTypeDefs;
exports.paymentsTypeDefs = paymentsTypeDefs;
exports.leaderboardTypeDefs = leaderboardTypeDefs;
