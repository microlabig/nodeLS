require('dotenv').config(); // считываем необходимые переменные окружения
const PORT = process.env.PORT || 3000; // порт сервера

const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const express = require('express');
const app = express();
const socketRun = require('./chat');

// парсинг post запросов от клиента
app.use(bodyParser.urlencoded({ extended: false })); // ключ: значение
app.use(bodyParser.json());

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

// роутер
// const allowCrossDomain = (req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//   res.header(
//     'Access-Control-Allow-Headers',
//     'Content-Type, Authorization, Content-Length, X-Requested-With'
//   );
//   // intercept OPTIONS method
//   if (req.method === 'OPTIONS') {
//     res.send(200);
//   } else {
//     next();
//   }
// };
// app.use(allowCrossDomain);
app.use(cors());
app.use('/', require('./routes'));

// сокет на socket.io (чат)
socketRun();

// основной сервер
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
