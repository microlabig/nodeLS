// const db = require('../store');
// const { getSkills } = require('../store/skills');
// const { getProducts } = require('../store/products');

module.exports.get = (req, res) => {
  // req.session.isAuth = false;
  const url = req.url;

  switch (url) {
    case '/api/profile':
      break;
    case '/api/news':
      break;
    case '/api/users':
      break;
    default:
      res.redirect('/');
      break;
  }
};

module.exports.post = (req, res) => {
  const url = req.url;

  switch (url) {
    case '/api/registration':
      break;
    case '/api/login':
      break;
    case '/api/refresh-token':
      break;
    case '/api/news':
      break;

    default:
      res.send('Error');
      break;
  }
};

module.exports.patch = (req, res) => {
  const url = req.url;

  switch (url) {
    case '/api/profile':
      break;
    case '/api/news/:id':
      break;
    case '/api/users/:id/permission':
      break;

    default:
      res.send('Error');
      break;
  }
};

module.exports.delete = (req, res) => {
  const url = req.url;

  switch (url) {
    case '/api/users/:id':
      break;
    case '/api/news/:id':
      break;

    default:
      res.send('Error');
      break;
  }
};

// module.exports.post = (req, res) => {
//   const { name, email, message } = req.body;
//   const isValid = !name || !email || !message;
//   const flashMessage = isValid
//     ? 'Ошибка ввода данных! Все поля обязательны для заполнения!'
//     : 'Форма отправлена успешно!';

//   // инициализируем flash-сообщение
//   req.flash('msgsemail', flashMessage);
//   // рендерим страницу с flash-сообщением
//   res.render('index', {
//     products: getProducts(db),
//     skills: getSkills(db),
//     msgsemail: req.flash('msgsemail')
//   });
//   console.log(req.body);
// };
