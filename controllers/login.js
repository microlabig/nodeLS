module.exports.get = (req, res) => {
  res.render('login', {});
};

module.exports.post = (req, res) => {
  const { email, password } = req.body;
  const isValid = !email || !password;
  const flashMessage = isValid
    ? 'Ошибка ввода данных! Все поля обязательны для заполнения!'
    : 'Форма отправлена успешно!';

  req.flash('msgslogin', flashMessage);
  if (isValid) {
    res.render('login', { msgslogin: req.flash('msgslogin') });
  } else {
    console.log(req.body);
    req.session.isAuth = true;
    res.redirect('/admin');
  }
};
