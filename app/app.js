const express = require("express");
const mongoose = require("mongoose");
const app = express();
console.log("WTFFF???\n\n\n");
console.log(process.argv[2]);
// const opts = { replset: { readPreference: "ReadPreference.SECONDARY" } };
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
// const config = {
//   _id: "padRepl",
//   members: [
//     {
//       _id: 0,
//       host: "localhost:27017"
//     },
//     { _id: 1, host: "localhost:27018" },
//     {
//       _id: 2,
//       host: "localhost:27019"
//     }
//   ]
// };
