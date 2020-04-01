const config = require('dotenv').config();
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const express = require('express');
const app = express();

// порт сервера
const PORT = process.env.PORT
  ? parseInt(process.env.PORT)
  : parseInt(config.PORT);

// парсинг post запросов от клиента
app.use(bodyParser.urlencoded({ extended: false })); // ключ: значение
app.use(bodyParser.json());

app.use(cookieParser());
app.use(
  session({
    secret: 'common:session',
    key: 'sessionkey',
    cookie: {
      path: '/',
      httpOnly: true,
      maxAge: 10 * 60 * 1000
    },
    resave: false, // для того, чтобы сеансы не удалялись, даже если они простаивают в течение длительного времени (=true)
    saveUninitialized: false // предотвращает перегрузку приложения слишком большим количеством пустых сеансов (=true)
  })
);
app.use(flash());
// app.use((req, res, next) => {
//   res.locals.msgsemail = req.flash("msgsemail");
//   next();
// });

// статика
app.use(express.static(path.join(__dirname, 'static')));

// PUG
app.set('views', './views/pages');
app.set('view engine', 'pug');

// роутер
app.use('/', (req, res, next) => {
  console.log(`Request: ${req.method}, ${req.url}`);
  next();
});
app.use('/', require('./routes/index'));

// обработка ошибки 404
app.use((req, res, next) => {
  const err = new Error('Страница не найдена!');
  err.status = 404;
  next(err);
});

// обработчик ошибок
app.use((err, req, res, next) => {
  console.error(err, '\n');
  err.status = err.status || 500;
  res.status(err.status);
  res.render('error', { message: err.message, status: err.status, error: err });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
