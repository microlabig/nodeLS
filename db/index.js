const mongoose = require('mongoose');

const LOCAL_PATH = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/loft`;
const REMOTE_PATH = `mongodb://${process.env.REMOTE_DB_HOST}:${process.env.REMOTE_DB_PORT}/loft`;

const mode = process.env.mode;
const dbPath = mode && mode === 'development' ? LOCAL_PATH : REMOTE_PATH;

const UserDB = require('./users');
const NewsDB = require('./news');

// соединяемся с БД
mongoose
  .connect(dbPath, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Connected to DB');
  })
  .catch((err) => {
    console.error(err);
  });

module.exports = {
  UserDB,
  NewsDB
};
