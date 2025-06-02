<script setup>
import { onMounted, ref } from 'vue';
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

const handleGenreFilter = async (genreId) => {
  selectedGenreId.value = genreId;
  await favoriteStore.fetchFavorites(genreId ? { genre_id: genreId } : {});
};
</script>

<template>
  <div class="favorites-page">
    <h1>Meus Filmes Favoritos</h1>
    
    <GenreFilter @filter="handleGenreFilter" />
    
    <div v-if="favoriteStore.loading" class="loading">
      <p>Carregando favoritos...</p>
    </div>
    
    <div v-else-if="favoriteStore.error" class="error">
      <p>{{ favoriteStore.error }}</p>
      <button @click="favoriteStore.fetchFavorites">Tentar novamente</button>
    </div>
    
    <div v-else-if="favoriteStore.favorites.length === 0" class="empty">
      <p>Você ainda não adicionou nenhum filme aos favoritos.</p>
      <button @click="router.push('/')" class="action-btn">Explorar filmes populares</button>
    </div>
    
    <div v-else class="movie-grid">
      <div v-for="movie in favoriteStore.favorites" :key="movie.tmdb_id" class="movie-card">
        <div class="poster" @click="viewMovieDetails(movie.tmdb_id)">
          <img 
            v-if="movie.poster_path" 
            :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" 
            :alt="movie.title"
          />
          <div v-else class="no-poster">Sem imagem</div>
        </div>
        
        <div class="movie-info">
          <h3 @click="viewMovieDetails(movie.tmdb_id)">{{ movie.title }}</h3>
          <div class="movie-meta">
            <span class="year" v-if="movie.release_date">
              {{ new Date(movie.release_date).getFullYear() }}
            </span>
            <span class="rating" v-if="movie.vote_average">
              ⭐ {{ parseFloat(movie.vote_average).toFixed(1) }}
            </span>
          </div>
          
          <button 
            class="remove-btn"
            @click="removeFromFavorites(movie.tmdb_id)"
          >
            ❌ Remover dos favoritos
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.favorites-page {
  padding: 20px;
}

h1 {
  margin-bottom: 30px;
  text-align: center;
  color: #e2e8f0;
}

.loading, .error, .empty {
  text-align: center;
  padding: 40px 0;
}

.action-btn {
  margin-top: 15px;
  padding: 10px 20px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.action-btn:hover {
  background-color: #2563eb;
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 30px;
  margin-top: 30px;
}

.movie-card {
  background-color: #1e1e1e;
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

.remove-btn {
  width: 100%;
  padding: 8px;
  border: none;
  border-radius: 4px;
  background-color: #e53e3e;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 0.9rem;
}

.remove-btn:hover {
  background-color: #c53030;
}
</style>