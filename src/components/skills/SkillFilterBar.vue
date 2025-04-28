<template>
  <div class="skill-filter-bar">
    <div class="filter-group">
      <label for="category-filter">Category</label>
      <select 
        id="category-filter" 
        v-model="filters.category" 
        @change="emitUpdate"
      >
        <option value="all">All Categories</option>
        <option 
          v-for="category in skillCategories" 
          :key="category.id" 
          :value="category.id"
        >
          {{ category.name }}
        </option>
      </select>
    </div>
    
    <div class="filter-group">
      <label for="level-filter">Level</label>
      <select 
        id="level-filter" 
        v-model="filters.level" 
        @change="emitUpdate"
      >
        <option value="all">All Levels</option>
        <option 
          v-for="level in skillLevels" 
          :key="level.value" 
          :value="level.value"
        >
          {{ level.label }}
        </option>
      </select>
    </div>
    
    <div class="filter-group search-group">
      <label for="skill-search">Search</label>
      <div class="search-input-wrapper">
        <input 
          id="skill-search" 
          type="text" 
          v-model="filters.search" 
          placeholder="Search skills..."
          @input="emitUpdate"
        />
        <button 
          v-if="filters.search" 
          class="clear-search" 
          @click="clearSearch"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, watch } from 'vue'; // Removed defineProps, defineEmits, toRef
import useSkills from '@/composables/useSkills';

export default {
  name: 'SkillFilterBar',
  props: {
    modelValue: {
      type: Object,
      default: () => ({ category: 'all', level: 'all', search: '' })
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const { skillCategories, skillLevels } = useSkills();

    // Create a reactive copy of the filters from props
    const filters = reactive({ ...props.modelValue });

    // Update component state when props change
    watch(() => props.modelValue, (newValue) => {
      Object.assign(filters, newValue);
    }, { deep: true });

    // Emit changes to parent component
    const emitUpdate = () => {
      emit('update:modelValue', { ...filters });
    };

    // Clear search field
    const clearSearch = () => {
      filters.search = '';
      emitUpdate();
    };

    // Return everything needed by the template
    return {
      filters,
      skillCategories,
      skillLevels,
      emitUpdate,
      clearSearch
    };
  }
}
</script>

<style scoped>
.skill-filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  min-width: 150px;
}

.search-group {
  flex-grow: 1;
}

label {
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: #4B5563;
}

select, input {
  padding: 0.5rem;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  font-size: 0.875rem;
  background-color: white;
}

select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

.search-input-wrapper {
  position: relative;
}

input[type="text"] {
  width: 100%;
  padding-right: 2.5rem;
}

.clear-search {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9CA3AF;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-search:hover {
  color: #4B5563;
}

@media (max-width: 768px) {
  .skill-filter-bar {
    flex-direction: column;
  }
  
  .filter-group {
    width: 100%;
  }
}
</style>