require('dotenv').config();
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  if (!req.cookies.jwt) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
  let payload;

  try {
    payload = jwt.verify(req.cookies.jwt, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key');
  } catch (err) {
    return next(new UnauthorizedError('Токен не прошел проверку'));
  }

  req.user = payload;
  return next();
};
