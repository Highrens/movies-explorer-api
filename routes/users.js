const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  updateUser,
  getMe,
} = require('../controllers/users');

// возвращает информацию о пользователе (email и имя)
router.get('/users/me', getMe);
// обновляет информацию о пользователе (email и имя)
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email(),
  }),
}), updateUser);

module.exports = router;
