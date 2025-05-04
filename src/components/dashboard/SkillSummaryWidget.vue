<template>
  <div class="skill-summary-widget">
    <div class="widget-header">
      <h2>Skills Summary</h2>
      <router-link to="/skills" class="view-all">View All</router-link>
    </div>
    
    <div class="skills-content" v-if="!loading">
      <div v-if="skills && skills.length > 0" class="skills-data">
        <div class="skill-chart">
          <SkillRadarChart :skills="topSkills" />
        </div>
        
        <div class="top-skills">
          <h3>Top Skills</h3>
          <ul class="skill-list">
            <li v-for="skill in topSkills" :key="skill.id" class="skill-item">
              <div class="skill-info">
                <div class="skill-name">{{ skill.name }}</div>
                <div class="skill-category">{{ getCategoryName(skill.category) }}</div>
              </div>
              <div class="skill-rating">
                <div class="stars">
                  <i 
                    v-for="n in 5" 
                    :key="n" 
                    :class="['fas', n <= skill.level ? 'fa-star' : 'fa-star empty']"
                  ></i>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      
      <div v-else class="empty-state">
        <div class="empty-icon">
          <i class="fas fa-chart-line"></i>
        </div>
        <h3>No skills tracked yet</h3>
        <p>Start tracking your technical skills to see your progress over time.</p>
        <router-link to="/skills" class="add-btn">
          <i class="fas fa-plus"></i> Add Skills
        </router-link>
      </div>
    </div>
    
    <div v-else class="loading-state">
      <div class="spinner"></div>
      <span>Loading skills...</span>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import useSkills from '@/composables/useSkills';
import SkillRadarChart from '@/components/skills/SkillRadarChart.vue';

export default {
  name: 'SkillSummaryWidget',
  components: {
    SkillRadarChart
  },
  setup() {
    const { skills, loading, skillCategories, fetchUserSkills } = useSkills();

    // Ensure we have skills data
    onMounted(async () => {
      if (!skills.value || skills.value.length === 0) {
        await fetchUserSkills();
      }
    });

    // Get category name from category ID
    const getCategoryName = (categoryId) => {
      const category = skillCategories.find(cat => cat.id === categoryId);
      return category ? category.name : categoryId;
    };

    // Computed properties
    const topSkills = computed(() => {
      return [...(skills.value || [])]
        .sort((a, b) => (b.level || 0) - (a.level || 0))
        .slice(0, 5);
    });

    const averageLevel = computed(() => {
      if (!skills.value || skills.value.length === 0) return 0;
      const totalLevel = skills.value.reduce((sum, skill) => sum + (skill.level || 0), 0);
      return (totalLevel / skills.value.length).toFixed(1);
    });

    const skillCategoriesUsed = computed(() => {
      if (!skills.value) return [];
      const categories = new Set(skills.value.map(s => s.category));
      return Array.from(categories);
    });

    // Data for Radar Chart
    const radarChartData = computed(() => {
      const labels = topSkills.value.map(s => s.name);
      const data = topSkills.value.map(s => s.level || 0);
      
      return {
        labels: labels,
        datasets: [
          {
            label: 'Top Skills Level',
            data: data,
            backgroundColor: 'rgba(79, 70, 229, 0.2)',
            borderColor: 'rgba(79, 70, 229, 1)',
            pointBackgroundColor: 'rgba(79, 70, 229, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(79, 70, 229, 1)'
          }
        ]
      };
    });

    return {
      skills,
      loading,
      topSkills,
      averageLevel,
      skillCategoriesUsed,
      radarChartData,
      getCategoryName
    };
  }
}
</script>

<style scoped>
.skill-summary-widget {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--surface-card);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
  color: var(--text);
  overflow: hidden;
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-shrink: 0;
}

.widget-header h2 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.view-all {
  font-size: 0.85rem;
  color: var(--primary);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.view-all:hover {
  color: var(--primary-hover);
  text-decoration: underline;
}

.skills-content {
  flex: 1;
  overflow-y: auto; /* Allow scroll if needed */
  display: flex; /* Use flex for layout */
  flex-direction: column; /* Stack chart and list */
}

.skills-data {
  display: flex;
  flex-direction: column; /* Stack chart and list */
  flex: 1; /* Allow data section to grow */
  gap: 1.5rem; /* Space between chart and list */
}

.skill-chart {
  /* Adjust height or aspect ratio as needed */
  height: 200px; /* Example height */
  position: relative; /* Needed for chart responsiveness */
  margin-bottom: 1rem; /* Space below chart */
  display: flex;
  justify-content: center;
  align-items: center;
}
/* Ensure radar chart component itself is responsive */
.skill-chart > :deep(div) { /* Target nested chart container */
  max-width: 100%;
  max-height: 100%;
}

.top-skills {
  flex: 1; /* Allow list to take remaining space */
  min-height: 0; /* Prevent flex item from overflowing */
  overflow-y: auto; /* Scroll if list is long */
  /* Custom scrollbar styling (optional) */
  scrollbar-width: thin;
  scrollbar-color: var(--primary-light) var(--surface-ground);
}
/* Webkit scrollbar styling */
.top-skills::-webkit-scrollbar { width: 6px; }
.top-skills::-webkit-scrollbar-track { background: var(--surface-ground); border-radius: 3px; }
.top-skills::-webkit-scrollbar-thumb { background-color: var(--primary-light); border-radius: 3px; }


h3 { /* Style for "Top Skills" */
  font-size: 0.9rem;
  margin: 0 0 0.75rem 0;
  color: var(--text-secondary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.skill-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.skill-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 0.25rem; /* Adjust padding */
  border-bottom: 1px solid var(--border-color);
}
.skill-item:last-child {
  border-bottom: none;
}

.skill-info {
  flex: 1;
  margin-right: 1rem;
  text-align: left; 
}

.skill-name {
  font-weight: 500;
  color: var(--text-primary);
  font-size: 0.9rem;
  margin-bottom: 0.1rem;
}

.skill-category {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.skill-rating {
  flex-shrink: 0;
}

.stars {
  color: var(--warning, #ffc107); /* Star color */
  font-size: 0.8rem; /* Adjust star size */
}

.stars .empty {
  color: var(--surface-border); /* Empty star color */
}

/* Loading/Error/Empty States (Consistent style) */
.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 1.5rem;
  text-align: center;
  color: var(--text-secondary);
}

.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid var(--primary-light);
  border-radius: 50%;
  border-top-color: var(--primary);
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.empty-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: var(--text-disabled);
}

.empty-state h3, .empty-state p {
  margin-bottom: 1rem;
}
.empty-state h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}
.empty-state p {
  font-size: 0.9rem;
  max-width: 300px;
}

.add-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  background-color: var(--primary);
  border: none;
  border-radius: 6px;
  color: var(--primary-contrast, #fff);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s, box-shadow 0.2s;
  text-decoration: none;
  box-shadow: 0 2px 4px rgba(var(--primary-rgb), 0.2);
}

.add-btn:hover {
  background-color: var(--primary-hover);
  box-shadow: 0 4px 8px rgba(var(--primary-rgb), 0.3);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>