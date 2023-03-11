const { getDatabase } = require("./database");
const { getWeb3 } = require("./contracts");

const getAccountByDepartment = (id) => {
  const row = getDatabase()
    .prepare("SELECT privkey FROM departments WHERE id = ?")
    .get(id);
  if (row === undefined) throw new Error("Department not found.");
  return getWeb3().eth.accounts.privateKeyToAccount(row.privkey);
};

module.exports = { getAccountByDepartment };
