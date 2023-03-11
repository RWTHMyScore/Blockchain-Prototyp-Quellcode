const UniversityRegistry = artifacts.require("UniversityRegistry");
const TransferLog = artifacts.require("TransferLog");

module.exports = function (deployer, network, accounts) {
  let universityA;
  let departmentA;
  let serverA;
  let pubkeyB;
  let universityB;
  let departmentB;
  let serverB;

  if (
    !(
      process.env.PARTNER_A_UNIVERSITY &&
      process.env.PARTNER_A_DEPARTMENT &&
      process.env.PARTNER_A_SERVER &&
      process.env.PARTNER_B_PUBKEY &&
      process.env.PARTNER_B_UNIVERSITY &&
      process.env.PARTNER_B_DEPARTMENT &&
      process.env.PARTNER_B_SERVER
    )
  ) {
    console.log("No values for init given. Falling back to defaults.");
    universityA = "University of A";
    departmentA = "Department Alpha";
    serverA = "https://uoa.example.com";
    pubkeyB = accounts[1];
    universityB = "University of B";
    departmentB = "Department Beta";
    serverB = "https://uob.example.com";
  } else {
    universityA = process.env.PARTNER_A_UNIVERSITY;
    departmentA = process.env.PARTNER_A_DEPARTMENT;
    serverA = process.env.PARTNER_A_SERVER;
    pubkeyB = process.env.PARTNER_B_PUBKEY;
    universityB = process.env.PARTNER_B_UNIVERSITY;
    departmentB = process.env.PARTNER_B_DEPARTMENT;
    serverB = process.env.PARTNER_B_SERVER;
  }

  deployer
    .deploy(
      UniversityRegistry,
      universityA,
      departmentA,
      serverA,
      pubkeyB,
      universityB,
      departmentB,
      serverB
    )
    .then(() => deployer.deploy(TransferLog, UniversityRegistry.address));
};
