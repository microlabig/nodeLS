/* eslint-disable */
const config = require('dotenv').config();
const path = require('path');
const express = require('express');
const app = express();

// порт сервера
const PORT = process.env.PORT
  ? parseInt(process.env.PORT)
  : parseInt(config.PORT);

// статика
app.use(express.static(path.join(__dirname, 'static')));

// PUG
app.set('views', './views/pages');
app.set('view engine', 'pug');

// роутер
app.use('/', require('./routes/index'));

// обработка ошибки 404
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
})

// обработчик ошибок
app.use(function (err, req, res, next) {
  // render the error page
  res.status(err.status || 500);
  res.render('error', { message: err.message, error: err });
})


app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
})