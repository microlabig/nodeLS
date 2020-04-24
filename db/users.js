const bcrypt = require('bcryptjs');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise; // для работы с Promise

// установка схем
// объект пользователя
const userScheme = new Schema({
  firstName: String,
  id: {
    type: Number,
    required: true
  },
  image: String,
  middleName: String,
  permission: {
    chat: { C: Boolean, R: Boolean, U: Boolean, D: Boolean },
    news: { C: Boolean, R: Boolean, U: Boolean, D: Boolean },
    settings: { C: Boolean, R: Boolean, U: Boolean, D: Boolean }
  },
  createdAt: Date,
  surName: String,
  username: String,
  password: {
    type: String,
    required: true
  }
});

// объект авторизированного пользователя
const autorizerUserScheme = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  accessToken: String,
  refreshToken: String,
  accessTokenExpiredAt: Date,
  refreshTokenExpiredAt: Date
});

// объект с токенами
const tokenScheme = new Schema({
  accessToken: String,
  refreshToken: String,
  accessTokenExpiredAt: Date,
  refreshTokenExpiredAt: Date
});

// закодируем пароль при сохранении пользователя
userScheme.pre('save', function (next) {
  bcrypt.hash(this.password, 10, (err, hash) => {
    if (err) {
      console.error(err);
      return next();
    }
    this.password = hash;
    next();
  });
});

// закодируем пароль при обновлении данных пользователя
userScheme.pre('updateOne', function (next) {
  bcrypt.hash(this._update.password, 10, (err, hash) => {
    if (err) {
      console.error(err);
      return next();
    }
    this._update.password = hash;
    next();
  });
});

// сравним закодированный пароль пользователя
userScheme.methods.comparePassword = function (candidatePassword) {
  const password = this.password;
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, password, (err, success) => {
      if (err) return reject(err);
      return resolve(success);
    });
  });
};

// модели данных
module.exports.User = mongoose.model('user', userScheme);
module.exports.AutorizedUser = mongoose.model('autorized', autorizerUserScheme);
module.exports.Token = mongoose.model('token', tokenScheme);
