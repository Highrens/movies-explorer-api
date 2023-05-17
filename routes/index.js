const express = require('express');
const { errors } = require('celebrate');
const authRoutes = require('./auth_routes');
const movies = require('./movies');
const users = require('./users');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-err');
const { signout } = require('../controllers/users');

const router = express.Router();

// Использование роутов

router.use(authRoutes);

router.use(auth);

router.use(movies);
router.use(users);
router.post('/signout', signout);
// Путь не найден
router.use((req, res, next) => {
  next(new NotFoundError('Ошибка путь не найден'));
});
router.use(errors());

router.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

module.exports = router;
