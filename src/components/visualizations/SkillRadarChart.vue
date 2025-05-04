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
      const hasSkills = computed(() => {
        return props.skills && props.skills.length > 0;
      });
  
      // Process data for radar chart
      const chartData = computed(() => {
        if (!hasSkills.value) return { labels: [], datasets: [] };
        
        const categoryCounts = {};
        const categoryLevels = {};
        
        // Initialize with zeros
        skillCategories.forEach(cat => {
          categoryCounts[cat.id] = 0;
          categoryLevels[cat.id] = 0;
        });
        
        // Aggregate data
        props.skills.forEach(skill => {
          if (skill.category && categoryCounts[skill.category] !== undefined) {
            categoryCounts[skill.category] += 1;
            categoryLevels[skill.category] += Number(skill.level) || 0;
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
        // Destroy previous chart instance if it exists
        if (chartInstance) {
          chartInstance.destroy();
          chartInstance = null;
        }
        
        // Only create chart if canvas exists and we have skills
        if (!chartCanvas.value || !hasSkills.value) {
          console.log("SkillRadarChart: Can't create chart - canvas or data missing");
          return;
        }
        
        try {
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
          console.log("SkillRadarChart: Chart created successfully");
        } catch (error) {
          console.error("SkillRadarChart: Error creating chart:", error);
        }
      };
  
      // Watch for changes in skills data
      watch(() => props.skills, (newSkills) => {
        console.log("SkillRadarChart: Skills updated, count:", newSkills?.length || 0);
        updateChart();
      }, { deep: true });
  
      // Initialize chart when component mounts
      onMounted(() => {
        console.log("SkillRadarChart: Component mounted");
        updateChart();
      });
  
      return {
        chartCanvas,
        hasSkills
      };
    }
  }
  </script>
  
  <style scoped>
  .skill-radar-chart {
    position: relative;
    width: 100%;
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--card-bg);
    border-radius: 12px;
    padding: 1rem;
    box-shadow: 0 4px 12px rgba(0,0,0,0.12);
    border: 1px solid var(--border-color);
  }
  
  .no-data-message {
    color: var(--text-secondary);
    font-size: 0.875rem;
    text-align: center;
  }
  </style>