const express = require("express");
const { validateLogin, getUserInfo } = require("../services/userHandler");
const { generateAuthToken } = require("../services/tokenFactory");

const router = express.Router();

router.post("/", (req, res) => {
  if (!(req.body.email && req.body.password)) {
    res.status(400).json({ error: "Request incomplete" });
  }

  const valid = validateLogin(req.body.email, req.body.password);
  if (valid) {
    const userInfo = getUserInfo(req.body.email);
    userInfo.token = generateAuthToken(req.body.email);
    res.json({ message: userInfo });
  } else {
    res.status(401).json({ error: "Login failed" });
  }
});

module.exports = router;
