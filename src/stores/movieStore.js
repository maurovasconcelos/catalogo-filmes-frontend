import { defineStore } from 'pinia'
import axios from 'axios'

export const useMovieStore = defineStore('movie', {
  state: () => ({
    popularMovies: [],
    searchResults: [],
    movieDetails: null,
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 0,
    totalResults: 0
  }),

  actions: {
    async fetchPopularMovies() {
      this.loading = true
      this.error = null

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_TMDB_API_URL}/movie/popular`,
          {
            params: {
              api_key: import.meta.env.VITE_TMDB_API_KEY,
              language: 'pt-BR',
              page: 1
            }
          }
        )

        this.popularMovies = response.data.results
      } catch (error) {
        console.error('Error fetching popular movies:', error)
        this.error =
          'Falha ao carregar filmes populares. Por favor, tente novamente.'
      } finally {
        this.loading = false
      }
    },

    async searchMovies(query, page = 1) {
      if (!query || query.trim() === '') {
        this.searchResults = []
        this.currentPage = 1
        this.totalPages = 0
        this.totalResults = 0
        return
      }

      this.loading = true
      this.error = null

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_TMDB_API_URL}/search/movie`,
          {
            params: {
              api_key: import.meta.env.VITE_TMDB_API_KEY,
              language: 'pt-BR',
              query: query,
              page: page
            }
          }
        )

        this.searchResults = response.data.results
        this.currentPage = response.data.page
        this.totalPages = response.data.total_pages
        this.totalResults = response.data.total_results
      } catch (error) {
        console.error('Error searching movies:', error)
        this.error = 'Falha na busca de filmes. Por favor, tente novamente.'
      } finally {
        this.loading = false
      }
    },

    async fetchMovieDetails(movieId) {
      this.loading = true
      this.error = null
      this.movieDetails = null

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_TMDB_API_URL}/movie/${movieId}`,
          {
            params: {
              api_key: import.meta.env.VITE_TMDB_API_KEY,
              language: 'pt-BR',
              append_to_response: 'credits,videos'
            }
          }
        )

        this.movieDetails = response.data
      } catch (error) {
        console.error(`Error fetching movie details for ID ${movieId}:`, error)
        this.error =
          'Falha ao carregar detalhes do filme. Por favor, tente novamente.'
      } finally {
        this.loading = false
      }
    },

    clearSearchResults() {
      this.searchResults = []
      this.currentPage = 1
      this.totalPages = 0
      this.totalResults = 0
    },

    clearMovieDetails() {
      this.movieDetails = null
    }
  }
})
