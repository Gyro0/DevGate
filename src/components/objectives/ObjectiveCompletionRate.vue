<template>
  <div class="completion-rate-chart">
    <ProgressChart
      :completionRate="completionRate"
      :completedCount="completedCount"
      :totalCount="totalCount"
      :loading="loading"
    />
  </div>
</template>

<script>
import { computed } from 'vue';
import useObjectives from '@/composables/useObjectives';
import ProgressChart from '@/components/visualizations/ProgressChart.vue'; // Keep import

export default {
  name: 'ObjectiveCompletionRate',
  components: {
    ProgressChart // Register component
  },
  setup() {
    const { objectives, loading } = useObjectives();

    const completionRate = computed(() => {
      if (objectives.value.length === 0) return 0;
      const completed = objectives.value.filter(o => o.status === 'completed').length;
      return Math.round((completed / objectives.value.length) * 100);
    });

    const completedCount = computed(() => {
      return objectives.value.filter(o => o.status === 'completed').length;
    });

    const totalCount = computed(() => {
      return objectives.value.length;
    });

    return {
      loading,
      completionRate,
      completedCount,
      totalCount
    };
  }
}
</script>

<style scoped>
.completion-rate-chart {
  height: 250px; /* Adjust height as needed */
  position: relative;
}
</style>