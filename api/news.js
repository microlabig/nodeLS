// const moment = require('moment');
const { validateData } = require('../helpers');
const { NewsDB } = require('../db');

// ф-ия возвращает все новости
const getNews = async () => {
  return await NewsDB.News.find({});
};

// упаковка данных новости
const packNewsData = async (newsObj, userObj) => {
  if (validateData(newsObj) && userObj) {
    const newsList = await NewsDB.News.find({});
    const id = newsList.length;

    return {
      id,
      created_at: new Date(Date.now()).toUTCString(),
      text: newsObj.text,
      title: newsObj.title,
      user: {
        firstName: userObj.firstName,
        id: userObj.id,
        image: userObj.image,
        middleName: userObj.middleName,
        surName: userObj.surName,
        username: userObj.username
      }
    };
  }
  return null;
};

// сохранение новости
const saveNews = async (newsObj) => {
  try {
    const doc = await newsObj.save();
    console.log('News saved:', doc);
    return await getNews();
  } catch (error) {
    console.error(error);
    return false;
  }
};

// удаление новости
const deleteNews = async (id) => {
  try {
    const doc = await NewsDB.News.deleteOne({ id });
    if (status && status.ok === 1) {
      console.log('News deleted:', status);
      return await getNews();
    } else {
      throw new Error('Ошибка удаления из БД');
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};

// изменение текущей новости
const updateNews = async (id, body) => {
  try {
    const news = await NewsDB.News.findOne({ id });
    news.title = body.title;
    news.text = body.text;
    const status = await NewsDB.News.updateOne({ id }, news);
    if (status && status.ok === 1) {
      console.log('User updated:', news);
      return await getNews();
    } else {
      throw new Error('Ошибка изменения данных в БД');
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};

module.exports = {
  getNews,
  packNewsData,
  saveNews,
  deleteNews,
  updateNews
};
