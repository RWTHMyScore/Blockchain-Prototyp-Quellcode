const { getUserInfo } = require("../services/userHandler");
const { getDepartment } = require("../services/departmentHandler");

const verifyToken = (req, res, next) => {
  const { email } = req.user;

  if (!email) {
    return res.status(403).json({ error: "Authentication required" });
  }
  try {
    const userInfo = getUserInfo(email);
    req.user.owner = false;
    req.user.deptId = null;
    req.user.deptName = null;
    if (userInfo.roles.includes("Owner")) {
      req.user.owner = true;
    }
    req.user.deptId = userInfo.department;
    req.user.deptName = userInfo.department
      ? getDepartment(userInfo.department).name
      : undefined;
  } catch (err) {
    return res
      .status(401)
      .json({ error: "Unable to establish department affiliation" });
  }
  return next();
};

module.exports = verifyToken;
