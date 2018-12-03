const router = require("express").Router();
const Students = require("../../services/students");

router
  .route("/")
  .get(async (req, res, next) => {
    console.log("STUDENTS HERE>>>\n\n");
    res.locals.students = await Students.getAll();
    console.log(res.locals.students);
    return res.render("./students");
  })
  .post(async (req, res, next) => {
    try {
      console.log("POST BODY>>>\n\n");
      console.log(req.body);
      const students = await Students.create(req.body);
      res.locals.student = await Students.getById(students._id);
      console.log("STUDENTS HERE>>>\n\n");
      console.log(res.locals.student);
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
      console.log("STUDENT UPDATE HERE>>>\n\n");
      console.log(req.body);
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
    console.log("getting deps here>>>>>>\n\n");
    const deps = await Students.getDeps();
    console.log("DEPPPPPS>\n\n");
    console.log(deps);
    res.locals.deps = deps;
    return res.render("./partials/deps-data");
  })
  .post(async (req, res, next) => {
    try {
      console.log("POST DEPS HERE>>\n\n");
      console.log(req.body);
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
      console.log("UPDATE DEPPP\n\n\n");
      console.log(req.body);
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
