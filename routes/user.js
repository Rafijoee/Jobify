const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const middlewares = require("../middlewares/restrict");
const uploadAvatar  = require("../utils/uploads/avatar");
const { userValidation } = require("../validators/user");

router.put(
  "/change-profile",
  uploadAvatar.single("avatar"),
  userValidation,
  middlewares.allUser,
  userController.changeProfile
);

module.exports = router;
