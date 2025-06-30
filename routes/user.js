const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const { allUser } = require("../middlewares/restrict");

