const Movie = require('../models/movie');
const NotFoundError = require('../utils/NotFoundError');
const BadRequestCode = require('../utils/BadRequestCode');
const ForbiddenError = require('../utils/ForbiddenError');

module.exports.getMovie = (req, res, next) => {
  Movie.find({})
    .then((movie) => res.send(movie))
    .catch((err) => { next(err); });
};

module.exports.createMovie = (req, res, next) => {
  const id = req.user._id;
  const { country,
    director,
    duration,
    year,
    description,
    image,
    nameRU,
    nameEN,
    trailerLink,
    thumbnail,
    movieId, } = req.body;
  Movie.create({  country,
    director,
    duration,
    year,
    description,
    image,
    nameRU,
    nameEN,
    trailerLink,
    thumbnail,
    movieId,
    owner: id })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestCode('Переданы некорректные данные'));
      } else { next(err); }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Пользователь не найден');
      }
      if (movie.owner.toString() !== req.user._id) { throw new ForbiddenError('Чужой фильм нельзя удалить'); }
      return Movie.findByIdAndRemove(req.params._id)
        .then(() => res.send(movie));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestCode('Переданы некорректные данные'));
      } else { next(err); }
    });
};

