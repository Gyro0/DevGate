<template>
  <div class="objective-timeline">
    <div v-if="!loading && objectives.length > 0" class="timeline-chart-container">
      <TimelineChart :chartData="timelineData" />
    </div>
    <div v-else-if="loading" class="loading-state">
      <div class="spinner"></div>
      <span>Loading timeline...</span>
    </div>
    <div v-else class="empty-state">
      <div class="empty-icon"><i class="fas fa-calendar"></i></div>
      <p>Add objectives with deadlines to see your timeline</p>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import useObjectives from '@/composables/useObjectives';
import TimelineChart from '@/components/visualizations/TimelineChart.vue';

export default {
  name: 'ObjectiveTimeline',
  components: {
    TimelineChart
  },
  setup() {
    const { objectives, loading, fetchUserObjectives } = useObjectives();
    
    // Ensure data is loaded
    onMounted(async () => {
      if (!objectives.value || objectives.value.length === 0) {
        await fetchUserObjectives();
      }
    });

    const timelineData = computed(() => {
      if (!objectives.value) return { labels: [], datasets: [] };
      
      // Filter objectives with deadlines
      const objectivesWithDeadlines = objectives.value.filter(o => o.deadline);
      
      // Sort by deadline
      const sortedObjectives = [...objectivesWithDeadlines].sort((a, b) => {
        const dateA = a.deadline?.seconds ? new Date(a.deadline.seconds * 1000) : new Date(a.deadline);
        const dateB = b.deadline?.seconds ? new Date(b.deadline.seconds * 1000) : new Date(b.deadline);
        return dateA - dateB;
      });
      
      // Format for chart
      return {
        labels: sortedObjectives.map(o => o.title),
        datasets: [{
          label: 'Deadlines',
          data: sortedObjectives.map(o => {
            const date = o.deadline?.seconds ? new Date(o.deadline.seconds * 1000) : new Date(o.deadline);
            return date;
          }),
          backgroundColor: sortedObjectives.map(o => {
            switch(o.status) {
              case 'completed': return 'rgba(34, 197, 94, 0.7)'; // Green
              case 'in-progress': return 'rgba(59, 130, 246, 0.7)'; // Blue
              default: return 'rgba(107, 114, 128, 0.7)'; // Gray
            }
          })
        }]
      };
    });

    return {
      objectives,
      loading,
      timelineData
    };
  }
}
</script>

<style scoped>
.objective-timeline {
  height: 250px; /* Match the height of completion rate chart */
  position: relative;
  width: 100%;
}

.timeline-chart-container {
  width: 100%;
  height: 100%;
}

.loading-state, .empty-state {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #6b7280;
}

.spinner {
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-top: 3px solid #4f46e5;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
  margin-bottom: 0.5rem;
}

.empty-icon {
  font-size: 2rem;
  color: #d1d5db;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>