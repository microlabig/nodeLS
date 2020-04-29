const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise; // для работы с Promise

// установка схем
// объект новости
const newsScheme = new Schema({
  id: {
    type: Number,
    required: true
  },
  created_at: Date,
  text: String,
  title: String,
  user: { // https://qna.habr.com/q/586673 или https://mongoosejs.com/docs/populate.html
    firstName: String,
    id: Number,
    image: String,
    middleName: String,
    surName: String,
    username: String
  }
});

// модели данных
module.exports.News = mongoose.model('news', newsScheme);
