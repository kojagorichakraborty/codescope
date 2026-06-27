import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function MovieDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(location.state?.movie || null);
  const [loading, setLoading] = useState(!movie);

  // helper to resolve poster URL: full URL or public/assets
  const posterSrc = (poster) => {
    if (!poster) return `${process.env.PUBLIC_URL}/assets/inception.jpeg`;
    return poster.startsWith("http") ? poster : `${process.env.PUBLIC_URL}/assets/${poster}`;
  };

  useEffect(() => {
    // If movie wasn't passed via navigation state, fetch from backend
    if (!movie) {
      setLoading(true);
      fetch(`http://localhost:5000/api/movies/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Movie not found");
          return res.json();
        })
        .then((data) => {
          setMovie(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching movie:", err);
          setLoading(false);
        });
    }
  }, [id, movie]);

  if (loading) return <p>Loading movie details...</p>;
  if (!movie) return <p>Movie not found.</p>;

  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: 12 }}>← Back</button>
      <h1>{movie.title}</h1>
      <img
        src={posterSrc(movie.poster)}
        alt={movie.title}
        style={{ maxWidth: 400, width: "100%", borderRadius: 12 }}
      />
      <p><b>Year:</b> {movie.year || movie.releaseYear || "N/A"}</p>
      {movie.rating && <p><b>Rating:</b> {movie.rating}</p>}
      <p style={{ maxWidth: 800, margin: "12px auto" }}>{movie.synopsis || movie.description || "No synopsis available."}</p>

      {/* Book Now button - adjust route/action as needed */}
      <div style={{ marginTop: 16 }}>
        <button
          className="book-btn"
          onClick={() => {
            // placeholder action - replace with booking flow later
            // navigate('/book', { state: { movie } });
            alert(`Booking flow not implemented yet — you'd book: ${movie.title}`);
          }}
        >
          Book Now
        </button>
      </div>
    </div>
  );
}

export default MovieDetails;
