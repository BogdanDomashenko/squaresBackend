const express = require("express");
const router = express.Router();
const md5 = require("md5");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
dotenv.config();

function generateAccessToken(obj) {
  return jwt.sign(obj, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "5s" });
}

function generateRefreshToken(obj) {
  return jwt.sign(obj, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "20s" });
}

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  !email && res.status(411).send({ error: "email does not exist" });
  !password && res.status(411).send({ error: "password does not exist" });

  if (!validator.isEmail(email))
    res.status(406).send({ error: "incorrect email" });

  if (email && password) {
    const data = { email, password: md5(password) };
    const accessToken = generateAccessToken(data);
    const refreshToken = generateRefreshToken(data);

    req.session.refreshToken = refreshToken;
    res.set("Authorization", accessToken);
    res.sendStatus(200);
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
  const { authorization } = req.headers;

  if (authorization) {
    jwt.verify(authorization, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(401).send("access token not valid");
      return res.send(req.session.refreshToken);
    });
  } else {
    res.status(411).send({ error: "token does not exist" });
  }
});

router.get("/refresh", (req, res) => {
  if (req.session.refreshToken) {
    jwt.verify(
      req.session.refreshToken || " ",
      process.env.REFRESH_TOKEN_SECRET,
      (err, user) => {
        if (err) return res.sendStatus(401);

        const { email, password } = user;
        const data = { email, password };

        const accessToken = generateAccessToken(data);
        const refreshToken = generateRefreshToken(data);

        req.session.refreshToken = refreshToken;
        res.set("Authorization", accessToken);
        res.sendStatus(200);
      }
    );
  } else {
    res.status(401).send({ error: "token does not exist" });
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
