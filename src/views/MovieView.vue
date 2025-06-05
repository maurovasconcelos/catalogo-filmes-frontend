<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useMovieStore } from '../stores/movieStore';
import { useFavoriteStore } from '../stores/favoriteStore';

const route = useRoute();
const movieStore = useMovieStore();
const favoriteStore = useFavoriteStore();

const movieId = ref(parseInt(route.params.id));
const activeTab = ref('overview');

onMounted(async () => {
  await movieStore.fetchMovieDetails(movieId.value);
  await favoriteStore.fetchFavorites();
});

const toggleFavorite = async () => {
  const movie = movieStore.movieDetails;
  if (!movie) return;
  
  if (favoriteStore.isFavorite(movie.id)) {
    await favoriteStore.removeFromFavorites(movie.id);
  } else {
    await favoriteStore.addToFavorites(movie);
  }
};

const formatRuntime = (minutes) => {
  if (!minutes) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}min`;
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('pt-BR', options);
};

const formatCurrency = (value) => {
  if (!value) return 'N/A';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const getTrailerUrl = () => {
  if (!movieStore.movieDetails || !movieStore.movieDetails.videos || !movieStore.movieDetails.videos.results) {
    return null;
  }
  
  const trailer = movieStore.movieDetails.videos.results.find(
    video => video.type === 'Trailer' && video.site === 'YouTube'
  );
  
  return trailer ? `https://www.youtube.com/embed/${trailer.key}` : null;
};
</script>

<template>
  <div class="pb-10">
    <div v-if="movieStore.loading" class="text-center py-20">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-indigo-600 mb-4"></div>
      <p class="text-gray-600 dark:text-gray-300">Carregando detalhes do filme...</p>
    </div>
    
    <div v-else-if="movieStore.error" class="text-center py-20 max-w-lg mx-auto">
      <p class="text-red-500 mb-4">{{ movieStore.error }}</p>
      <button 
        @click="movieStore.fetchMovieDetails(movieId)" 
        class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition duration-200"
      >
        Tentar novamente
      </button>
    </div>
    
    <div v-else-if="!movieStore.movieDetails" class="text-center py-20 max-w-lg mx-auto">
      <p class="text-red-500 mb-4">Filme não encontrado.</p>
      <button 
        @click="$router.push('/')" 
        class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition duration-200"
      >
        Voltar para a página inicial
      </button>
    </div>
    
    <template v-else>
      <div 
        class="bg-cover bg-center relative bg-gradient-to-r from-gray-900 to-black" 
        :style="movieStore.movieDetails.backdrop_path ? 
          `background-image: url(https://image.tmdb.org/t/p/original${movieStore.movieDetails.backdrop_path})` : ''"
      >
        <div class="bg-black bg-opacity-60 backdrop-blur-sm py-12">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex flex-col md:flex-row gap-10">
              <div class="flex-shrink-0 w-full md:w-72 lg:w-80 mx-auto md:mx-0">
                <div class="relative group">
                  <div class="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                  <div class="relative">
                    <img 
                      v-if="movieStore.movieDetails.poster_path" 
                      :src="`https://image.tmdb.org/t/p/w500${movieStore.movieDetails.poster_path}`" 
                      :alt="movieStore.movieDetails.title"
                      class="w-full rounded-xl shadow-2xl transform transition duration-500 group-hover:scale-105"
                    />
                    <div 
                      v-else 
                      class="w-full h-96 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 text-gray-400 rounded-xl shadow-2xl"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="flex-1 text-white">
                <h1 class="text-3xl md:text-5xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
                  {{ movieStore.movieDetails.title }}
                </h1>
                
                <div v-if="movieStore.movieDetails.tagline" class="text-lg italic text-gray-300 mb-4 font-light">
                  {{ movieStore.movieDetails.tagline }}
                </div>
                
                <div v-if="movieStore.movieDetails.release_date" class="mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span class="text-gray-300">{{ formatDate(movieStore.movieDetails.release_date) }}</span>
                </div>
                
                <div class="flex flex-wrap gap-2 mb-5">
                  <span 
                    v-for="genre in movieStore.movieDetails.genres" 
                    :key="genre.id"
                    class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-default"
                  >
                    {{ genre.name }}
                  </span>
                </div>
                
                <div class="flex flex-wrap gap-6 mb-6 text-gray-200">
                  <div class="flex items-center bg-black bg-opacity-40 px-4 py-2 rounded-lg" v-if="movieStore.movieDetails.vote_average">
                    <div class="relative mr-3">
                      <svg class="w-10 h-10 text-yellow-500" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="18" cy="18" r="16" stroke="currentColor" stroke-width="2" fill="none" />
                        <path d="M18 7l2.47 7.6h7.98l-6.47 4.7 2.47 7.6-6.47-4.7-6.47 4.7 2.47-7.6-6.47-4.7h7.98z" fill="currentColor" />
                      </svg>
                      <div class="absolute inset-0 flex items-center justify-center font-bold text-xs text-white">{{ movieStore.movieDetails.vote_average.toFixed(1) }}</div>
                    </div>
                    <div>
                      <div class="font-medium">Avaliação</div>
                      <div class="text-gray-400 text-xs">{{ movieStore.movieDetails.vote_count }} votos</div>
                    </div>
                  </div>
                  
                  <div class="flex items-center bg-black bg-opacity-40 px-4 py-2 rounded-lg" v-if="movieStore.movieDetails.runtime">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <div class="font-medium">Duração</div>
                      <div class="text-gray-400 text-xs">{{ formatRuntime(movieStore.movieDetails.runtime) }}</div>
                    </div>
                  </div>
                </div>
                
                <div class="mt-6">
                  <button 
                    class="px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center"
                    :class="favoriteStore.isFavorite(movieStore.movieDetails.id) ? 
                      'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white' : 
                      'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white'"
                    @click="toggleFavorite"
                  >
                    <span class="mr-2 text-lg">
                      {{ favoriteStore.isFavorite(movieStore.movieDetails.id) ? '❤️' : '🤍' }}
                    </span>
                    {{ favoriteStore.isFavorite(movieStore.movieDetails.id) ? 
                      'Remover dos favoritos' : 'Adicionar aos favoritos' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div class="mb-6">
          <nav class="flex flex-wrap gap-2" aria-label="Tabs">
            <button 
              class="px-5 py-2.5 text-sm font-medium rounded-lg shadow-sm transition-all duration-200 flex items-center"
              :class="activeTab === 'overview' ? 
                'bg-gradient-to-r from-indigo-600 to-purple-600 text-white transform scale-105' : 
                'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'"
              @click="activeTab = 'overview'"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Visão Geral
            </button>
            <button 
              class="px-5 py-2.5 text-sm font-medium rounded-lg shadow-sm transition-all duration-200 flex items-center"
              :class="activeTab === 'cast' ? 
                'bg-gradient-to-r from-indigo-600 to-purple-600 text-white transform scale-105' : 
                'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'"
              @click="activeTab = 'cast'"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Elenco
            </button>
            <button 
              v-if="getTrailerUrl()"
              class="px-5 py-2.5 text-sm font-medium rounded-lg shadow-sm transition-all duration-200 flex items-center"
              :class="activeTab === 'videos' ? 
                'bg-gradient-to-r from-indigo-600 to-purple-600 text-white transform scale-105' : 
                'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'"
              @click="activeTab = 'videos'"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Trailer
            </button>
          </nav>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <div v-if="activeTab === 'overview'">
            <h2 class="text-2xl font-bold mb-4 text-gray-800 dark:text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Sinopse
            </h2>
            <div class="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-lg mb-8 border-l-4 border-indigo-500 dark:border-indigo-400">
              <p v-if="movieStore.movieDetails.overview" class="text-gray-700 dark:text-gray-300 leading-relaxed">
                {{ movieStore.movieDetails.overview }}
              </p>
              <p v-else class="text-gray-500 dark:text-gray-400 text-center py-4">Sinopse não disponível.</p>
            </div>
            
            <h3 class="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Informações Adicionais
            </h3>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div class="bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600 hover:shadow-md transition-shadow duration-300">
                <div class="flex items-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Orçamento</h3>
                </div>
                <p class="text-gray-900 dark:text-white font-medium text-lg">{{ formatCurrency(movieStore.movieDetails.budget) }}</p>
              </div>
              
              <div class="bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600 hover:shadow-md transition-shadow duration-300">
                <div class="flex items-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Receita</h3>
                </div>
                <p class="text-gray-900 dark:text-white font-medium text-lg">{{ formatCurrency(movieStore.movieDetails.revenue) }}</p>
              </div>
              
              <div class="bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600 hover:shadow-md transition-shadow duration-300">
                <div class="flex items-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Idioma Original</h3>
                </div>
                <p class="text-gray-900 dark:text-white font-medium text-lg">{{ movieStore.movieDetails.original_language?.toUpperCase() || 'N/A' }}</p>
              </div>
              
              <div class="bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600 hover:shadow-md transition-shadow duration-300">
                <div class="flex items-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h3>
                </div>
                <p class="text-gray-900 dark:text-white font-medium text-lg">{{ movieStore.movieDetails.status || 'N/A' }}</p>
              </div>
            </div>
          </div>
          
          <div v-else-if="activeTab === 'cast'">
            <h2 class="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Elenco Principal
            </h2>
            
            <div v-if="movieStore.movieDetails.credits?.cast?.length" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              <div 
                v-for="actor in movieStore.movieDetails.credits.cast.slice(0, 10)" 
                :key="actor.id"
                class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
              >
                <div class="aspect-[2/3] overflow-hidden relative">
                  <img 
                    v-if="actor.profile_path" 
                    :src="`https://image.tmdb.org/t/p/w200${actor.profile_path}`" 
                    :alt="actor.name"
                    class="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-gray-500 dark:text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <div class="p-4 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                  <h4 class="font-semibold text-gray-900 dark:text-white text-sm mb-1 truncate">{{ actor.name }}</h4>
                  <p class="text-indigo-600 dark:text-indigo-400 text-xs truncate font-medium">{{ actor.character }}</p>
                </div>
              </div>
            </div>
            
            <div v-else class="bg-gray-50 dark:bg-gray-700/50 p-8 rounded-lg text-center border border-gray-200 dark:border-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p class="text-gray-500 dark:text-gray-400">Informações do elenco não disponíveis.</p>
            </div>
          </div>
          
          <div v-else-if="activeTab === 'videos'">
            <h2 class="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
              Trailer
            </h2>
            
            <div v-if="getTrailerUrl()" class="mt-4">
              <div class="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-xl border-4 border-gray-100 dark:border-gray-700">
                <iframe 
                  :src="getTrailerUrl()" 
                  frameborder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowfullscreen
                  class="w-full h-full"
                ></iframe>
              </div>
              <div class="mt-4 text-center">
                <p class="text-sm text-gray-500 dark:text-gray-400">Assista ao trailer oficial de {{ movieStore.movieDetails.title }}</p>
              </div>
            </div>
            
            <div v-else class="bg-gray-50 dark:bg-gray-700/50 p-8 rounded-lg text-center border border-gray-200 dark:border-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p class="text-gray-500 dark:text-gray-400">Trailer não disponível para este filme.</p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
/* Adiciona suporte para aspect-ratio que não está incluído no Tailwind por padrão */
.aspect-w-16 {
  position: relative;
  padding-bottom: calc(var(--tw-aspect-h) / var(--tw-aspect-w) * 100%);
  --tw-aspect-w: 16;
}

.aspect-h-9 {
  --tw-aspect-h: 9;
}

.aspect-w-16 > * {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>