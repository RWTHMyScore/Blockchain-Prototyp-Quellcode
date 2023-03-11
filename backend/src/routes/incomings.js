const crypto = require("crypto");
const express = require("express");
const asyncHandler = require("express-async-handler");
const requestIp = require("request-ip");
const auth = require("../middleware/auth");
const dept = require("../middleware/dept");
const {
  checkTranscriptConsistency,
  addIncomingTranscript,
  getIncomingTranscript,
  getIncomingTranscriptList,
  getIncomingTranscriptCount,
} = require("../services/transcriptHandler");
const {
  getIncomingByHash,
  validateAnnouncement,
  getIncomingErrorList,
  addIncomingError,
  setIncomingWasRead,
} = require("../services/incomingHandler");
const { isPartner } = require("../services/partnerHandler");
const { getAnnouncementFromChain } = require("../services/announcementHandler");

const router = express.Router();

router.get("/", auth, dept, (req, res) => {
  const id = req.body.id || req.query.id;
  if (id) {
    res.json({
      message: getIncomingTranscript(id, req.user.deptName, req.user.owner),
    });
  } else {
    res.json({
      message: getIncomingTranscriptList(req.user.deptName, req.user.owner),
    });
  }
});

router.get("/count", auth, dept, (req, res) => {
  res.json({
    message: getIncomingTranscriptCount(req.user.deptName, req.user.owner),
  });
});

router.get("/errors", auth, dept, (req, res) => {
  res.json({
    message: getIncomingErrorList(),
  });
});

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const ip = requestIp.getClientIp(req);

    if (!(req.body.content && req.body.sender && req.body.recipient)) {
      addIncomingError(
        ip,
        null,
        req.body.sender ? req.body.sender : "UNKNOWN",
        req.body.recipient ? req.body.recipient : "UNKNOWN",
        "Incomplete send"
      );
      res.status(400).json({ error: "Request incomplete" });
      return;
    }

    // check that sender is a partner
    if (!isPartner(req.body.sender)) {
      addIncomingError(
        ip,
        null,
        req.body.sender,
        req.body.recipient,
        "Sender not recognized"
      );
      res.status(400).json({ error: "Sender not recognized" });
      return;
    }

    // check that transfer was announced correctly
    const h = crypto.createHash("sha512");
    const contentHash = h.update(req.body.content, "utf-8").digest("hex");
    const announcement = await getAnnouncementFromChain(
      req.body.sender,
      req.body.recipient,
      contentHash
    ).catch(() => {});
    if (!announcement) {
      addIncomingError(
        ip,
        contentHash,
        req.body.sender,
        req.body.recipient,
        "Announcement not found"
      );
      res.status(500).json({ error: "Transfer not logged on chain" });
      return;
    }

    // make sure that sender and recipient are matching transcript content
    if (
      !checkTranscriptConsistency(
        req.body.content,
        req.body.sender,
        req.body.recipient
      )
    ) {
      addIncomingError(
        ip,
        contentHash,
        req.body.sender,
        req.body.recipient,
        "Sender and recipient info not consistent"
      );
      res
        .status(400)
        .json({ error: "Sender and recipient info not consistent" });
      return;
    }

    // detect duplicate send
    const duplicate = getIncomingByHash(contentHash);
    if (duplicate) {
      addIncomingError(
        ip,
        contentHash,
        req.body.sender,
        req.body.recipient,
        "Transcript already transferred"
      );
      res.json({ message: "Already transferred" });
      return;
    }

    // write transcript & write how transcript was received
    let rowIdIn;
    try {
      rowIdIn = await addIncomingTranscript(
        req.body.content,
        req.body.sender,
        req.body.recipient,
        req.body.tx,
        req.body.block
      );
    } catch (error) {
      addIncomingError(
        ip,
        contentHash,
        req.body.sender,
        req.body.recipient,
        "Transcript could not be saved"
      );
      res.status(500).json({ error: "Upload failed" });
      return;
    }

    // write how the transcript was validated
    try {
      validateAnnouncement(rowIdIn, announcement);
    } catch (error) {
      res.status(500).json({ error: "Validation of log failed" });
      return;
    }

    res.json({ message: "Transfer complete" });
  })
);

router.post("/read", auth, dept, (req, res) => {
  if (!(req.body.read != null && req.body.id)) {
    res.status(400).json({ error: "Request incomplete" });
    return;
  }

  try {
    setIncomingWasRead(req.body.id, req.body.read);
  } catch (error) {
    res.status(500).json({ error: "Update failed" });
    return;
  }

  res.json({ message: { read: req.body.read } });
});

module.exports = router;
