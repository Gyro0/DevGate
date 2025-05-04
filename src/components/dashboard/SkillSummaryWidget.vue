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
              <div class="skill-name">{{ skill.name }}</div>
              <div class="skill-rating">
                <div class="stars">
                  <i 
                    v-for="n in 5" 
                    :key="n" 
                    :class="['fas', n <= skill.level ? 'fa-star' : 'fa-star empty']"
                  ></i>
                </div>
                <div class="skill-category">{{ getCategoryName(skill.category) }}</div>
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
  border-radius: 1rem;
  box-shadow: 0 2px 16px 0 rgba(0,0,0,0.35), 0 0 0 2px var(--primary-glow), 0 0 8px 2px var(--circuit-accent);
  border: 1.5px solid var(--border-color, #23272e);
  padding: 1.5rem 1.25rem;
  position: relative;
  overflow: hidden;
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color, #23272e);
  padding-bottom: 0.75rem;
}

.widget-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 0.01em;
}

.view-all {
  color: var(--primary);
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  background: var(--primary-fade, rgba(79,70,229,0.08));
  box-shadow: 0 0 6px 0 var(--primary-glow);
  transition: background 0.18s, color 0.18s;
}

.view-all:hover {
  background: var(--primary-glow);
  color: #fff;
}

.skills-content {
  flex: 1;
  display: flex;
  color: var(--text-secondary);
}

.skills-data {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.skill-chart {
  height: 200px;
  position: relative;
  margin-bottom: 1.5rem;
  background: var(--surface-2);
  border-radius: 0.75rem;
  box-shadow: 0 0 0 1.5px var(--primary-glow), 0 0 12px 0 var(--circuit-accent-fade, #2e8b57cc);
  padding: 0.5rem;
}

.top-skills h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 1rem;
  color: var(--text-primary);
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
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border-color, #23272e);
  transition: background 0.15s;
}

.skill-item:last-child {
  border-bottom: none;
}

.skill-item:hover {
  background: var(--surface-2);
  box-shadow: 0 0 0 1px var(--primary-glow);
}

.skill-name {
  font-weight: 500;
  color: var(--text-primary);
  letter-spacing: 0.01em;
}

.skill-rating {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.stars {
  color: var(--star-color, #fbbf24);
  margin-bottom: 0.25rem;
  filter: drop-shadow(0 0 2px var(--primary-glow));
}

.stars .empty {
  color: var(--star-empty, #444a57);
  opacity: 0.5;
}

.skill-category {
  font-size: 0.75rem;
  color: var(--text-tertiary, #7a869a);
  font-style: italic;
}

.empty-state {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem 1rem;
  background: var(--surface-2);
  border-radius: 0.75rem;
  box-shadow: 0 0 0 1.5px var(--primary-glow), 0 0 8px 0 var(--circuit-accent-fade, #2e8b57cc);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--primary-glow);
  filter: drop-shadow(0 0 6px var(--primary-glow));
}

.empty-state h3 {
  margin: 0;
  margin-bottom: 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
}

.empty-state p {
  margin: 0;
  margin-bottom: 1.5rem;
  color: var(--text-tertiary, #7a869a);
  max-width: 24rem;
}

.add-btn {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1.1rem;
  background: var(--primary);
  color: #fff;
  border-radius: 0.375rem;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  box-shadow: 0 0 8px 0 var(--primary-glow);
  border: none;
  transition: background 0.18s, box-shadow 0.18s;
  letter-spacing: 0.01em;
}

.add-btn i {
  margin-right: 0.5rem;
}

.add-btn:hover {
  background: var(--primary-glow);
  color: #fff;
  box-shadow: 0 0 16px 2px var(--primary-glow);
}

.loading-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-tertiary, #7a869a);
  font-size: 0.95rem;
}

.spinner {
  border: 3px solid rgba(60, 65, 80, 0.18);
  border-top: 3px solid var(--primary-glow);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
  margin-bottom: 0.5rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 640px) {
  .skill-chart {
    height: 180px;
  }
}
</style>