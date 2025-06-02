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
  <div class="movie-details">
    <div v-if="movieStore.loading" class="loading">
      <p>Carregando detalhes do filme...</p>
    </div>
    
    <div v-else-if="movieStore.error" class="error">
      <p>{{ movieStore.error }}</p>
      <button @click="movieStore.fetchMovieDetails(movieId)" class="btn btn--primary">Tentar novamente</button>
    </div>
    
    <div v-else-if="!movieStore.movieDetails" class="error">
      <p>Filme não encontrado.</p>
      <button @click="$router.push('/')" class="btn btn--primary">Voltar para a página inicial</button>
    </div>
    
    <template v-else>
      <div 
        class="movie-details__backdrop" 
        :style="movieStore.movieDetails.backdrop_path ? 
          `background-image: url(https://image.tmdb.org/t/p/original${movieStore.movieDetails.backdrop_path})` : ''"
      >
        <div class="movie-details__backdrop-overlay">
          <div class="container">
            <div class="movie-details__header">
              <div class="movie-details__poster-container">
                <img 
                  v-if="movieStore.movieDetails.poster_path" 
                  :src="`https://image.tmdb.org/t/p/w500${movieStore.movieDetails.poster_path}`" 
                  :alt="movieStore.movieDetails.title"
                  class="movie-details__poster"
                />
                <div v-else class="movie-details__no-poster">Sem imagem</div>
              </div>
              
              <div class="movie-details__info">
                <h1 class="movie-details__title">{{ movieStore.movieDetails.title }}</h1>
                
                <div v-if="movieStore.movieDetails.release_date" class="movie-details__release-date">
                  {{ formatDate(movieStore.movieDetails.release_date) }}
                </div>
                
                <div class="movie-details__genres">
                  <span 
                    v-for="genre in movieStore.movieDetails.genres" 
                    :key="genre.id"
                    class="movie-details__genre-tag"
                  >
                    {{ genre.name }}
                  </span>
                </div>
                
                <div class="movie-details__meta">
                  <div class="movie-details__rating" v-if="movieStore.movieDetails.vote_average">
                    <span class="movie-details__rating-value">⭐ {{ movieStore.movieDetails.vote_average.toFixed(1) }}</span>
                    <span class="movie-details__rating-count">({{ movieStore.movieDetails.vote_count }} votos)</span>
                  </div>
                  
                  <div class="movie-details__runtime" v-if="movieStore.movieDetails.runtime">
                    🕒 {{ formatRuntime(movieStore.movieDetails.runtime) }}
                  </div>
                </div>
                
                <div class="movie-details__actions">
                  <button 
                    class="btn" 
                    :class="favoriteStore.isFavorite(movieStore.movieDetails.id) ? 'btn--favorite btn--active' : 'btn--favorite'"
                    @click="toggleFavorite"
                  >
                    {{ favoriteStore.isFavorite(movieStore.movieDetails.id) ? 
                      '❤️ Remover dos favoritos' : '🤍 Adicionar aos favoritos' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="container movie-details__content-section">
        <div class="movie-details__tabs">
          <button 
            class="movie-details__tab-btn"
            :class="{ 'movie-details__tab-btn--active': activeTab === 'overview' }" 
            @click="activeTab = 'overview'"
          >
            Visão Geral
          </button>
          <button 
            class="movie-details__tab-btn"
            :class="{ 'movie-details__tab-btn--active': activeTab === 'cast' }" 
            @click="activeTab = 'cast'"
          >
            Elenco
          </button>
          <button 
            class="movie-details__tab-btn"
            :class="{ 'movie-details__tab-btn--active': activeTab === 'videos' }" 
            @click="activeTab = 'videos'"
            v-if="getTrailerUrl()"
          >
            Trailer
          </button>
        </div>
        
        <div class="movie-details__tab-content">
          <div v-if="activeTab === 'overview'" class="movie-details__overview">
            <h2>Sinopse</h2>
            <p v-if="movieStore.movieDetails.overview">
              {{ movieStore.movieDetails.overview }}
            </p>
            <p v-else class="movie-details__no-data">Sinopse não disponível.</p>
            
            <div class="movie-details__additional-info">
              <div class="movie-details__info-item">
                <h3>Orçamento</h3>
                <p>{{ formatCurrency(movieStore.movieDetails.budget) }}</p>
              </div>
              
              <div class="movie-details__info-item">
                <h3>Receita</h3>
                <p>{{ formatCurrency(movieStore.movieDetails.revenue) }}</p>
              </div>
              
              <div class="movie-details__info-item">
                <h3>Idioma Original</h3>
                <p>{{ movieStore.movieDetails.original_language?.toUpperCase() || 'N/A' }}</p>
              </div>
              
              <div class="movie-details__info-item">
                <h3>Status</h3>
                <p>{{ movieStore.movieDetails.status || 'N/A' }}</p>
              </div>
            </div>
          </div>
          
          <div v-else-if="activeTab === 'cast'" class="movie-details__cast">
            <h2>Elenco Principal</h2>
            
            <div v-if="movieStore.movieDetails.credits?.cast?.length" class="movie-details__cast-grid">
              <div 
                v-for="actor in movieStore.movieDetails.credits.cast.slice(0, 10)" 
                :key="actor.id"
                class="movie-details__cast-card"
              >
                <div class="movie-details__cast-image">
                  <img 
                    v-if="actor.profile_path" 
                    :src="`https://image.tmdb.org/t/p/w200${actor.profile_path}`" 
                    :alt="actor.name"
                    class="movie-details__cast-photo"
                  />
                  <div v-else class="movie-details__no-photo">Sem foto</div>
                </div>
                <div class="movie-details__cast-info">
                  <h4 class="movie-details__cast-name">{{ actor.name }}</h4>
                  <p class="movie-details__cast-character">{{ actor.character }}</p>
                </div>
              </div>
            </div>
            
            <p v-else class="movie-details__no-data">Informações do elenco não disponíveis.</p>
          </div>
          
          <div v-else-if="activeTab === 'videos'" class="movie-details__videos">
            <h2>Trailer</h2>
            
            <div v-if="getTrailerUrl()" class="movie-details__trailer-container">
              <iframe 
                :src="getTrailerUrl()" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen
                class="movie-details__trailer-frame"
              ></iframe>
            </div>
            
            <p v-else class="movie-details__no-data">Trailer não disponível.</p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.movie-details {
  padding-bottom: var(--spacing-xl);
}

.loading, .error {
  text-align: center;
  padding: var(--spacing-xxl) 0;
}

.movie-details__backdrop {
  background-size: cover;
  background-position: center;
  position: relative;
}

.movie-details__backdrop-overlay {
  background: rgba(0, 0, 0, 0.7);
  padding: var(--spacing-xl) 0;
}

.movie-details__header {
  display: flex;
  gap: var(--spacing-lg);
}

.movie-details__poster-container {
  flex: 0 0 300px;
}

.movie-details__poster {
  width: 100%;
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-lg);
}

.movie-details__no-poster {
  width: 100%;
  height: 450px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-background-elevated);
  color: var(--color-text-muted);
  border-radius: var(--border-radius-md);
}

.movie-details__info {
  flex: 1;
  color: var(--color-text);
}

.movie-details__title {
  font-size: var(--font-size-xxl);
  margin-bottom: var(--spacing-xs);
}

.movie-details__release-date {
  font-size: var(--font-size-md);
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-muted);
}

.movie-details__genres {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-md);
}

.movie-details__genre-tag {
  background: rgba(59, 130, 246, 0.2);
  color: var(--color-primary-light);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-sm);
}

.movie-details__meta {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  font-size: var(--font-size-md);
}

.movie-details__rating-value {
  color: var(--color-accent);
}

.movie-details__rating-count {
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

.movie-details__actions {
  margin-top: var(--spacing-md);
}

.movie-details__content-section {
  margin-top: var(--spacing-lg);
}

.movie-details__tabs {
  display: flex;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
  padding-bottom: var(--spacing-xs);
}

.movie-details__tab-btn {
  background: none;
  border: none;
  color: var(--color-text-muted);
  font-size: var(--font-size-md);
  padding: var(--spacing-xs) var(--spacing-sm);
  cursor: pointer;
  border-radius: var(--border-radius-sm);
  transition: var(--transition-normal);
}

.movie-details__tab-btn:hover {
  background-color: var(--color-background-elevated);
  color: var(--color-text);
}

.movie-details__tab-btn--active {
  background-color: var(--color-primary);
  color: var(--color-text-on-primary);
}

.movie-details__tab-content {
  background-color: var(--color-background-elevated);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  box-shadow: var(--shadow-md);
}

.movie-details__overview {
  line-height: 1.7;
  color: var(--color-text);
}

.movie-details__additional-info {
  margin-top: var(--spacing-lg);
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-md);
}

.movie-details__info-item {
  margin-bottom: var(--spacing-sm);
}

.movie-details__info-item h3 {
  font-weight: bold;
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-xs);
}

.movie-details__trailer-container {
  margin-top: var(--spacing-md);
}

.movie-details__trailer-frame {
  width: 100%;
  aspect-ratio: 16/9;
  border: none;
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
}

.movie-details__cast-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: var(--spacing-md);
}

.movie-details__cast-card {
  background-color: var(--color-background-elevated);
  border-radius: var(--border-radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.movie-details__cast-photo {
  width: 100%;
  aspect-ratio: 2/3;
  object-fit: cover;
}

.movie-details__no-photo {
  width: 100%;
  aspect-ratio: 2/3;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-background-elevated);
  color: var(--color-text-muted);
}

.movie-details__cast-info {
  padding: var(--spacing-sm);
}

.movie-details__cast-name {
  font-weight: bold;
  margin-bottom: var(--spacing-xs);
  color: var(--color-text);
}

.movie-details__cast-character {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.movie-details__no-data {
  color: var(--color-text-muted);
  text-align: center;
  padding: var(--spacing-md);
}

@media (max-width: 768px) {
  .movie-details__header {
    flex-direction: column;
  }
  
  .movie-details__poster-container {
    flex: 0 0 auto;
    max-width: 250px;
    margin: 0 auto;
  }
  
  .movie-details__title {
    font-size: var(--font-size-xl);
    text-align: center;
  }
  
  .movie-details__release-date, 
  .movie-details__genres {
    text-align: center;
    justify-content: center;
  }
  
  .movie-details__meta {
    justify-content: center;
  }
  
  .movie-details__actions {
    display: flex;
    justify-content: center;
  }
}
</style>