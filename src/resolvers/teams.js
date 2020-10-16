const models = require('../models');
const teamsResolvers = {

    Query: {
        async getTeam(root, { id }) {
            return models.Team.findByPk(id)
        },
        async getAllTeams(root, args) {
            return models.Team.findAll()
        }
    },

    Mutation: {
        async createTeam(root, { name, organization }) {
            return models.Team.create({
                name,
                organization
            })
        }
    }
}

exports.teamsResolvers = teamsResolvers