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
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  trailerLink: {
    type: String,
    required: true,
    validate: { validator: (str) => validator.isURL(str) },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: { validator: (str) => validator.isURL(str) },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: String,
    required: true,
  },
  nameRU: {
    type: Number,
    required: true,
  },
  nameEN: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
