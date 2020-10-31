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
        },
        async deleteTeam(root, { id }) {
            models.Team.destroy({
                where: {
                   id: id //this will be your id that you want to delete
                }
             }).then(function(rowDeleted){ // rowDeleted will return number of rows deleted
               if(rowDeleted === 1){
                  return true;
                }
             }, function(err){
                 return false;
             });
        },
        async modifyTeam(root, { id, organization }) {
            return models.Team.create({
                name,
                organization
            })
        }
    }
}

exports.teamsResolvers = teamsResolvers