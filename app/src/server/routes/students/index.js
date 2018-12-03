const router = require("express").Router();
const Students = require("../../services/students");

router
  .route("/")
  .get(async (req, res, next) => {
    res.locals.students = await Students.getAll();
    return res.render("./students");
  })
  .post(async (req, res, next) => {
    try {
      const students = await Students.create(req.body);
      res.locals.student = await Students.getById(students._id);
      return res.render("./partials/table-row-template");
    } catch (error) {
      next(error);
    }
  })
  .delete(async (req, res, next) => {
    try {
      await Students.deleteById(req.query.id);
      return res.json({});
    } catch (error) {
      next(error);
    }
  });

router.route("/add").get(async (req, res, next) => {
  res.locals.deps = await Students.getDeps();
  res.locals.title = "Create";
  return res.render("./partials/students-create-modal");
});

router
  .route("/edit/:id")
  .get(async (req, res, next) => {
    console.log("EDIT HERE>>\n\n");
    res.locals.type = "edit";
    res.locals.title = "Edit";
    res.locals.student = await Students.getById(req.params.id);
    res.locals.deps = await Students.getDeps();
    return res.render("./partials/students-create-modal");
  })
  .put(async (req, res, next) => {
    try {
      await Students.updateById(req.params.id, req.body);
      res.locals.student = await Students.getById(req.params.id);
      return res.render("./partials/table-row-template");
    } catch (error) {
      next(error);
    }
  });

router
  .route("/departments")
  .get(async (req, res, next) => {
    const deps = await Students.getDeps();
    res.locals.deps = deps;
    return res.render("./partials/deps-data");
  })
  .post(async (req, res, next) => {
    try {
      const departments = req.body.fuels.split(",").map(el => ({ name: el }));
      await Students.depsBulkCreate(departments);
      res.locals.deps = await Students.getDeps();
      return res.render("./partials/deps-data");
    } catch (error) {
      next(error);
    }
  });

router
  .route("/departments/:id")
  .put(async (req, res, next) => {
    try {
      await Students.depUpdateById(req.params.id, req.body);
      return res.json({});
    } catch (error) {
      next(error);
    }
  })
  .delete(async (req, res, next) => {
    try {
      await Students.depDeleteById(req.params.id);
      return res.json({});
    } catch (error) {
      next(error);
    }
  });
module.exports = router;
