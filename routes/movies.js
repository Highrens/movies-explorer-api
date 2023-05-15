const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getMySavedMovies, createMovie, deleteSavedMovie } = require('../controllers/movies');

// возвращает все сохранённые текущим  пользователем фильмы
router.get('/movies', getMySavedMovies);

// создаёт фильм с переданными в теле данными
router.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.string().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    name: Joi.string().required(),
    image: Joi.string().required().pattern(/(https?:\/\/)(w{3}\.)?(([a-zA-Z0-9]+).)+/),
    trailer: Joi.string().required().pattern(/(https?:\/\/)(w{3}\.)?(([a-zA-Z0-9]+).)+/),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().pattern(/(https?:\/\/)(w{3}\.)?(([a-zA-Z0-9]+).)+/),
    movieId: Joi.string().required(),
  }),
}), createMovie);

// удаляет сохранённый фильм по id
router.delete('/movies/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().required().length(24),
  }),
}), deleteSavedMovie);

module.exports = router;
