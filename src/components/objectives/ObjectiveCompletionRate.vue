<template>
  <div class="completion-rate-chart card shadow-sm border-0">
    <!-- Card Header -->
    <div class="card-header bg-light">
      <h5 class="card-title mb-0">Objective Completion Rate</h5>
    </div>

    <!-- Card Body -->
    <div class="card-body d-flex justify-content-center align-items-center">
      <ProgressChart
        :completionRate="completionRate"
        :completedCount="completedCount"
        :totalCount="totalCount"
        :loading="loading"
      />
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import useObjectives from '@/composables/useObjectives';
import ProgressChart from '@/components/visualizations/ProgressChart.vue';

export default {
  name: 'ObjectiveCompletionRate',
  components: {
    ProgressChart,
  },
  setup() {
    const { objectives, loading } = useObjectives();

    const completionRate = computed(() => {
      if (objectives.value.length === 0) return 0;
      const completed = objectives.value.filter((o) => o.status === 'completed').length;
      return Math.round((completed / objectives.value.length) * 100);
    });

    const completedCount = computed(() => {
      return objectives.value.filter((o) => o.status === 'completed').length;
    });

    const totalCount = computed(() => {
      return objectives.value.length;
    });

    return {
      loading,
      completionRate,
      completedCount,
      totalCount,
    };
  },
};
</script>

<style scoped>
.completion-rate-chart {
  border-radius: 8px;
  overflow: hidden;
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
}

.card-body {
  height: 250px; /* Adjust height as needed */
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>