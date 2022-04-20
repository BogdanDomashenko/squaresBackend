const md5 = require("md5");
const validator = require("validator");
const User = require("../models/User");
const token = require("../utils/token");
const generator = require("generate-password");
const bcrypt = require("bcrypt");

function generatePassword() {
  return (
    generator.generate() +
    generator.generate({
      length: 2,
      uppercase: false,
      lowercase: false,
      numbers: false,
      symbols: 2,
    })
  );
}

class AutController {
  async signup(req, res) {
    try {
      const { email } = req.body;

      if (!email)
        return res.status(400).json({ message: "email does not exist" });
      if (!validator.isEmail(email))
        return res.status(400).json({ message: "incorrect email" });
      if (await User.findOne({ email }))
        return res
          .status(400)
          .json({ message: "This email is already registered" });

      const username = email.split("@")[0];
      const password = generatePassword();
      const hashPassword = await bcrypt.hash(password, 3);

      const user = await User.create({
        email,
        username,
        password: hashPassword,
      });

      const data = { email, password: hashPassword };
      const accessToken = token.generateAccessToken(data);
      const refreshToken = token.generateRefreshToken(data);

      res.cookie("refreshToken", refreshToken, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      res.set("Authorization", accessToken);

      return res
        .status(200)
        .json({ email, username, password, role: user.role });
    } catch (e) {
      console.log(e);
      return res.status(400).json({ message: "Sign Up error" });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email)
        return res.status(400).json({ message: "email does not exist" });
      if (!password)
        return res.status(400).json({ message: "password does not exist" });
      if (!validator.isEmail(email))
        return res.status(400).json({ message: "incorrect email" });

      const user = await User.findOne({ email });
      if (!user)
        return res
          .status(400)
          .json({ message: "User with this email does not exist" });

      const isPassEquals = await bcrypt.compare(password, user.password);
      if (!isPassEquals) {
        return res.status(400).json({ message: "Incorrect password" });
      }

      const data = { email, password: user.password };
      const accessToken = token.generateAccessToken(data);
      const refreshToken = token.generateRefreshToken(data);

      res.cookie("refreshToken", refreshToken, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      res.set("Authorization", accessToken);
      return res.status(200).json({
        username: user.username,
        email: user.email,
        role: user.role,
      });
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

module.exports = new AutController();
