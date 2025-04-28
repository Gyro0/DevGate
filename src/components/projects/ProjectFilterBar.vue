<template>
  <div class="project-filter-bar">
    <div class="filter-group search-group">
      <label for="project-search">Search</label>
      <div class="search-input-wrapper">
        <input 
          id="project-search" 
          v-model="filters.search"
          @input="emitUpdate"
          type="text" 
          placeholder="Search projects..." 
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
    
    <div class="filter-group tech-filter">
      <label>Technologies</label>
      <div class="tech-chips">
        <div 
          v-for="tech in availableTechnologies" 
          :key="tech"
          @click="toggleTechFilter(tech)" 
          :class="['tech-chip', { selected: filters.tech.includes(tech) }]"
        >
          {{ tech }}
        </div>
      </div>
    </div>
    
    <div class="filter-group date-filter">
      <label>Date Range</label>
      <div class="date-inputs">
        <div class="date-input">
          <label for="start-date">From</label>
          <input 
            id="start-date" 
            type="date" 
            :value="startDateValue"
            @input="updateStartDate"
          />
        </div>
        <div class="date-input">
          <label for="end-date">To</label>
          <input 
            id="end-date" 
            type="date" 
            :value="endDateValue"
            @input="updateEndDate"
          />
        </div>
        <button 
          v-if="hasDateFilter" 
          class="clear-dates" 
          @click="clearDateFilter"
        >
          Clear
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, reactive, watch } from 'vue'; // Removed ref as it's not used directly

export default {
  name: 'ProjectFilterBar',
  props: {
    modelValue: {
      type: Object,
      default: () => ({ tech: [], dateRange: null, search: '' })
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    // List of available technologies for filtering
    const availableTechnologies = [
      'JavaScript', 'React', 'Vue', 'Angular', 
      'Node.js', 'Python', 'Django', 'Flask',
      'Ruby', 'Rails', 'PHP', 'Laravel',
      'Java', 'Spring', '.NET', 'C#',
      'Docker', 'Kubernetes', 'AWS', 'Firebase'
    ];
    
    // Create a reactive copy of the filters
    const filters = reactive({ ...props.modelValue });
    
    // Watch for external changes to modelValue
    watch(() => props.modelValue, (newVal) => {
      Object.assign(filters, newVal);
    }, { deep: true });
    
    // Computed properties for date inputs
    const formatDateForInput = (date) => {
      if (!date) return '';
      // Ensure date is a Date object before calling toISOString
      const dateObj = date instanceof Date ? date : new Date(date);
      if (isNaN(dateObj.getTime())) return ''; // Handle invalid dates
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
    
    // Methods
    const emitUpdate = () => {
      // Ensure dateRange is structured correctly before emitting
      const dataToEmit = {
        ...filters,
        dateRange: filters.dateRange ? {
          start: filters.dateRange.start || null,
          end: filters.dateRange.end || null
        } : null
      };
      // Remove dateRange if both start and end are null
      if (dataToEmit.dateRange && !dataToEmit.dateRange.start && !dataToEmit.dateRange.end) {
        dataToEmit.dateRange = null;
      }
      emit('update:modelValue', dataToEmit);
    };
    
    const toggleTechFilter = (tech) => {
      if (!Array.isArray(filters.tech)) { // Ensure filters.tech is an array
         filters.tech = [];
      }
      if (filters.tech.includes(tech)) {
        filters.tech = filters.tech.filter(t => t !== tech);
      } else {
        filters.tech = [...filters.tech, tech];
      }
      emitUpdate();
    };
    
    const updateStartDate = (event) => {
      const start = event.target.value ? new Date(event.target.value) : null;
      filters.dateRange = filters.dateRange || { start: null, end: null }; // Ensure dateRange object exists
      filters.dateRange.start = start;
      emitUpdate();
    };
    
    const updateEndDate = (event) => {
      const end = event.target.value ? new Date(event.target.value) : null;
      filters.dateRange = filters.dateRange || { start: null, end: null }; // Ensure dateRange object exists
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

    // Return everything needed by the template
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
      emitUpdate // Expose if needed directly in template (e.g., @input)
    };
  }
}
</script>

<style scoped>
.project-filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-group > label {
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #4b5563;
}

.search-group {
  flex: 1;
  min-width: 200px;
}

.search-input-wrapper {
  position: relative;
  width: 100%;
}

.search-input-wrapper input {
  width: 100%;
  padding: 0.6rem;
  padding-right: 2.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.875rem;
}

.clear-search {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
}

.clear-search:hover {
  color: #4b5563;
}

.tech-filter {
  flex: 2;
  min-width: 300px;
}

.tech-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tech-chip {
  padding: 0.25rem 0.75rem;
  background-color: #f3f4f6;
  border-radius: 1rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.tech-chip:hover {
  background-color: #e5e7eb;
}

.tech-chip.selected {
  background-color: #4f46e5;
  color: white;
}

.date-filter {
  min-width: 200px;
}

.date-inputs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.date-input {
  flex: 1;
  min-width: 120px;
}

.date-input label {
  display: block;
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.date-input input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.875rem;
}

.clear-dates {
  align-self: flex-end;
  padding: 0.5rem 0.75rem;
  background-color: #f3f4f6;
  border: none;
  border-radius: 6px;
  font-size: 0.75rem;
  color: #4b5563;
  cursor: pointer;
  margin-bottom: 1px;
}

.clear-dates:hover {
  background-color: #e5e7eb;
}

@media (max-width: 768px) {
  .project-filter-bar {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>