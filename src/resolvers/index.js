const { helloWorldResolvers } = require('./helloWorld')
const { teamsResolvers } = require('./teams')
const {authResolvers} = require('./auth')

exports.helloWorldResolvers = helloWorldResolvers
exports.teamsResolvers = teamsResolvers
exports.authResolvers = authResolvers