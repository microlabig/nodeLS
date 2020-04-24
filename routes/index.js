const express = require('express');
const router = express.Router();

const ctrlHome = require('../controllers/home');

// MW
const isAuth = (req, res, next) => {
  // если в сессии текущего пользователя есть пометка о том, что он является администратором
  // иначе перебросить пользователя на главную страницу сайта
  return req.session.isAuth ? next() : res.status(401).redirect('/');
};

router.get(/.*$/, isAuth, (req, res) => ctrlHome.get(req, res));

router.post(/.*$/, ctrlHome.post);

router.patch('/api/users/:id/permission', ctrlHome.userPermissionUpdate);
router.patch('/api/news/:id', ctrlHome.newsUpdate);
router.patch('/api/profile', ctrlHome.profileUpdate);

router.delete('/api/*/:id', ctrlHome.delete);

module.exports = router;
