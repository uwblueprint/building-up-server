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
            const user = await models.User.findByPk(id);
            if (user == null) {
                throw "User Not Found";
            }
            return user;
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

            const user = await models.User.findOne({where: {id:id}});
            if (user == null) {
                throw "User Not Found";
            }
            
            user.firstName = firstName;
            user.lastName = lastName;
            user.email = email;
            user.password = password;
            user.role = role;
            user.teamId = teamId;

            await user.save();
            return user;
        }
    }
}

exports.usersResolvers = usersResolvers;