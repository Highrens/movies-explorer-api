require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SomethingWrongError = require('../errors/something-wrong-err');
const ConflictError = require('../errors/conflict-err');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;
// GET /users/me возвращает информацию о пользователе (email и имя)
module.exports.getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((data) => {
      res.send(data);
    })
    .catch(next);
};

// PATCH /users/me — обновляет профиль
module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { runValidators: true, new: true })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new SomethingWrongError('Переданы некорректные данные при обновлении профиля'));
      } else {
        next(err);
      }
    });
};

// post singin логинимся
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000,
        httpOnly: true,
      });
      User.findById(user._id).then((userObj) => { res.send(userObj); });
    })
    .catch(next);
};

// Post singup Создает пользователя
module.exports.createUser = (req, res, next) => {
  const { name } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name,
      email: req.body.email,
      password: hash,
    })).then((userObj) => {
      const user = userObj.toObject();
      delete user.password;
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('пользователь с таким Email уже существует'));
      } else if (err.name === 'ValidationError') {
        next(new SomethingWrongError('Переданны неверные данные для регистрации'));
      } else {
        next(err);
      }
    });
};
