module.exports.get = (req, res) => {
  res.render('login', {});
};

module.exports.post = (req, res) => {
  const { email, password } = req.body;
  const checkFields = !email || !password;
  const flashMessage = checkFields
    ? 'Ошибка ввода данных! Все поля обязательны для заполнения!'
    : 'Форма отправлена успешно!';

  req.flash('msgslogin', flashMessage);
  if (checkFields) {
    res.render('login', req.flash('msgslogin'));
  } else {
    console.log(req.body);
    req.session.isAuth = true;
    res.redirect('/admin');
  }
  res.locals.msgslogin = null;
};
