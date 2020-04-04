const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const db = require('../store');
const { getSkillValues, setSkills } = require('../store/skills');
const { setProduct } = require('../store/products');

module.exports.get = async (ctx, next) => {
  return await ctx.render('admin', { skills: getSkillValues(db) });
};

module.exports.skills = async (ctx, next) => {
  const { age, concerts, cities, years } = ctx.request.body;
  const isValid =
    age !== '' && concerts !== '' && cities !== '' && years !== '';
  const flashMessage = !isValid
    ? 'Ошибка ввода данных! Все поля обязательны для заполнения!'
    : 'Форма отправлена успешно!';

  // если все данные валидны, запишем в базу
  if (isValid) {
    setSkills(
      db,
      Object.keys(ctx.request.body).map((item, index) => {
        return {
          id: item,
          number: Object.values(ctx.request.body)[index]
        };
      })
    );
  }

  ctx.flash('msgskill', flashMessage);
  console.log(ctx.request.body);
  return await ctx.render('admin', {
    skills: getSkillValues(db),
    msgskill: ctx.flash('msgskill')
  });
};

module.exports.product = async (ctx, next) => {
  // входные данные
  const form = new formidable.IncomingForm();
  // папка загрузки
  const upload = path.join('/static', 'assets', 'img', 'products');
  // сформируем полный путь до папки загрузки
  form.uploadDir = path.join(process.cwd(), upload);
  // распарсим входные данные

  try {
    await new Promise((resolve, reject) => {
      form.parse(ctx.req, (err, fields, files) => {
        if (err) {
          reject(err);
          return next(err);
        }

        const { name, price } = fields;
        const isValid = files && name !== '' && price !== '';
        const flashMessage = !isValid
          ? 'Ошибка ввода данных! Все поля обязательны для заполнения!'
          : 'Форма отправлена успешно!';

        ctx.flash('msgfile', flashMessage);
        console.log({ ...fields, photo: files.photo.name });

        // путь, относительно корневой директории
        const fileName = path.join(upload, files.photo.name);

        // переименуем файл со случайно сгенерированным именем в имя, которое клиент отправил
        fs.rename(files.photo.path, path.join(process.cwd(), fileName), err => {
          if (err) {
            reject(err);
            console.error(err.message);
            return;
          }
          // если все данные валидны, запишем в базу
          if (isValid) {
            // взять оставшуюся часть пути, начиная с assets
            const src = fileName.substr(fileName.indexOf('assets'));
            // запишем в базу
            setProduct(db, { ...fields, src });
          }
          resolve();
        });
      });
    });
  } catch (error) {
    ctx.throw(error);
  } finally {
    await ctx.render('admin', {
      skills: getSkillValues(db),
      msgfile: ctx.flash('msgfile')
    });
  }
};
