<template>
  <div class="skill-progress-chart">
    <div v-if="skills.length === 0" class="no-data-message">
      No skills data available to display
    </div>
    <canvas v-else ref="chartCanvas"></canvas>
  </div>
</template>

<script>
import { ref, onMounted, watch, computed } from 'vue';
import Chart from 'chart.js/auto';
import useSkills from '@/composables/useSkills';

export default {
  name: 'SkillProgressChart',
  props: {
    skills: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const { skillLevels } = useSkills();
    const chartCanvas = ref(null);
    let chartInstance = null;

    // Transform skills data for the chart
    const chartData = computed(() => {
      // Group skills by level
      const levelCounts = {};
      skillLevels.forEach(level => {
        levelCounts[level.value] = props.skills.filter(skill => skill.level === level.value).length;
      });
      
      return {
        labels: skillLevels.map(level => level.label),
        datasets: [{
          label: 'Skills Count',
          data: skillLevels.map(level => levelCounts[level.value] || 0),
          backgroundColor: [
            'rgba(59, 130, 246, 0.7)', // Blue
            'rgba(16, 185, 129, 0.7)', // Green
            'rgba(245, 158, 11, 0.7)', // Yellow
            'rgba(239, 68, 68, 0.7)',  // Red
            'rgba(139, 92, 246, 0.7)'  // Purple
          ],
          borderColor: [
            'rgb(59, 130, 246)',
            'rgb(16, 185, 129)',
            'rgb(245, 158, 11)',
            'rgb(239, 68, 68)',
            'rgb(139, 92, 246)'
          ],
          borderWidth: 1
        }]
      };
    });

    // Initialize and update chart
    const updateChart = () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
      
      if (!chartCanvas.value) return;
      
      const ctx = chartCanvas.value.getContext('2d');
      
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: chartData.value,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                precision: 0
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
                  const count = context.parsed.y;
                  return count === 1 ? '1 skill' : `${count} skills`;
                }
              }
            }
          }
        }
      });
    };

    // Watch for changes in skills data
    watch(() => props.skills, () => {
      updateChart();
    }, { deep: true });

    // Initialize chart when component mounts
    onMounted(() => {
      updateChart();
    });

    // Return refs and methods needed by the template
    return {
      chartCanvas
      // props.skills is automatically available
    };
  }
}
</script>

<style scoped>
.skill-progress-chart {
  position: relative;
  height: 300px;
  background: var(--card-bg);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  border: 1px solid var(--border-color);
  padding: 1.5rem 1rem 1rem 1rem;
  overflow: hidden;
}

.no-data-message {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  font-size: 0.95rem;
  background: var(--card-bg);
  border-radius: 12px;
}
</style>