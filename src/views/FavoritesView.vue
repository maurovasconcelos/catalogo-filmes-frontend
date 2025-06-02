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
  <div class="favorites-page">
    <h1>Meus Filmes Favoritos</h1>
    
    <genre-filter @filter="filterByGenre" />
    
    <div v-if="favoriteStore.loading" class="loading">
      <p>Carregando favoritos...</p>
    </div>
    
    <div v-else-if="favoriteStore.error" class="error">
      <p>{{ favoriteStore.error }}</p>
      <button class="btn btn--primary" @click="favoriteStore.fetchFavorites">Tentar novamente</button>
    </div>
    
    <div v-else-if="filteredFavorites.length === 0" class="empty">
      <p v-if="favoriteStore.favorites.length === 0">Você ainda não adicionou nenhum filme aos favoritos.</p>
      <p v-else>Nenhum filme favorito encontrado para o gênero selecionado.</p>
    </div>
    
    <div v-else class="grid">
      <div v-for="movie in filteredFavorites" :key="movie.id" class="movie-card">
        <div class="movie-card__poster" @click="viewMovieDetails(movie.tmdb_id)">
          <img 
            v-if="movie.poster_path" 
            :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" 
            :alt="movie.title"
            class="movie-card__poster-img"
          />
          <div v-else class="movie-card__no-poster">Sem imagem</div>
        </div>
        
        <div class="movie-card__info">
          <h3 @click="viewMovieDetails(movie.tmdb_id)" class="movie-card__title">{{ movie.title }}</h3>
          <div class="movie-card__meta">
            <span v-if="movie.release_date">
              {{ new Date(movie.release_date).getFullYear() }}
            </span>
            <span v-if="movie.vote_average">
              ⭐ {{ movie.vote_average.toFixed(1) }}
            </span>
          </div>
          
          <button 
            class="btn btn--secondary btn--full" 
            @click="favoriteStore.removeFromFavorites(movie.tmdb_id)"
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
  padding: var(--spacing-md);
}

h1 {
  margin-bottom: var(--spacing-xl);
  text-align: center;
  color: var(--color-text);
}

/* Nota: Os estilos para movie-card e seus elementos foram movidos para components.css */
/* Aqui mantemos apenas estilos específicos desta página */

/* Media queries para responsividade */
@media (max-width: 768px) {
  .favorites-page {
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
  
  .btn--secondary {
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