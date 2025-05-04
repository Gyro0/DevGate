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
import { computed, onMounted } from 'vue'; 
import useObjectives from '@/composables/useObjectives';
import ProgressChart from '@/components/visualizations/ProgressChart.vue';

export default {
  name: 'ObjectiveCompletionRate',
  components: {
<<<<<<< HEAD
    ProgressChart
=======
    ProgressChart,
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
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
<<<<<<< HEAD
      if (!objectives.value || objectives.value.length === 0) return 0;
      const completed = objectives.value.filter(o => o.status === 'completed').length;
=======
      if (objectives.value.length === 0) return 0;
      const completed = objectives.value.filter((o) => o.status === 'completed').length;
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
      return Math.round((completed / objectives.value.length) * 100);
    });

    const completedCount = computed(() => {
<<<<<<< HEAD
      return objectives.value ? objectives.value.filter(o => o.status === 'completed').length : 0;
=======
      return objectives.value.filter((o) => o.status === 'completed').length;
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
    });

    const totalCount = computed(() => {
      return objectives.value ? objectives.value.length : 0;
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
<<<<<<< HEAD
  height: 250px;
  position: relative;
  width: 100%;
  background: var(--surface-card);
  border-radius: 1.1rem;
  box-shadow: 0 2px 16px 0 rgba(0,0,0,0.25), 0 0 0 2px var(--primary-glow), 0 0 8px 2px var(--circuit-accent);
  border: 1.5px solid var(--border-color, #23272e);
  padding: 1.2rem 1rem;
  color: var(--text);
=======
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
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
}
</style>