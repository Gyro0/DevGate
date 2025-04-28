<template>
  <div class="project-summary-widget">
    <div class="widget-header">
      <h2>Projects</h2>
      <router-link to="/projects" class="view-all">View All</router-link>
    </div>
    
    <div class="projects-content" v-if="!loading">
      <div v-if="projects.length > 0" class="projects-list-container">
        <div class="project-stats">
          <div class="stat-box">
            <div class="stat-value">{{ projects.length }}</div>
            <div class="stat-label">Total</div>
          </div>
          <div class="stat-box">
            <div class="stat-value">{{ activeProjects.length }}</div>
            <div class="stat-label">In Progress</div>
          </div>
          <div class="stat-box">
            <div class="stat-value">{{ completedProjects.length }}</div>
            <div class="stat-label">Completed</div>
          </div>
        </div>
        
        <h3>Latest Projects</h3>
        
        <ul class="projects-list">
          <li v-for="project in recentProjects" :key="project.id" class="project-item">
            <div class="project-info">
              <div class="project-name">{{ project.title }}</div>
              <div class="project-details">
                <span class="project-status" :class="statusClass(project)">
                  {{ project.status }}
                </span>
                <span class="project-date">
                  {{ formatDate(project.updatedAt || project.createdAt) }}
                </span>
              </div>
            </div>
            <router-link :to="`/projects/${project.id}`" class="view-project">
              <i class="fas fa-chevron-right"></i>
            </router-link>
          </li>
        </ul>
      </div>
      
      <div v-else class="empty-state">
        <div class="empty-icon">
          <i class="fas fa-code"></i>
        </div>
        <h3>No projects yet</h3>
        <p>Add projects to track your portfolio and showcase your work.</p>
        <router-link to="/projects" class="add-btn">
          <i class="fas fa-plus"></i> Add Project
        </router-link>
      </div>
    </div>
    
    <div v-else class="loading-state">
      <div class="spinner"></div>
      <span>Loading projects...</span>
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
  return projects.value.filter(p => p.status === 'in-progress');
});

const completedProjects = computed(() => {
  return projects.value.filter(p => p.status === 'completed');
});

// Format date for display
const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A';
  
  const date = timestamp?.seconds 
    ? new Date(timestamp.seconds * 1000) 
    : new Date(timestamp);
    
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
};

// Get CSS class for project status
const statusClass = (project) => {
  const status = project.status || 'planning';
  
  switch (status) {
    case 'completed':
      return 'status-completed';
    case 'in-progress':
      return 'status-active';
    case 'paused':
      return 'status-paused';
    default:
      return 'status-planning';
  }
};
</script>

<style scoped>
.project-summary-widget {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.widget-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.view-all {
  color: #4f46e5;
  text-decoration: none;
  font-size: 0.875rem;
}

.view-all:hover {
  text-decoration: underline;
}

.projects-content {
  flex: 1;
}

.projects-list-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.project-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.stat-box {
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  flex: 1;
  margin-right: 0.5rem;
}

.stat-box:last-child {
  margin-right: 0;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.75rem;
  color: #6b7280;
}

h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 1rem;
}

.projects-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.project-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e5e7eb;
}

.project-item:last-child {
  border-bottom: none;
}

.project-info {
  flex: 1;
}

.project-name {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.project-details {
  display: flex;
  align-items: center;
  font-size: 0.75rem;
}

.project-status {
  padding: 0.25rem 0.5rem;
  border-radius: 16px;
  margin-right: 0.5rem;
}

.status-completed {
  background-color: #d1fae5;
  color: #065f46;
}

.status-active {
  background-color: #eff6ff;
  color: #1e40af;
}

.status-paused {
  background-color: #fef3c7;
  color: #92400e;
}

.status-planning {
  background-color: #e5e7eb;
  color: #374151;
}

.project-date {
  color: #6b7280;
}

.view-project {
  color: #6b7280;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s;
}

.view-project:hover {
  background-color: #f3f4f6;
  color: #4f46e5;
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
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #d1d5db;
}

.empty-state h3 {
  margin: 0;
  margin-bottom: 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
}

.empty-state p {
  margin: 0;
  margin-bottom: 1.5rem;
  color: #6b7280;
  max-width: 24rem;
}

.add-btn {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: #4f46e5;
  color: white;
  border-radius: 0.375rem;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s;
}

.add-btn i {
  margin-right: 0.5rem;
}

.add-btn:hover {
  background-color: #4338ca;
}

.loading-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 0.875rem;
}

.spinner {
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-top: 3px solid #4f46e5;
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
  .project-stats {
    flex-direction: column;
  }
  
  .stat-box {
    margin-right: 0;
    margin-bottom: 0.5rem;
  }
  
  .stat-box:last-child {
    margin-bottom: 0;
  }
}
</style>