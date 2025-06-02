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
        class="form-control form-control--large"
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
      <div class="grid">
        <div v-for="movie in movieStore.searchResults" :key="movie.id" class="movie-card">
          <div class="movie-card__poster" @click="viewMovieDetails(movie.id)">
            <img 
              v-if="movie.poster_path" 
              :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" 
              :alt="movie.title"
              loading="lazy"
              class="movie-card__poster-img"
            />
            <div v-else class="movie-card__no-poster">Sem imagem</div>
          </div>
          
          <div class="movie-card__info">
            <h3 @click="viewMovieDetails(movie.id)" class="movie-card__title">{{ movie.title }}</h3>
            <div class="movie-card__meta">
              <span v-if="movie.release_date">
                {{ new Date(movie.release_date).getFullYear() }}
              </span>
              <span v-if="movie.vote_average">
                ⭐ {{ movie.vote_average.toFixed(1) }}
              </span>
            </div>
            
            <button 
              class="btn btn--favorite" 
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
        <div class="pagination__info">
          <span>Página {{ movieStore.currentPage }} de {{ movieStore.totalPages }}</span>
          <span>Total: {{ movieStore.totalResults }} filmes</span>
        </div>
        <div class="pagination__controls">
          <button 
            @click="goToPage(movieStore.currentPage - 1)" 
            :disabled="movieStore.currentPage <= 1"
            class="pagination__btn"
          >
            &laquo; Anterior
          </button>
          
          <button 
            @click="goToPage(movieStore.currentPage + 1)" 
            :disabled="movieStore.currentPage >= movieStore.totalPages"
            class="pagination__btn"
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
  padding: var(--spacing-md);
}

h1 {
  margin-bottom: var(--spacing-xl);
  text-align: center;
  color: var(--color-text);
}

.search-container {
  max-width: 600px;
  margin: 0 auto var(--spacing-xl);
}

/* Media queries para responsividade */
@media (max-width: 768px) {
  .search-page {
    padding: var(--spacing-sm);
  }
  
  h1 {
    font-size: var(--font-size-xl);
    margin-bottom: var(--spacing-lg);
  }
  
  .search-container {
    max-width: 100%;
    margin-bottom: var(--spacing-lg);
  }
  
  .movie-card__title {
    font-size: var(--font-size-md);
  }
  
  .movie-card__meta {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }
  
  .btn--favorite {
    font-size: var(--font-size-sm);
    padding: var(--spacing-xs);
  }
  
  .pagination {
    margin-top: var(--spacing-xl);
  }
  
  .pagination__info {
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-xs);
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: var(--font-size-lg);
  }
  
  .grid {
    gap: var(--spacing-md);
  }
  
  .movie-card__poster {
    height: 300px;
  }
  
  .pagination__controls {
    width: 100%;
    justify-content: space-between;
  }
  
  .pagination__btn {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: var(--font-size-sm);
  }
}
</style>