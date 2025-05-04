<template>
<<<<<<< HEAD
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
=======
  <div class="objective-timeline card shadow-sm border-0">
    <!-- Card Header -->
    <div class="card-header bg-light">
      <h5 class="card-title mb-0">Objective Timeline</h5>
    </div>

    <!-- Card Body -->
    <div class="card-body">
      <div v-if="loading" class="d-flex justify-content-center align-items-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <div v-else>
        <div class="objective-timeline-chart">
          <canvas ref="chartCanvas"></canvas>
        </div>
      </div>
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import useObjectives from '@/composables/useObjectives';
<<<<<<< HEAD
import TimelineChart from '@/components/visualizations/TimelineChart.vue';
=======
import TimeSeriesChart from '@/components/visualizations/TimeSeriesChart.vue';
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8

export default {
  name: 'ObjectiveTimeline',
  components: {
<<<<<<< HEAD
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
=======
    TimeSeriesChart,
  },
  setup() {
    const { objectives, loading } = useObjectives();

    // Prepare data for TimeSeriesChart
    const chartData = computed(() => {
      const completedData = objectives.value
        .filter((o) => o.status === 'completed' && o.completedAt)
        .map((o) => ({
          x: o.completedAt?.seconds ? new Date(o.completedAt.seconds * 1000) : new Date(o.completedAt),
          y: 1, // Count each completion
        }))
        .sort((a, b) => a.x - b.x); // Sort by date

      // Aggregate completions by date (e.g., day)
      const aggregatedData = completedData.reduce((acc, curr) => {
        const dateStr = curr.x.toISOString().split('T')[0]; // Group by day
        if (!acc[dateStr]) {
          acc[dateStr] = { x: curr.x, y: 0 };
        }
        acc[dateStr].y += curr.y;
        return acc;
      }, {});

      const finalData = Object.values(aggregatedData).sort((a, b) => a.x - b.x);
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8

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
<<<<<<< HEAD
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

=======
        datasets: [
          {
            label: 'Objectives Completed',
            data: finalData,
            borderColor: '#34d399',
            backgroundColor: 'rgba(52, 211, 153, 0.1)',
            tension: 0.1,
            fill: true,
          },
        ],
      };
    });

    const chartOptions = computed(() => ({
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'day', // Adjust unit as needed (week, month)
          },
          title: {
            display: true,
            text: 'Date',
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Count',
          },
          ticks: {
            stepSize: 1, // Ensure integer steps for count
          },
        },
      },
      plugins: {
        legend: {
          display: false, // Hide legend if only one dataset
        },
      },
    }));

>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
    return {
      objectives,
      loading,
<<<<<<< HEAD
      timelineData
=======
      chartData,
      chartOptions,
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
    };
  },
};
</script>

<style scoped>
<<<<<<< HEAD
.objective-timeline {
  height: 250px;
=======
.objective-timeline-chart {
  height: 300px; /* Adjust height as needed */
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
  position: relative;
  width: 100%;
  background: var(--surface-card);
  border-radius: 1.1rem;
  box-shadow: 0 2px 16px 0 rgba(0,0,0,0.25), 0 0 0 2px var(--primary-glow), 0 0 8px 2px var(--circuit-accent);
  border: 1.5px solid var(--border-color, #23272e);
  padding: 1.2rem 1rem;
  color: var(--text);
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
  color: var(--text-tertiary, #7a869a);
}

.spinner {
  border: 3px solid rgba(60, 65, 80, 0.18);
  border-top: 3px solid var(--primary-glow);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
  margin-bottom: 0.5rem;
}

.empty-icon {
  font-size: 2rem;
  color: var(--primary-glow);
  margin-bottom: 1rem;
  filter: drop-shadow(0 0 6px var(--primary-glow));
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
}
</style>