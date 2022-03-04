const express = require("express");
const router = express.Router();
const md5 = require("md5");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
dotenv.config();
process.env.TOKEN_SECRET;

function generateAccessToken(email) {
  return jwt.sign({ email }, process.env.TOKEN_SECRET, { expiresIn: "1800s" });
}

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    res.status(411).send({ error: "email or password does not exist" });

  if (!validator.isEmail(email))
    res.status(406).send({ error: "incorrect email" });

  //const token = md5(email);
  const token = generateAccessToken({ email });
  req.session.token = token;
  res.json(token);
  //res.send({ token });
});

router.get("/token", (req, res) => {
  const token = req.session.token;

  //if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    console.log(err);

    if (err) return res.sendStatus(401);

    res.send(req.session.token);

    next();
  });
});

// OLD TOKEN
// router.get("/token", (req, res) => {
//   if (!req.session.token)
//     res.status(401).send({ error: "user is not authorized" });

//   res.send(req.session.token);
// });

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.sendStatus(200);
});

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

module.exports = router;
