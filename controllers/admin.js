const db = require('../store');
const { setValues } = require('../store/skills');

module.exports.get = (req, res) => {
  res.render('admin', {});
};

module.exports.skills = (req, res) => {
  const { age, concerts, cities, years } = req.body;
  const isValid =
    age !== '' && concerts !== '' && cities !== '' && years !== '';
  const flashMessage = !isValid
    ? 'Ошибка ввода данных! Все поля обязательны для заполнения!'
    : 'Форма отправлена успешно!';

  if (isValid) {
    console.log(11212);
    
    setValues(db, [
      {
        id: 'age',
        number: age
      },
      {
        id: 'concerts',
        number: concerts
      },
      {
        id: 'cities',
        number: cities
      },
      {
        id: 'years',
        number: years
      }
    ]);
  }

  req.flash('msgskill', flashMessage);
  res.locals.msgskill = req.flash('msgskill');
  res.render('admin', req.flash('msgskill'));
  console.log(req.body);
  res.locals.msgslogin = null;
};

// в поле photo - Картинка товара
//     в поле name - Название товара
//     в поле price - Цена товара
module.exports.upload = (req, res) => {
  const { photo, name, price } = req.body;
  const isValid = photo !== '' && name !== '' && price !== '';
  const flashMessage = !isValid
    ? 'Ошибка ввода данных! Все поля обязательны для заполнения!'
    : 'Форма отправлена успешно!';

  req.flash('msgfile', flashMessage);
  res.locals.msgfile = req.flash('msgfile');
  res.render('admin', req.flash('msgfile'));
  console.log(req.body);
  res.locals.msgfile = null;
};
