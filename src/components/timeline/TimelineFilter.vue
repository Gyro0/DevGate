<template>
  <div class="timeline-filter">
    <span class="filter-label">Filter by:</span>
    <div class="filter-options">
      <label 
        v-for="type in eventTypes" 
        :key="type.id" 
        class="filter-option"
        :class="{ active: selectedFilters.includes(type.id) }"
      >
        <input 
          type="checkbox" 
          :value="type.id" 
          v-model="selectedFilters"
          @change="emitUpdate"
        />
        <span class="checkbox-custom"></span>
        {{ type.label }}
      </label>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import useTimeline from '@/composables/useTimeline';

export default {
  name: 'TimelineFilter',
  props: {
    modelValue: {
      type: Array,
      default: () => ['skill', 'project', 'objective']
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const { eventTypes } = useTimeline();
    const selectedFilters = ref([...props.modelValue]);

    // Watch for external changes to modelValue
    watch(() => props.modelValue, (newValue) => {
      selectedFilters.value = [...newValue];
    }, { deep: true });

    // Emit changes to parent
    const emitUpdate = () => {
      emit('update:modelValue', [...selectedFilters.value]);
    };

    // Return reactive state and methods
    return {
      eventTypes,
      selectedFilters,
      emitUpdate
    };
  }
}
</script>

<style scoped>
.timeline-filter {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.filter-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
}

.filter-options {
  display: flex;
  gap: 1rem;
}

.filter-option {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 0.875rem;
  position: relative;
  padding-left: 1.5rem; /* Space for custom checkbox */
}

/* Hide default checkbox */
.filter-option input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Custom checkbox style */
.checkbox-custom {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 16px;
  width: 16px;
  background-color: #fff;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  transition: background-color 0.15s, border-color 0.15s;
}

/* Style when checked */
.filter-option input:checked ~ .checkbox-custom {
  background-color: #4f46e5;
  border-color: #4f46e5;
}

/* Checkmark style */
.checkbox-custom::after {
  content: "";
  position: absolute;
  display: none;
  left: 5px;
  top: 2px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

/* Show checkmark when checked */
.filter-option input:checked ~ .checkbox-custom::after {
  display: block;
}

/* Optional: Style for active label text */
.filter-option.active {
  color: #4f46e5;
  font-weight: 500;
}
</style>