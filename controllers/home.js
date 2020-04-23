// require('dotenv').config();
// const jwt = require('jsonwebtoken');
// const SECRET_KEY = process.env.JWT_SECRET || 'secret';
const {
  saveUserData,
  packUserData,
  checkUserData,
  findUserById,
  genToken,
  getUsers,
  updateUserPermission,
  deleteUser
} = require('../api/users');
const {
  getNews,
  saveNews,
  packNewsData,
  deleteNews,
  updateNews
} = require('../api/news');

const { UserDB, NewsDB } = require('../db');

let currentUser = null;

// ------------
//     GET
// ------------
module.exports.get = async (req, res) => {
  // req.session.isAuth = false;
  const url = req.url;

  switch (url) {
    case '/api/profile':
      // const findUser = await findUserById(req.session.id);
      // console.log('---', currentUser);
      // if (req.session.id) {
      //   res.status(200).json(currentUser); // TODO: найти пользователя
      // } else {
      //   res.status(401).json({ message: 'Не авторизованы' });
      // }
      break;

    // получений новостей
    case '/api/news':
      const news = await getNews();

      if (news) {
        res.status(200).json(news);
      } else {
        res.status(200).json({});
      }
      break;

    case '/api/users':
      res.status(200).json(await getUsers());
      break;

    default:
      res.redirect('/');
      break;
  }
};

// ------------
//     POST
// ------------
module.exports.post = async (req, res) => {
  const url = req.url;
  const body = req.body;

  console.log('Request BODY:', req.body);

  switch (url) {
    // регистрация нового пользователя
    case '/api/registration':
      const userData = await packUserData(body);

      if (userData) {
        const newUser = new UserDB.User({ ...userData });
        const saveStatus = await saveUserData(newUser);
        if (saveStatus) {
          const obj = await checkUserData(body);
          res.status(201).json(genToken(obj)); // "создано"
        } else {
          res.status(401).json({ message: 'Пользователь уже существует' }); // "нет содержимого"
        }
      } else {
        res.status(401).json({ message: 'Введите все поля' });
      }
      break;

    // логин пользователя
    case '/api/login':
      currentUser = await checkUserData(body);

      if (currentUser) {
        req.session.isAuth = true;
        req.session.id = currentUser.id;
        res.status(202).json(genToken(currentUser)); // "принято"
      } else {
        res.status(401).json({ message: 'Ошибка ввода имени или пароля' }); // "не авторизован (не представился)"
      }
      break;

    // обновление токена
    case '/api/refresh-token':
      break;

    // сохранение новости
    case '/api/news':
      const newsData = await packNewsData(body, currentUser);
      if (newsData) {
        const newNews = new NewsDB.News({ ...newsData });
        const saveStatus = await saveNews(newNews);
        if (saveStatus) {
          res.status(201).json(saveStatus); // "создано"
        } else {
          res.status(204).json({ message: 'Ошибка сохранения' }); // "нет содержимого"
        }
      } else {
        res.status(204).json({ message: 'Введите все поля' });
      }
      break;

    default:
      res.json({ success: false, err: 'Error' });
      break;
  }
};

// ------------
//    PATCH
// ------------
// изменение прав пользователя по id (permission)
module.exports.userUpdate = async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const status = await updateUserPermission(id, body);
  if (status) {
    res.status(200).json({ message: 'Права изменены' });
  } else {
    res.status(500).json({ message: 'Ошибка изменения прав' });
  }
};
// изменение других данных
module.exports.patch = async (req, res) => {
  const what = req.url.match(/^\/api\/.{0,5}\/?/)[0];
  const id = req.params.id;
  const body = req.body;
  let status = null;
  console.log(body, id, what);

  switch (what) {
    // обновление данных пользователя
    case '/api/profile/':
      status = await updateProfile(id, body);
      break;

    // изменение новости по id
    case '/api/news/':
      status = await updateNews(id, body);
      break;

    default:
      res.status(404).json({ message: 'Неизвестная ошибка' });
      break;
  }
  if (status) {
    res.status(200).json(status);
  } else {
    res.status(500).json({ message: 'Ошибка изменения' });
  }
};

// ------------
//    DELETE
// ------------
module.exports.delete = async (req, res) => {
  const what = req.url.match(/^\/api\/.{0,5}\/?/)[0];
  const id = req.params.id;
  let status = null;
  console.log(1);

  switch (what) {
    // удаление пользователя по id
    case '/api/users/':
      status = await deleteUser(id);
      break;

    // удаление новости по id
    case '/api/news/':
      status = await deleteNews(id);
      break;

    default:
      res.status(404).json({ message: 'Неизвестная ошибка' });
      break;
  }
  if (status) {
    res.status(200).json(status);
  } else {
    res.status(500).json({ message: 'Ошибка удаления' });
  }
};
