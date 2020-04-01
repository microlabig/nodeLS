const db = require('../store');
const { getValues } = require('../store/skills');

module.exports.get = (req, res) => {
  // req.session.isAuth = false;
  res.render('index', { skills: getValues(db) });
};

module.exports.post = (req, res) => {
  const { name, email, message } = req.body;
  const isValid = !name || !email || !message;
  const flashMessage = isValid
    ? 'Ошибка ввода данных! Все поля обязательны для заполнения!'
    : 'Форма отправлена успешно!';

  // инициализируем flash-сообщение
  req.flash('msgsemail', flashMessage);
  // записываем flash-сообщение
  res.locals.msgsemail = req.flash('msgsemail');
  // рендерим страницу с flash-сообщением
  res.render('index', req.flash('msgsemail'));
  console.log(req.body);
  // очищаем flash-сообщение для данной страницы
  res.locals.msgsemail = null;
};
