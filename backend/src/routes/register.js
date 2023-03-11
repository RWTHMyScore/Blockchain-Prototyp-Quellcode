const express = require("express");
const { createUser } = require("../services/userHandler");

const router = express.Router();

router.post("/", (req, res) => {
  if (
    !(
      req.body.firstname &&
      req.body.lastname &&
      req.body.email &&
      req.body.password
    )
  ) {
    res.status(400).json({ error: "Request incomplete" });
  }

  let rowId;
  try {
    rowId = createUser(
      req.body.firstname,
      req.body.lastname,
      req.body.email,
      req.body.password
    );
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
    return;
  }

  res.json({ message: rowId });
});

module.exports = router;
