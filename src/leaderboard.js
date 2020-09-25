const { redis } = require('./redis');

const addTeam = (org, score, name) => {
    redis.zadd([org, score, name])
        .then(console.log)
        .catch(console.error);
}

const updateTeamScore = (org, score, name) => {
    redis.zincrby([org, score, name])
        .then(console.log)
        .then(console.error)
}

const getSortedTeamsByScore = (org) => {
    redis.zrevrange([org, 0, -1])
        .then(console.log)
        .then(console.error)
}

exports.addTeam = addTeam;
exports.updateTeamScore = updateTeamScore;
exports.getSortedTeamsByScore = getSortedTeamsByScore;
