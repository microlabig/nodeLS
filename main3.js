/* eslint-disable */
const config = require('dotenv').config();
const http = require('http');

// порт сервера
const PORT = process.env.PORT
  ? parseInt(process.env.PORT)
  : parseInt(config.parsed.PORT);
// задержка между тиками (в мс)
const DELAY = process.env.DELAY
  ? parseInt(process.env.DELAY)
  : parseInt(config.parsed.DELAY);
// лимит таймера (количество тиков)
const TIMELIMIT = process.env.TIMELIMIT
  ? parseInt(process.env.TIMELIMIT)
  : parseInt(config.parsed.TIMELIMIT);

let connections = []; // список подключившихся

// -----------------------------------------------
// Функция возвращает текущую дату в формате стр.
// -----------------------------------------------
function getCurrentDateTime () {
  const currDate = new Date(); // текущая дата

  let month = currDate.getMonth() + 1; // т.к. январь - 1, не 0!
  let day = currDate.getDate();
  let hours = currDate.getHours();
  let minutes = currDate.getMinutes();
  let seconds = currDate.getSeconds();

  // сформируем двузначные значения
  month = month < 10 ? '0' + month : '' + month;
  day = day < 10 ? '0' + day : '' + day;
  hours = hours < 10 ? '0' + hours : '' + hours;
  minutes = minutes < 10 ? '0' + minutes : '' + minutes;
  seconds = seconds < 10 ? '0' + seconds : '' + seconds;

  // сформируем текущую дату в нужный формат по UTC
  return `${day}.${month}.${currDate.getFullYear()}, ${hours.toUpperCase()}:${minutes}:${seconds}`;
}

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
    let tick = 0;

    connections.push(res);
    setTimeout(function run () {
      const date = getCurrentDateTime();
      console.log(date);
      if (++tick > TIMELIMIT) {
        connections.forEach((res, i) => {
          res.write(date);
          res.end();
          console.log(`${i}'nth is closed`);
        });
        connections = [];
        tick = 0;
      } else {
        setTimeout(run, DELAY);
      }
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
