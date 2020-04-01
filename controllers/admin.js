module.exports.get = (req, res) => {
  res.render('admin', {});
};

module.exports.skills = (req, res) => {
  const { age, concerts, cities, years } = req.body;
  const checkFields = age !== '' && concerts !== '' && cities !== '' && years !== '';
  const flashMessage = !checkFields
    ? 'Ошибка ввода данных! Все поля обязательны для заполнения!'
    : 'Форма отправлена успешно!';

  req.flash('msgskill', flashMessage);
  res.locals.msgskill = req.flash('msgskill');
  res.render('admin', req.flash('msgskill'));
  console.log(req.body);
  res.locals.msgslogin = null;
};
