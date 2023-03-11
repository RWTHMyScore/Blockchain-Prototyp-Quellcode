const express = require("express");
const asyncHandler = require("express-async-handler");
const auth = require("../middleware/auth");
const dept = require("../middleware/dept");
const {
  getTranscriptList,
  addTranscript,
  getTranscript,
} = require("../services/transcriptHandler");

const router = express.Router();

router.get("/", auth, dept, (req, res) => {
  const id = req.body.id || req.query.id;

  if (id) {
    res.json({ message: getTranscript(id, req.user.deptName, req.user.owner) });
  } else {
    res.json({ message: getTranscriptList(req.user.deptName, req.user.owner) });
  }
});

router.post(
  "/",
  auth,
  dept,
  asyncHandler(async (req, res) => {
    if (!req.body.content) {
      res.status(400).json({ error: "Request incomplete" });
      return;
    }

    let rowId;
    try {
      rowId = await addTranscript(
        req.body.content,
        req.user.deptName,
        req.user.owner
      );
    } catch (error) {
      res.status(500).json({ error: "Upload failed" });
      return;
    }

    res.json({ message: rowId });
  })
);

module.exports = router;
