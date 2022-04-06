const express = require("express");
const router = express.Router();
const controller = require("../controllers/token");

router.post("/access", controller.access);
router.get("/refresh", controller.refresh);

module.exports = router;
