const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getMySavedMovies, createMovie, deleteSavedMovie } = require('../controllers/movies');
const { urlPattern } = require('../constants/constants');
// возвращает все сохранённые текущим  пользователем фильмы
router.get('/movies', getMySavedMovies);

// создаёт фильм с переданными в теле данными
router.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(urlPattern),
    trailerLink: Joi.string().required().pattern(urlPattern),
    thumbnail: Joi.string().required().pattern(urlPattern),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);

// удаляет сохранённый фильм по id
router.delete('/movies/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().required().length(24),
  }),
}), deleteSavedMovie);

module.exports = router;
