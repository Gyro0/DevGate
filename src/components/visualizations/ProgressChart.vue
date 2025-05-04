<template>
    <div class="progress-chart">
      <div v-if="loading" class="chart-loading">
        <div class="spinner"></div>
        <span>Loading data...</span>
      </div>
      <div v-else-if="totalCount === 0" class="chart-empty">
        <div class="empty-icon">
          <i class="fas fa-chart-pie"></i>
        </div>
        <p>No data available</p>
      </div>
      <div v-else class="chart-container">
        <div class="chart-canvas-container">
          <canvas ref="chartCanvas"></canvas>
        </div>
        <div class="progress-stats">
          <div class="completion-percentage">{{ completionRate }}%</div>
          <div class="completion-label">Complete</div>
          <div class="completion-counts">
            {{ completedCount }} of {{ totalCount }} objectives
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, watch } from 'vue';
  import Chart from 'chart.js/auto';
  
  export default {
    name: 'ProgressChart',
    props: {
      completionRate: {
        type: Number,
        default: 0
      },
      completedCount: {
        type: Number,
        default: 0
      },
      totalCount: {
        type: Number,
        default: 0
      },
      loading: {
        type: Boolean,
        default: false
      }
    },
    setup(props) {
      const chartCanvas = ref(null);
      let chart = null;
  
      const createChart = () => {
        if (!chartCanvas.value) return;
        
        // Destroy existing chart if it exists
        if (chart) chart.destroy();
  
        const ctx = chartCanvas.value.getContext('2d');
        
        chart = new Chart(ctx, {
          type: 'doughnut',
          data: {
            datasets: [{
              data: [props.completedCount, props.totalCount - props.completedCount],
              backgroundColor: [
                'rgba(79, 70, 229, 0.8)', // Completed - Indigo
                'rgba(229, 231, 235, 0.6)' // Remaining - Light gray
              ],
              borderWidth: 0,
              cutout: '80%'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                enabled: false
              }
            },
            animation: {
              animateRotate: true,
              animateScale: true
            }
          }
        });
      };
  
      onMounted(() => {
        if (!props.loading && props.totalCount > 0) {
          createChart();
        }
      });
  
      // Watch for changes in data and recreate chart when needed
      watch(
        () => [props.completionRate, props.completedCount, props.totalCount, props.loading],
        () => {
          if (!props.loading && props.totalCount > 0) {
            createChart();
          }
        }
      );
  
      return {
        chartCanvas
      };
    }
  }
  </script>
  
  <style scoped>
  .progress-chart {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--card-bg);
    border-radius: 12px;
    padding: 1rem;
    box-shadow: 0 4px 12px rgba(0,0,0,0.12);
    border: 1px solid var(--border-color);
  }
  
  .chart-container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  .chart-canvas-container {
    position: relative;
    width: 180px;
    height: 180px;
  }
  
  .progress-stats {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }
  
  .completion-percentage {
    font-size: 2rem;
    font-weight: 700;
    color: var(--text-color);
    line-height: 1;
  }
  
  .completion-label {
    font-size: 0.875rem;
    color: var(--text-secondary);
    margin-bottom: 0.5rem;
  }
  
  .completion-counts {
    font-size: 0.75rem;
    color: var(--text-secondary);
  }
  
  .chart-loading, .chart-empty {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--text-secondary);
  }
  
  .spinner {
    border: 3px solid var(--border-color);
    border-top: 3px solid var(--primary-color);
    border-radius: 50%;
    width: 24px;
    height: 24px;
    animation: spin 1s linear infinite;
    margin-bottom: 0.5rem;
  }
  
  .empty-icon {
    font-size: 2.5rem;
    color: var(--text-secondary);
    margin-bottom: 1rem;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  </style>