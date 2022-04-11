const jwt = require("jsonwebtoken");

function authAccessToken(req, res, next) {
  try {
    const { authorization } = req.headers;

    if (authorization) {
      jwt.verify(
        authorization,
        process.env.ACCESS_TOKEN_SECRET,
        (err, user) => {
          if (err)
            return res.status(400).json({ error: "Access token not valid" });
          next();
        }
      );
    } else {
      res.status(411).send({ error: "Token does not exist" });
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: "Access token error" });
  }
}

module.exports = authAccessToken;
