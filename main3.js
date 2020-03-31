// /* eslint-disable */
const config = require('dotenv').config();
const http = require('http');

// порт сервера
const PORT = process.env.PORT
  ? parseInt(process.env.PORT)
  : parseInt(config.parsed.PORT);
// задержка между тиками (в мс)
const INTERVAL = process.env.INTERVAL
  ? parseInt(process.env.INTERVAL)
  : parseInt(config.parsed.INTERVAL);
// лимит таймера (количество тиков)
const TIMEOUT = process.env.TIMEOUT
  ? parseInt(process.env.TIMEOUT)
  : parseInt(config.parsed.TIMEOUT);

let timer = null; // ИД интервального таймера
let isRunning = false; // признак запуска интервального таймера
let date = null; // текущая дата

// ---------------
// Создаем сервер
// ---------------
const server = http
  .createServer((req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked'); // отдавать данные частями
    res.write('<h1>Okay</h1>');
  })
  .listen(PORT, err => {
    if (err) {
      throw new Error(err.message);
    }
    console.log(`TIMEOUT=${TIMEOUT / 1000}s, INTERVAL=${INTERVAL / 1000}s`);
    console.log(`HTTP-cервер стартовал на порту ${PORT}`);
  });

// ------------------------
// Обрабатываем GET запрос
// ------------------------
server.on('request', (req, res) => {
  const isOnlyHtmlRequest = req.headers.accept.indexOf('text/html', 0);
  const method = req.method;
  const url = req.url;

  if (method === 'GET' && isOnlyHtmlRequest !== -1 && url === '/') {
    if (!isRunning) {
      let tick = 0;

      isRunning = true;
      timer = setInterval(() => {
        date = new Date().toUTCString();
        console.log(date);
        tick += INTERVAL;
        if (tick >= TIMEOUT) {
          isRunning = false;
          res.write(date);
          res.end();
          clearInterval(timer);
        }
      }, INTERVAL);
    }
  }
});

// ----------------------------
// Обрабатываем ошибки клиента
// ----------------------------
server.on('clientError', (err, socket) => {
  console.log(err.message);
  socket.end('HTTP/1.1 400 Bad Request\r\n');
});

// ---------------------------
// Обрабатываем прочие ошибки
// ---------------------------
process.on('error', err => {
  console.error(err.message);
  server.close();
});
