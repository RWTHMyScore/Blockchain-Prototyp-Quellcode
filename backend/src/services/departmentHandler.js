const { getDatabase } = require("./database");
const { getWeb3 } = require("./contracts");
const { registryPromise, reloadContracts } = require("./contracts");
const { assignDepartment } = require("./userHandler");
const { sendTransactionToContract } = require("./send.js")
// eslint-disable-next-line no-unused-vars
const config = require("./config");

const getDepartment = (id) => {
  return getDatabase()
    .prepare("SELECT * FROM departments where id = ?")
    .get(id);
};

const getDepartmentList = () => {
  return getDatabase().prepare("SELECT * FROM departments").all();
};

const addDepartment = async (name, server, admin) => {
  const insert = getDatabase().prepare(
    "INSERT INTO departments (name, pubkey, privkey, admin) VALUES (?, ?, ?, (SELECT id from users WHERE email = ?))"
  );
  const account = getWeb3().eth.accounts.create();
  const deptId = insert.run(
    name,
    account.address,
    account.privateKey,
    admin
  ).lastInsertRowid;
  // getWeb3().eth.accounts.wallet.add(account);
  await getWeb3().eth.personal.importRawKey(account.privateKey, "");
  await getWeb3().eth.personal.unlockAccount(
    account.address,
    "",
    1000000000000000
  );
  reloadContracts();

  assignDepartment(admin, deptId);
};

// eslint-disable-next-line no-unused-vars
const departmentApplyForMembership = async (departmentAddress) => {
  // TODO
  // const registry = await registryPromise();
  // await registry.applyForMembership(config.university, name, server, {
  //  from: departmentAddress,
  // });
};

const updateDepartmentServer = async (deptId, newServer) => {
  const web3 = getWeb3();
  const registry = await registryPromise();
  const departmentAddress = getDepartment(deptId).pubkey;
  const pk = getDepartment(deptId).privkey;
  sendTransactionToContract(
    departmentAddress,
    pk, 
    registry,
    "updateServer",
    web3.utils.toHex('320000'),
    [newServer]
    )
};

const updateDepartmentAdmin = async (deptId, newAdminEmail) => {
  assignDepartment(newAdminEmail, deptId);
  const update = getDatabase().prepare(
    "UPDATE departments SET admin = (SELECT id FROM users WHERE email = ?) WHERE id = ?"
  );
  update.run(newAdminEmail, deptId);
};

module.exports = {
  getDepartment,
  getDepartmentList,
  addDepartment,
  departmentApplyForMembership,
  updateDepartmentServer,
  updateDepartmentAdmin,
};
