const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('./store/db.json'); // If you are reading from a file adapter, the path is relative to execution path (CWD) and not to your code.
const db = low(adapter);

module.exports = db;
