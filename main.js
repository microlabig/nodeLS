/* eslint-disable */
const fs = require('fs');
const path = require('path');
var argv = require('minimist')(process.argv.slice(2)); // читаем аргументы
const folders = [...argv._]; // названия папок в src

const deleteSourceFolder = argv.d || false; // признак удаления исходной папки

const FROM = folders[0]
  ? path.join(__dirname, 'src', folders[0])
  : path.join(__dirname, 'src', './foods'); // исходный каталог

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
      const firstLetter = file[0].toUpperCase();
      const pathTo = path.join(TO, firstLetter);
      const newPath = path.join(pathTo, file);

      // проверяем - существует ли такая папка с названием первой буквы в каталоге
      if (!fs.existsSync(pathTo)) {
        fs.mkdirSync(pathTo); // если нет - создать каталог
      }
      
      // переместим файл в папку с названием первой буквы в каталоге
      fs.rename(fullPath, newPath, err => {
        errorMessage(err);
        //const state = fs.statSync(FROM);
        const files = fs.readdirSync(scanPath);

        console.log(files);
        
        // удаляем исходный каталог по признаку --d
        // if (deleteSourceFolder) {
        //   if (fs.existsSync(scanPath) && files.length === 0) {
        //     fs.rmdir(scanPath, err => errorMessage(err));
        //   }
        // }
      });
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
