const Router = require('koa-router');
const router = new Router();

const ctrlHome = require('../controllers/home');
const ctrlLogin = require('../controllers/login');
const ctrlAdmin = require('../controllers/admin');

// MW
const isAuth = async (ctx, next) => {
  // если в сессии текущего пользователя есть пометка о том, что он является администратором
  // иначе перебросить пользователя на главную страницу сайта
  return ctx.session.isAuth ? next() : ctx.redirect('/login');
};

// MW для лога url
router.get(/.*/, async (ctx, next) => {
  console.log(`Request: ${ctx.request.method}, ${ctx.request.url}`);
  await next();
});

router.get('/', ctrlHome.get);
router.post('/', ctrlHome.post);

router.get('/login', ctrlLogin.get);
router.get(
  /login(\.html?)?$/,
  async (ctx, next) => ctx.redirect('/login')
);
router.post('/login', ctrlLogin.post);

router.get('/admin', isAuth, ctrlAdmin.get);
router.get(
  /admin(\.html?)?$/,
  isAuth,
  async (ctx, next) => ctx.redirect('/admin')
);
router.post('/admin/skills', ctrlAdmin.skills);
router.post('/admin/upload', ctrlAdmin.product);

module.exports = router;
