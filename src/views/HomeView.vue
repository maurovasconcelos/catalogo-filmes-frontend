<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useMovieStore } from '../stores/movieStore';
import { useFavoriteStore } from '../stores/favoriteStore';

const router = useRouter();
const movieStore = useMovieStore();
const favoriteStore = useFavoriteStore();

onMounted(async () => {
  await movieStore.fetchPopularMovies();
  await favoriteStore.fetchFavorites();
});

const viewMovieDetails = (movieId) => {
  router.push({ name: 'movie', params: { id: movieId } });
};

const toggleFavorite = async (movie) => {
  if (favoriteStore.isFavorite(movie.id)) {
    await favoriteStore.removeFromFavorites(movie.id);
  } else {
    await favoriteStore.addToFavorites(movie);
  }
};
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex items-center mb-8">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-indigo-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
      </svg>
      <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Filmes Populares</h1>
    </div>

    <div v-if="movieStore.loading" class="flex justify-center items-center h-64">
      <div class="relative">
        <div class="h-16 w-16 rounded-full border-t-4 border-b-4 border-indigo-500 animate-spin"></div>
        <div class="h-16 w-16 rounded-full border-r-4 border-l-4 border-purple-500 animate-spin absolute top-0 left-0" style="animation-direction: reverse; animation-duration: 1.5s;"></div>
      </div>
    </div>

    <div v-else-if="movieStore.error" class="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-lg shadow-md mb-6">
      <div class="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <strong class="font-bold text-lg">Erro!</strong>
      </div>
      <span class="block mt-2"> {{ movieStore.error }}</span>
      <button 
        @click="movieStore.fetchPopularMovies()" 
        class="mt-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Tentar novamente
      </button>
    </div>

    <div v-else-if="movieStore.popularMovies.length === 0" class="bg-gradient-to-r from-yellow-50 to-amber-100 border-l-4 border-yellow-500 text-yellow-800 p-6 rounded-lg shadow-md mb-6">
      <div class="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <strong class="font-bold text-lg">Nenhum filme encontrado!</strong>
      </div>
      <button 
        @click="movieStore.fetchPopularMovies()" 
        class="mt-4 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white font-medium py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Tentar novamente
      </button>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      <div 
        v-for="movie in movieStore.popularMovies" 
        :key="movie.id"
        class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 border border-gray-200 dark:border-gray-700 group"
      >
        <div class="relative pb-[150%] overflow-hidden cursor-pointer" @click="viewMovieDetails(movie.id)">
          <img 
            v-if="movie.poster_path" 
            :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" 
            :alt="movie.title"
            class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div 
            v-else 
            class="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-gray-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
          </div>
        </div>

        <div class="p-4">
          <h3 
            @click="viewMovieDetails(movie.id)" 
            class="text-lg font-semibold text-gray-800 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300 cursor-pointer"
          >
            {{ movie.title }}
          </h3>
          <div class="flex justify-between items-center mt-2">
            <span class="text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
              {{ new Date(movie.release_date).getFullYear() }}
            </span>
            <span class="text-sm font-bold text-yellow-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md flex items-center">
              <svg class="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z" fill="currentColor" />
              </svg>
              {{ movie.vote_average.toFixed(1) }}
            </span>
          </div>
          <button 
            @click="toggleFavorite(movie)" 
            class="mt-3 w-full py-2.5 px-3 text-sm font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center"
            :class="favoriteStore.isFavorite(movie.id) ? 
              'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white' : 
              'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white'"
          >
            <span class="mr-2">
              {{ favoriteStore.isFavorite(movie.id) ? '❤️' : '🤍' }}
            </span>
            {{ favoriteStore.isFavorite(movie.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>