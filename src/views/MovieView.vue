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
  min-height: 100vh;
}

.loading, .error {
  text-align: center;
  padding: 60px 0;
}

.retry-btn, .back-btn {
  margin-top: 20px;
  padding: 10px 20px;
  background: #0066cc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.backdrop {
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
  min-height: 500px;
}

.backdrop-overlay {
  background: rgba(0, 0, 0, 0.7);
  min-height: 500px;
  padding: 40px 0;
  color: white;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
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
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
}

.no-poster {
  width: 100%;
  height: 450px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #333;
  border-radius: 8px;
  color: #999;
}

.movie-header-info {
  flex: 1;
}

.movie-header-info h1 {
  font-size: 2.5rem;
  margin: 0 0 10px;
}

.release-date {
  font-size: 1.1rem;
  margin-bottom: 15px;
  opacity: 0.8;
}

.genres {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.genre-tag {
  background: rgba(255, 255, 255, 0.2);
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
}

.meta-info {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  font-size: 1.1rem;
}

.rating-value {
  font-weight: bold;
  margin-right: 5px;
}

.rating-count {
  opacity: 0.7;
}

.actions {
  margin-top: 20px;
}

.favorite-btn {
  padding: 12px 24px;
  font-size: 1rem;
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

.content-section {
  padding: 40px 0;
}

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}

.tabs button {
  padding: 10px 20px;
  background: none;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  color: #666;
  transition: all 0.2s ease;
}

.tabs button:hover {
  color: #0066cc;
}

.tabs button.active {
  color: #0066cc;
  font-weight: bold;
  border-bottom: 3px solid #0066cc;
}

.tab-content {
  min-height: 300px;
}

.overview-tab h2, .cast-tab h2, .videos-tab h2 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.5rem;
  color: #333;
}

.overview-tab p {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 30px;
}

.additional-info {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

.info-item h3 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 1.1rem;
  color: #666;
}

.info-item p {
  font-size: 1.2rem;
  margin: 0;
}

.cast-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
}

.cast-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.cast-image {
  height: 225px;
  overflow: hidden;
}

.cast-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  color: #999;
}

.cast-info {
  padding: 10px;
}

.cast-info h4 {
  margin: 0 0 5px;
  font-size: 1rem;
}

.cast-info p {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
}

.trailer-container {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  overflow: hidden;
  max-width: 100%;
}

.trailer-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.no-data {
  color: #666;
  font-style: italic;
}

@media (max-width: 768px) {
  .movie-header {
    flex-direction: column;
  }
  
  .poster-container {
    max-width: 250px;
    margin: 0 auto 30px;
  }
  
  .movie-header-info h1 {
    font-size: 2rem;
    text-align: center;
  }
  
  .release-date, .genres, .meta-info {
    justify-content: center;
    text-align: center;
  }
  
  .actions {
    text-align: center;
  }
}
</style>