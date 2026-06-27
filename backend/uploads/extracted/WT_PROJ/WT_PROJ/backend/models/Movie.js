const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: String,
  poster: String,
  rating: Number,
  synopsis: String,
  category: String
});

module.exports = mongoose.model('Movie', movieSchema);
