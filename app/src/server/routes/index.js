const router = require("express").Router();

router.get("/", (req, res, next) => {
 
  res.render("index");
});

router.get("/one", (req, res, next) => {
  console.log(req.headers);

  return res.render("one");
});

router.get("/two", (req, res, next) => {
  console.log(req.headers);
  return res.render("two");
});

router.get("/three", (req, res, next) => {
  console.log(req.headers);
  return res.render("three");
});

router.use("/students", require("./students"));

router.use((req, res, next) => {
  return res.send("PAGE NOT FOUND");
});

module.exports = router;
