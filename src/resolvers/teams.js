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
                   id: id 
                }
             }).then(function(rowDeleted){ 
               if(rowDeleted === 1){
                  return true;
                }
             }, function(err){
                 return false;
             });
        },
        async modifyName(root, { id, value }) {
            models.Team.update(
                {
                    name:  value
                },
                { 
                    where: 
                    {
                        id: id
                    }
                }
            ).then(count => {
                console.log('Rows updated ' + count);
            });
        },
        async modifyOrganization(root, { id, value }) {
            models.Team.update(
                {
                    organization:  value
                },
                { 
                    where: 
                    {
                        id: id
                    }
                }
            ).then(count => {
                console.log('Rows updated ' + count);
            });
        },
        async modifyAmountRaised(root, { id, value }) {
            models.Team.update(
                {
                    amountRaised:  value
                },
                { 
                    where: 
                    {
                        id: id
                    }
                }
            ).then(count => {
                console.log('Rows updated ' + count);
            });
        }
    }
}

exports.teamsResolvers = teamsResolvers