<template>
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
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import useObjectives from '@/composables/useObjectives';
import TimeSeriesChart from '@/components/visualizations/TimeSeriesChart.vue';

export default {
  name: 'ObjectiveTimeline',
  components: {
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

      return {
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

    return {
      loading,
      chartData,
      chartOptions,
    };
  },
};
</script>

<style scoped>
.objective-timeline-chart {
  height: 300px; /* Adjust height as needed */
  position: relative;
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
}
</style>