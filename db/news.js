const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise; // для работы с Promise

// установка схем
// объект новости
const newsScheme = new Schema(
  {
    id: {
      type: Number,
      required: true
    },
    text: String,
    title: String,
    user: { type: Schema.Types.ObjectId, ref: 'user' } // https://mongoosejs.com/docs/populate.html
  },
  { timestamps: true }
);

// модели данных
module.exports.News = mongoose.model('news', newsScheme);
