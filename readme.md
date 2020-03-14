# ДЗ 1

Дата прохождения курса 10.03.2020 - 17.04.2020

**Студент:** Безместин Игорь

**Наставник:** Артем Пузаков
 
## Задача проекта
Есть сложная структура папок (обязательна вложенность папок) с файлами (тип файлов на ваш выбор - музыкальные, файлы изображений). Необходимо разобрать коллекцию, создав новую общую папку и расположив внутри все файлы по папкам в алфавитном порядке, т.е. все файлы начинающиеся на “a” должны быть в папке “A” и т.д. 
Исходный каталог лежит по пути `./src`

## Необходимые действия для запуска проекта

1. установить node.js [https://nodejs.org/](https://nodejs.org/ "Node.JS")
2. cклонировать проект к себе и перейти в каталог проекта
3. `npm i` - установить зависимости
4. запуск проекта командой `node main ИСХОДНЫЙ_КАТАЛОГ СОРТИРОВОЧНЫЙ_КАТАЛОГ`

## Примеры запуска проекта
Если исходный каталог `./src/foods`, а сортировочный - `./src/sort_foods`, то команда для запуска будет следующей `node main foods sort_foods` 
