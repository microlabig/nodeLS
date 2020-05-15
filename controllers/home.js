const UsersAPI = require('../api/users');
const NewsAPI = require('../api/news');

const { UserDB, NewsDB } = require('../db');

// ------------
//     GET
// ------------
module.exports.get = async (req, res) => {
  const url = req.url;
  let status = null;

  switch (url) {
    // получение профиля по JWT в authorization headers запроса
    case '/api/profile':
      if (req.headers.authorization) {
        // JWT-инфо
        status = await UsersAPI.getUserByJWT(req.headers.authorization);
      }
      break;

    // получений новостей
    case '/api/news':
      status = await NewsAPI.getNews();
      break;

    // получение списка всех пользователей
    case '/api/users':
      status = await UsersAPI.getUsers();
      break;

    default:
      res.redirect('/');
      break;
  }
  if (status) {
    res.status(200).json(status);
  }
};

// ------------
//     POST
// ------------
module.exports.post = async (req, res) => {
  const url = req.url;
  const body = req.body;
  let userData = null;
  let newsData = null;
  let checkedUser = null;

  switch (url) {
    // регистрация нового пользователя
    case '/api/registration':
      userData = await UsersAPI.packUserData(body);
      if (userData) {
        const newUser = new UserDB.User({ ...userData });
        const saveStatus = await UsersAPI.saveUserData(newUser);
        if (saveStatus) {
          const obj = await UsersAPI.checkUserData(body);
          res.status(201).json(UsersAPI.genToken(obj)); // "создано"
        } else {
          res.status(401).json({ message: 'Пользователь уже существует' }); // "нет содержимого"
        }
      } else {
        res.status(401).json({ message: 'Введите все поля' });
      }
      break;

    // логин пользователя
    case '/api/login':
      checkedUser = await UsersAPI.checkUserData(body);
      if (checkedUser) {
        req.session.isAuth = true;
        req.session.uid = checkedUser.id;
        res.status(202).json(UsersAPI.genToken(checkedUser)); // "принято"
      } else {
        res.status(401).json({ message: 'Ошибка ввода имени или пароля' }); // "не авторизован (не представился)"
      }
      break;

    // обновление токена
    case '/api/refresh-token':
      if (req.headers.authorization) {
        // JWT-инфо
        const findUser = await UsersAPI.getUserByJWT(req.headers.authorization);
        if (findUser) {
          res.status(201).json(UsersAPI.genToken(findUser));
        } else {
          res.status(500).json({ message: 'Пользователь в БД не найден' });
        }
      }
      break;

    // сохранение новости
    case '/api/news':
      if (req.headers.authorization) {
        // JWT-инфо
        const findedUser = await UsersAPI.getUserByJWT(
          req.headers.authorization
        );
        if (findedUser) {
          newsData = await NewsAPI.packNewsData(body, findedUser);
          if (newsData) {
            const newNews = new NewsDB.News({ ...newsData });
            const saveStatus = await NewsAPI.saveNews(newNews);
            if (saveStatus) {
              res.status(201).json(saveStatus); // "создано"
            } else {
              res.status(204).json({ message: 'Ошибка сохранения' }); // "нет содержимого"
            }
          }
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
module.exports.userPermissionUpdate = async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const status = await UsersAPI.updateUserPermission(id, body);
  if (status) {
    res.status(200).json({ message: 'Права изменены' });
  } else {
    res.status(500).json({ message: 'Ошибка изменения прав' });
  }
};

// изменение новости
module.exports.newsUpdate = async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const status = await NewsAPI.updateNews(id, body);

  if (status) {
    res.status(200).json(status);
  } else {
    res.status(500).json({ message: 'Ошибка изменения' });
  }
};

// изменение профиля текущего пользователя
module.exports.profileUpdate = async (req, res, next) => {
  let currentUser = null;

  if (req.headers.authorization) {
    // JWT-инфо
    currentUser = await UsersAPI.getUserByJWT(req.headers.authorization);
    if (currentUser) {
      UsersAPI.updateProfile(currentUser, req, res, next);
    } else {
      res.status(500).json({ message: 'Пользователь не найден в БД' });
    }
  }
};

// ------------
//    DELETE
// ------------
module.exports.delete = async (req, res) => {
  const what = req.url.match(/^\/api\/.{0,5}\/?/)[0];
  const id = req.params.id;
  let status = null;

  switch (what) {
    // удаление пользователя по id
    case '/api/users/':
      status = await UsersAPI.deleteUser(id);
      break;

    // удаление новости по id
    case '/api/news/':
      status = await NewsAPI.deleteNews(id);
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
