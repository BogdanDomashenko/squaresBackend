const express = require("express");
const router = express.Router();
const md5 = require("md5");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
dotenv.config();
process.env.TOKEN_SECRET;

function generateAccessToken(obj) {
  return jwt.sign(obj, process.env.TOKEN_SECRET, { expiresIn: "5s" });
}

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  !email && res.status(411).send({ error: "email does not exist" });
  !password && res.status(411).send({ error: "password does not exist" });

  if (!validator.isEmail(email))
    res.status(406).send({ error: "incorrect email" });

  if (email && password) {
    const token = generateAccessToken({ email, password: md5(password) });
    req.session.token = token;
    res.json({ token });
  }
});

// router.get("/token", (req, res) => {
//   const token = req.session.token;

//   jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
//     if (err) return res.sendStatus(401);

//     res.send(req.session.token);

//     next();
//   });
// });

router.post("/token", (req, res) => {
  const { token } = req.body;

  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(401);

      const { email, password } = user;
      //console.log("USER:", user);
      //res.send(req.session.token);
      return res.send({ token: generateAccessToken({ email, password }) });
    });
  } else {
    res.status(411).send({ error: "token does not exist" });
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.sendStatus(200);
});

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

module.exports = router;
