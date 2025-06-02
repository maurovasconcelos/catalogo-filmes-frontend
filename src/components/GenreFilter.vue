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
    <label for="genre-select" class="form-label">Filtrar por gênero:</label>
    <select 
      id="genre-select"
      v-model="selectedGenre" 
      @change="filterByGenre"
      class="select"
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
  margin-bottom: var(--spacing-xl);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.select {
  max-width: 300px;
  width: 100%;
}

/* Media queries para responsividade */
@media (max-width: 768px) {
  .genre-filter {
    margin-bottom: var(--spacing-lg);
  }
  
  .select {
    max-width: 100%;
    width: 100%;
  }
  
  .form-label {
    font-size: var(--font-size-md);
    margin-bottom: var(--spacing-xs);
  }
}

@media (max-width: 480px) {
  .genre-filter {
    margin-bottom: var(--spacing-md);
    width: 100%;
    padding: 0 var(--spacing-sm);
  }
  
  .form-label {
    font-size: var(--font-size-sm);
  }
}
</style>