const { getDatabase } = require("./database");

const getIncomingByHash = (hash) => {
  return getDatabase()
    .prepare(
      "SELECT id,fullname,homeMatriculation,fromUniversity,fromDepartment,toUniversity,toDepartment,content,hash,time,recipient,sender,valid,verifyTime FROM transcripts INNER JOIN (SELECT recipient,sender,transcript,valid, time as verifyTime FROM incoming_records INNER JOIN validation_records ON incoming_records.id = validation_records.inrecord) incoming_records ON transcripts.id = incoming_records.transcript WHERE hash = ?"
    )
    .get(hash);
};

// at this point it is already known that the hashes match the
// we have to check time and write it to db
// NOTE: currently we only use this method directly after receiving a transcript, making time checks somewhat oboslete
// (only timecheck possibly beneficial is making sure that the announcement is not too old)
// eslint-disable-next-line no-unused-vars
const validateAnnouncement = (inrecord, announcement) => {
  let valid = true;
  const currentTimeSeconds = Math.floor(Date.now() / 1000);
  const passedTime = currentTimeSeconds - announcement.time;
  if (passedTime < 0 || passedTime > 604800) {
    // 1 week
    valid = false;
  }
  const insert = getDatabase().prepare(
    "INSERT INTO validation_records (inrecord, valid) VALUES (?, ?)"
  );
  insert.run(inrecord, valid ? 1 : 0);
  return true;
};

const getIncomingErrorList = () => {
  return getDatabase().prepare("SELECT * FROM incoming_errors").all();
};

const addIncomingError = (ip, hash, sender, recipient, comment) => {
  const insert = getDatabase().prepare(
    "INSERT INTO incoming_errors (ip, hash, sender, recipient, comment) VALUES (?, ?, ?, ?, ?)"
  );

  return insert.run(ip, hash, sender, recipient, comment).lastInsertRowid;
};

const setIncomingWasRead = (id, read) => {
  const update = getDatabase().prepare(
    "UPDATE incoming_records SET read = ? WHERE transcript = ?"
  );

  update.run(read ? 1 : 0, id);
};

module.exports = {
  getIncomingByHash,
  validateAnnouncement,
  getIncomingErrorList,
  addIncomingError,
  setIncomingWasRead,
};
