<template>
  <div class="timeline-filter d-flex align-items-center gap-3">
    <!-- Filter Label -->
    <span class="filter-label text-muted fw-semibold">Filter by:</span>

    <!-- Filter Options -->
    <div class="filter-options d-flex flex-wrap gap-2">
      <div
        v-for="type in eventTypes"
        :key="type.id"
        class="form-check form-check-inline"
      >
        <input
          class="form-check-input"
          type="checkbox"
          :id="`filter-${type.id}`"
          :value="type.id"
          v-model="selectedFilters"
          @change="emitUpdate"
        />
        <label
          class="form-check-label"
          :for="`filter-${type.id}`"
        >
          {{ type.label }}
        </label>
      </div>
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
<<<<<<< HEAD
      default: () => ['skill', 'project', 'objective']
    }
=======
      default: () => [],
    },
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const { eventTypes } = useTimeline();
    const selectedFilters = ref([...props.modelValue]);

    // Watch for external changes to modelValue
    watch(
      () => props.modelValue,
      (newValue) => {
        selectedFilters.value = [...newValue];
      },
      { deep: true }
    );

    // Emit changes to parent
    const emitUpdate = () => {
      emit('update:modelValue', [...selectedFilters.value]);
    };

    return {
      eventTypes,
      selectedFilters,
      emitUpdate,
    };
  },
};
</script>

<style scoped>
.timeline-filter {
  flex-wrap: wrap;
}

.filter-label {
  font-size: 0.875rem;
<<<<<<< HEAD
  font-weight: 500;
  color: var(--text-secondary);
=======
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
}

.form-check-input {
  cursor: pointer;
}

.form-check-label {
  font-size: 0.875rem;
<<<<<<< HEAD
  position: relative;
  padding-left: 1.5rem;
  color: var(--text-color);
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
  background-color: var(--bg-darker);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  transition: all 0.15s ease;
}

/* Style when checked */
.filter-option input:checked ~ .checkbox-custom {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
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
  color: var(--primary-color);
  font-weight: 500;
=======
  cursor: pointer;
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
}

.filter-option:hover .checkbox-custom {
  border-color: var(--primary-color);
}
</style>