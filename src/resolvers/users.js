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
        },
        async getUser(root, {id}) {
            return models.User.findByPk(id)
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
        },
        async updateUser(root, { id, firstName, lastName, email, password, role, teamId}) {
             models.User.update(
                {
                    id: id,
                     firstName: firstName, 
                     lastName: lastName, 
                     email: email, 
                     password: password, 
                     role: role, 
                     teamId: teamId
                },
                { 
                    where: 
                    {
                        id: id
                    }
                }
            )
        }
    }
}

exports.usersResolvers = usersResolvers;