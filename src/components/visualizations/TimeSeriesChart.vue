<template>
<<<<<<< HEAD
  <div class="time-series-chart">
    <div v-if="!chartData || chartData.labels.length === 0" class="chart-empty">
      <div class="empty-icon">
        <i class="fas fa-chart-line"></i>
      </div>
      <p>No time series data available</p>
    </div>
    <div v-else class="chart-container">
      <canvas ref="chartCanvas"></canvas>
=======
  <div class="time-series-chart card shadow-sm border-0">
    <!-- Card Header -->
    <div class="card-header bg-light">
      <h5 class="card-title mb-0">Time Series Chart</h5>
    </div>

    <!-- Card Body -->
    <div class="card-body d-flex justify-content-center align-items-center">
      <div v-if="loading" class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <div v-else>
        <canvas ref="chartCanvas"></canvas>
      </div>
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
    </div>
  </div>
</template>

<script>
<<<<<<< HEAD
import { ref, onMounted, watch } from 'vue';
import Chart from 'chart.js/auto';

export default {
  name: 'TimeSeriesChart',
  props: {
    chartData: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const chartCanvas = ref(null);
    let chart = null;

    const createChart = () => {
      if (!chartCanvas.value || !props.chartData || !props.chartData.labels || props.chartData.labels.length === 0) return;

      if (chart) chart.destroy();

      const ctx = chartCanvas.value.getContext('2d');
      
      chart = new Chart(ctx, {
        type: 'line',
        data: props.chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'day',
                displayFormats: {
                  day: 'MMM d'
                }
              },
              title: {
                display: true,
                text: 'Time'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Value'
              }
            }
          },
          plugins: {
            legend: {
              position: 'top'
            }
          }
        }
      });
    };

    onMounted(() => {
      if (props.chartData && props.chartData.labels && props.chartData.labels.length > 0) {
        createChart();
      }
    });

    watch(() => props.chartData, (newVal) => {
      if (newVal && newVal.labels && newVal.labels.length > 0) {
        createChart();
      }
    }, { deep: true });

    return {
      chartCanvas
    };
  }
}
=======
export default {
  name: 'TimeSeriesChart',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
};
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
</script>

<style scoped>
.time-series-chart {
<<<<<<< HEAD
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 200px;
  background-color: var(--card-bg);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  border: 1px solid var(--border-color);
}

.chart-container {
  width: 100%;
  height: 100%;
}

.chart-empty {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
}

.empty-icon {
  font-size: 2.5rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
=======
  border-radius: 8px;
  overflow: hidden;
}

.card-body {
  height: 300px;
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
}
</style>