const router = require("express").Router();
const auth = require("./auth");

router.get("/", (req, res) => {
  res.json({
    message: "Hello World",
    jwt : req.query.token || 'belum login',
  });
});

router.use('/auth', auth);

module.exports = router;
