<script setup>
import { ref } from 'vue';

const emit = defineEmits(['filter']);

const selectedGenre = ref('');
const genres = ref([
  { id: 28, name: 'Ação' },
  { id: 12, name: 'Aventura' },
  { id: 16, name: 'Animação' },
  { id: 35, name: 'Comédia' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentário' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Família' },
  { id: 14, name: 'Fantasia' },
  { id: 36, name: 'História' },
  { id: 27, name: 'Terror' },
  { id: 10402, name: 'Música' },
  { id: 9648, name: 'Mistério' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Ficção Científica' },
  { id: 10770, name: 'Cinema TV' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'Guerra' },
  { id: 37, name: 'Faroeste' }
]);

const filterByGenre = () => {
  const genreId = selectedGenre.value === '' ? '' : Number(selectedGenre.value);
  emit('filter', genreId);
};
</script>

<template>
  <div class="genre-filter">
    <label for="genre-select">Filtrar por gênero:</label>
    <select 
      id="genre-select"
      v-model="selectedGenre" 
      @change="filterByGenre"
      class="genre-select"
    >
      <option value="">Todos os gêneros</option>
      <option v-for="genre in genres" :key="genre.id" :value="genre.id">
        {{ genre.name }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.genre-filter {
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

label {
  margin-bottom: 10px;
  font-size: 1.1rem;
  color: #e2e8f0;
}

.genre-select {
  width: 100%;
  max-width: 300px;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #4a5568;
  background-color: #2d3748;
  color: #e2e8f0;
  font-size: 1rem;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23a0aec0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 16px;
}

.genre-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
}
</style>