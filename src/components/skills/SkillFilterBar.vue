<template>
  <div class="skill-filter-bar row g-3">
    <!-- Category Filter -->
    <div class="col-md-4">
      <div class="form-group">
        <label for="category-filter" class="form-label">Category</label>
        <select
          id="category-filter"
          v-model="filters.category"
          @change="emitUpdate"
          class="form-select"
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
    </div>

    <!-- Level Filter -->
    <div class="col-md-4">
      <div class="form-group">
        <label for="level-filter" class="form-label">Level</label>
        <select
          id="level-filter"
          v-model="filters.level"
          @change="emitUpdate"
          class="form-select"
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
    </div>

    <!-- Search Filter -->
    <div class="col-md-4">
      <div class="form-group">
        <label for="skill-search" class="form-label">Search</label>
        <div class="input-group">
          <input
            id="skill-search"
            type="text"
            v-model="filters.search"
            placeholder="Search skills..."
            @input="emitUpdate"
            class="form-control"
          />
          <button
            v-if="filters.search"
            class="btn btn-outline-secondary"
            @click="clearSearch"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, watch } from 'vue';
import useSkills from '@/composables/useSkills';

export default {
  name: 'SkillFilterBar',
  props: {
    modelValue: {
      type: Object,
      default: () => ({ category: 'all', level: 'all', search: '' }),
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const { skillCategories, skillLevels } = useSkills();

    // Create a reactive copy of the filters from props
    const filters = reactive({ ...props.modelValue });

    // Update component state when props change
    watch(
      () => props.modelValue,
      (newValue) => {
        Object.assign(filters, newValue);
      },
      { deep: true }
    );

    // Emit changes to parent component
    const emitUpdate = () => {
      emit('update:modelValue', { ...filters });
    };

    // Clear search field
    const clearSearch = () => {
      filters.search = '';
      emitUpdate();
    };

    return {
      filters,
      skillCategories,
      skillLevels,
      emitUpdate,
      clearSearch,
    };
  },
};
</script>

<style scoped>
.skill-filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.input-group .form-control {
  flex: 1;
}

.btn-outline-secondary {
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .skill-filter-bar {
    flex-direction: column;
  }
}
</style>