const express = require("express");
const asyncHandler = require("express-async-handler");
const { getBlockNumber, getBalance } = require("../services/contracts");
const { getDepartment } = require("../services/departmentHandler");
const auth = require("../middleware/auth");
const dept = require("../middleware/dept");

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const n = await getBlockNumber();
    res.json({ message: { blocknumber: n } });
  })
);

router.get(
  "/funds",
  auth,
  dept,
  asyncHandler(async (req, res) => {
    if (!req.user.deptId) {
      res.status(403).json({ error: "Action forbidden" });
    }

    const department = getDepartment(req.user.deptId);
    const n = await getBalance(department.pubkey);
    res.json({ message: n });
  })
);

module.exports = router;
