require('dotenv').config(); // считываем необходимые переменные окружения
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const express = require('express');
const app = express();

// порт сервера
const PORT = process.env.PORT;

// парсинг post запросов от клиента
app.use(bodyParser.urlencoded({ extended: false })); // ключ: значение
app.use(bodyParser.json());

// app.use(cookieParser());
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

// статика
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index'));

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
