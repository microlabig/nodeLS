const moment = require('moment');
const jwt = require('jwt-simple');

const { UserDB } = require('../db');
const IMG_DEFAULT_PATH = null; // './assets/img/users/default.jpg';

const { validateData } = require('../helpers');

const getUsers = async () => {
  return await UserDB.User.find({});
};

// упаковка данных пользователя
const packUserData = async (userObj, options = {}) => {
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
const saveUserData = async (obj) => {
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

// генерация токена
const genToken = (user) => {
  const accessTokenExpiredAt = moment().utc().add({ minutes: 30 }).unix();
  const accessToken = jwt.encode(
    {
      exp: accessTokenExpiredAt,
      username: user.username
    },
    process.env.JWT_SECRET
  );
  const refreshTokenExpiredAt = moment().utc().add({ days: 7 }).unix();
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
    accessTokenExpiredAt: moment.unix(accessTokenExpiredAt).format(),
    refreshToken: refreshToken,
    refreshTokenExpiredAt: moment.unix(refreshTokenExpiredAt).format()
  };
};

// проверка данных пользователя
const checkUserData = async (user) => {
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
const findUserById = async (id) => {
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

// изменение текущего пользователя
const updateUserPermission = async (id, body) => {
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

const deleteUser = async (id) => {
  try {
    const status = await UserDB.User.deleteOne({ id });
    if (status && status.ok === 1) {
      console.log('News deleted:', status);
      return await getUsers();
    } else {
      throw new Error('Ошибка удаления из БД');
    }
  } catch (error) {
    console.error(error);
    return false;
  }
}

module.exports = {
  packUserData,
  saveUserData,
  checkUserData,
  findUserById,
  getUsers,
  updateUserPermission,
  genToken,
  deleteUser
};
