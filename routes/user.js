const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const middlewares = require("../middlewares/restrict");
const uploadAvatar  = require("../utils/uploads/avatar");
const Validation  = require("../validators/user");

router.put(
  "/change-profile",
  uploadAvatar.single("avatar"),
  Validation.userValidation,
  middlewares.allUser,
  userController.changeProfile
);
router.put('/change-password',Validation.changePasswordValidation, middlewares.allUser, userController.changePassword);
router.get('/profile', middlewares.allUser, userController.getProfile);
router.get('/users/:id', middlewares.admin, userController.getUserById);
router.get('/users', middlewares.admin, userController.getAllUsers);
router.post('/forgot-password', Validation.forgotPasswordValidation, userController.forgotPassword);
router.post('/verify-reset-otp',Validation.otp, userController.verifyResetOtp);
router.post('/reset-password',Validation.resetPasswordValidation, userController.resetPassword);

module.exports = router;
