const { addTeam, getGlobalLeaderboard } = require('../redis/leaderboard');

const leaderboardResolvers = {
    Query: {
        async getGlobalLeaderboard(root, { first, offset }) {
            const res = await getGlobalLeaderboard(first, first + offset);
            console.log(res);
            return {
                sortedTeams: res.slice(first, first + offset)
            };
        }
    }
}

exports.leaderboardResolvers = leaderboardResolvers;
