<template>
  <div class="objective-timeline-chart">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script>
import { computed } from 'vue';
import useObjectives from '@/composables/useObjectives';
import TimeSeriesChart from '@/components/visualizations/TimeSeriesChart.vue'; // Keep import

export default {
  name: 'ObjectiveTimeline',
  components: {
    TimeSeriesChart // Register component
  },
  setup() {
    const { objectives, loading } = useObjectives();

    // Prepare data for TimeSeriesChart
    const chartData = computed(() => {
      const completedData = objectives.value
        .filter(o => o.status === 'completed' && o.completedAt)
        .map(o => ({
          x: o.completedAt?.seconds ? new Date(o.completedAt.seconds * 1000) : new Date(o.completedAt),
          y: 1 // Count each completion
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
            fill: true
          }
        ]
      };
    });

    const chartOptions = computed(() => ({
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'day' // Adjust unit as needed (week, month)
          },
          title: {
            display: true,
            text: 'Date'
          }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Count'
          },
          ticks: {
             stepSize: 1 // Ensure integer steps for count
          }
        }
      },
      plugins: {
        legend: {
          display: false // Hide legend if only one dataset
        }
      }
    }));

    return {
      loading,
      chartData,
      chartOptions
    };
  }
}
</script>

<style scoped>
.objective-timeline-chart {
  height: 250px; /* Adjust height as needed */
  position: relative;
}
</style>