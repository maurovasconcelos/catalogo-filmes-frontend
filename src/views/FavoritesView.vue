<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useFavoriteStore } from '../stores/favoriteStore';
import GenreFilter from '../components/GenreFilter.vue';

const router = useRouter();
const favoriteStore = useFavoriteStore();
const selectedGenreId = ref('');

onMounted(async () => {
  await favoriteStore.fetchFavorites();
});

const viewMovieDetails = (movieId) => {
  router.push({ name: 'movie', params: { id: movieId } });
};

const removeFromFavorites = async (movieId) => {
  await favoriteStore.removeFromFavorites(movieId);
};

const filterByGenre = async (genreId) => {
  selectedGenreId.value = genreId;
  await favoriteStore.fetchFavorites(genreId ? { genre_id: genreId } : {});
};

const filteredFavorites = computed(() => {
  return favoriteStore.favorites;
});
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex items-center mb-8">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-pink-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
      <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">Meus Favoritos</h1>
    </div>

    <div class="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-200 dark:border-gray-700">
      <genre-filter @filter="filterByGenre" />
    </div>

    <div v-if="favoriteStore.loading" class="flex justify-center items-center h-64">
      <div class="relative">
        <div class="h-16 w-16 rounded-full border-t-4 border-b-4 border-pink-500 animate-spin"></div>
        <div class="h-16 w-16 rounded-full border-r-4 border-l-4 border-rose-500 animate-spin absolute top-0 left-0" style="animation-direction: reverse; animation-duration: 1.5s;"></div>
      </div>
    </div>

    <div v-else-if="favoriteStore.error" class="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-lg shadow-md mb-6">
      <div class="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <strong class="font-bold text-lg">Erro!</strong>
      </div>
      <span class="block mt-2"> {{ favoriteStore.error }}</span>
      <button 
        class="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition duration-200" 
        @click="favoriteStore.fetchFavorites"
      >
        Tentar novamente
      </button>
    </div>

    <div v-else-if="filteredFavorites.length === 0" class="bg-gradient-to-r from-yellow-50 to-amber-100 border-l-4 border-yellow-500 text-yellow-800 p-6 rounded-lg shadow-md mb-6">
      <div class="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <strong class="font-bold text-lg">Nenhum filme favorito encontrado!</strong>
      </div>
      <p v-if="favoriteStore.favorites.length === 0" class="mt-2 text-gray-700">Adicione filmes aos seus favoritos para vê-los aqui.</p>
      <p v-else class="mt-2 text-gray-700">Nenhum filme favorito encontrado para o gênero selecionado.</p>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      <div 
        v-for="movie in filteredFavorites" 
        :key="movie.id"
        class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 border border-gray-200 dark:border-gray-700 group"
      >
        <div 
          class="relative aspect-[2/3] overflow-hidden cursor-pointer" 
          @click="viewMovieDetails(movie.tmdb_id)"
        >
          <img 
            v-if="movie.poster_path" 
            :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" 
            :alt="movie.title"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div 
            v-else 
            class="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-gray-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
          </div>
          <div class="absolute top-2 right-2 bg-black bg-opacity-70 rounded-full p-1.5">
            <div class="relative">
              <svg class="w-8 h-8 text-yellow-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z" fill="currentColor" />
              </svg>
              <div class="absolute inset-0 flex items-center justify-center font-bold text-xs text-white">{{ movie.vote_average.toFixed(1) }}</div>
            </div>
          </div>
        </div>

        <div class="p-4">
          <h3 
            @click="viewMovieDetails(movie.tmdb_id)" 
            class="text-lg font-semibold text-gray-800 dark:text-white hover:text-pink-600 dark:hover:text-pink-400 truncate group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors duration-300"
          >
            {{ movie.title }}
          </h3>
          <div class="flex justify-between items-center mt-2">
            <span v-if="movie.release_date" class="text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
              {{ new Date(movie.release_date).getFullYear() }}
            </span>
          </div>
          <button 
            @click="favoriteStore.removeFromFavorites(movie.tmdb_id)" 
            class="mt-3 w-full py-2.5 px-3 text-sm font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white"
          >
            <span class="mr-2">❤️</span>
            Remover dos favoritos
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>