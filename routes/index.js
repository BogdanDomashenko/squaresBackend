const express = require("express");
const router = express.Router();

const dotenv = require("dotenv");
dotenv.config();

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

module.exports = router;
