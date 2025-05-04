<template>
  <div class="project-filter-bar">
    <!-- Search Group -->
    <div class="filter-group search-group">
      <label for="project-search">Search</label>
      <div class="search-input-wrapper">
        <input
          id="project-search"
          type="text"
          placeholder="Search title or description..."
          v-model="filters.search"
          @input="emitUpdate"
        />
        <button
          v-if="filters.search"
          class="clear-btn clear-search"
          @click="clearSearch"
          title="Clear search"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>

    <!-- Technology Group -->
    <div class="filter-group tech-group">
      <label>Technologies</label>
      <div class="tech-chips-container">
        <div v-if="allProjectTechs && allProjectTechs.length > 0" class="tech-chips">
          <button
            v-for="tech in allProjectTechs"
            :key="tech"
            @click="toggleTechFilter(tech)"
            :class="['tech-chip', { selected: techIsSelected(tech) }]"
          >
            {{ tech }}
          </button>
        </div>
        <div v-else class="no-techs-info">
          No technologies used in projects yet.
        </div>
      </div>
    </div>

    <!-- Date Range Group -->
    <div class="filter-group date-group">
      <label>Date Range</label>
      <div class="date-inputs">
        <div class="date-input-wrapper">
          <label for="start-date">From</label>
          <input
            id="start-date"
            type="date"
            :value="startDateValue"
            @input="updateStartDate"
          />
        </div>
        <div class="date-input-wrapper">
          <label for="end-date">To</label>
          <input
            id="end-date"
            type="date"
            :value="endDateValue"
            @input="updateEndDate"
            :min="startDateValue"
          />
        </div>
        <button
          v-if="hasDateFilter"
          class="clear-btn clear-dates"
          @click="clearDateFilter"
          title="Clear dates"
        >
          <i class="fas fa-times"></i> Clear
        </button>
      </div>
    </div>

  </div>
</template>

<script>
import { computed, reactive, watch, toRefs } from 'vue';

export default {
  name: 'ProjectFilterBar',
  props: {
    modelValue: {
      type: Object,
      required: true,
      default: () => ({ search: '', tech: [], dateRange: null })
    },
    allProjectTechs: {
      type: Array,
      default: () => []
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const localFilters = reactive({
      search: props.modelValue.search || '',
      tech: Array.isArray(props.modelValue.tech) ? [...props.modelValue.tech] : [],
      dateRange: props.modelValue.dateRange ? { ...props.modelValue.dateRange } : null
    });

    watch(() => props.modelValue, (newVal) => {
      localFilters.search = newVal.search || '';
      localFilters.tech = Array.isArray(newVal.tech) ? [...newVal.tech] : [];
      localFilters.dateRange = newVal.dateRange ? { ...newVal.dateRange } : null;
    }, { deep: true });

    const emitUpdate = () => {
      const objectToEmit = { ...localFilters };
      console.log("ProjectFilterBar emitting update:", JSON.stringify(objectToEmit));
      emit('update:modelValue', objectToEmit);
    };

    const toggleTechFilter = (tech) => {
      console.log(`Toggling tech: ${tech}`);
      const index = localFilters.tech.indexOf(tech);

      if (index === -1) {
        localFilters.tech.push(tech);
        console.log(`Added tech. Current localFilters.tech:`, JSON.stringify(localFilters.tech));
      } else {
        localFilters.tech.splice(index, 1);
        console.log(`Removed tech. Current localFilters.tech:`, JSON.stringify(localFilters.tech));
      }
      emitUpdate();
    };

    const techIsSelected = (tech) => {
      return Array.isArray(localFilters.tech) && localFilters.tech.includes(tech);
    };

    const updateStartDate = (event) => {
      const value = event.target.value;
      if (!localFilters.dateRange) {
        localFilters.dateRange = { start: null, end: null };
      }
      localFilters.dateRange.start = value ? value : null;
      emitUpdate();
    };

    const updateEndDate = (event) => {
      const value = event.target.value;
      if (!localFilters.dateRange) {
        localFilters.dateRange = { start: null, end: null };
      }
      localFilters.dateRange.end = value ? value : null;
      emitUpdate();
    };

    const clearDateFilter = () => {
      localFilters.dateRange = null;
      emitUpdate();
    };

    const clearSearch = () => {
      localFilters.search = '';
      emitUpdate();
    };

    const startDateValue = computed(() => localFilters.dateRange?.start || '');
    const endDateValue = computed(() => localFilters.dateRange?.end || '');
    const hasDateFilter = computed(() => !!(localFilters.dateRange?.start || localFilters.dateRange?.end));

    return {
      filters: localFilters,
      startDateValue,
      endDateValue,
      hasDateFilter,
      techIsSelected,
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
  display: grid;
  /* Define columns for better alignment */
  grid-template-columns: minmax(200px, 1fr) minmax(250px, 1.5fr) minmax(320px, 1.5fr);
  gap: 1.5rem 2rem; /* Row gap, Column gap */
  padding: 1.5rem;
  background-color: var(--surface-card); /* Use card background */
  border-radius: 12px;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); /* Softer shadow */
  margin-bottom: 2rem; /* Ensure space below */
}

/* General Filter Group Styling */
.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.6rem; /* Space between label and control */
}

.filter-group > label { /* Label above the group */
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.1rem; /* Small space below main label */
}

/* Input Styling (Common) */
input[type="text"],
input[type="date"] {
  width: 100%;
  padding: 0.7rem 1rem;
  border-radius: 8px;
  border: 1.5px solid var(--border-color);
  background-color: var(--surface-ground);
  color: var(--text);
  font-size: 0.9rem;
  transition: border-color 0.2s, box-shadow 0.2s, background-color 0.2s;
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.07);
}

input[type="text"]:hover,
input[type="date"]:hover {
  border-color: var(--primary-glow);
  background-color: var(--surface-hover);
}

input[type="text"]:focus,
input[type="date"]:focus {
  outline: none;
  border-color: var(--primary);
  background-color: var(--surface-section);
  box-shadow: 0 0 0 3px var(--primary-glow, rgba(79, 70, 229, 0.2)),
              inset 0 1px 2px rgba(0,0,0,0.07);
}

input::placeholder {
  color: var(--text-secondary);
  opacity: 0.8;
}

/* Clear Buttons (Common) */
.clear-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 6px;
  background: transparent;
  border: 1px solid transparent; /* For alignment */
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.85rem;
}
.clear-btn i {
  margin-right: 0.3em; /* Space between icon and text */
  font-size: 0.9em; /* Slightly smaller icon */
}
.clear-btn:hover {
  color: var(--danger, #dc3545);
  background-color: var(--danger-hover-bg, rgba(220, 53, 69, 0.1));
}

/* Search Specific */
.search-input-wrapper {
  position: relative;
}
.clear-search {
  position: absolute;
  top: 50%;
  right: 0.5rem;
  transform: translateY(-50%);
  padding: 0.4rem; /* Smaller padding */
  border-radius: 50%; /* Circular */
}
.clear-search i {
  margin-right: 0; /* No margin for icon-only button */
}
input[type="text"] {
  padding-right: 2.8rem; /* Space for clear button */
}

/* Technology Specific */
.tech-chips-container {
  background-color: var(--surface-ground);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 0.75rem;
  min-height: 40px; /* Ensure minimum height */
  max-height: 150px; /* Limit height */
  overflow-y: auto; /* Allow scrolling */
}
.tech-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}
.tech-chip {
  padding: 0.4rem 0.9rem;
  border-radius: 16px;
  font-size: 0.8rem;
  background-color: rgba(41, 38, 64, 0.355);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  white-space: nowrap;
}
.tech-chip:hover {
  transform: translateY(-1px);
  border-color: var(--primary-glow);
  color: var(--text);
  background-color: var(--surface-hover);
}
.tech-chip.selected {
  background-color: rgba(127, 121, 176, 0.552);
  color: white;
  border-color: var(--primary);
  font-weight: 600;
  box-shadow: 0 0 8px var(--primary-glow);
}
.no-techs-info {
  font-size: 0.85rem;
  color: var(--text-secondary);
  padding: 0.25rem;
  text-align: center;
}

/* Date Specific */
.date-inputs {
  display: flex;
  align-items: flex-end; /* Align bottom */
  gap: 0.75rem;
}
.date-input-wrapper {
  flex: 1; /* Distribute space */
  min-width: 120px;
}
.date-input-wrapper label { /* Label above date input */
  display: block;
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-bottom: 0.3rem;
}
.clear-dates {
  margin-bottom: 0; /* Align with input bottom */
  padding: 0.65rem 0.8rem; /* Match input height */
  border: 1.5px solid var(--border-color);
  background-color: var(--surface-ground);
  white-space: nowrap;
}
.clear-dates:hover {
  border-color: var(--danger, #dc3545);
}

/* Responsive Adjustments */
@media (max-width: 992px) {
  .project-filter-bar {
    grid-template-columns: 1fr 1fr; /* Two columns */
  }
  .tech-group {
    grid-column: 1 / -1; /* Span full width */
  }
}

@media (max-width: 768px) {
  .project-filter-bar {
    grid-template-columns: 1fr; /* Single column */
    gap: 1rem; /* Reduce gap */
    padding: 1rem;
  }
  .date-inputs {
    flex-wrap: wrap; /* Allow date inputs to wrap */
  }
  .clear-dates {
     margin-top: 0.5rem; /* Add space if wrapped */
     width: 100%; /* Full width when wrapped */
     justify-content: center;
  }
}
</style>