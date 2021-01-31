const { promisify } = require('util');
const redisModule = require('redis');

const client = redisModule.createClient({ host: 'building-up-redis', port: 6379 });

const redis = {
  get: promisify(client.get).bind(client),
  set: promisify(client.set).bind(client),
  zadd: promisify(client.zadd).bind(client),
  zincrby: promisify(client.zincrby).bind(client),
  zrevrange: promisify(client.zrevrange).bind(client),
};

exports.redis = redis;
