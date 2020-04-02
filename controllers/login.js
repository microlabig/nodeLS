module.exports.get = async (ctx, next) => {
  return await ctx.render('login', {});
};

module.exports.post = async (ctx, next) => {
  const { email, password } = ctx.request.body;
  const isValid = !email || !password;
  const flashMessage = isValid
    ? 'Ошибка ввода данных! Все поля обязательны для заполнения!'
    : 'Форма отправлена успешно!';

  ctx.flash('msgslogin', flashMessage);
  if (isValid) {
    await ctx.render('login', { msgslogin: ctx.flash('msgslogin') });
  } else {
    console.log(ctx.request.body);
    ctx.session.isAuth = true;
    await ctx.redirect('/admin');
  }
};
