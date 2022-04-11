const express = require("express");
const router = express.Router();
const controller = require("../controllers/user");
const authAccessToken = require("../middlewares/authAccessToken");

router.get("/data", authAccessToken, controller.data);

module.exports = router;
