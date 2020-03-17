/* eslint-disable */
const fs = require('fs');
const path = require('path');
var argv = require('minimist')(process.argv.slice(2)); // читаем аргументы
const folders = [...argv._]; // названия папок в src

const deleteSourceFolder = argv.d || false; // признак удаления исходной папки

// определяем полный путь исходного каталога
const FROM = folders[0]
  ? path.join(__dirname, 'src', folders[0])
  : path.join(__dirname, 'src', './foods'); // исходный каталог

// определяем полный путь выходного каталога
const TO = folders[1]
  ? path.join(__dirname, 'src', folders[1])
  : path.join(__dirname, 'src', './sort_foods'); // новый каталог

// функция чтения исходного каталога и перемещения файлов
const readDir = scanPath => {
  const files = fs.readdirSync(scanPath);

  files.forEach(file => {
    const fullPath = path.join(path.resolve(scanPath), file);

    const state = fs.statSync(fullPath);

    if (state.isDirectory()) {
      readDir(fullPath);
    } else {
      const newPath = path.join(TO, file);
      fs.renameSync(fullPath, newPath);
      const files = fs.readdirSync(scanPath);
      
      // удаляем исходный каталог по признаку--d
      if (deleteSourceFolder) {
        if (fs.existsSync(scanPath) && files.length === 0) {
          fs.rmdir(scanPath, err => errorMessage(err));
        }
      }
    }
  });
};

// функция обработки ошибок
const errorMessage = err => {
  if (err) {
    console.error(err.message);
    throw err;
  }
};

// проверка существования выходного каталога
if (!fs.existsSync(TO)) {
  fs.mkdirSync(TO); // если нет - создать выходной каталог
}
// читаем исходный каталог и перемещаем файлы
try {
  readDir(FROM);
} catch (error) {
  process.exit(1);
}

