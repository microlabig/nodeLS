const express = require('express');
const router = express.Router();
const cors = require('cors');

// app.use(cors({
//   origin: '*',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }));

const ctrlHome = require('../controllers/home');

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

router.get(/.*$/, isAuth, (req, res) => ctrlHome.get(req, res));

router.post(/.*$/, cors({
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}), ctrlHome.post);

router.patch('/api/users/:id/permission', cors({
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}), ctrlHome.userPermissionUpdate);
router.patch('/api/news/:id', cors({
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}), ctrlHome.newsUpdate);
router.patch('/api/profile', cors({
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}), ctrlHome.profileUpdate);

router.delete('/api/*/:id', cors({
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}), ctrlHome.delete);

// router.options('*', (req, res) => {
//   res.header('Access-Control-Allow-Origin', '*');
// });

module.exports = router;
