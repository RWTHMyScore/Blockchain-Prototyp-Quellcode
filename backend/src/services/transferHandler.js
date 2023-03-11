const axios = require("axios");
const https = require("https");
const { getDatabase } = require("./database");
const { getPartner } = require("./partnerHandler");

const agent = new https.Agent({
  rejectUnauthorized: false,
});

const transferTranscript = async (email, transcriptId, recipientAddress, tx, block) => {
  // TODO maybe check that announcement is on chain; currently we just assume that it is
  const announcement = getDatabase()
    .prepare(
      "SELECT id FROM transfer_announcements WHERE transcript = ? AND recipient = ?"
    )
    .get(transcriptId, recipientAddress);
  if (announcement === undefined) {
    throw new Error("Transfer must be announced first");
  }

  // get user info, transcript, and other server domain/ip
  const user = getDatabase()
    .prepare(
      "SELECT id,pubkey FROM users INNER JOIN (SELECT id as dpt,pubkey from departments) departments ON users.department=departments.dpt WHERE email = ?"
    )
    .get(email);
  const transcript = getDatabase()
    .prepare("SELECT content FROM transcripts WHERE id = ?")
    .get(transcriptId);
  const partner = await getPartner(recipientAddress);

  // send it to other transfer server
  const url = `${partner.server}/api/incomings`;
  const body = {
    ...transcript,
    recipient: recipientAddress,
    sender: user.pubkey,
    tx: tx,
    block: block
  };
  const axiosConfig = {};
  if (process.env.NODE_ENV === "development") {
    axiosConfig.httpsAgent = agent;
  }
  const response = await axios.post(url, body, axiosConfig).catch((e) => {
    throw new Error(`Transcript transfer failed: ${e}`);
  });
  if (response.status !== 200) {
    throw new Error("Transcript transfer failed");
  }

  // log the successful transfer to local db
  const insert = getDatabase().prepare(
    "INSERT INTO transfer_records (user,announcement) VALUES (?, ?)"
  );
  return insert.run(user.id, announcement.id).lastInsertRowid;
};

module.exports = { transferTranscript };
