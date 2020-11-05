const { redis } = require("./redis");

const GLOBAL_LEADERBOARD = "global-leaderboard";

/**
 * Creates a team key for redis sorted set
 * @param  {number} teamId
 * @param  {string} teamName
 * @return {string} Stringified JSON object usable as a key in Redis
 */
const _createTeamKey = (teamId, teamName) =>
  JSON.stringify({ teamId, teamName });

/**
 * Adds a new team
 * @param  {number} orgId
 * @param  {number} teamId
 * @param  {string} teamName
 * @param  {number} [score=0]
 * @return {number} Number of new teams added
 */
const addTeam = async (orgId, teamId, teamName, score = 0) => {
  try {
    const teamKey = _createTeamKey(teamId, teamName);
    const [orgResult, globalResult] = await Promise.all([
      redis.zadd([orgId, score, teamKey]),
      redis.zadd([GLOBAL_LEADERBOARD, score, teamKey])
    ]);
    return orgResult;
  } catch (err) {
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
    const teamKey = _createTeamKey(teamId, teamName);
    const [orgResult, globalResult] = await Promise.all([
      redis.zincrby([GLOBAL_LEADERBOARD, score, teamKey])
    ]);
    return parseInt(orgResult);
  } catch (err) {
    console.error(err);
  }
};

/**
 * Parses a redis zrange list to a leaderbaord
 * @param {Array} leaderboard even indices store keys, odd indices stores scores
 * @return {Array} array of objects containing parsed teamKeys and scores
 */
const _parseLeaderboard = async leaderboard => {
  teams = leaderboard
    .filter((_, i) => i % 2 == 0)
    .map(teamKey => JSON.parse(teamKey));
  scores = leaderboard
    .filter((_, i) => i % 2 == 1)
    .map(score => parseInt(score));

  return teams.map((team, i) => {
    score = scores[i];
    return { team, score };
  });
};

/**
 * Gets an organizations leaderboard
 * @param {number} orgId
 * @return {Array} array of objects containing parsed teamKeys and scores
 */
const getOrgLeaderboard = async orgId => {
  try {
    const res = await redis.zrevrange([orgId, 0, -1, "withscores"]);
    return _parseLeaderboard(res);
  } catch (err) {
    console.error(err);
  }
};

/**
 * Gets global leaderboard
 * @param {number} orgId
 * @return {Array} array of objects containing parsed teamKeys and scores
 */
const getGlobalLeaderboard = async () => {
  try {
    const res = await redis.zrevrange([
      GLOBAL_LEADERBOARD,
      0,
      -1,
      "withscores"
    ]);
    return _parseLeaderboard(res);
  } catch (err) {
    console.error(err);
  }
};

exports.addTeam = addTeam;
exports.incrementTeamScore = incrementTeamScore;
exports.getOrgLeaderboard = getOrgLeaderboard;
exports.getGlobalLeaderboard = getGlobalLeaderboard;
