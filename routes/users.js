const express = require("express");
const router = express.Router();
const controller = require("../controllers/users");
const authAccessToken = require("../middlewares/authAccessToken");

router.post("/list-by-ids", controller.getListByIds);

module.exports = router;
