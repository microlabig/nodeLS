const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const db = require('../store');
const { setSkills } = require('../store/skills');
const { setProduct } = require('../store/products');

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

  // если все данные валидны, запишем в базу
  if (isValid) {
    setSkills(
      db,
      Object.keys(req.body).map((item, index) => {
        return {
          id: item,
          number: Object.values(req.body)[index]
        };
      })
    );
  }

  req.flash('msgskill', flashMessage);
  res.locals.msgskill = req.flash('msgskill');
  res.render('admin', req.flash('msgskill'));
  console.log(req.body);
  res.locals.msgslogin = null;
};

module.exports.product = (req, res, next) => {
  // входные данные
  const form = new formidable.IncomingForm();
  // папка загрузки
  const upload = path.join('/static', 'assets', 'img', 'products');
  // сформируем полный путь до папки загрузки
  form.uploadDir = path.join(process.cwd(), upload);
  // распарсим входные данные
  form.parse(req, (err, fields, files) => {
    if (err) {
      return next(err);
    }

    const { name, price } = fields;
    const isValid = files && name !== '' && price !== '';
    const flashMessage = !isValid
      ? 'Ошибка ввода данных! Все поля обязательны для заполнения!'
      : 'Форма отправлена успешно!';

    req.flash('msgfile', flashMessage);
    res.locals.msgfile = req.flash('msgfile');
    res.render('admin', req.flash('msgfile'));
    console.log({ ...fields, photo: files.photo.name });
    res.locals.msgfile = null;

    // если все данные валидны, запишем в базу
    if (isValid) {
      // путь, относительно корневой директории
      const fileName = path.join(upload, files.photo.name);
      // переименуем файл со случайно сгенерированным именем в имя, которое клиент отправил
      fs.rename(files.photo.path, path.join(process.cwd(), fileName), err => {
        if (err) {
          console.error(err.message);
          return;
        }
        // взять оставшуюся часть пути, начиная с assets
        const src = fileName.substr(fileName.indexOf('assets'));
        // запишем в базу
        setProduct(db, { ...fields, src });
      });
    }
  });
};
