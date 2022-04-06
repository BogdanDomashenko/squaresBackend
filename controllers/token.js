const jwt = require("jsonwebtoken");

function generateAccessToken(obj) {
  return jwt.sign(obj, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "5s" });
}

function generateRefreshToken(obj) {
  return jwt.sign(obj, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "20s" });
}

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
              return res.status(401).json({ error: "Access token not valid" });
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
    } catch (e) {
      console.log(e);
      res.status(400).json({ error: "Token refresh error" });
    }
  }
}

module.exports = new token();
