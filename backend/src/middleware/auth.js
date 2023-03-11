const jwt = require("jsonwebtoken");
const { secret } = require("../services/tokenFactory");

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).json({ error: "Authentication required" });
  }
  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
  } catch (err) {
    return res.status(401).json({ error: "Invalid authentication" });
  }
  return next();
};

module.exports = verifyToken;
