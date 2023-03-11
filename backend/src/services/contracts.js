/* eslint-disable no-console */
const Web3 = require("web3");
const contract = require("@truffle/contract");
const config = require("./config");
const { getDatabase } = require("./database");

const partnerRegistryABI = require("../../contracts/UniversityRegistry.json");
const logABI = require("../../contracts/TransferLog.json");

console.log(`Attempting to connect to chain at: ${config.blockchain_node}`);
const web3 = new Web3(config.blockchain_node);
web3.eth.net
  .isListening()
  .then(() => console.log("Is connected to chain."))
  .catch((e) => console.log(`Could not connect to chain: ${e}`));
const rows = getDatabase().prepare("SELECT privkey FROM departments").all();
for (let i = 0; i < rows.length; i += 1) {
  web3.eth.accounts.wallet.add(
    web3.eth.accounts.privateKeyToAccount(rows[i].privkey)
  );
}
// TODO keys for newly created departments have to be added on department creation somewhere

// eslint-disable-next-line no-promise-executor-return
const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const promiseContractInstance = async (contractABI) => {
  await delay(1000);
  const contractObject = contract(contractABI);
  contractObject.setProvider(web3.currentProvider);
  console.log("Connecting to a contract...");
  return contractObject
    .deployed()
    .then((ctr) => {
      console.log("Connected to contract successfully.");
      return ctr;
    })
    .catch((e) => console.log(`Could not connect to contract: ${e}`));
};

let rp = promiseContractInstance(partnerRegistryABI);
let lp = promiseContractInstance(logABI);

const getBlockNumber = () => {
  return web3.eth.getBlockNumber();
};

const getBalance = async (acc) => {
  const wei = await web3.eth.getBalance(acc);
  return web3.utils.fromWei(wei);
};

const reloadContracts = () => {
  rp = promiseContractInstance(partnerRegistryABI);
  lp = promiseContractInstance(logABI);
};

const registryPromise = () => {
  return rp;
};
const logPromise = () => {
  return lp;
};

const getWeb3 = () => {
  return web3;
};

module.exports = {
  registryPromise,
  logPromise,
  getBlockNumber,
  getWeb3,
  getBalance,
  reloadContracts,
};
