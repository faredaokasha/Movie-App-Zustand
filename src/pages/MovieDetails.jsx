import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { IMAGE_BASE_URL } from "../services/tmdbApi";
import useMovieStore from "../stores/movieStore";

function MovieDetails() {
  const { id } = useParams();

  const selectedMovie = useMovieStore((state) => state.selectedMovie);
  const detailsStatus = useMovieStore((state) => state.detailsStatus);
  const error = useMovieStore((state) => state.error);

  const fetchMovieDetails = useMovieStore(
    (state) => state.fetchMovieDetails
  );
  const clearSelectedMovie = useMovieStore(
    (state) => state.clearSelectedMovie
  );

  useEffect(() => {
    fetchMovieDetails(id);

    return () => {
      clearSelectedMovie();
    };
  }, [id, fetchMovieDetails, clearSelectedMovie]);

  if (detailsStatus === "loading") {
    return <p className="message">Loading movie details...</p>;
  }

  if (detailsStatus === "failed") {
    return <p className="error">{error}</p>;
  }

  if (!selectedMovie) {
    return null;
  }

  return (
    <main className="container">
      <Link to="/" className="back-link">
        ← Back to Home
      </Link>

      <section className="details">
        <div className="details-poster">
          {selectedMovie.poster_path ? (
            <img
              src={`${IMAGE_BASE_URL}${selectedMovie.poster_path}`}
              alt={selectedMovie.title}
            />
          ) : (
            <div className="no-image large">No Image</div>
          )}
        </div>

        <div className="details-content">
          <h1>{selectedMovie.title}</h1>

          {selectedMovie.tagline && (
            <p className="tagline">"{selectedMovie.tagline}"</p>
          )}

          <p>{selectedMovie.overview || "No overview available."}</p>

          <div className="details-list">
            <p>
              <strong>Release Date:</strong>{" "}
              {selectedMovie.release_date || "N/A"}
            </p>

            <p>
              <strong>Rating:</strong>{" "}
              {selectedMovie.vote_average?.toFixed(1) || "N/A"}
            </p>

            <p>
              <strong>Runtime:</strong>{" "}
              {selectedMovie.runtime ? `${selectedMovie.runtime} min` : "N/A"}
            </p>

            <p>
              <strong>Genres:</strong>{" "}
              {selectedMovie.genres?.length
                ? selectedMovie.genres.map((genre) => genre.name).join(", ")
                : "N/A"}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default MovieDetails;