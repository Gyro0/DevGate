<template>
  <div class="card shadow-sm">
    <!-- Header -->
    <div class="card-header d-flex justify-content-between align-items-center">
      <h2 class="h5 mb-0 text-primary">Skills Summary</h2>
      <router-link to="/skills" class="btn btn-link p-0 text-decoration-none text-secondary">
        View All
      </router-link>
    </div>

    <!-- Content -->
    <div class="card-body">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-3 text-muted">Loading skills...</p>
      </div>

      <!-- Skills Content -->
      <div v-else>
        <div v-if="skills.length > 0">
          <!-- Radar Chart -->
          <div class="mb-4">
            <SkillRadarChart :chart-data="radarChartData" />
          </div>

          <!-- Top Skills -->
          <h3 class="h6 text-dark mb-3">Top Skills</h3>
          <ul class="list-group">
            <li
              v-for="skill in topSkills"
              :key="skill.id"
              class="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <div class="fw-bold">{{ skill.name }}</div>
                <div class="small text-muted">{{ skill.category }}</div>
              </div>
              <div class="d-flex align-items-center">
                <div class="stars me-2">
                  <i
                    v-for="n in 5"
                    :key="n"
                    :class="['fas', n <= skill.level ? 'fa-star text-warning' : 'fa-star text-muted']"
                  ></i>
                </div>
                <span class="badge bg-primary">{{ skill.level }}</span>
              </div>
            </li>
          </ul>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-5">
          <i class="fas fa-chart-line fa-3x text-muted mb-3"></i>
          <h3 class="h6 text-dark">No skills tracked yet</h3>
          <p class="text-muted">Start tracking your technical skills to see your progress over time.</p>
          <router-link to="/skills" class="btn btn-primary">
            <i class="fas fa-plus me-2"></i> Add Skills
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import useSkills from '@/composables/useSkills';
import SkillRadarChart from '@/components/skills/SkillRadarChart.vue';

const { skills, loading } = useSkills();

// Computed properties
const topSkills = computed(() => {
  return [...skills.value]
    .sort((a, b) => (b.level || 0) - (a.level || 0))
    .slice(0, 5);
});

const radarChartData = computed(() => {
  const labels = topSkills.value.map((s) => s.name);
  const data = topSkills.value.map((s) => s.level || 0);

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
        pointHoverBorderColor: 'rgba(79, 70, 229, 1)',
      },
    ],
  };
});
</script>

<style scoped>
.stars i {
  font-size: 1rem;
}
</style>