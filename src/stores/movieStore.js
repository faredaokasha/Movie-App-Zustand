import { create } from "zustand";
import {
  getMovieDetailsApi,
  getPopularMovies,
  searchMoviesApi,
} from "../services/tmdbApi";

const useMovieStore = create((set) => ({
  popularMovies: [],
  searchResults: [],
  selectedMovie: null,

  popularStatus: "idle",
  searchStatus: "idle",
  detailsStatus: "idle",

  error: null,

  fetchPopularMovies: async () => {
    set({ popularStatus: "loading", error: null });

    try {
      const data = await getPopularMovies();

      set({
        popularMovies: data.results,
        popularStatus: "succeeded",
      });
    } catch (error) {
      set({
        error: error.message,
        popularStatus: "failed",
      });
    }
  },

  searchMovies: async (query) => {
    set({ searchStatus: "loading", error: null });

    try {
      const data = await searchMoviesApi(query);

      set({
        searchResults: data.results,
        searchStatus: "succeeded",
      });
    } catch (error) {
      set({
        error: error.message,
        searchStatus: "failed",
      });
    }
  },

  fetchMovieDetails: async (movieId) => {
    set({ detailsStatus: "loading", error: null });

    try {
      const data = await getMovieDetailsApi(movieId);

      set({
        selectedMovie: data,
        detailsStatus: "succeeded",
      });
    } catch (error) {
      set({
        error: error.message,
        detailsStatus: "failed",
      });
    }
  },

  clearSearchResults: () => {
    set({
      searchResults: [],
      searchStatus: "idle",
    });
  },

  clearSelectedMovie: () => {
    set({
      selectedMovie: null,
      detailsStatus: "idle",
    });
  },
}));

export default useMovieStore;