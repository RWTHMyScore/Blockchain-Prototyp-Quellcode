const express = require("express");
const asyncHandler = require("express-async-handler");
const auth = require("../middleware/auth");
const dept = require("../middleware/dept");
const {
  announceTranscript,
  getAnnouncementByTranscript,
} = require("../services/announcementHandler");
const { transferTranscript } = require("../services/transferHandler");
const {
  getOutgoingTranscript,
  getOutgoingTranscriptList,
  deleteTranscript,
  getOutgoingTranscriptCount,
} = require("../services/transcriptHandler");
const { findPartnerByName } = require("../services/partnerHandler");

const router = express.Router();

router.get("/", auth, dept, (req, res) => {
  const id = req.body.id || req.query.id;
  if (id) {
    res.json({
      message: getOutgoingTranscript(id, req.user.deptName, req.user.owner),
    });
  } else {
    res.json({
      message: getOutgoingTranscriptList(req.user.deptName, req.user.owner),
    });
  }
});

router.get("/count", auth, dept, (req, res) => {
  res.json({
    message: getOutgoingTranscriptCount(req.user.deptName, req.user.owner),
  });
});

router.delete("/", auth, dept, (req, res) => {
  if (!req.query.id) {
    res.status(400).json({ error: "Request incomplete" });
  }

  try {
    deleteTranscript(req.query.id);
  } catch (error) {
    res.status(500).json({ error: "Announcing failed" });
    return;
  }

  res.json({ message: "Transcript deleted" });
});

router.post(
  "/",
  auth,
  dept,
  asyncHandler(async (req, res) => {
    if (!req.body.transcript) {
      res.status(400).json({ error: "Request incomplete" });
    }

    // find target address from name
    const transcriptEntry = getOutgoingTranscript(
      req.body.transcript,
      req.user.deptName,
      req.user.owner
    );

    const partner = await findPartnerByName(
      transcriptEntry.toUniversity,
      transcriptEntry.toDepartment
    );

    if (!partner) {
      res
        .status(500)
        .json({ error: "Recipient address could not be established" });
    }

    let rowIdA;
    // check if already announced
    if (transcriptEntry.announcementTime) {
      rowIdA = getAnnouncementByTranscript(req.body.transcript).id;
    } else {
      // announce the transfer
      try {
        rowIdA = await announceTranscript(
          req.user.email,
          req.body.transcript,
          partner.address
        );
      } catch (error) {
        res.status(500).json({ error: "Announcing failed" });
        return;
      }
    }

    const { block, tx } = getOutgoingTranscript(
      req.body.transcript,
      req.user.deptName,
      req.user.owner
    );

    // actually transfer the transcript after announcing it
    let rowIdT;
    try {
      rowIdT = await transferTranscript(
        req.user.email,
        req.body.transcript,
        partner.address,
        tx,
        block
      );
    } catch (error) {
      res.status(500).json({
        error: "Transferring failed",
        message: { announcement: rowIdA },
      });
      return;
    }

    res.json({ message: { announcement: rowIdA, transfer: rowIdT } });
  })
);

module.exports = router;
