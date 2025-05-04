<template>
  <div class="skill-progress-chart card shadow-sm border-0">
    <!-- Card Header -->
    <div class="card-header bg-light">
      <h5 class="card-title mb-0">Skill Progress Chart</h5>
    </div>

    <!-- Card Body -->
    <div class="card-body position-relative">
      <div v-if="skills.length === 0" class="no-data-message text-center">
        <i class="fas fa-chart-bar fa-2x text-muted mb-3"></i>
        <p class="text-muted">No skills data available to display</p>
      </div>
      <div v-else>
        <canvas ref="chartCanvas"></canvas>
      </div>
    </div>
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
      default: () => [],
    },
  },
  setup(props) {
    const { skillLevels } = useSkills();
    const chartCanvas = ref(null);
    let chartInstance = null;

    // Transform skills data for the chart
    const chartData = computed(() => {
      const levelCounts = {};
      skillLevels.forEach((level) => {
        levelCounts[level.value] = props.skills.filter((skill) => skill.level === level.value).length;
      });

      return {
        labels: skillLevels.map((level) => level.label),
        datasets: [
          {
            label: 'Skills Count',
            data: skillLevels.map((level) => levelCounts[level.value] || 0),
            backgroundColor: [
              'rgba(59, 130, 246, 0.7)', // Blue
              'rgba(16, 185, 129, 0.7)', // Green
              'rgba(245, 158, 11, 0.7)', // Yellow
              'rgba(239, 68, 68, 0.7)', // Red
              'rgba(139, 92, 246, 0.7)', // Purple
            ],
            borderColor: [
              'rgb(59, 130, 246)',
              'rgb(16, 185, 129)',
              'rgb(245, 158, 11)',
              'rgb(239, 68, 68)',
              'rgb(139, 92, 246)',
            ],
            borderWidth: 1,
          },
        ],
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
                precision: 0,
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                title: function (context) {
                  return context[0].label;
                },
                label: function (context) {
                  const count = context.parsed.y;
                  return count === 1 ? '1 skill' : `${count} skills`;
                },
              },
            },
          },
        },
      });
    };

    // Watch for changes in skills data
    watch(
      () => props.skills,
      () => {
        updateChart();
      },
      { deep: true }
    );

    // Initialize chart when component mounts
    onMounted(() => {
      updateChart();
    });

    return {
      chartCanvas,
    };
  },
};
</script>

<style scoped>
.skill-progress-chart {
  border-radius: 8px;
  overflow: hidden;
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
}

.card-body {
  height: 300px;
}

.no-data-message {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #6c757d;
  font-size: 0.875rem;
}
</style>