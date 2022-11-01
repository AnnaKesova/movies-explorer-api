const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    validator: (link) => {
      validator.isURL(link, {
        protocols: ['http', 'https'],
        require_protocol: true,
      });
    },
  },
  trailerLink: {
    type: String,
    validator: (link) => {
      validator.isURL(link, {
        protocols: ['http', 'https'],
        require_protocol: true,
      });
    },
  },
  thumbnail: {
    type: String,
    validator: (link) => {
      validator.isURL(link, {
        protocols: ['http', 'https'],
        require_protocol: true,
      });
    },
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },

});

movieSchema.index({ owner: 1, movieId: 1 }, { unique: true });

module.exports = mongoose.model('Movie', movieSchema);
