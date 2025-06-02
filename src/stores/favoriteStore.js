import { defineStore } from 'pinia'
import axios from 'axios'

export const useFavoriteStore = defineStore('favorite', {
  state: () => ({
    favorites: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchFavorites(params = {}) {
      this.loading = true
      this.error = null

      try {
        const queryParams = { ...params }

        if (queryParams.genre_id && Array.isArray(queryParams.genre_id)) {
          queryParams.genre_id = queryParams.genre_id.join(',')
        }

        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/favorites`,
          { params: queryParams }
        )
        this.favorites = response.data
      } catch (error) {
        console.error('Error fetching favorites:', error)
        this.error = 'Falha ao carregar favoritos. Por favor, tente novamente.'
      } finally {
        this.loading = false
      }
    },

    async addToFavorites(movie) {
      this.loading = true
      this.error = null

      try {
        let genreIds = []

        if (movie.genres && Array.isArray(movie.genres)) {
          genreIds = movie.genres.map(genre => genre.id)
        } else if (movie.genre_ids && Array.isArray(movie.genre_ids)) {
          genreIds = movie.genre_ids
        }

        const movieData = {
          tmdb_id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          overview: movie.overview,
          release_date: movie.release_date,
          vote_average: movie.vote_average,
          genre_ids: genreIds.length > 0 ? JSON.stringify(genreIds) : null
        }

        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/favorites`,
          movieData
        )

        if (!this.favorites.some(fav => fav.tmdb_id === movie.id)) {
          this.favorites.push(movieData)
        }
      } catch (error) {
        console.error('Error adding to favorites:', error)
        this.error =
          'Falha ao adicionar aos favoritos. Por favor, tente novamente.'
      } finally {
        this.loading = false
      }
    },

    async removeFromFavorites(movieId) {
      this.loading = true
      this.error = null

      try {
        await axios.delete(
          `${import.meta.env.VITE_API_BASE_URL}/favorites/${movieId}`
        )

        this.favorites = this.favorites.filter(
          movie => movie.tmdb_id !== movieId
        )
      } catch (error) {
        console.error('Error removing from favorites:', error)
        this.error =
          'Falha ao remover dos favoritos. Por favor, tente novamente.'
      } finally {
        this.loading = false
      }
    },

    isFavorite(movieId) {
      return this.favorites.some(movie => movie.tmdb_id === movieId)
    }
  }
})
