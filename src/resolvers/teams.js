const { sequelize } = require('../models');
const models = require('../models');
const teamsResolvers = {

    Query: {
        async getTeam(root, { id }) {
            const team =  await models.Team.findByPk(id);
            if (team == null) {
                throw "Team not found";
            }
            return team;
        },
        async getAllTeams(root, args) {
            return models.Team.findAll();
        },
        async latestOrders(root, { id, amountPrev }) {
            return models.Orders.findAll({
                attributes: 
                [
                    'orderNumber', 'price', 'purchaseDate'
                ],
                where: 
                {
                    teamID: id
                },
                order: 
                [
                    ['purchaseDate', 'DESC']
                ],
                limit: amountPrev
            });
        
        },
        async getItemsSold(root, { id }) {
            return models.Orders.findAll({
                attributes:
                [
                    'teamID, numberOfItems', [sequelize.fn('SUM', sequelize.col('numberOfItems')), 'itemsSold']
                ],
                where:
                {
                    teamID: id
                },
                group:
                [
                    'teamID'
                ]
            });
        }
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
             })
             return true;
        },
        
        async updateTeam(root, {id, name, organization, amountRaised, itemsSold}) {
            const team = await models.Team.findOne({where: {id:id}});
            if (team == null) {
                throw "Team Not Found";
            }
            team.name = name;
            team.organization = organization;
            team.amountRaised = amountRaised;
            team.itemsSold = itemsSold;

            await team.save();
            return team;
        }
    }
}

exports.teamsResolvers = teamsResolvers;