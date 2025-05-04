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
      default: () => [],
    },
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
}

.form-check-input {
  cursor: pointer;
}

.form-check-label {
  font-size: 0.875rem;
  cursor: pointer;
}
</style>