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
  <div class="search-page">
    <h1>Buscar Filmes</h1>
    
    <div class="search-container">
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="Digite o nome do filme..."
        class="search-input"
        autofocus
      />
    </div>
    
    <div v-if="movieStore.loading" class="loading">
      <p>Buscando filmes...</p>
    </div>
    
    <div v-else-if="movieStore.error" class="error">
      <p>{{ movieStore.error }}</p>
      <button @click="performSearch(1)">Tentar novamente</button>
    </div>
    
    <div v-else-if="searchQuery && movieStore.searchResults.length === 0" class="empty">
      <p>Nenhum filme encontrado para "{{ searchQuery }}".</p>
    </div>
    
    <div v-else-if="!searchQuery" class="empty">
      <p>Digite um termo de busca para encontrar filmes.</p>
    </div>
    
    <div v-else>
      <div class="movie-grid">
        <div v-for="movie in movieStore.searchResults" :key="movie.id" class="movie-card">
          <div class="poster" @click="viewMovieDetails(movie.id)">
            <img 
              v-if="movie.poster_path" 
              :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" 
              :alt="movie.title"
              loading="lazy"
            />
            <div v-else class="no-poster">Sem imagem</div>
          </div>
          
          <div class="movie-info">
            <h3 @click="viewMovieDetails(movie.id)">{{ movie.title }}</h3>
            <div class="movie-meta">
              <span class="year" v-if="movie.release_date">
                {{ new Date(movie.release_date).getFullYear() }}
              </span>
              <span class="rating" v-if="movie.vote_average">
                ⭐ {{ movie.vote_average.toFixed(1) }}
              </span>
            </div>
            
            <button 
              class="favorite-btn" 
              :class="{ 'is-favorite': favoriteStore.isFavorite(movie.id) }"
              @click="toggleFavorite(movie)"
            >
              {{ favoriteStore.isFavorite(movie.id) ? '❤️ Remover dos favoritos' : '🤍 Adicionar aos favoritos' }}
            </button>
          </div>
        </div>
      </div>
      
      <!-- Paginação -->
      <div v-if="movieStore.totalPages > 1" class="pagination">
        <div class="pagination-info">
          <span>Página {{ movieStore.currentPage }} de {{ movieStore.totalPages }}</span>
          <span>Total: {{ movieStore.totalResults }} filmes</span>
        </div>
        <div class="pagination-controls">
          <button 
            @click="goToPage(movieStore.currentPage - 1)" 
            :disabled="movieStore.currentPage <= 1"
            class="pagination-btn"
          >
            &laquo; Anterior
          </button>
          
          <button 
            @click="goToPage(movieStore.currentPage + 1)" 
            :disabled="movieStore.currentPage >= movieStore.totalPages"
            class="pagination-btn"
          >
            Próxima &raquo;
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-page {
  padding: 20px;
}

h1 {
  margin-bottom: 30px;
  text-align: center;
  color: #e2e8f0;
}

.search-container {
  max-width: 600px;
  margin: 0 auto 30px;
}

.search-input {
  width: 100%;
  padding: 12px 20px;
  font-size: 1.1rem;
  border: 1px solid #4a5568;
  border-radius: 8px;
  background-color: #2d3748;
  color: #e2e8f0;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
}

.loading, .error, .empty {
  text-align: center;
  padding: 40px 0;
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 30px;
}

.movie-card {
  background: #1e1e1e;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
}

.movie-card:hover {
  transform: translateY(-5px);
}

.poster {
  height: 375px;
  overflow: hidden;
  cursor: pointer;
}

.poster img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.poster img:hover {
  transform: scale(1.05);
}

.no-poster {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #2d3748;
  color: #a0aec0;
}

.movie-info {
  padding: 15px;
}

.movie-info h3 {
  margin: 0 0 10px;
  font-size: 1.1rem;
  cursor: pointer;
  color: #e2e8f0;
}

.movie-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 0.9rem;
  color: #a0aec0;
}

.favorite-btn {
  width: 100%;
  padding: 8px;
  border: none;
  border-radius: 4px;
  background-color: #2d3748;
  color: #e2e8f0;
  cursor: pointer;
  transition: background-color 0.3s;
}

.favorite-btn:hover {
  background-color: #4a5568;
}

.favorite-btn.is-favorite {
  background-color: #3b82f6;
}

.favorite-btn.is-favorite:hover {
  background-color: #2563eb;
}

/* Paginação */
.pagination {
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pagination-info {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 500px;
  margin-bottom: 15px;
  color: #a0aec0;
}

.pagination-controls {
  display: flex;
  gap: 10px;
}

.pagination-btn {
  padding: 8px 16px;
  background-color: #2d3748;
  color: #e2e8f0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #4a5568;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>