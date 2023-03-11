const crypto = require("crypto");
const xml2js = require("xml2js");
const config = require("./config");
const { getDatabase } = require("./database");
const { getDepartmentList } = require("./departmentHandler");
const { getPartner } = require("./partnerHandler");

const getTranscript = (id, deptName, owner) => {
  if (owner)
    return getDatabase()
      .prepare("SELECT * FROM transcripts WHERE id = ?")
      .get(id);
  return getDatabase()
    .prepare("SELECT * FROM transcripts WHERE id = ? && fromDepartment = ?")
    .get(id, deptName);
};

const getTranscriptList = (deptName, owner) => {
  if (owner) return getDatabase().prepare("SELECT * FROM transcripts").all();
  return getDatabase()
    .prepare("SELECT * FROM transcripts WHERE fromDepartment = ?")
    .all(deptName);
};

const getIncomingTranscript = (id, deptName, owner) => {
  return getDatabase()
    .prepare(
      "SELECT id,fullname,homeMatriculation,fromUniversity,fromDepartment,toUniversity,toDepartment,content,hash,time,recipient,sender,valid,read,verifyTime,tx,block FROM transcripts INNER JOIN (SELECT recipient,sender,transcript,read,valid, time as verifyTime,tx,block FROM incoming_records INNER JOIN validation_records ON incoming_records.id = validation_records.inrecord) incoming_records ON transcripts.id = incoming_records.transcript WHERE id = ? AND (? = 1 OR toDepartment = ?)"
    )
    .get(id, owner ? 1 : 0, deptName);
};

const getIncomingTranscriptList = (deptName, owner) => {
  return getDatabase()
    .prepare(
      "SELECT id,fullname,homeMatriculation,fromUniversity,fromDepartment,toUniversity,toDepartment,content,hash,time,recipient,sender,valid,read, verifyTime FROM transcripts INNER JOIN (SELECT recipient,sender,transcript,read,valid,time as verifyTime FROM incoming_records INNER JOIN validation_records ON incoming_records.id = validation_records.inrecord) incoming_records ON transcripts.id = incoming_records.transcript WHERE (? = 1 OR toDepartment = ?)"
    )
    .all(owner ? 1 : 0, deptName);
};

const getIncomingTranscriptCount = (deptName, owner) => {
  return getDatabase()
    .prepare(
      "SELECT COUNT(*) FROM transcripts INNER JOIN incoming_records ON transcripts.id = incoming_records.transcript WHERE transcripts.id IN (SELECT transcript FROM incoming_records) AND (? = 1 OR toDepartment = ?)"
    )
    .get(owner ? 1 : 0, deptName)["COUNT(*)"];
};

const getOutgoingTranscript = (id, deptName, owner) => {
  return getDatabase()
    .prepare(
      "SELECT id,fullname,homeMatriculation,fromUniversity,fromDepartment,toUniversity,toDepartment,content,hash,time AS uploadTime,announcementUser,recipient,announcementTime,block,tx,transferUser,transferTime FROM transcripts LEFT JOIN ((SELECT id as announcementId,user AS announcementUser,recipient,transcript,time AS announcementTime,block,tx FROM transfer_announcements) transfer_announcements LEFT JOIN (SELECT user AS transferUser,announcement,time AS transferTime FROM transfer_records) transfer_records ON transfer_announcements.announcementId = transfer_records.announcement) info ON transcripts.id = info.transcript WHERE id = ? AND (? = 1 OR fromDepartment = ?)"
    )
    .get(id, owner ? 1 : 0, deptName);
};

const getOutgoingTranscriptList = (deptName, owner) => {
  const raw = getDatabase()
    .prepare(
      "SELECT id,fullname,homeMatriculation,fromUniversity,fromDepartment,toUniversity,toDepartment,content,hash,time AS uploadTime,announcementUser,recipient,announcementTime,block,tx,transferUser,transferTime FROM transcripts LEFT JOIN ((SELECT id as announcementId,user AS announcementUser,recipient,transcript,time AS announcementTime,block,tx FROM transfer_announcements) transfer_announcements LEFT JOIN (SELECT user AS transferUser,announcement,time AS transferTime FROM transfer_records) transfer_records ON transfer_announcements.announcementId = transfer_records.announcement) info ON transcripts.id = info.transcript WHERE id NOT IN (SELECT transcript FROM incoming_records) AND (? = 1 OR fromDepartment = ?)"
    )
    .all(owner ? 1 : 0, deptName);

  const final = raw.map((t) => {
    const t2 = JSON.parse(JSON.stringify(t));
    if (t2.transferTime) {
      t2.status = "transferred";
    } else if (t2.announcementTime) {
      t2.status = "announced";
    } else {
      t2.status = "ready";
    }
    return t2;
  });
  return final;
};

const getOutgoingTranscriptCount = (deptName, owner) => {
  return getDatabase()
    .prepare(
      "SELECT COUNT(*) FROM transcripts WHERE id NOT IN (SELECT transcript FROM incoming_records)AND id IN (SELECT transcript FROM transfer_announcements INNER JOIN transfer_records ON transfer_announcements.id = transfer_records.id) AND (? = 1 OR fromDepartment = ?)"
    )
    .get(owner ? 1 : 0, deptName)["COUNT(*)"];
};

const preprocessTranscript = async (content) => {
  const toContentString = (input) => {
    if (typeof input === "string") {
      // is it an xml string?
      if (input.startsWith("<?xml version='1.0'")) {
        return input;
      }

      // is it base64 encoded xml?
      try {
        const unencoded = Buffer.from(content, "base64").toString("utf8");
        return unencoded;
      } catch (e) {
        // continue regardless of error
      }
    }
    return "";
  };

  const contentString = toContentString(content);
  if (contentString === "") {
    throw new Error("No content for transcript could be established");
  }
  const encoded = Buffer.from(contentString).toString("base64");
  const hash = crypto.createHash("sha512");
  const contentHash = hash.update(encoded, "utf-8").digest("hex");
  const contentObject = await xml2js.parseStringPromise(contentString, {
    explicitArray: false,
  });

  return [
    `${contentObject.blockchainTransfer.elmo.learner.givenNames} ${contentObject.blockchainTransfer.elmo.learner.familyName}`,
    contentObject.blockchainTransfer.transfer.homeMatriculation,
    contentObject.blockchainTransfer.transfer.fromUniversity,
    contentObject.blockchainTransfer.transfer.fromDepartment,
    contentObject.blockchainTransfer.transfer.toUniversity,
    contentObject.blockchainTransfer.transfer.toDepartment,
    encoded,
    contentHash,
  ];
};

const checkTranscriptConsistency = async (content, sender, recipient) => {
  const params = await preprocessTranscript(content);

  // wrong recipient university?
  if (params[4] !== config.university) return false;

  // non-existing recipient department?
  const departments = getDepartmentList();
  const recipientDepartment = departments.find((d) => d.name === params[5]);
  if (!recipientDepartment) return false;

  // incorrect recipient address?
  if (recipientDepartment.pubkey !== recipient) return false;

  // incorrect sender address?
  const partner = await getPartner(sender);
  if (partner.university !== params[2] || partner.department !== params[3])
    return false;

  return true;
};

// NOTE: content can be xml or already base64 encoded xml
const addTranscript = async (content, deptName, owner) => {
  const insert = getDatabase().prepare(
    "INSERT INTO transcripts (fullname, homeMatriculation, fromUniversity, fromDepartment, toUniversity, toDepartment, content, hash) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  );

  const params = await preprocessTranscript(content);

  if (!((owner || params[3] === deptName) && params[2] === config.university)) {
    throw new Error("Not authorized for sending department");
  }

  return insert.run(...params).lastInsertRowid;
};

const addIncomingTranscript = async (content, sender, recipient, tx, block) => {
  const params = await preprocessTranscript(content);
  // eslint-disable-next-line no-unused-vars
  let rowIdIn;
  const insertAtomically = getDatabase().transaction(() => {
    const insert = getDatabase().prepare(
      "INSERT INTO transcripts (fullname, homeMatriculation, fromUniversity, fromDepartment, toUniversity, toDepartment, content, hash) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    );
    const transcriptId = insert.run(...params).lastInsertRowid;

    const insert2 = getDatabase().prepare(
      "INSERT INTO incoming_records (transcript, recipient, sender, tx, block) VALUES (?, ?, ?, ?, ?)"
    );
    rowIdIn = insert2.run(transcriptId, recipient, sender, tx, block).lastInsertRowid;
  });
  insertAtomically();
  return rowIdIn;
};

const deleteTranscript = (transcriptId) => {
  const del = getDatabase().prepare("DELETE FROM transcripts WHERE id = ?");
  return del.run(transcriptId);
};

module.exports = {
  getTranscript,
  getTranscriptList,
  getIncomingTranscript,
  getIncomingTranscriptList,
  getOutgoingTranscript,
  getOutgoingTranscriptList,
  checkTranscriptConsistency,
  addTranscript,
  addIncomingTranscript,
  deleteTranscript,
  getOutgoingTranscriptCount,
  getIncomingTranscriptCount,
};
