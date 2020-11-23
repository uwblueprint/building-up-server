const { sequelize } = require('../models');
const models = require('../models');
const teamsResolvers = {

    Query: {
        async getTeam(root, { id }) {
            return models.Team.findByPk(id)
        },
        async getAllTeams(root, args) {
            return models.Team.findAll()
        },
        async latestOrders(root, { id, amountPrev }) {
            return models.Orders.findAll({
                attributes: 
                [
                    'orderId', 'price', 'purchaseDate'
                ],
                where: 
                {
                    teamId: id
                },
                order: 
                [
                    ['purchaseDate', 'DESC']
                ],
                limit: amountPrev
            });
        
        },
    },

    Mutation: {
        async createTeam(root, { name, organization, amountRaised,itemsSold }) {
            return models.Team.create({
                name,
                organization,
                amountRaised,
                itemsSold
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
        
        async updateTeam(root, {id, name, organization, amountRaised, itemsSold}) {
           models.Team.update(
                {
                    name: name,
                    organization: organization,
                    amountRaised: amountRaised,
                    itemsSold: itemsSold
                },
                { 
                    where: 
                    {
                        id: id
                    }
                }
            );
        }
    }
}

exports.teamsResolvers = teamsResolvers;