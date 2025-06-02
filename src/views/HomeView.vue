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
    
    <div v-else class="grid">
      <div v-for="movie in movieStore.popularMovies" :key="movie.id" class="movie-card">
        <div class="movie-card__poster" @click="viewMovieDetails(movie.id)">
          <img 
            v-if="movie.poster_path" 
            :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" 
            :alt="movie.title"
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
  </div>
</template>

<style scoped>
.home {
  padding: var(--spacing-md);
}

h1 {
  margin-bottom: var(--spacing-xl);
  text-align: center;
  color: var(--color-text);
}

/* Utilizando as classes de status do components.css */
.loading, .error, .empty {
  text-align: center;
  padding: calc(var(--spacing-xl) * 2) 0;
}

/* Media queries para responsividade */
@media (max-width: 768px) {
  .home {
    padding: var(--spacing-sm);
  }
  
  h1 {
    font-size: var(--font-size-xl);
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
}
</style>