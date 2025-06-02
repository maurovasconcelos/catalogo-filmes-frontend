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
  color: #333;
}

.loading, .error, .empty {
  text-align: center;
  padding: 40px 0;
}

.action-btn {
  margin-top: 15px;
  padding: 10px 20px;
  background-color: #0066cc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.action-btn:hover {
  background-color: #0052a3;
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 30px;
  margin-top: 30px;
}

.movie-card {
  background-color: white;
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
  background-color: #f0f0f0;
  color: #666;
  font-style: italic;
}

.movie-info {
  padding: 15px;
}

.movie-info h3 {
  margin: 0 0 10px;
  font-size: 1.2rem;
  cursor: pointer;
}

.movie-info h3:hover {
  color: #0066cc;
}

.movie-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  color: #666;
  font-size: 0.9rem;
}

.remove-btn {
  width: 100%;
  padding: 8px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;
}

.remove-btn:hover {
  background-color: #d32f2f;
}
</style>