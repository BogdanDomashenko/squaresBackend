const md5 = require("md5");
const validator = require("validator");
const jwt = require("jsonwebtoken");

function generateAccessToken(obj) {
  return jwt.sign(obj, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "5s" });
}

function generateRefreshToken(obj) {
  return jwt.sign(obj, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "20s" });
}

class auth {
  async login(req, res) {
    try {
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
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Login error" });
    }
  }

  logout(req, res) {
    try {
      req.session.destroy();
      res.sendStatus(200);
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Logout error" });
    }
  }
}

module.exports = new auth();
