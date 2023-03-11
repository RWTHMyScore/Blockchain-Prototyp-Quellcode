const express = require("express");
const asyncHandler = require("express-async-handler");
const auth = require("../middleware/auth");
const { getPartnerList } = require("../services/partnerHandler");
const { getDepartmentList } = require("../services/departmentHandler");

const router = express.Router();

router.get(
  "/",
  auth,
  asyncHandler(async (req, res) => {
    const external = req.body.external || req.query.external;
    const partnerProm = getPartnerList();
    let partnerList;
    if (external === "true") {
      const departmentKeys = getDepartmentList().map((dpt) => dpt.pubkey);
      partnerList = await partnerProm;
      partnerList = partnerList.filter(
        (partner) => !departmentKeys.includes(partner.address)
      );
    } else {
      partnerList = await partnerProm;
    }
    res.json({ message: partnerList });
  })
);

module.exports = router;
