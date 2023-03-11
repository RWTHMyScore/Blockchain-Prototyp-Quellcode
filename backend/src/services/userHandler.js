const crypto = require("crypto");
const { getDatabase } = require("./database");

const validateLogin = (email, password) => {
  const row = getDatabase()
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(email.toLowerCase());
  if (row === undefined) return false;
  const testHash = crypto
    .pbkdf2Sync(password, row.salt, 1000, 64, "sha512")
    .toString("hex");
  return testHash === row.password;
};

const getUserInfo = (email) => {
  const row = getDatabase()
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(email);
  if (row === undefined) return undefined;
  const info = {
    email: row.email,
    name: `${row.firstname} ${row.lastname}`,
    department: row.department,
    roles: row.owner ? ["Owner"] : ["User"],
  };

  const row2 = getDatabase()
    .prepare("SELECT * FROM departments WHERE admin = ?")
    .get(row.id);
  if (row2 !== undefined) {
    info.roles.push("Admin");
  }

  return info;
};

const createUser = (firstname, lastname, email, password) => {
  const insert = getDatabase().prepare(
    "INSERT INTO users (firstname, lastname, email, password, salt) VALUES (?, ?, ?, ?, ?)"
  );
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  return insert.run(firstname, lastname, email, hash, salt).lastInsertRowid;
};

const assignDepartment = (email, department) => {
  const update = getDatabase().prepare(
    "UPDATE users SET department = ? WHERE email = ?"
  );
  update.run(department, email);
};

const setPassword = (email, password) => {
  const update = getDatabase().prepare(
    "UPDATE users SET password = ?, salt = ? WHERE email = ?"
  );
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  update.run(hash, salt, email);
};

module.exports = {
  validateLogin,
  getUserInfo,
  createUser,
  assignDepartment,
  setPassword,
};
