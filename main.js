const fs = require('fs');
const path = require('path');

const FROM = process.argv[2]
  ? path.join(__dirname, 'src', process.argv[2])
  : path.join(__dirname, 'src', './foods'); // исходный каталог

const TO = process.argv[3]
  ? path.join(__dirname, 'src', process.argv[3])
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
      const firstLetter = file[0].toUpperCase();
      const pathTo = path.join(TO, firstLetter);

      // проверяем - существует ли такая папка с названием первой буквы в каталоге
      if (!fs.existsSync(pathTo)) {
        fs.mkdirSync(pathTo); // если нет - создать каталог
      }
      // переместим файл в папку с названием первой буквы в каталоге
      fs.rename(fullPath, path.join(pathTo, file), err => errorMessage(err));
    }
  });
};

// функция обработки ошибок
const errorMessage = err => {
  if (err) {
    console.error(err.message);
    process.exit(1);
  }
};

// проверка существования выходного каталога
if (!fs.existsSync(TO)) {
  fs.mkdirSync(TO); // если нет - создать выходной каталог
}
// читаем каталог и перемещаем файлы
readDir(FROM);
// удаляем исходный каталог
if (fs.existsSync(FROM)) {
  fs.rmdir(FROM, { recursive: true }, err => errorMessage(err));
}
