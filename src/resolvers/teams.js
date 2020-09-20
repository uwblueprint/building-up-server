const teamsResolvers = {

    Query: {
        async getTeam(root, { id }, { models }) {
            return models.Team.findByPk(id)
        },
        async getAllTeams(root, args, { models }) {
            return models.Team.findAll()
        }
    },

    Mutation: {
        async createTeam(root, { name, organization }, { models }) {
            return models.Team.create({
                name,
                organization
            })
        }
    }
}

exports.teamsResolvers = teamsResolvers