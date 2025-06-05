<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useMovieStore } from '../stores/movieStore';
import { useFavoriteStore } from '../stores/favoriteStore';

const router = useRouter();
const movieStore = useMovieStore();
const favoriteStore = useFavoriteStore();

const searchQuery = ref('');
const debouncedSearchTimeout = ref(null);

const performSearch = (page = 1) => {
  clearTimeout(debouncedSearchTimeout.value);
  
  if (searchQuery.value.trim() === '') {
    movieStore.clearSearchResults();
    return;
  }
  
  debouncedSearchTimeout.value = setTimeout(async () => {
    await movieStore.searchMovies(searchQuery.value, page);
  }, 500); // Espera 500ms após digitar
};

// Observa mudança no campo de busca
watch(searchQuery, () => {
  performSearch(1); // Volta para a primeira página quando a busca muda
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

const goToPage = (page) => {
  if (page < 1 || page > movieStore.totalPages) return;
  performSearch(page);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8 relative">
      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="Buscar filmes..." 
        class="w-full p-4 pl-12 border border-gray-300 dark:border-gray-700 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-800 dark:text-white transition-all duration-300"
      />
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
        @click="performSearch(1)"
        class="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition duration-200"
      >
        Tentar novamente
      </button>
    </div>

    <div v-else-if="searchQuery && movieStore.searchResults.length === 0" class="bg-gradient-to-r from-yellow-50 to-amber-100 border-l-4 border-yellow-500 text-yellow-800 p-6 rounded-lg shadow-md mb-6">
      <div class="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <strong class="font-bold text-lg">Nenhum filme encontrado para "{{ searchQuery }}"!</strong>
      </div>
    </div>

    <div v-else-if="!searchQuery" class="text-center py-12">
      <p class="text-gray-600 dark:text-gray-300">Digite um termo de busca para encontrar filmes.</p>
    </div>

    <div v-else>
      <div class="flex items-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-indigo-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h2 class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Resultados para "{{ searchQuery }}"</h2>
      </div>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div 
          v-for="movie in movieStore.searchResults" 
          :key="movie.id" 
          class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 border border-gray-200 dark:border-gray-700 group"
        >
          <div 
            class="relative h-80 overflow-hidden cursor-pointer" 
            @click="viewMovieDetails(movie.id)"
          >
            <img 
              v-if="movie.poster_path" 
              :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" 
              :alt="movie.title"
              loading="lazy"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div 
              v-else 
              class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900 text-gray-400"
            >
              Sem imagem
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
              @click="viewMovieDetails(movie.id)" 
              class="text-lg font-semibold text-gray-800 dark:text-white mb-2 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
            >
              {{ movie.title }}
            </h3>
            <div class="flex justify-between items-center mb-4 text-sm text-gray-600 dark:text-gray-300">
              <span v-if="movie.release_date" class="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
                {{ new Date(movie.release_date).getFullYear() }}
              </span>
            </div>
            
            <button 
              class="w-full py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center"
              :class="favoriteStore.isFavorite(movie.id) ? 
                'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white' : 
                'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white'"
              @click="toggleFavorite(movie)"
            >
              <span class="mr-2">
                {{ favoriteStore.isFavorite(movie.id) ? '❤️' : '🤍' }}
              </span>
              {{ favoriteStore.isFavorite(movie.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos' }}
            </button>
          </div>
        </div>
      </div>
      
      <!-- Paginação -->
      <div v-if="movieStore.totalPages > 1" class="mt-10 flex flex-col sm:flex-row justify-between items-center">
        <div class="text-sm text-gray-600 dark:text-gray-300 mb-4 sm:mb-0 text-center sm:text-left">
          <span class="block sm:inline">Página {{ movieStore.currentPage }} de {{ movieStore.totalPages }}</span>
          <span class="block sm:inline sm:ml-4">Total: {{ movieStore.totalResults }} filmes</span>
        </div>
        <div class="flex space-x-2">
          <button 
            @click="goToPage(movieStore.currentPage - 1)" 
            :disabled="movieStore.currentPage <= 1"
            class="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Anterior
          </button>
          
          <button 
            @click="goToPage(movieStore.currentPage + 1)" 
            :disabled="movieStore.currentPage >= movieStore.totalPages"
            class="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            Próxima
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>