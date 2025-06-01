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
  emit('filter', selectedGenre.value);
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
  margin-bottom: 20px;
  text-align: center;
}

label {
  margin-right: 10px;
  font-weight: 500;
}

.genre-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  font-size: 1rem;
  min-width: 200px;
  cursor: pointer;
}

.genre-select:focus {
  outline: none;
  border-color: #0066cc;
  box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.2);
}
</style>