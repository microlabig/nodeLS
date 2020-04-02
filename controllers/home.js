const db = require('../store');
const { getSkills } = require('../store/skills');
const { getProducts } = require('../store/products');

module.exports.get = async (ctx, next) => {
  // req.session.isAuth = false;
  return await ctx.render('index', {
    products: getProducts(db),
    skills: getSkills(db)
  });
};

module.exports.post = async (ctx, next) => {
  const { name, email, message } = ctx.request.body;
  const isValid = !name || !email || !message;
  const flashMessage = isValid
    ? 'Ошибка ввода данных! Все поля обязательны для заполнения!'
    : 'Форма отправлена успешно!';

  // инициализируем flash-сообщение
  ctx.flash('msgsemail', flashMessage);
  // рендерим страницу с flash-сообщением
  console.log(ctx.request.body);
  return await ctx.render('index', {
    products: getProducts(db),
    skills: getSkills(db),
    msgsemail: ctx.flash('msgsemail')
  });
};
