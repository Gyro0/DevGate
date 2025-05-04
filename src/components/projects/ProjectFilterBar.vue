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
          :class="['tech-chip', { selected: techIsSelected(tech) }]"
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
import { computed, reactive, watch } from 'vue';

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
    
    // Create a reactive copy of the filters with safe initialization
    const filters = reactive({ 
      search: props.modelValue.search || '',
      tech: Array.isArray(props.modelValue.tech) ? [...props.modelValue.tech] : [],
      dateRange: props.modelValue.dateRange || null
    });
    
    // Safe check if a tech is selected
    const techIsSelected = (tech) => {
      return Array.isArray(filters.tech) && filters.tech.includes(tech);
    };
    
    // Watch for external changes to modelValue
    watch(() => props.modelValue, (newVal) => {
      if (newVal) {
        // Safely update properties
        filters.search = newVal.search || '';
        filters.tech = Array.isArray(newVal.tech) ? [...newVal.tech] : [];
        filters.dateRange = newVal.dateRange || null;
      }
    }, { deep: true });
    
    // Computed properties for date inputs
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
    
    // Methods
    const emitUpdate = () => {
      // Ensure all properties exist and are properly initialized
      const dataToEmit = {
        search: filters.search || '',
        tech: Array.isArray(filters.tech) ? filters.tech : [],
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
      if (!Array.isArray(filters.tech)) {
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
      techIsSelected, // Add this new method
      toggleTechFilter,
      updateStartDate,
      updateEndDate,
      clearDateFilter,
      clearSearch,
      emitUpdate
    };
  }
}
</script>

<style scoped>
.project-filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  padding: 1.5rem;
  background-color: var(--card-bg);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group > label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-color);
  text-transform: uppercase;
  letter-spacing: 0.05em;
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
  padding: 0.75rem;
  padding-right: 2.5rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 0.9rem;
  background-color: var(--bg-darker);
  color: var(--text-color);
  transition: all 0.3s ease;
}

.search-input-wrapper input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.search-input-wrapper input::placeholder {
  color: var(--text-secondary);
}

.clear-search {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-darker);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-search:hover {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
  transform: translateY(-50%) scale(1.1);
}

.tech-filter {
  flex: 1;
  min-width: 200px;
}

.tech-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tech-chip {
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.85rem;
  background-color: var(--bg-darker);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all 0.3s ease;
}

.tech-chip:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tech-chip.selected {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.date-filter {
  flex: 1;
  min-width: 200px;
}

.date-inputs {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.date-input {
  flex: 1;
  min-width: 150px;
}

.date-input label {
  display: block;
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 0.25rem;
}

.date-input input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 0.9rem;
  background-color: var(--bg-darker);
  color: var(--text-color);
  transition: all 0.3s ease;
}

.date-input input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.clear-dates {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.85rem;
  background-color: var(--bg-darker);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: flex-end;
}

.clear-dates:hover {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .project-filter-bar {
    padding: 1rem;
    gap: 1rem;
  }
  
  .filter-group {
    width: 100%;
  }
  
  .date-inputs {
    flex-direction: column;
  }
  
  .clear-dates {
    width: 100%;
  }
}
</style>