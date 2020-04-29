const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const util = require('util');
const unlink = util.promisify(fs.unlink); // делаем из ф-ии колбека ф-ию промис

const moment = require('moment');
const jwt = require('jwt-simple');

const { UserDB } = require('../db');
const IMG_DEFAULT_PATH = null; // './assets/img/users/default.jpg';

const { validateData } = require('../helpers');

// возвращает список всех пользователей из БД
const getUsers = async () => {
  return await UserDB.User.find({});
};

module.exports.getUsers = getUsers;

// упаковка данных пользователя
module.exports.packUserData = async (userObj, options = {}) => {
  if (validateData(userObj)) {
    const userList = await UserDB.User.find({});
    const id = userList.length;

    return {
      id,
      firstName: userObj.firstName,
      image: IMG_DEFAULT_PATH,
      middleName: userObj.middleName,
      permission: {
        chat: { C: true, R: true, U: true, D: true },
        news: { C: true, R: true, U: true, D: true },
        settings: { C: true, R: true, U: true, D: true }
      },
      createdAt: new Date(Date.now()).toUTCString(),
      surName: userObj.surName,
      username: userObj.username,
      password: userObj.password
    };
  }
  return null;
};

// сохранение данных пользователя
module.exports.saveUserData = async (obj) => {
  try {
    const userName = await UserDB.User.findOne({
      username: obj.username
    });
    // если пользователя с таким именем не существует
    if (!userName) {
      const doc = await obj.save();
      console.log('User saved:', doc);
      return true;
    } else {
      console.log('User exist!');
      return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};

// генерация токенов
module.exports.genToken = (user) => {
  const accessTokenExpiredAt = moment().utc().add({ asMinutes: 30 }).unix();
  const accessToken = jwt.encode(
    {
      exp: accessTokenExpiredAt,
      username: user.username
    },
    process.env.JWT_SECRET
  );
  const refreshTokenExpiredAt = moment().utc().add({ days: 30 }).unix();
  const refreshToken = jwt.encode(
    {
      exp: refreshTokenExpiredAt,
      username: user.username
    },
    process.env.JWT_SECRET
  );

  return {
    ...user._doc,
    accessToken: accessToken,
    accessTokenExpiredAt: Date.parse(moment.unix(accessTokenExpiredAt).format()),
    refreshToken: refreshToken,
    refreshTokenExpiredAt: Date.parse(moment.unix(refreshTokenExpiredAt).format())
  };
};

// возвращает пользователя по JWT-инфо
module.exports.getUserByJWT = async (token) => {
  try {
    const decodedData = jwt.decode(token, process.env.JWT_SECRET);
    const { username } = decodedData;
    const findUser = await UserDB.User.findOne({ username });

    if (findUser) {
      if (findUser._doc.hasOwnProperty('password')) {
        delete findUser._doc.password;
      }
      console.log('Get Profile Data:', findUser);
      return findUser;
    } else {
      throw new Error('Ошибка удаления из БД');
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};


// проверка данных пользователя
module.exports.checkUserData = async (user) => {
  try {
    const findUser = await UserDB.User.findOne({
      username: user.username
    });

    if (findUser) {
      const success = await findUser.comparePassword(user.password);
      if (success) {
        return findUser;
      } else {
        throw new Error('Пароли не совпадают');
      }
    } else {
      throw new Error('Пользователь не найден');
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};

// поиск пользователя по id
module.exports.findUserById = async (id) => {
  try {
    const findUser = await UserDB.User.findOne({
      id: id
    });

    if (findUser) {
      return findUser;
    } else {
      throw new Error('Пользователь не найден');
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};

// изменение прав текущего пользователя
module.exports.updateUserPermission = async (id, body) => {
  try {
    const user = await UserDB.User.findOne({ id });
    user.permission = { ...body.permission };
    const status = await UserDB.User.updateOne({ id }, user);
    if (status && status.ok === 1) {
      console.log('User updated:', user);
      return await getUsers();
    } else {
      throw new Error('Ошибка изменения данных в БД');
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};

// удаление пользователя и его аватара
module.exports.deleteUser = async (id) => {
  try {
    const findUser = await UserDB.User.findOne({ id });
    const status = await UserDB.User.deleteOne({ id });
    if (status && status.ok === 1) {
      await unlink(path.join(process.cwd(), 'public', findUser.image));
      console.log('News deleted:', status);
      return await getUsers();
    } else {
      throw new Error('Ошибка удаления из БД');
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};

// обновление данных пользователя и сохранение аватара
module.exports.updateProfile = (currentUser, req, res, next) => {
  // входные данные
  const form = new formidable.IncomingForm();
  // папка загрузки
  const upload = path.join('/public', 'assets', 'users');
  // сформируем полный путь до папки загрузки
  form.uploadDir = path.join(process.cwd(), upload);

  if (!fs.existsSync(form.uploadDir)) {
    fs.mkdirSync(form.uploadDir);
  }

  // распарсим входные данные
  form.parse(req, (err, fields, files) => {
    if (err) {
      return next(err);
    }

    const isValid = files.avatar && validateData(fields);

    // если все данные валидны, запишем в базу
    if (isValid) {
      // путь, относительно корневой директории
      const fileName = path.join(upload, files.avatar.name);

      // переименуем файл со случайно сгенерированным именем в имя, которое клиент отправил
      fs.rename(files.avatar.path,
        path.join(process.cwd(), fileName),
        async (err) => {
          if (err) {
            console.error(err.message);
            return false;
          }
          // взять оставшуюся часть пути, начиная с assets
          const pathToImage = fileName.substr(fileName.indexOf('assets'));
          const password = fields.newPassword
            ? fields.newPassword
            : fields.oldPassword;

          try {
            const updatedUser = {
              ...currentUser._doc,
              image: pathToImage,
              firstName: fields.firstName,
              surName: fields.surName,
              middleName: fields.middleName,
              password
            };
            const status = await UserDB.User.updateOne(
              { id: currentUser.id },
              updatedUser
            );

            currentUser._doc = { ...updatedUser };
            if (currentUser._doc.hasOwnProperty('password')) {
              delete currentUser._doc.password;
            }
            if (status && status.ok === 1) {
              console.log('User updated:', updatedUser);
              res.status(200).json(updatedUser);
              return true;
            } else {
              throw new Error('Ошибка изменения данных в БД');
            }
          } catch (error) {
            console.error(error);
            return false;
          }
        }
      );
    } else {
      res.status(500).json({ message: 'Неверно заполнены данные' });
    }
  });
};
