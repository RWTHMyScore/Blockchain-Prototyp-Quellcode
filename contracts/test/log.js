const crypto = require("crypto");
const TransferLog = artifacts.require("TransferLog");

contract("Transfer Log: Log Transcript Transfer", async (accounts) => {
  it("should validate correct transfer", async () => {
    const hash = crypto.createHash("sha512");
    const contentHash = hash.update("This is a transcript", "utf-8").digest();
    const instance = await TransferLog.deployed();
    await instance.announce(
      accounts[1],
      contentHash.slice(0, 32),
      contentHash.slice(32, 64),
      { from: accounts[0] }
    );
    await instance.validate(
      accounts[0],
      accounts[1],
      contentHash.slice(0, 32),
      contentHash.slice(32, 64),
      { from: accounts[1] }
    );
  });
  it("should error on false transfer", async () => {
    const hash = crypto.createHash("sha512");
    const contentHash = hash.update("This is a diploma", "utf-8").digest();
    const instance = await TransferLog.deployed();
    let wasRejected = false;
    await instance
      .validate(
        accounts[0],
        accounts[1],
        contentHash.slice(0, 32),
        contentHash.slice(32, 64),
        { from: accounts[1] }
      )
      .catch((err) => {
        wasRejected = true;
      });
    expect(wasRejected).to.be.true;
  });
});
