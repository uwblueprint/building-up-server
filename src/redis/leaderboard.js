const { redis } = require('./redis');

const GLOBAL_LEADERBOARD = 'global-leaderboard';

/**
 * Creates a team key for redis sorted set
 * @param  {number} teamId
 * @param  {string} teamName
 * @return {string} Stringified JSON object usable as a key in Redis
 */
const createTeamKey = (teamId, teamName) => JSON.stringify({ teamId, teamName });

/**
 * Adds a new team
 * @param  {number} teamId
 * @param  {string} teamName
 * @param  {number} [score=0]
 * @return {number} Number of new teams added
 */
const addTeam = async (teamId, teamName, score = 0) => {
  try {
    const teamKey = createTeamKey(teamId, teamName);
    const globalResult = await Promise(redis.zadd([GLOBAL_LEADERBOARD, score, teamKey]));
    return globalResult;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
};

/**
 * Increments a teams score
 * @param  {number} teamId
 * @param  {string} teamName
 * @param  {number} [score=1]

 * @return {number} New score after update
 */
const incrementTeamScore = async (teamId, teamName, score = 1) => {
  try {
    const teamKey = createTeamKey(teamId, teamName);
    const globalResult = await redis.zincrby([GLOBAL_LEADERBOARD, score, teamKey]);
    return parseInt(globalResult, 10);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
};

/**
 * Decrements a teams score
 * @param  {number} teamId
 * @param  {string} teamName
 * @param  {number} [score=-1]

 * @return {number} New score after update
 */
const decrementTeamScore = async (teamId, teamName, score = -1) => {
  try {
    const teamKey = createTeamKey(teamId, teamName);
    const globalResult = await redis.zincrby([GLOBAL_LEADERBOARD, score, teamKey]);
    return parseInt(globalResult, 10);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
};

/**
 * Parses a redis zrange list to a leaderbaord
 * @param {Array} leaderboard even indices store keys, odd indices stores scores
 * @return {Array} array of objects containing parsed teamKeys and scores
 */
const parseLeaderboard = async leaderboard => {
  const teams = leaderboard.filter((_, i) => i % 2 === 0).map(teamKey => JSON.parse(teamKey));
  const scores = leaderboard.filter((_, i) => i % 2 === 1).map(score => parseInt(score, 10));

  return teams.map((team, i) => ({
    teamId: team.teamId,
    teamName: team.teamName,
    score: scores[i],
  }));
};

const getGlobalLeaderboard = async () => {
  try {
    const res = await redis.zrevrange([GLOBAL_LEADERBOARD, 0, -1, 'withscores']);
    return parseLeaderboard(res);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
};

exports.addTeam = addTeam;
exports.incrementTeamScore = incrementTeamScore;
exports.decrementTeamScore = decrementTeamScore;
exports.getGlobalLeaderboard = getGlobalLeaderboard;
