/************* 
* This is the entry point of our application
* How it works:
* With current configuration there should be 3 instances of this app on ports 8080,8081,8082
* The instances are communicating only with the Revers Proxy.
* We use MongoDB as a Database, there are a cluster of three instaces of MongoDB based on Master-Slave architecture, 
each app instance is fetching data from one instance of MongoDB 
* Well, it's kinda hard to explain here how MongoDB handles replication and synchronization, you can read more about it
here https://docs.mongodb.com/manual/replication/
**********/ 


const express = require("express");
const mongoose = require("mongoose");
const app = express();
const opts = {};
mongoose.connect(
  "mongodb://localhost:27017,localhost:27018,localhost:27019/pad-project?replicaSet=padRepl",
  {
    db: {
      readPreference: {
        preference: "secondaryPreferred",
        tags: [{ location: process.argv[3] }]
      }
    }
  }
);
mongoose.set("debug", true);

app.set("view engine", "ejs");
app.set("views", "./src/server/views");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  console.log("HERE WE ARE!!!");
  next();
});
app.use(express.static("./public"));
app.use(require("./src/server/routes"));

app.listen(process.argv[2], err => {
  if (err) {
    console.log("Error");
    console.log(err);
  }
  console.log(`Connected on poort 8080`);
});
