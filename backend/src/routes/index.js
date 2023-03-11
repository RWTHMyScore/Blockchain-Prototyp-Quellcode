const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Blockchain Transfer Server API is up" });
});

module.exports = router;
