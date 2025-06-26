// src/routes/auth.js
const express = require("express");
const { body } = require("express-validator");
const passport = require("passport");
const router = express.Router();
const authController = require("../controllers/auth");

const {
  registerValidation,
  loginValidation,
} = require("../validators/authValidator");
router.post("/register", registerValidation, authController.register);
router.post("/verify-otp", authController.verifyOtp);
router.post("/login", loginValidation, authController.login);
router.get(
  "/google",
  (req, res, next) => {
    console.log("🔵 Route /google hit");
    next();
  },
  authController.googleLogin
);

router.get(
  "/google/callback",
  (req, res, next) => {
    console.log("🟢 Route /google/callback hit");
    next();
  },
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  authController.googleCallback
);

module.exports = router;
