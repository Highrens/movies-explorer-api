const NotFoundError = require('../errors/not-found-err');
const SomethingWrongError = require('../errors/something-wrong-err');
const NoAccsesError = require('../errors/no-accses-err');
const Movie = require('../models/movie');

// GET /movies возвращает все сохранённые текущим  пользователем фильмы
module.exports.getMySavedMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      res.send(movies);
    })
    .catch(next);
};

// POST /movies создаёт фильм с переданными в данными
module.exports.createMovie = (req, res, next) => {
  Movie.create(
    {
      country: req.body.country,
      director: req.body.director,
      duration: req.body.duration,
      year: req.body.year,
      description: req.body.description,
      trailerlink: req.body.trailerlink,
      thumbnail: req.body.thumbnail,
      owner: req.user._id,
      movieId: req.body.movieId,
      nameRU: req.body.nameRU,
      nameEN: req.body.nameEN,
    },
  )
    .then((movie) => {
      res.status(201).send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new SomethingWrongError('Переданы некорректные данные при сохранении в фильме'));
      } else {
        next(err);
      }
    });
};

// delete удаляет карту
module.exports.deleteSavedMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Фильм по указанному _id не найден'));
      } if (card.owner._id.toString() === req.user._id.toString()) {
        return Movie.deleteOne(card).then(() => { res.send({ message: 'Фильм удален' }); });
      }
      return next(new NoAccsesError('Нет доступа'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new SomethingWrongError('Ошибка: невалидный id'));
      } else {
        next(err);
      }
    });
};
