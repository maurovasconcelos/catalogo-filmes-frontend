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
  <div class="home">
    <h1>Filmes Populares</h1>
    
    <div v-if="movieStore.loading" class="loading">
      <p>Carregando filmes...</p>
    </div>
    
    <div v-else-if="movieStore.error" class="error">
      <p>{{ movieStore.error }}</p>
      <button @click="movieStore.fetchPopularMovies">Tentar novamente</button>
    </div>
    
    <div v-else-if="movieStore.popularMovies.length === 0" class="empty">
      <p>Nenhum filme encontrado.</p>
    </div>
    
    <div v-else class="movie-grid">
      <div v-for="movie in movieStore.popularMovies" :key="movie.id" class="movie-card">
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
.home {
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
</style>