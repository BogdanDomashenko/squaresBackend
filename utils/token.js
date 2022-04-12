const jwt = require("jsonwebtoken");

exports.generateAccessToken = (obj) => {
  return jwt.sign(obj, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "20m" });
};

exports.generateRefreshToken = (obj) => {
  return jwt.sign(obj, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "24h" });
};
