const express = require('express');
const { celebrate, Joi } = require('celebrate');
const {
  getMovie, createMovie, deleteMovie,
} = require('../controllers/movie');

const movieRoutes = express.Router();

movieRoutes.get('/movies', getMovie);
movieRoutes.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string()
      .required()
      .pattern(
        /https?:\/\/(www\.)?[-a-zA-Z0-9]{1,}\.[a-zA-Z0-9()]{1,}\b([-a-zA-Z0-9()@:%-_+~#?&/=]*)/,
      ),
    trailerLink: Joi.string()
      .required()
      .pattern(
        /https?:\/\/(www\.)?[-a-zA-Z0-9]{1,}\.[a-zA-Z0-9()]{1,}\b([-a-zA-Z0-9()@:%-_+~#?&/=]*)/,
      ),
    thumbnail: Joi.string()
      .required()
      .pattern(
        /https?:\/\/(www\.)?[-a-zA-Z0-9]{1,}\.[a-zA-Z0-9()]{1,}\b([-a-zA-Z0-9()@:%-_+~#?&/=]*)/,
      ),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);

movieRoutes.delete('/movies/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required().length(24).hex(),
  }),
}), deleteMovie);


module.exports = movieRoutes;
