const express = require("express");
const auth = require("../middleware/auth");
const { getUserInfo } = require("../services/userHandler");

const router = express.Router();

router.get("/", auth, (req, res) => {
  res.json({ message: getUserInfo(req.user.email) });
});

module.exports = router;
