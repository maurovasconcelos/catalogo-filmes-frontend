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
      <button @click="movieStore.fetchMovieDetails(movieId)" class="retry-btn">Tentar novamente</button>
    </div>
    
    <div v-else-if="!movieStore.movieDetails" class="error">
      <p>Filme não encontrado.</p>
      <button @click="$router.push('/')" class="back-btn">Voltar para a página inicial</button>
    </div>
    
    <template v-else>
      <div 
        class="backdrop" 
        :style="movieStore.movieDetails.backdrop_path ? 
          `background-image: url(https://image.tmdb.org/t/p/original${movieStore.movieDetails.backdrop_path})` : ''"
      >
        <div class="backdrop-overlay">
          <div class="container">
            <div class="movie-header">
              <div class="poster-container">
                <img 
                  v-if="movieStore.movieDetails.poster_path" 
                  :src="`https://image.tmdb.org/t/p/w500${movieStore.movieDetails.poster_path}`" 
                  :alt="movieStore.movieDetails.title"
                  class="poster"
                />
                <div v-else class="no-poster">Sem imagem</div>
              </div>
              
              <div class="movie-header-info">
                <h1>{{ movieStore.movieDetails.title }}</h1>
                
                <div v-if="movieStore.movieDetails.release_date" class="release-date">
                  {{ formatDate(movieStore.movieDetails.release_date) }}
                </div>
                
                <div class="genres">
                  <span 
                    v-for="genre in movieStore.movieDetails.genres" 
                    :key="genre.id"
                    class="genre-tag"
                  >
                    {{ genre.name }}
                  </span>
                </div>
                
                <div class="meta-info">
                  <div class="rating" v-if="movieStore.movieDetails.vote_average">
                    <span class="rating-value">⭐ {{ movieStore.movieDetails.vote_average.toFixed(1) }}</span>
                    <span class="rating-count">({{ movieStore.movieDetails.vote_count }} votos)</span>
                  </div>
                  
                  <div class="runtime" v-if="movieStore.movieDetails.runtime">
                    🕒 {{ formatRuntime(movieStore.movieDetails.runtime) }}
                  </div>
                </div>
                
                <div class="actions">
                  <button 
                    class="favorite-btn" 
                    :class="{ 'is-favorite': favoriteStore.isFavorite(movieStore.movieDetails.id) }"
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
      
      <div class="container content-section">
        <div class="tabs">
          <button 
            :class="{ active: activeTab === 'overview' }" 
            @click="activeTab = 'overview'"
          >
            Visão Geral
          </button>
          <button 
            :class="{ active: activeTab === 'cast' }" 
            @click="activeTab = 'cast'"
          >
            Elenco
          </button>
          <button 
            :class="{ active: activeTab === 'videos' }" 
            @click="activeTab = 'videos'"
            v-if="getTrailerUrl()"
          >
            Trailer
          </button>
        </div>
        
        <div class="tab-content">
          <div v-if="activeTab === 'overview'" class="overview-tab">
            <h2>Sinopse</h2>
            <p v-if="movieStore.movieDetails.overview">
              {{ movieStore.movieDetails.overview }}
            </p>
            <p v-else class="no-data">Sinopse não disponível.</p>
            
            <div class="additional-info">
              <div class="info-item">
                <h3>Orçamento</h3>
                <p>{{ formatCurrency(movieStore.movieDetails.budget) }}</p>
              </div>
              
              <div class="info-item">
                <h3>Receita</h3>
                <p>{{ formatCurrency(movieStore.movieDetails.revenue) }}</p>
              </div>
              
              <div class="info-item">
                <h3>Idioma Original</h3>
                <p>{{ movieStore.movieDetails.original_language?.toUpperCase() || 'N/A' }}</p>
              </div>
              
              <div class="info-item">
                <h3>Status</h3>
                <p>{{ movieStore.movieDetails.status || 'N/A' }}</p>
              </div>
            </div>
          </div>
          
          <div v-else-if="activeTab === 'cast'" class="cast-tab">
            <h2>Elenco Principal</h2>
            
            <div v-if="movieStore.movieDetails.credits?.cast?.length" class="cast-grid">
              <div 
                v-for="actor in movieStore.movieDetails.credits.cast.slice(0, 10)" 
                :key="actor.id"
                class="cast-card"
              >
                <div class="cast-image">
                  <img 
                    v-if="actor.profile_path" 
                    :src="`https://image.tmdb.org/t/p/w200${actor.profile_path}`" 
                    :alt="actor.name"
                  />
                  <div v-else class="no-image">Sem foto</div>
                </div>
                <div class="cast-info">
                  <h4>{{ actor.name }}</h4>
                  <p>{{ actor.character }}</p>
                </div>
              </div>
            </div>
            
            <p v-else class="no-data">Informações do elenco não disponíveis.</p>
          </div>
          
          <div v-else-if="activeTab === 'videos'" class="videos-tab">
            <h2>Trailer</h2>
            
            <div v-if="getTrailerUrl()" class="trailer-container">
              <iframe 
                :src="getTrailerUrl()" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen
              ></iframe>
            </div>
            
            <p v-else class="no-data">Trailer não disponível.</p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.movie-details {
  padding-bottom: 40px;
}

.loading, .error {
  text-align: center;
  padding: 60px 0;
}

.retry-btn, .back-btn {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.retry-btn:hover, .back-btn:hover {
  background-color: #2563eb;
}

.backdrop {
  background-size: cover;
  background-position: center;
  position: relative;
}

.backdrop-overlay {
  background: rgba(0, 0, 0, 0.7);
  padding: 40px 0;
}

.movie-header {
  display: flex;
  gap: 30px;
}

.poster-container {
  flex: 0 0 300px;
}

.poster {
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.no-poster {
  width: 100%;
  height: 450px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #2d3748;
  color: #a0aec0;
  border-radius: 8px;
}

.movie-header-info {
  flex: 1;
  color: white;
}

.movie-header-info h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.release-date {
  font-size: 1.1rem;
  margin-bottom: 15px;
  color: #a0aec0;
}

.genres {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.genre-tag {
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.9rem;
}

.meta-info {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  font-size: 1.1rem;
}

.rating-value {
  color: #fbbf24;
}

.rating-count {
  color: #a0aec0;
  font-size: 0.9rem;
}

.actions {
  margin-top: 20px;
}

.favorite-btn {
  padding: 10px 20px;
  background-color: #2d3748;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
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

.content-section {
  margin-top: 30px;
}

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  border-bottom: 1px solid #4a5568;
  padding-bottom: 10px;
}

.tabs button {
  background: none;
  border: none;
  color: #a0aec0;
  font-size: 1rem;
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
}

.tabs button:hover {
  background-color: #2d3748;
  color: #e2e8f0;
}

.tabs button.active {
  background-color: #3b82f6;
  color: white;
}

.tab-content {
  background-color: #1e1e1e;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.overview {
  line-height: 1.7;
  color: #e2e8f0;
}

.tagline {
  font-style: italic;
  color: #a0aec0;
  margin-bottom: 20px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.info-item {
  margin-bottom: 15px;
}

.info-label {
  font-weight: bold;
  color: #a0aec0;
  margin-bottom: 5px;
}

.info-value {
  color: #e2e8f0;
}

.trailer-container {
  margin-top: 20px;
}

.trailer-frame {
  width: 100%;
  aspect-ratio: 16/9;
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.no-trailer {
  text-align: center;
  padding: 40px;
  background-color: #2d3748;
  border-radius: 8px;
  color: #a0aec0;
}

.cast-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
}

.cast-card {
  background-color: #2d3748;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.cast-photo {
  width: 100%;
  aspect-ratio: 2/3;
  object-fit: cover;
}

.no-photo {
  width: 100%;
  aspect-ratio: 2/3;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #4a5568;
  color: #a0aec0;
}

.cast-info {
  padding: 10px;
}

.cast-name {
  font-weight: bold;
  margin-bottom: 5px;
  color: #e2e8f0;
}

.cast-character {
  font-size: 0.9rem;
  color: #a0aec0;
}

@media (max-width: 768px) {
  .movie-header {
    flex-direction: column;
  }
  
  .poster-container {
    flex: 0 0 auto;
    max-width: 250px;
    margin: 0 auto;
  }
  
  .movie-header-info h1 {
    font-size: 2rem;
    text-align: center;
  }
  
  .release-date, .genres {
    text-align: center;
    justify-content: center;
  }
  
  .meta-info {
    justify-content: center;
  }
  
  .actions {
    display: flex;
    justify-content: center;
  }
}
</style>