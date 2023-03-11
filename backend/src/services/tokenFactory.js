const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

const secret = fs.readFileSync(
  path.resolve(__dirname, "../../certificates/server.key"),
  "utf8"
);

const generateAuthToken = (email) => {
  return jwt.sign({ email: email.toLowerCase() }, secret, {
    expiresIn: "2h",
  });
};

module.exports = { generateAuthToken, secret };
