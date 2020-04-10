const express = require('express');
const router = express.Router();

const ctrlHome = require('../controllers/home');
// const ctrlLogin = require('../controllers/login');
// const ctrlAdmin = require('../controllers/admin');

// MW
// const isAuth = (req, res, next) => {
//   // если в сессии текущего пользователя есть пометка о том, что он является администратором
//   // иначе перебросить пользователя на главную страницу сайта
//   return req.session.isAuth ? next() : res.redirect('/login');
// };

router.get(/.*$/, ctrlHome.get);
router.post(/.*$/, ctrlHome.post);
router.patch(/.*$/, ctrlHome.patch);
router.delete('/api/users/:id', ctrlHome.delete);

// router.get('/login', ctrlLogin.get);
// router.get('/login(.html?)?$/', (req, res) => res.redirect('/login'));
// router.post('/login', ctrlLogin.post);

// router.get('/admin', isAuth, ctrlAdmin.get);
// router.get('/admin(.html?)?$/', isAuth, (req, res) => res.redirect('/admin'));
// router.post('/admin/skills', ctrlAdmin.skills);
// router.post('/admin/upload', ctrlAdmin.product);

module.exports = router;
