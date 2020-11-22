const { sequelize } = require('../models');
const models = require('../models');
const usersResolvers = {
    Query: {
        async Users(root,{teamId}){
            return models.User.findAll({
                where: {
                    teamId: teamId
                }
            })
        }
    },
    Mutation: {
        async addUser(root, { firstName, lastName, email, password, role, teamId }) {
            return models.User.create({
                id,
                firstName,
                lastName,
                email,
                password,
                role,
                teamId
            })
        }
    }
}

exports.usersResolvers = usersResolvers;