const router = require("express").Router();
const auth = require("./auth");

router.get("/", (req, res) => {
  res.json({
    message: "Hello World",
  });
});

router.use(auth);

module.exports = router;
