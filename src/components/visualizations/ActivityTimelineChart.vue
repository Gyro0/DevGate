<template>
  <div class="timeline-chart">
    <!-- Check processed data for the empty state -->
    <div v-if="!processedChartData || processedChartData.labels.length === 0" class="chart-empty">
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
import { ref, onMounted, watch, computed, nextTick } from 'vue'; // Import nextTick
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

    // --- Computed Property to Process Events (Keep as is) ---
    const processedChartData = computed(() => {
      // console.log("ActivityTimelineChart: Recalculating processedChartData...");
      if (!props.events || props.events.length === 0) {
        // console.log("ActivityTimelineChart: No events to process.");
        return { labels: [], datasets: [] };
      }
      // ... (rest of the existing processing logic) ...
      const eventsByDate = props.events.reduce((acc, event) => {
         const dateObj = event.timestamp instanceof Date
           ? event.timestamp
           : event.timestamp?.seconds
             ? new Date(event.timestamp.seconds * 1000)
             : null;
         if (dateObj && !isNaN(dateObj.getTime())) {
           const dateString = dateObj.toISOString().split('T')[0];
           acc[dateString] = (acc[dateString] || 0) + 1;
         }
         return acc;
      }, {});
      const sortedDates = Object.keys(eventsByDate).sort();
      const chartDataResult = {
         labels: sortedDates,
         datasets: [{
           label: 'Activities',
           data: sortedDates.map(date => eventsByDate[date]),
           backgroundColor: 'rgba(75, 192, 192, 0.6)',
           borderColor: 'rgba(75, 192, 192, 1)',
           borderWidth: 1,
           barPercentage: 0.8,
           categoryPercentage: 0.7
         }]
      };
      // console.log("ActivityTimelineChart: Processed chart data:", JSON.stringify(chartDataResult));
      return chartDataResult;
    });
    // --- End Computed Property ---

    // --- Chart Creation/Update Function (Keep as is) ---
    const createOrUpdateChart = () => {
      // console.log("ActivityTimelineChart: Attempting createOrUpdateChart...");
      if (!chartCanvas.value) {
        console.error("ActivityTimelineChart: Canvas element not found!");
        return; // Exit if canvas is not available
      }

      const data = processedChartData.value; // Get current processed data

      // Check if there's data to display
      if (!data || !data.labels || data.labels.length === 0) {
        if (chart) { // Destroy existing chart if data becomes empty
          chart.destroy();
          chart = null;
          console.log("ActivityTimelineChart: No data, chart destroyed.");
        } else {
          console.log("ActivityTimelineChart: No data, chart not created.");
        }
        return; // Exit if no data
      }

      const ctx = chartCanvas.value.getContext('2d');

      // If chart exists, update data, otherwise create new chart
      if (chart) {
        // console.log("ActivityTimelineChart: Updating existing chart.");
        chart.data = data; // Update data
        chart.update(); // Update the chart
      } else {
        // console.log("ActivityTimelineChart: Creating new chart.");
        chart = new Chart(ctx, { // Create new chart instance
          type: 'bar',
          data: data, // Use processed data
          options: { // Keep existing options
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                type: 'time',
                time: { unit: 'day', tooltipFormat: 'MMM d, yyyy', displayFormats: { day: 'MMM d' } },
                title: { display: true, text: 'Date' },
                ticks: { autoSkip: true, maxTicksLimit: 15 }
              },
              y: {
                beginAtZero: true,
                title: { display: true, text: 'Number of Activities' },
                ticks: { stepSize: 1 }
              }
            },
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  title: function(context) {
                    const date = new Date(context[0].label);
                    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                  },
                  label: function(context) { return `Activities: ${context.raw}`; }
                }
              }
            }
          }
        });
      }
      // console.log("ActivityTimelineChart: Chart created or updated successfully.");
    };
    // --- End Chart Function ---

    // --- Use nextTick in onMounted ---
    onMounted(async () => {
      // console.log("ActivityTimelineChart: Component mounted.");
      await nextTick(); // Wait for the DOM to be updated
      createOrUpdateChart(); // Now create/update the chart
    });
    // --- End onMounted ---

    // --- Watch the source prop 'events' ---
    watch(() => props.events, async (newEvents, oldEvents) => {
      // console.log("ActivityTimelineChart: props.events watcher triggered.");
      // No need to check if data is same if computed property handles it
      await nextTick(); // Ensure DOM is ready if v-if/v-else switched
      createOrUpdateChart(); // Call update function
    }, { deep: true }); // Deep watch is appropriate for arrays of objects
    // --- End Watch ---

    // No need to watch processedChartData directly if we watch props.events

    return {
      chartCanvas,
      processedChartData // Still needed for the v-if in the template
    };
  }
}
</script>

<style scoped>
/* Keep existing styles */
.timeline-chart {
  position: relative;
  width: 100%;
  min-height: 300px;
  height: 350px;
  background-color: var(--surface-card);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  border: 1px solid var(--border-color);
  display: flex;
  justify-content: center;
  align-items: center;
}
.chart-container {
  position: relative;
  width: 100%;
  height: 100%;
}
.chart-empty {
  text-align: center;
  color: var(--text-secondary);
}
.empty-icon {
  font-size: 3rem;
  color: var(--text-disabled);
  margin-bottom: 1rem;
}
.chart-empty p {
  font-size: 1rem;
  font-weight: 500;
}
</style>