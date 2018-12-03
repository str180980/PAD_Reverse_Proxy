/****************
 * This is the entry point of our Reverse-Proxy
 * How it works:
 * 1. Running a http server on port 80
 * 2. Reading the config.js file and forwarding all the requests that matches the url to the addresses from proxy_to
 * 3. lbCounter from config.js is used for Load Balancing, we use Round Robin algorithm, so we just iterate over proxy_to array and
 * are forwarding successively requests to each of the server instances (besides, adresses from proxy_to reprsents the same app wich is running
 * on three different port, so we have three nodes of the app)
 * 5. For caching we use Redis, we are caching only GET requests, so when we process an incoming request if it's for ex. GET /students 
 * we check if we haven a key-value pair in Redis(key is the url, value is the resources from this url(in our case html)), if not we forward
 * the request to our app server, when we get back the response we save the resource in Redis so we can return the following requests on this url
 * from redis. We invalidate the cache on POST/PUT/DELETE, for ex. if we have a POST /students we remove from the Redis the record wich we inserted
 * on GET /students 
 *  ***********/


const express = require("express");
const config = require("./config");
const fetch = require("node-fetch");
const LBalancer = require("./load-balancer");
const redisClient = require("./redis-wrapper");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const getRelPath = (url, sliceNr) => {
  const path = url
    .split("/")
    .slice(sliceNr)
    .join("/");

  return path;
};

const fetchData = (addr, relPath, options, res) => {
  return fetch(`${addr}/${relPath}`, options, res)
    .then(data => {
      return data.text();
    })
    .then(async val => {
      if (options.method === "GET")
        await redisClient.setKey(`/${relPath}`, val);
      else {
        if (relPath.includes("students")) {
          const keys = await redisClient.matchKeys("/students*");
          if (keys.length > 0) await redisClient.deleteKey(keys);
        }
        await redisClient.deleteKey(`/${relPath}`);
      }
      console.log("GETTING DATA FROM REMOTE SERVER!!");
      return res.send(val);
    });
};

const logger = (req, node) => {
  console.log(
    `${req.headers.host}${req.url} proxy to ${node.proxy_to[node.lbCounter]}`
  );
};

const setRoute = (node, sliceIndex = 2) => {
  const Balancer = new LBalancer(node);
  app.all(`${node.url}*`, async (req, res, next) => {
    const path = getRelPath(req.originalUrl, sliceIndex);
    logger(req, node);
    const options = {
      method: req.method
    };
    if (Object.keys(req.body).length > 0) {
      options.body = JSON.stringify(req.body);
      options.headers = { "Content-Type": "application/json" };
    }
    const proxyAddr = Balancer.getAddress();
    if (options.method === "GET") {
      const cacheData = await redisClient.checkForKey(`/${path}`);
      if (cacheData) {
        return res.send(cacheData);
      }
    }
    return fetchData(proxyAddr, path, options, res).catch(err => {
      const newProxyAddr = Balancer.getAddress();
      console.log(
        `\n\n>>>>>${proxyAddr} isn't available! Trying another node\n\n`
      );
      return fetchData(newProxyAddr, path, options, res);
    });
  });
};

const routeBuilder = location => {
  let root = null;
  config.server.location.forEach(el => {
    if (el.url === "/") {
      root = el;
      return;
    }
  });
  if (root) setRoute(root, 1);
};

app.listen(config.server.listen, err => {
  if (err) {
    console.log("Error");
    console.log(err);
  }
  console.log(`Connected on poort ${config.server.listen}`);
  routeBuilder(config);
});
