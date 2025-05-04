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
  gap: 1.5rem;
  padding: 1.5rem;
  background-color: var(--card-bg);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.filter-group {
  display: flex;
  flex-direction: column;
  min-width: 150px;
  gap: 0.5rem;
}

.search-group {
  flex-grow: 1;
}

label {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: var(--text-color);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

select, input {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 0.9rem;
  background-color: var(--bg-darker); /* This styles the box */
  color: var(--text-color);
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

/* Attempt to style options (limited browser support) */
select option {
  background-color: var(--bg-darker); /* Try setting background */
  color: var(--text-color); /* Ensure text is readable */
}

select:focus, input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(79,70,229,0.1), 0 2px 4px rgba(0, 0, 0, 0.08);
}

select {
  appearance: none;
  background-position: right 0.75rem center;
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
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: var(--bg-darker);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.clear-search:hover {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
  transform: translateY(-50%) scale(1.1);
}

@media (max-width: 768px) {
  .skill-filter-bar {
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
  }
  .filter-group {
    width: 100%;
  }
}
</style>