const { getDatabase } = require("./database");
const { logPromise } = require("./contracts");
const { sendTransactionToContract } = require("./send")
const { getWeb3 } = require("./contracts");

const getAnnouncement = (id) => {
  return getDatabase()
    .prepare("SELECT * FROM transfer_announcements WHERE id = ?")
    .run(id);
};

const getAnnouncementByTranscript = (id) => {
  return getDatabase()
    .prepare("SELECT * FROM transfer_announcements WHERE transcript = ?")
    .run(id);
};

const getAnnouncementList = () => {
  return getDatabase().prepare("SELECT * FROM transfer_announcements").all();
};

const announceTranscript = async (email, transcriptId, recipientAddress) => {
  const transferLog = await logPromise();

  // get department
  const user = getDatabase()
    .prepare("SELECT department, id FROM users WHERE email = ?")
    .get(email);
  if (user === undefined || user.department === undefined)
    throw new Error("Department not found");

  // get transcript hash
  const { hash } = getDatabase()
    .prepare("SELECT hash FROM transcripts WHERE id = ?")
    .get(transcriptId);
  if (hash === undefined) throw new Error("Transcript not found");
  const hashBuffer = Buffer.from(hash, "hex");
  const hash1 = hashBuffer.slice(0, 32);
  const hash2 = hashBuffer.slice(32, 64);

  // get department address
  const { pubkey, privkey } = getDatabase()
    .prepare("SELECT pubkey, privkey FROM departments WHERE id = ?")
    .get(user.department);

  const web3 = getWeb3();
  // transaction
  const txReceipt = await sendTransactionToContract(
    pubkey,
    privkey, 
    transferLog,
    "announce",
    web3.utils.toHex('320000'),
    [recipientAddress, hash1, hash2]
  )

  const insert = getDatabase().prepare(
    "INSERT INTO transfer_announcements (user,transcript,recipient,block,tx) VALUES (?, ?, ?, ?, ?)"
  );

  return insert.run(
    user.id,
    transcriptId,
    recipientAddress,
    txReceipt.blockHash,
    txReceipt.transactionHash
  ).lastInsertRowid;
};

// function can only find announcement for specific transfer if it is valid (except time check) because hash is used to
// identify it
const getAnnouncementFromChain = async (sender, recipient, hash) => {
  const hashBuffer = Buffer.from(hash, "hex");
  const hash1 = hashBuffer.slice(0, 32);
  const hash2 = hashBuffer.slice(32, 64);
  const transferLog = await logPromise();
  let announcement;
  try {
    announcement = await transferLog.validate(sender, recipient, hash1, hash2);
  } catch (e) {
    throw new Error(`Announcement not found: ${e}`);
  }
  if (!announcement) {
    throw new Error("Announcement not found");
  }
  return announcement;
};

module.exports = {
  getAnnouncement,
  getAnnouncementList,
  announceTranscript,
  getAnnouncementFromChain,
  getAnnouncementByTranscript,
};
