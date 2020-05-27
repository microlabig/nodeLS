const express = require('express');
const router = express.Router();

const ctrl = require('../controllers');

// MW
const isAuth = (req, res, next) => {
  // если в сессии текущего пользователя есть пометка о том, что он является авторизованным
  // иначе перебросить пользователя на главную страницу сайта
  return req.session.isAuth ? next() : res.status(401).redirect('/');
};

router.all('*', (req, res, next) => {
  // для дебага в консоли
  console.log(`\n--- ${req.method} : ${req.url} ---`.toUpperCase());
  next();
});

router.get(/.*$/, isAuth, (req, res) => ctrl.get(req, res));

router.post(/.*$/, ctrl.post);

router.patch('/api/users/:id/permission', ctrl.userPermissionUpdate);
router.patch('/api/news/:id', ctrl.newsUpdate);
router.patch('/api/profile', ctrl.profileUpdate);

router.delete('/api/*/:id', ctrl.delete);

module.exports = router;
