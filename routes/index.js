const router = require("express").Router();
const auth = require("./auth");
const user = require("./user");

router.get("/", (req, res) => {
  res.json({
    message: "Hello World",
    jwt : req.query.token || 'belum login',
  });
});

router.use('/auth', auth);
router.use("/user", user);

module.exports = router;
