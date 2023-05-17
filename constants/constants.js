const urlPattern = /(https?:\/\/)(w{3}\.)?(([a-zA-Z0-9]+).)+/;

const wrongData = 'Переданы некорректные данные';
const emailAlreadyExsist = 'пользователь с таким Email уже существует';
const logoutSucceeded = 'Успешно разлогинен';
const filmDeleted = 'Фильм удален';
const noAccses = 'Нет доступа';
const filmNotFoundById = 'Фильм по указанному _id не найден';
const badId = 'Ошибка: невалидный id';

module.exports = {
  urlPattern,
  wrongData,
  emailAlreadyExsist,
  logoutSucceeded,
  filmDeleted,
  noAccses,
  filmNotFoundById,
  badId,
};
