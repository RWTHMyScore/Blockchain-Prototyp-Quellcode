const UniversityRegistry = artifacts.require("UniversityRegistry");

contract("Partner Registry: Init", async (accounts) => {
  it("should be initialized with 2 partners", async () => {
    const instance = await UniversityRegistry.deployed();
    const partnerCount = await instance.getMemberCount();
    expect(partnerCount.toNumber()).to.equal(2);
  });
  it("should have Account 0 be a member", async () => {
    const instance = await UniversityRegistry.deployed();
    const account = accounts[0];
    const isMember = await instance.isMember(account);
    expect(isMember.valueOf()).to.be.true;
  });
  it("should have Account 1 be a member", async () => {
    const instance = await UniversityRegistry.deployed();
    const account = accounts[1];
    const isMember = await instance.isMember(account);
    expect(isMember.valueOf()).to.be.true;
  });
  it("should not have Account 2 be a member", async () => {
    const instance = await UniversityRegistry.deployed();
    const account = accounts[2];
    const isMember = await instance.isMember(account);
    expect(isMember.valueOf()).to.be.false;
  });
});

contract("Partner Registry: Server Update", async (accounts) => {
  it("should not allow non-member to edit", async () => {
    const instance = await UniversityRegistry.deployed();
    let wasRejected = false;
    await instance
      .updateServer("localhost", { from: accounts[2] })
      .catch((err) => {
        wasRejected = true;
      });
    expect(wasRejected).to.be.true;
  });
  it("should allow member to change server address", async () => {
    const instance = await UniversityRegistry.deployed();
    await instance.updateServer("realURL", { from: accounts[0] });
    const info = await instance.memberInfos(accounts[0]);
    expect(info.server).to.equal("realURL");
  });
});

contract("Partner Registry: Voting", async (accounts) => {
  it("should not accept existing member to apply", async () => {
    const instance = await UniversityRegistry.deployed();
    let wasRejected = false;
    await instance
      .applyForMembership(
        "University of A",
        "Department Alpha",
        "https://uoa.example.com",
        { from: accounts[0] }
      )
      .catch((err) => {
        wasRejected = true;
      });
    expect(wasRejected).to.be.true;
  });
  it("should not accept two applications by same applicant", async () => {
    const instance = await UniversityRegistry.deployed();
    await instance.applyForMembership(
      "University of C",
      "Department Gamma",
      "https://uoc.example.com",
      { from: accounts[2] }
    );
    let wasRejected = false;
    await instance
      .applyForMembership(
        "University of C",
        "Department Gamma",
        "https://uoc.example.com",
        { from: accounts[2] }
      )
      .catch((err) => {
        wasRejected = true;
      });
    expect(wasRejected).to.be.true;
  });
  it("should not accept voting twice", async () => {
    const instance = await UniversityRegistry.deployed();
    // application for membership exists from prior test case
    await instance.castMembershipVote(accounts[2], 2, { from: accounts[0] });
    let wasRejected = false;
    await instance
      .castMembershipVote(accounts[2], 2, { from: accounts[0] })
      .catch((err) => {
        wasRejected = true;
      });
    expect(wasRejected).to.be.true;
  });
  it("should accept new member Account 3 via majority vote", async () => {
    const instance = await UniversityRegistry.deployed();
    // application for membership exists from prior test case
    await instance.castMembershipVote(accounts[2], 2, { from: accounts[1] });
    await instance.resolveVoteResult({ from: accounts[2] });
    const isMember = await instance.isMember(accounts[2]);
    expect(isMember.valueOf()).to.be.true;
    const isApplicant = await instance.isApplicant(accounts[2]);
    expect(isApplicant.valueOf()).to.be.false;
  });
});
