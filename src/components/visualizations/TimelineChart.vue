<template>
    <div class="timeline-chart">
      <div v-if="!chartData || chartData.labels.length === 0" class="chart-empty">
        <div class="empty-icon">
          <i class="fas fa-calendar-alt"></i>
        </div>
        <p>No timeline data available</p>
      </div>
      <div v-else class="chart-container">
        <canvas ref="chartCanvas"></canvas>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, watch } from 'vue';
  import Chart from 'chart.js/auto';
  
  export default {
    name: 'TimelineChart',
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
  
        // Destroy existing chart if it exists
        if (chart) chart.destroy();
  
        const ctx = chartCanvas.value.getContext('2d');
        
        // Configure chart
        chart = new Chart(ctx, {
          type: 'bar',
          data: props.chartData,
          options: {
            indexAxis: 'y',
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
                  text: 'Timeline'
                }
              },
              y: {
                title: {
                  display: true,
                  text: 'Objectives'
                }
              }
            },
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                callbacks: {
                  title: function(context) {
                    return context[0].label;
                  },
                  label: function(context) {
                    const date = new Date(context.raw);
                    return `Due: ${date.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}`;
                  }
                }
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
  </script>
  
  <style scoped>
  .timeline-chart {
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
  }
  </style>