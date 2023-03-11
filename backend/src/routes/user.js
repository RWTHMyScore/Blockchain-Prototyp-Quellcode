const express = require("express");
const auth = require("../middleware/auth");
const {
  assignDepartment,
  getUserInfo,
  setPassword,
} = require("../services/userHandler");

const router = express.Router();

router.get("/", auth, (req, res) => {
  if (!req.query.email) {
    res.status(400).json({ error: "Request incomplete" });
    return;
  }

  const senderInfo = getUserInfo(req.user.email);
  if (
    !(senderInfo.roles.includes("Owner") || senderInfo.roles.includes("Admin"))
  ) {
    res.status(403).json({ error: "Action forbidden" });
    return;
  }

  res.json({ message: getUserInfo(req.query.email) });
});

router.put("/assignDepartment", auth, (req, res) => {
  if (!(req.body.email && req.body.department)) {
    res.status(400).json({ error: "Request incomplete" });
    return;
  }

  const senderInfo = getUserInfo(req.user.email);
  const subjectInfo = getUserInfo(req.body.email);
  if (
    !(
      senderInfo.roles.includes("Owner") ||
      (senderInfo.roles.includes("Admin") &&
        senderInfo.department === req.body.department &&
        (subjectInfo.department === undefined || subjectInfo.department === null))
    )
  ) {
    res.status(403).json({ error: "Action forbidden" });
    return;
  }

  try {
    assignDepartment(req.body.email, req.body.department);
  } catch (error) {
    res.status(500).json({ error: "Assigning department failed" });
    return;
  }

  res.json({ message: "User department updated" });
});

router.put("/removeDepartment", auth, (req, res) => {
  if (!req.body.email) {
    res.status(400).json({ error: "Request incomplete" });
    return;
  }

  const senderInfo = getUserInfo(req.user.email);
  const subjectInfo = getUserInfo(req.body.email);
  if (
    !(
      senderInfo.roles.includes("Owner") ||
      (senderInfo.roles.includes("Admin") &&
        senderInfo.department === subjectInfo.department)
    )
  ) {
    res.status(403).json({ error: "Action forbidden" });
    return;
  }

  try {
    assignDepartment(req.body.email, null);
  } catch (error) {
    res.status(500).json({ error: "Removing department failed" });
    return;
  }

  res.json({ message: "User department updated" });
});

router.put("/setPassword", auth, (req, res) => {
  if (!(req.body.email && req.body.password)) {
    res.status(400).json({ error: "Request incomplete" });
    return;
  }

  const senderInfo = getUserInfo(req.user.email);
  if (!senderInfo.roles.includes("Owner")) {
    res.status(403).json({ error: "Action forbidden" });
    return;
  }

  try {
    setPassword(req.body.email, req.body.password);
  } catch (error) {
    res.status(500).json({ error: "Setting password failed" });
    return;
  }

  res.json({ message: "User password updated" });
});

module.exports = router;
