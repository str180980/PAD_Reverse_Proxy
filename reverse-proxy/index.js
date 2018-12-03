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
          console.log("KEYS HERE>>>>\n\n\n\n");
          console.log(keys);
          if (keys.length > 0) await redisClient.deleteKey(keys);
        }
        await redisClient.deleteKey(`/${relPath}`);
      }
      console.log("GETTING DATA FROM REMOTE SERVER!!");
      return res.send(val);
    });
};

const logger = (req, node) => {
  //  console.log(node);
  console.log(
    `${req.headers.host}${req.url} proxy to ${node.proxy_to[node.lbCounter]}`
  );
};

const setRoute = (node, sliceIndex = 2) => {
  const Balancer = new LBalancer(node);
  app.all(`${node.url}*`, async (req, res, next) => {
    const path = getRelPath(req.originalUrl, sliceIndex);
    logger(req, node);
    console.log(node.proxy_to[node.lbCounter]);
    console.log(node.lbCounter);
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
        console.log("GETTING DATA FROM CACHE!!");
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
    // setRoute(el);
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
