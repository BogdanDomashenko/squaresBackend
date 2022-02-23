const express = require("express");
const router = express.Router();
const md5 = require("md5");
const validator = require("validator");

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    res.status(411).send({ error: "email or password does not exist" });

  if (!validator.isEmail(email))
    res.status(406).send({ error: "incorrect email" });

  const token = md5(email);
  req.session.token = token;
  res.send({ token });

  //res.sendStatus(200);
});

router.get("/token", (req, res) => {
  if (!req.session.token)
    res.status(401).send({ error: "user is not authorized" });

  res.send(req.session.token);
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.sendStatus(200);
});

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

module.exports = router;
