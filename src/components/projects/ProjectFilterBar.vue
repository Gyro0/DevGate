<template>
  <div class="project-filter-bar row g-3">
    <!-- Search Filter -->
    <div class="col-md-4">
      <div class="form-group">
        <label for="project-search" class="form-label">Search</label>
        <div class="input-group">
          <input
            id="project-search"
            v-model="filters.search"
            @input="emitUpdate"
            type="text"
            class="form-control"
            placeholder="Search projects..."
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

    <!-- Technologies Filter -->
    <div class="col-md-4">
      <div class="form-group">
        <label class="form-label">Technologies</label>
        <div class="d-flex flex-wrap gap-2">
          <button
            v-for="tech in availableTechnologies"
            :key="tech"
            @click="toggleTechFilter(tech)"
            :class="['btn btn-sm', filters.tech.includes(tech) ? 'btn-primary' : 'btn-outline-primary']"
          >
            {{ tech }}
          </button>
        </div>
      </div>
    </div>

    <!-- Date Range Filter -->
    <div class="col-md-4">
      <div class="form-group">
        <label class="form-label">Date Range</label>
        <div class="d-flex align-items-center gap-2">
          <input
            id="start-date"
            type="date"
            :value="startDateValue"
            @input="updateStartDate"
            class="form-control"
            placeholder="From"
          />
          <input
            id="end-date"
            type="date"
            :value="endDateValue"
            @input="updateEndDate"
            class="form-control"
            placeholder="To"
          />
          <button
            v-if="hasDateFilter"
            class="btn btn-outline-secondary"
            @click="clearDateFilter"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, reactive, watch } from 'vue';

export default {
  name: 'ProjectFilterBar',
  props: {
    modelValue: {
      type: Object,
      default: () => ({ tech: [], dateRange: null, search: '' }),
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const availableTechnologies = [
      'JavaScript', 'React', 'Vue', 'Angular',
      'Node.js', 'Python', 'Django', 'Flask',
      'Ruby', 'Rails', 'PHP', 'Laravel',
      'Java', 'Spring', '.NET', 'C#',
      'Docker', 'Kubernetes', 'AWS', 'Firebase',
    ];

    const filters = reactive({ ...props.modelValue });

    watch(
      () => props.modelValue,
      (newVal) => {
        Object.assign(filters, newVal);
      },
      { deep: true }
    );

    const formatDateForInput = (date) => {
      if (!date) return '';
      const dateObj = date instanceof Date ? date : new Date(date);
      if (isNaN(dateObj.getTime())) return '';
      return dateObj.toISOString().split('T')[0];
    };

    const startDateValue = computed(() => {
      return filters.dateRange?.start ? formatDateForInput(filters.dateRange.start) : '';
    });

    const endDateValue = computed(() => {
      return filters.dateRange?.end ? formatDateForInput(filters.dateRange.end) : '';
    });

    const hasDateFilter = computed(() => {
      return !!(filters.dateRange?.start || filters.dateRange?.end);
    });

    const emitUpdate = () => {
      const dataToEmit = {
        ...filters,
        dateRange: filters.dateRange
          ? {
              start: filters.dateRange.start || null,
              end: filters.dateRange.end || null,
            }
          : null,
      };
      if (dataToEmit.dateRange && !dataToEmit.dateRange.start && !dataToEmit.dateRange.end) {
        dataToEmit.dateRange = null;
      }
      emit('update:modelValue', dataToEmit);
    };

    const toggleTechFilter = (tech) => {
      if (!Array.isArray(filters.tech)) {
        filters.tech = [];
      }
      if (filters.tech.includes(tech)) {
        filters.tech = filters.tech.filter((t) => t !== tech);
      } else {
        filters.tech = [...filters.tech, tech];
      }
      emitUpdate();
    };

    const updateStartDate = (event) => {
      const start = event.target.value ? new Date(event.target.value) : null;
      filters.dateRange = filters.dateRange || { start: null, end: null };
      filters.dateRange.start = start;
      emitUpdate();
    };

    const updateEndDate = (event) => {
      const end = event.target.value ? new Date(event.target.value) : null;
      filters.dateRange = filters.dateRange || { start: null, end: null };
      filters.dateRange.end = end;
      emitUpdate();
    };

    const clearDateFilter = () => {
      filters.dateRange = null;
      emitUpdate();
    };

    const clearSearch = () => {
      filters.search = '';
      emitUpdate();
    };

    return {
      filters,
      availableTechnologies,
      startDateValue,
      endDateValue,
      hasDateFilter,
      toggleTechFilter,
      updateStartDate,
      updateEndDate,
      clearDateFilter,
      clearSearch,
      emitUpdate,
    };
  },
};
</script>

<style scoped>
.project-filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #4b5563;
}

.input-group {
  display: flex;
  align-items: center;
}

.input-group .form-control {
  flex: 1;
}

.btn-outline-secondary {
  font-size: 0.875rem;
}

.btn-sm {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
}

@media (max-width: 768px) {
  .project-filter-bar {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>