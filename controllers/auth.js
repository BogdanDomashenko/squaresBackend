const md5 = require("md5");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

function generateAccessToken(obj) {
  return jwt.sign(obj, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "5s" });
}

function generateRefreshToken(obj) {
  return jwt.sign(obj, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "10s" });
}

class auth {
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email)
        return res.status(411).json({ message: "email does not exist" });
      if (!password)
        return res.status(411).json({ message: "password does not exist" });
      if (!validator.isEmail(email))
        return res.status(406).json({ message: "incorrect email" });

      const user = await User.findOne({ email });
      if (!user)
        return res
          .status(400)
          .json({ message: "User with this email does not exist" });

      if (user.password === password) {
        const data = { email, password: md5(password) };
        const accessToken = generateAccessToken(data);
        const refreshToken = generateRefreshToken(data);

        res.cookie("refreshToken", refreshToken, {
          maxAge: 30000,
          httpOnly: true,
        });
        res.set("Authorization", accessToken);
        return res.status(200).json({
          username: user.username,
          email: user.email,
          role: user.role,
        });
      } else {
        return res.status(400).json({ message: "Incorrect password" });
      }
    } catch (e) {
      console.log(e);
      return res.status(400).json({ message: "Login error" });
    }
  }

  logout(req, res) {
    try {
      res.clearCookie("refreshToken");
      res.sendStatus(200);
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Logout error" });
    }
  }
}

module.exports = new auth();
