/*import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [movies, setMovies] = useState([]);     // All movies
  const [search, setSearch] = useState("");     // Search input
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();

  useEffect(() => {
    // Try fetching movies from backend
    fetch("http://localhost:5000/api/movies")
      .then((res) => res.json())
      .then((data) => {
        // Backend returns an array of movies (or fallback sample data)
        const movieArray = Array.isArray(data) ? data : [];
        if (movieArray.length === 0) {
          // fallback local sample (make sure these files exist in public/assets)
          setMovies([
            { _id: "1", title: "Inception", year: 2010, poster: "inception.jpeg" },
            { _id: "2", title: "Interstellar", year: 2014, poster: "interstellar.jpeg" },
            { _id: "3", title: "The Dark Knight", year: 2008, poster: "darkknight.jpeg" },
          ]);
        } else {
          setMovies(movieArray);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching movies:", err);
        // If backend fails, show sample data
        setMovies([
          { _id: "1", title: "Inception", year: 2010, poster: "inception.jpeg" },
          { _id: "2", title: "Interstellar", year: 2014, poster: "interstellar.jpeg" },
          { _id: "3", title: "The Dark Knight", year: 2008, poster: "darkknight.jpeg" },
        ]);
        setLoading(false);
      });
  }, []);

  // Filter movies for search
  const filtered = Array.isArray(movies)
    ? movies.filter((m) =>
        m.title?.toLowerCase().includes(search.toLowerCase())
      )
    : [];

   // helper to resolve poster URL: use full URL if provided, otherwise load from public/assets
  const posterSrc = (poster) => {
    if (!poster) return `${process.env.PUBLIC_URL}/assets/inception.jpeg`;
    return poster.startsWith("http") ? poster : `${process.env.PUBLIC_URL}/assets/${poster}`;
  };


  return (
    <div className="home-container">
      <h1>🎬 Featured Movies</h1>

      {/* Search Bar */
     /* <input
        type="text"
        placeholder="Search movies..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-bar"
      />

      {/* Movie Grid */
     /* {loading ? (
        <p>Loading movies...</p>
      ) : Array.isArray(filtered) && filtered.length > 0 ? (
        <div className="movie-grid">
          {filtered.map((movie) => (
            <div
              key={movie._id || movie.id}
              className="movie-card"
              onClick={() =>
                navigate(`/MovieDetails/${movie._id || movie.id}`, { state: { movie } })
              }
              style={{ cursor: "pointer" }}
            >
              <img
                src={movie.poster}
                alt={movie.title}
                width="200"
                className="movie-poster"
              />
              <h3>{movie.title}</h3>
              <p>{movie.year || "N/A"}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No movies found.</p>
      )}*/ 




import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/main.css"; // existing main.css

function Home() {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Local movie list (3 movies only)
    setMovies([
      {
        _id: "1",
        title: "Inception",
        year: 2010,
        duration: "2h 28min",
        rating: "8.8",
        poster: `${process.env.PUBLIC_URL}/assets/inception.jpeg`,
      },
      {
        _id: "2",
        title: "Interstellar",
        year: 2014,
        duration: "2h 49min",
        rating: "8.6",
        poster: `${process.env.PUBLIC_URL}/assets/interstellar.jpeg`,
      },
      {
        _id: "3",
        title: "The Dark Knight",
        year: 2008,
        duration: "2h 32min",
        rating: "9.0",
        poster: `${process.env.PUBLIC_URL}/assets/darkknight.jpeg`,
      },
    ]);
  }, []);

  return (
    <div className="home-container">
      <header className="home-header">
        <h1 className="brand-title">⭐ STAR VIEW</h1>
      </header>

      <section className="featured-section">
        <h2 className="section-title">Featured Movies</h2>
        <div className="movie-grid">
          {movies.map((movie) => (
            <div
              className="movie-card"
              key={movie._id}
              onClick={() => navigate(`/movie/${movie._id}`, { state: { movie } })}
            >
              <div className="poster-container">
                <img src={movie.poster} alt={movie.title} className="movie-poster" />
                <div className="rating">
                  ⭐ {movie.rating}
                </div>
              </div>
              <div className="movie-info">
                <h3>{movie.title}</h3>
                <p className="movie-duration">⏱ {movie.duration}</p>
                <p className="movie-year">{movie.year}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}


      {/* Bottom Navigation */}
 /*     <div className="bottom-nav">
        <button>🏠 Home</button>
        <button>❤️ Favorites</button>
        <button>🎟️ Booking</button>
        <button>👤 Profile</button>
      </div>
    </div>
  );
}*/

export default Home;
