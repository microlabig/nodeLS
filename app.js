const config = require('dotenv').config();
const flash = require('koa-better-flash');
const Koa = require('koa');
const app = new Koa();
const serve = require('koa-static');
const koaBody = require('koa-body');
const Pug = require('koa-pug');
const pug = new Pug({
  viewPath: './views/pages',
  basedir: './views',
  app: app
});

const session = require('koa-generic-session');

// порт сервера
const PORT = process.env.PORT
  ? parseInt(process.env.PORT)
  : parseInt(config.PORT);

app.use(koaBody());

app.keys = ['common:session'];
app.use(session());
app.use(flash());

// статика
app.use(serve('./static'));

// роутер
app.use(require('./routes/index').routes());

// обработчик ошибок
app.use(async (ctx, next) => {
  try {
    await next();
    if (ctx.status >= 400) {
      ctx.throw(ctx.status);
    }
  } catch (err) {
    ctx.status = err.status;
    console.log(err);
    await ctx.render('error', {
      message: err.message,
      status: err.status,
      error: err
    });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
