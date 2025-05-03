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
import { computed, onMounted } from 'vue'; 
import useObjectives from '@/composables/useObjectives';
import ProgressChart from '@/components/visualizations/ProgressChart.vue';

export default {
  name: 'ObjectiveCompletionRate',
  components: {
    ProgressChart
  },
  setup() {
    const { objectives, loading, fetchUserObjectives } = useObjectives();
    
    // Add onMounted to ensure data is loaded
    onMounted(async () => {
      if (!objectives.value || objectives.value.length === 0) {
        await fetchUserObjectives();
      }
    });

    const completionRate = computed(() => {
      if (!objectives.value || objectives.value.length === 0) return 0;
      const completed = objectives.value.filter(o => o.status === 'completed').length;
      return Math.round((completed / objectives.value.length) * 100);
    });

    const completedCount = computed(() => {
      return objectives.value ? objectives.value.filter(o => o.status === 'completed').length : 0;
    });

    const totalCount = computed(() => {
      return objectives.value ? objectives.value.length : 0;
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
  height: 250px; /* Ensure height is defined */
  position: relative;
  width: 100%; /* Make sure it takes full width */
}
</style>