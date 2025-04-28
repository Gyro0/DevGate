<template>
  <div class="skill-radar-chart">
    <div v-if="!hasSkills" class="no-data-message">
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
  name: 'SkillRadarChart',
  props: {
    skills: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const { skillCategories } = useSkills();
    const chartCanvas = ref(null);
    let chartInstance = null;

    // Check if there are skills to display
    const hasSkills = computed(() => props.skills.length > 0);

    // Process data for radar chart
    const chartData = computed(() => {
      const categoryCounts = {};
      const categoryLevels = {};
      
      // Initialize with zeros
      skillCategories.forEach(cat => {
        categoryCounts[cat.id] = 0;
        categoryLevels[cat.id] = 0;
      });
      
      // Aggregate data
      props.skills.forEach(skill => {
        if (categoryCounts[skill.category] !== undefined) {
          categoryCounts[skill.category] += 1;
          categoryLevels[skill.category] += skill.level;
        }
      });
      
      // Calculate average level per category
      skillCategories.forEach(cat => {
        if (categoryCounts[cat.id] > 0) {
          categoryLevels[cat.id] = categoryLevels[cat.id] / categoryCounts[cat.id];
        }
      });
      
      return {
        labels: skillCategories.map(cat => cat.name),
        datasets: [{
          label: 'Average Skill Level',
          data: skillCategories.map(cat => categoryLevels[cat.id] || 0),
          fill: true,
          backgroundColor: 'rgba(79, 70, 229, 0.2)',
          borderColor: 'rgb(79, 70, 229)',
          pointBackgroundColor: 'rgb(79, 70, 229)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(79, 70, 229)'
        }]
      };
    });

    // Initialize and update radar chart
    const updateChart = () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
      
      if (!chartCanvas.value || !hasSkills.value) return;
      
      const ctx = chartCanvas.value.getContext('2d');
      
      chartInstance = new Chart(ctx, {
        type: 'radar',
        data: chartData.value,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            r: {
              min: 0,
              max: 5,
              ticks: {
                stepSize: 1
              }
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context) {
                  const value = context.parsed.r;
                  return `Average Level: ${value.toFixed(1)}`;
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

    // Return refs and computed properties needed by the template
    return {
      chartCanvas,
      hasSkills
      // props.skills is automatically available
    };
  }
}
</script>

<style scoped>
.skill-radar-chart {
  position: relative;
  height: 300px;
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
  color: #9CA3AF;
  font-size: 0.875rem;
}
</style>