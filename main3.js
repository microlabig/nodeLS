/* eslint-disable */
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
const DELAY = process.env.DELAY
  ? parseInt(process.env.DELAY)
  : parseInt(config.parsed.DELAY);
  
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
    console.log(`HTTP-cервер стартовал на порту ${PORT}`);
  });

// ------------------------
// Обрабатываем GET запрос
// ------------------------
server.on('request', (req, res) => {
  const isOnlyHtmlRequest = req.headers.accept.indexOf('text/html', 0);
  const method = req.method;

  if (method === 'GET' && isOnlyHtmlRequest !== -1) {
      let date = new Date().toUTCString();

      const timer = setInterval(() => {
        date = new Date().toUTCString();
        console.log(date);
      }, INTERVAL);

      setTimeout(() => {
        clearInterval(timer);
        res.write(date);
        console.log('close');
        res.end();
      }, DELAY);
  }
});

// ----------------------------
// Обрабатываем ошибки клиента
// ----------------------------
server.on('clientError', (err, socket) => {
  console.log(err.message);
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

// ---------------------------
// Обрабатываем прочие ошибки
// ---------------------------
process.on('error', err => {
  console.log(err.message);
  server.close();
});
