import { defineStore } from "pinia";
import axios from "axios";

export const useMovieStore = defineStore("movie", {
    state: () => ({
        popularMovies: [],
        searchResults: [],
        movieDetails: null,
        loading: false,
        error: null,
    }),

    actions: {
        async fetchPopularMovies() {
            this.loading = true;
            this.error = null;

            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_TMDB_API_URL}/movie/popular`,
                    {
                        params: {
                            api_key: import.meta.env.VITE_TMDB_API_KEY,
                            language: "pt-BR",
                            page: 1,
                        },
                    }
                );

                this.popularMovies = response.data.results;
            } catch (error) {
                console.error("Error fetching popular movies:", error);
                this.error =
                    "Falha ao carregar filmes populares. Por favor, tente novamente.";
            } finally {
                this.loading = false;
            }
        },

        async searchMovies(query) {
            if (!query || query.trim() === "") {
                this.searchResults = [];
                return;
            }

            this.loading = true;
            this.error = null;

            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_TMDB_API_URL}/search/movie`,
                    {
                        params: {
                            api_key: import.meta.env.VITE_TMDB_API_KEY,
                            language: "pt-BR",
                            query: query,
                            page: 1,
                        },
                    }
                );

                this.searchResults = response.data.results;
            } catch (error) {
                console.error("Error searching movies:", error);
                this.error =
                    "Falha na busca de filmes. Por favor, tente novamente.";
            } finally {
                this.loading = false;
            }
        },

        async fetchMovieDetails(movieId) {
            this.loading = true;
            this.error = null;
            this.movieDetails = null;

            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_TMDB_API_URL}/movie/${movieId}`,
                    {
                        params: {
                            api_key: import.meta.env.VITE_TMDB_API_KEY,
                            language: "pt-BR",
                            append_to_response: "credits,videos",
                        },
                    }
                );

                this.movieDetails = response.data;
            } catch (error) {
                console.error(
                    `Error fetching movie details for ID ${movieId}:`,
                    error
                );
                this.error =
                    "Falha ao carregar detalhes do filme. Por favor, tente novamente.";
            } finally {
                this.loading = false;
            }
        },

        clearSearchResults() {
            this.searchResults = [];
        },

        clearMovieDetails() {
            this.movieDetails = null;
        },
    },
});
