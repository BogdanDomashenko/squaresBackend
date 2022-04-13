const jwt = require("jsonwebtoken");
const tokenUtil = require("../utils/token");

class token {
  access(req, res) {
    try {
      const { authorization } = req.headers;

      if (authorization) {
        jwt.verify(
          authorization,
          process.env.ACCESS_TOKEN_SECRET,
          (err, user) => {
            if (err)
              return res.status(400).json({ error: "Access token not valid" });
            return res.send(req.session.refreshToken);
          }
        );
      } else {
        res.status(411).send({ error: "token does not exist" });
      }
    } catch (e) {
      console.log(e);
      res.status(400).json({ error: "Access token error" });
    }
  }

  refresh(req, res) {
    try {
      if (req.cookies.refreshToken) {
        jwt.verify(
          req.cookies.refreshToken || " ",
          process.env.REFRESH_TOKEN_SECRET,
          (err, user) => {
            if (err) return res.sendStatus(401);

            const { email, password } = user;
            const data = { email, password };

            const accessToken = tokenUtil.generateAccessToken(data);
            const refreshToken = tokenUtil.generateRefreshToken(data);

            res.cookie("refreshToken", refreshToken, {
              maxAge: 24 * 60 * 60 * 1000,
              httpOnly: true,
            });
            res.set("Authorization", accessToken);
            res.sendStatus(201);
          }
        );
      } else {
        res.status(401).send({ error: "token does not exist" });
      }
    } catch (e) {
      console.log(e);
      res.status(400).json({ error: "Token refresh error" });
    }
  }
}

module.exports = new token();
