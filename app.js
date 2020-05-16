require('dotenv').config(); // считываем необходимые переменные окружения
const PORT = process.env.PORT || 3000; // порт сервера

const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const express = require('express');
const app = express();
const socketRun = require('./chat');
const server = require('http').Server(app);
const io = require('socket.io')(server);

// парсинг post запросов от клиента
app.use(bodyParser.urlencoded({ extended: false })); // ключ: значение
app.use(bodyParser.json());

// session cookie
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
app.use((req, res, next) => {
  console.log('CORS-enabled web server');
  cors();
  next();
});
app.use('/', require('./routes'));

// основной сервер
server.listen(PORT, () => {  
  console.log(`Сервер запущен на порту ${PORT}`);
});

// чат на socket.io
socketRun(io);

// error handler
app.use((err, req, res, next) => {
  if (err) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  } else {
    next();
  }
});
