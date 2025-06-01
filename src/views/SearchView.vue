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

const performSearch = () => {
  clearTimeout(debouncedSearchTimeout.value);
  
  if (searchQuery.value.trim() === '') {
    movieStore.clearSearchResults();
    return;
  }
  
  debouncedSearchTimeout.value = setTimeout(async () => {
    await movieStore.searchMovies(searchQuery.value);
  }, 500); // Espera 500ms após  digitar
};

// Observa mudança no campo de busca
watch(searchQuery, () => {
  performSearch();
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
      <button @click="performSearch">Tentar novamente</button>
    </div>
    
    <div v-else-if="searchQuery && movieStore.searchResults.length === 0" class="empty">
      <p>Nenhum filme encontrado para "{{ searchQuery }}".</p>
    </div>
    
    <div v-else-if="!searchQuery" class="empty">
      <p>Digite um termo de busca para encontrar filmes.</p>
    </div>
    
    <div v-else class="movie-grid">
      <div v-for="movie in movieStore.searchResults" :key="movie.id" class="movie-card">
        <div class="poster" @click="viewMovieDetails(movie.id)">
          <img 
            v-if="movie.poster_path" 
            :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" 
            :alt="movie.title"
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
  </div>
</template>

<style scoped>
.search-page {
  padding: 20px;
}

h1 {
  margin-bottom: 30px;
  text-align: center;
  color: #333;
}

.search-container {
  max-width: 600px;
  margin: 0 auto 40px;
}

.search-input {
  width: 100%;
  padding: 12px 20px;
  font-size: 1.1rem;
  border: 2px solid #ddd;
  border-radius: 30px;
  outline: none;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  border-color: #0066cc;
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
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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
  background: #f0f0f0;
  color: #999;
}

.movie-info {
  padding: 15px;
}

.movie-info h3 {
  margin: 0 0 10px;
  font-size: 1.1rem;
  cursor: pointer;
}

.movie-info h3:hover {
  color: #0066cc;
}

.movie-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 0.9rem;
  color: #666;
}

.favorite-btn {
  width: 100%;
  padding: 8px;
  border: none;
  border-radius: 4px;
  background: #f0f0f0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.favorite-btn:hover {
  background: #e0e0e0;
}

.favorite-btn.is-favorite {
  background: #ff6b6b;
  color: white;
}

.favorite-btn.is-favorite:hover {
  background: #ff5252;
}
</style>