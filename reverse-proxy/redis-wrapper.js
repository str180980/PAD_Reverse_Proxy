const redis = require("redis");
const client = redis.createClient();
const { promisify } = require("util");

client.on("error", function(err) {
  console.log("REDIS Error " + err);
});

const pget = promisify(client.get).bind(client);
const pset = promisify(client.set).bind(client);
const pdel = promisify(client.del).bind(client);
const pkeys = promisify(client.keys).bind(client);

class redisModule {
  async matchKeys(pattern) {
    try {
      return await pkeys(pattern);
    } catch (error) {
      throw error;
    }
  }
  async checkForKey(key) {
    try {
      return await pget(key);
    } catch (error) {
      throw error;
    }
  }

  async setKey(key, val) {
    try {
      return await pset(key, val);
    } catch (error) {
      throw error;
    }
  }

  async deleteKey(key) {
    try {
      return await pdel(key);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new redisModule();
