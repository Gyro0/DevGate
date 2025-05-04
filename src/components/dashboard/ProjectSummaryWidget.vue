<template>
  <div class="card shadow-sm">
    <!-- Header -->
    <div class="card-header d-flex justify-content-between align-items-center">
      <h2 class="h5 mb-0 text-primary">Projects</h2>
      <router-link to="/projects" class="btn btn-link p-0 text-decoration-none text-secondary">
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
        <p class="mt-3 text-muted">Loading projects...</p>
      </div>

      <!-- Projects Content -->
      <div v-else>
        <div v-if="projects.length > 0">
          <!-- Project Stats -->
          <div class="row text-center mb-4">
            <div class="col">
              <div class="h5 text-primary">{{ projects.length }}</div>
              <div class="small text-muted">Total</div>
            </div>
            <div class="col">
              <div class="h5 text-success">{{ activeProjects.length }}</div>
              <div class="small text-muted">In Progress</div>
            </div>
            <div class="col">
              <div class="h5 text-info">{{ completedProjects.length }}</div>
              <div class="small text-muted">Completed</div>
            </div>
          </div>

          <!-- Latest Projects -->
          <h3 class="h6 text-dark mb-3">Latest Projects</h3>
          <ul class="list-group">
            <li
              v-for="project in recentProjects"
              :key="project.id"
              class="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <div class="fw-bold">{{ project.title }}</div>
                <div class="small text-muted">
                  <span class="badge me-2" :class="statusClass(project)">
                    {{ project.status }}
                  </span>
                  {{ formatDate(project.updatedAt || project.createdAt) }}
                </div>
              </div>
              <router-link :to="`/projects/${project.id}`" class="btn btn-sm btn-outline-secondary">
                <i class="fas fa-chevron-right"></i>
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-5">
          <i class="fas fa-code fa-3x text-muted mb-3"></i>
          <h3 class="h6 text-dark">No projects yet</h3>
          <p class="text-muted">Add projects to track your portfolio and showcase your work.</p>
          <router-link to="/projects" class="btn btn-primary">
            <i class="fas fa-plus me-2"></i> Add Project
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import useProjects from '@/composables/useProjects';

const { projects, loading } = useProjects();

// Computed properties
const recentProjects = computed(() => {
  return [...projects.value]
    .sort((a, b) => {
      const dateA = a.createdAt?.seconds ? new Date(a.createdAt.seconds * 1000) : new Date(a.createdAt);
      const dateB = b.createdAt?.seconds ? new Date(b.createdAt.seconds * 1000) : new Date(b.createdAt);
      return dateB - dateA;
    })
    .slice(0, 4);
});

const activeProjects = computed(() => {
  return projects.value.filter((p) => p.status === 'in-progress');
});

const completedProjects = computed(() => {
  return projects.value.filter((p) => p.status === 'completed');
});

// Format date for display
const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A';

  const date = timestamp?.seconds
    ? new Date(timestamp.seconds * 1000)
    : new Date(timestamp);

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

// Get CSS class for project status
const statusClass = (project) => {
  const status = project.status || 'planning';

  switch (status) {
    case 'completed':
      return 'bg-success text-white';
    case 'in-progress':
      return 'bg-info text-white';
    case 'paused':
      return 'bg-warning text-dark';
    default:
      return 'bg-secondary text-white';
  }
};
</script>

<style scoped>
/* No additional custom styles needed as Bootstrap is used */
</style>