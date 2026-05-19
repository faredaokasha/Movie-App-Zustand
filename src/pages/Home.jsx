import { useEffect, useMemo, useState } from "react";
import MovieCard from "../components/MovieCard";
import SearchBar from "../components/SearchBar";
import useMovieStore from "../stores/movieStore";
import { debounce } from "../utils/debounce";

function Home() {
  const [searchTerm, setSearchTerm] = useState("");

  const popularMovies = useMovieStore((state) => state.popularMovies);
  const searchResults = useMovieStore((state) => state.searchResults);
  const popularStatus = useMovieStore((state) => state.popularStatus);
  const searchStatus = useMovieStore((state) => state.searchStatus);
  const error = useMovieStore((state) => state.error);

  const fetchPopularMovies = useMovieStore(
    (state) => state.fetchPopularMovies
  );
  const searchMovies = useMovieStore((state) => state.searchMovies);
  const clearSearchResults = useMovieStore(
    (state) => state.clearSearchResults
  );

  useEffect(() => {
    fetchPopularMovies();
  }, [fetchPopularMovies]);

  const debouncedSearch = useMemo(() => {
    return debounce((query) => {
      searchMovies(query);
    }, 500);
  }, [searchMovies]);

  useEffect(() => {
    const query = searchTerm.trim();

    if (!query) {
      debouncedSearch.cancel();
      clearSearchResults();
      return;
    }

    debouncedSearch(query);

    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, debouncedSearch, clearSearchResults]);

  const isSearching = searchTerm.trim().length > 0;
  const movies = isSearching ? searchResults : popularMovies;
  const status = isSearching ? searchStatus : popularStatus;

  return (
    <main className="container">
      <section className="hero">
        <h1>Movie App Zustand</h1>

        <SearchBar value={searchTerm} onChange={setSearchTerm} />
      </section>

      {status === "loading" && <p className="message">Loading movies...</p>}

      {status === "failed" && <p className="error">{error}</p>}

      {status === "succeeded" && movies.length === 0 && (
        <p className="message">No movies found.</p>
      )}

      <section className="movies-grid">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </section>
    </main>
  );
}

export default Home;