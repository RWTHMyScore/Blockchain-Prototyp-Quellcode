const Database = require("better-sqlite3");
const config = require("./config");

// eslint-disable-next-line import/order
let db = Database(config.db_source, {});

const reloadDatabase = () => {
  db = Database(config.db_source, {});
};

const getDatabase = () => {
  return db;
};

module.exports = { getDatabase, reloadDatabase };
