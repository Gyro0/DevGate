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
  height: 250px;
  position: relative;
  width: 100%;
  background: var(--surface-card);
  border-radius: 1.1rem;
  box-shadow: 0 2px 16px 0 rgba(0,0,0,0.25), 0 0 0 2px var(--primary-glow), 0 0 8px 2px var(--circuit-accent);
  border: 1.5px solid var(--border-color, #23272e);
  padding: 1.2rem 1rem;
  color: var(--text);
}
</style>