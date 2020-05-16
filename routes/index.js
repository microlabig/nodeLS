const express = require('express');
const router = express.Router();

const ctrlHome = require('../controllers/home');

// MW
const isAuth = (req, res, next) => {
  // если в сессии текущего пользователя есть пометка о том, что он является авторизованным
  // иначе перебросить пользователя на главную страницу сайта
  return req.session.isAuth ? next() : res.status(401).redirect('/');
};

router.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.status(200);
  // для дебага в консоли
  console.log(`\n--- ${req.method} : ${req.url} ---`.toUpperCase());
  next();
});

router.get(/.*$/, isAuth, (req, res) => ctrlHome.get(req, res));

router.post(/.*$/, ctrlHome.post);

router.patch('/api/users/:id/permission', ctrlHome.userPermissionUpdate);
router.patch('/api/news/:id', ctrlHome.newsUpdate);
router.patch('/api/profile', ctrlHome.profileUpdate);

router.delete('/api/*/:id', ctrlHome.delete);

// router.options('*', (req, res) => {
//   res.header('Access-Control-Allow-Origin', '*');
// });

module.exports = router;
