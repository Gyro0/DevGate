<template>
  <div class="activity-timeline-chart">
    <div v-if="!events || events.length === 0" class="chart-empty">
      <div class="empty-icon">
        <i class="fas fa-chart-line"></i>
      </div>
      <p>No activity data to display</p>
    </div>
    <div v-else class="chart-container">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';

export default {
  name: 'ActivityTimelineChart',
  props: {
    events: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const chartCanvas = ref(null);
    let chart = null;

    // Transform events data for the chart
    const chartData = computed(() => {
      if (!props.events || props.events.length === 0) {
        return { labels: [], datasets: [] };
      }

      // Group events by date (day)
      const dateGroups = {};
      
      const now = new Date();
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(now.getMonth() - 6);
      
      // Process each event
      props.events.forEach(event => {
        // Safely handle different timestamp formats
        let timestamp;
        try {
          if (event.timestamp?.seconds) {
            timestamp = new Date(event.timestamp.seconds * 1000);
          } else if (event.timestamp instanceof Date) {
            timestamp = event.timestamp;
          } else {
            timestamp = new Date(event.timestamp);
          }
          
          // Skip invalid dates
          if (isNaN(timestamp.getTime())) {
            console.warn('Invalid timestamp for event:', event);
            return;
          }
          
          if (timestamp < sixMonthsAgo) return; // Skip events older than 6 months
          
          // Format date as YYYY-MM-DD for grouping
          const dateKey = timestamp.toISOString().split('T')[0];
          
          if (!dateGroups[dateKey]) {
            dateGroups[dateKey] = {
              date: timestamp,
              skill: 0,
              project: 0,
              objective: 0
            };
          }
          
          // Increment count for this event type on this date
          if (event.type in dateGroups[dateKey]) {
            dateGroups[dateKey][event.type]++;
          }
          
        } catch (err) {
          console.error('Error processing event timestamp:', err, event);
        }
      });
      
      // Convert to arrays sorted by date
      const dates = Object.keys(dateGroups).sort();
      
      // Prepare datasets
      return {
        labels: dates.map(date => new Date(date)),
        datasets: [
          {
            label: 'Skills',
            data: dates.map(date => dateGroups[date].skill),
            backgroundColor: 'rgba(59, 130, 246, 0.7)', // Blue
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1
          },
          {
            label: 'Projects',
            data: dates.map(date => dateGroups[date].project),
            backgroundColor: 'rgba(16, 185, 129, 0.7)', // Green
            borderColor: 'rgba(16, 185, 129, 1)',
            borderWidth: 1
          },
          {
            label: 'Objectives',
            data: dates.map(date => dateGroups[date].objective),
            backgroundColor: 'rgba(245, 158, 11, 0.7)', // Yellow/Amber
            borderColor: 'rgba(245, 158, 11, 1)',
            borderWidth: 1
          }
        ]
      };
    });

    const createChart = () => {
      if (!chartCanvas.value) return;
      
      // Destroy existing chart if it exists
      if (chart) chart.destroy();

      const ctx = chartCanvas.value.getContext('2d');
      
      try {
        chart = new Chart(ctx, {
          type: 'bar',
          data: chartData.value,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                type: 'time',
                time: {
                  unit: 'day',
                  tooltipFormat: 'MMM d, yyyy',
                  displayFormats: {
                    day: 'MMM d'
                  }
                },
                title: {
                  display: true,
                  text: 'Date'
                },
                stacked: true
              },
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Number of Activities'
                },
                ticks: {
                  precision: 0 // Only show whole numbers
                },
                stacked: true
              }
            },
            plugins: {
              tooltip: {
                mode: 'index',
                intersect: false
              },
              legend: {
                position: 'top'
              }
            }
          }
        });
      } catch (err) {
        console.error('Error creating chart:', err);
      }
    };

    onMounted(() => {
      if (props.events && props.events.length > 0) {
        createChart();
      }
    });

    watch(() => props.events, (newEvents) => {
      if (newEvents && newEvents.length > 0) {
        createChart();
      }
    }, { deep: true });

    return {
      chartCanvas,
      chartData
    };
  }
}
</script>

<style scoped>
.activity-timeline-chart {
  position: relative;
  width: 100%;
  height: 100%;
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