const express = require("express");
const asyncHandler = require("express-async-handler");
const auth = require("../middleware/auth");
const dept = require("../middleware/dept");
const {
  getDepartment,
  getDepartmentList,
  addDepartment,
  updateDepartmentServer,
  updateDepartmentAdmin,
} = require("../services/departmentHandler");
const { getUserInfo } = require("../services/userHandler");

const router = express.Router();

router.get("/", auth, dept, (req, res) => {
  const id = req.body.id || req.query.id;
  let deptList;
  if (id) {
    deptList = [getDepartment(id)];
  } else {
    deptList = getDepartmentList();
  }
  deptList.map((d) => {
    return { id: d.id, name: d.name, pubkey: d.pubkey, admin: d.admin };
  });
  if (id) {
    res.json({ message: deptList[0] });
  } else {
    res.json({ message: deptList });
  }
});

router.post(
  "/",
  auth,
  asyncHandler(async (req, res) => {
    if (!(req.body.name && req.body.server && req.body.admin)) {
      res.status(400).json({ error: "Request incomplete" });
      return;
    }

    const senderInfo = getUserInfo(req.user.email);
    const subjectInfo = getUserInfo(req.body.admin);
    if (!(senderInfo.roles.includes("Owner") && !subjectInfo.department)) {
      res.status(403).json({ error: "Action forbidden" });
      return;
    }

    try {
      await addDepartment(req.body.name, req.body.server, req.body.admin);
    } catch (error) {
      res.status(500).json({ error: "Creating department failed" });
      return;
    }

    res.json({ message: "Department created" });
  })
);

router.put(
  "/",
  auth,
  dept,
  asyncHandler(async (req, res) => {
    if (!(req.body.server || req.body.admin)) {
      res.status(400).json({ error: "Request incomplete" });
      return;
    }

    const senderInfo = getUserInfo(req.user.email);
    if (
      !(
        senderInfo.roles.includes("Owner") || senderInfo.roles.includes("Admin")
      )
    ) {
      res.status(403).json({ error: "Action forbidden" });
      return;
    }

    if (
      senderInfo.roles.includes("Owner") &&
      !senderInfo.roles.includes("Admin") &&
      !req.body.department
    ) {
      res.status(400).json({ error: "Request incomplete" });
      return;
    }

    if (req.body.server) {
      try {
        await updateDepartmentServer(
          req.user.deptId || req.body.department,
          req.body.server
        );
      } catch (error) {
        res.status(500).json({ error: "Updating department failed" });
        return;
      }
    }

    if (req.body.admin) {
      try {
        await updateDepartmentAdmin(
          req.user.deptId || req.body.department,
          req.body.admin
        );
      } catch (error) {
        res.status(500).json({ error: "Updating department failed" });
        return;
      }
    }

    res.json({ message: "Department server updated" });
  })
);

module.exports = router;
