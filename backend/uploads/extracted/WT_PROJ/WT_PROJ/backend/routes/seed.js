const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');

router.post('/', async (req, res) => {
  try {
    const sample = [
      {
        title: "Inception",
        poster: "https://m.media-amazon.com/images/I/51s+LHYieEL._AC_SY679_.jpg",
        rating: 8.8,
        synopsis: "A thief who steals corporate secrets through dream-sharing technology.",
        category: "Sci-Fi"
      },
      {
        title: "The Matrix",
        poster: "https://m.media-amazon.com/images/I/51EG732BV3L.jpg",
        rating: 8.7,
        synopsis: "A hacker discovers reality is a simulation and joins the rebellion.",
        category: "Action"
      }
    ];

    await Movie.deleteMany({});
    const created = await Movie.insertMany(sample);
    res.json({ seeded: created.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
