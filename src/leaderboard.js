const { redis } = require('./redis');

// Returns int containing the number of new teams added
const addTeam = async (org, score, name) => {
    try {
        const res = await redis.zadd([org, score, name]);
        return res;
    } catch (err) {
        console.error(err);
    }
}

// Returns int containing new score after update
const updateTeamScore = async (org, score, name) => {
    try {
        const res = await redis.zincrby([org, score, name]);
        return parseInt(res);
    } catch (err) {
        console.error(err);
    }
}

// Returns array of team names sorted by score descending
const getSortedTeamsByScore = async (org) => {
    try {
        const res = await redis.zrevrange([org, 0, -1]);
        return res;
    } catch (err) {
        console.error(err);
    }
}

exports.addTeam = addTeam;
exports.updateTeamScore = updateTeamScore;
exports.getSortedTeamsByScore = getSortedTeamsByScore;
