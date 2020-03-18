const fs = require('fs');
const path = require('path');
const argv = require('minimist')(process.argv.slice(2)); // читаем аргументы
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

// ------------------------------------------------------
// функция чтения исходного каталога и перемещения файлов
// ------------------------------------------------------
const readDir = (scanPath) => {
  const files = fs.readdirSync(scanPath);

  if (files.length === 0) {
    // если пустой каталог - удалим его
    deleteEmptyFolder(scanPath);
  } else {
    // переберем файлы в текущей директории
    files.forEach(file => {
      const currentPath = path.join(path.resolve(scanPath), file);
      const state = fs.statSync(currentPath);

      if (state.isDirectory()) {
        // если текущий "файл" по типу директория - перейдем в нее
        readDir(currentPath);
        setImmediate(() => {
          // удалим текущую пустую директорию
          if (fs.existsSync(currentPath)) {
            deleteEmptyFolder(currentPath);
          }
        });
      } else {
        const firstLetter = file[0].toUpperCase() || 'OTHER'; // первый символ файла
        const pathTo = path.join(TO, firstLetter); // путь к новому расположению файла
        const newPath = path.join(pathTo, file); // новое имя и путь файла

        // проверяем - существует ли такая папка с названием первой буквы в каталоге
        if (!fs.existsSync(pathTo)) {
          fs.mkdirSync(pathTo); // если нет - создать каталог
        }
        // переместим файл в папку с названием первой буквы в каталоге
        fs.rename(currentPath, newPath, (err) => {
          // обработаем ошибки
          setImmediate(() => {
            errorMessage(err);
          });
          
          setImmediate(() => {
            // удалим текущую пустую директорию
            if (fs.existsSync(scanPath)) {
              deleteEmptyFolder(scanPath);
            }
          });
        });
      }
    });
  }
};

// -----------------------------
// функция удаления пустой папки
// -----------------------------
const deleteEmptyFolder = (path) => {
  const files = fs.readdirSync(path); // сканируем директорию
  // удаляем исходный каталог (при наличии признака --d)
  if (deleteSourceFolder) {
    if (files.length === 0) { // если пустая директория - удаляем
      fs.rmdirSync(path);
    }
  }
};

// ------------------------
// функция обработки ошибок
// ------------------------
const errorMessage = (err) => {
  if (err) {
    console.error(err.message);
    process.exit(1);
  }
};

// проверка существования выходного каталога
if (!fs.existsSync(TO)) {
  fs.mkdirSync(TO); // если нет - создать выходной каталог
}
// читаем исходный каталог и перемещаем файлы
readDir(FROM);
setImmediate(() => {
  // удалим исходный каталог
  if (deleteSourceFolder) {
    fs.rmdirSync(FROM);
  }
});
