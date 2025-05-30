const router = require("express").Router();
const auth = require("./auth");
const project = require("./project");
const task = require("./task");

router.get("/", (req, res) => {
  res.json({
    message: "Hello World",
  });
});

router.use(auth);
router.use(project);
router.use(task);

module.exports = router;
