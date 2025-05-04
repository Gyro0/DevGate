<template>
  <div class="project-summary-widget">
    <div class="widget-header">
      <h2>Projects</h2>
      <router-link to="/projects" class="view-all">View All</router-link>
    </div>
    
    <div class="projects-content">
      <!-- Loading state -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <span>Loading projects...</span>
      </div>
      
      <!-- Error state -->
      <div v-else-if="error" class="error-state">
        <div class="error-icon"><i class="fas fa-exclamation-circle"></i></div>
        <p>{{ error }}</p>
        <button @click="loadProjects" class="retry-btn">Retry</button>
      </div>
      
      <!-- Projects loaded successfully -->
      <div v-else-if="projects.length > 0" class="projects-list-container">
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
                  {{ formatStatus(project.status || 'active') }}
                </span>
                <span class="project-date">
                  {{ formatDate(project.updatedAt || project.createdAt) }}
                </span>
              </div>
            </div>
            <router-link :to="`/projects/`" class="view-project">
              <i class="fas fa-chevron-right"></i>
            </router-link>
          </li>
        </ul>
      </div>
      
      <!-- No projects state -->
      <div v-else class="empty-state">
        <div class="empty-icon">
          <i class="fas fa-folder-open"></i>
        </div>
        <h3>No projects yet</h3>
        <p>Add projects to track your portfolio and showcase your work.</p>
        <router-link to="/projects" class="add-btn">
          <i class="fas fa-plus"></i> Add Project
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { db } from '@/firebase/firebaseInit';
import firebase from 'firebase/app';
import useAuth from '@/composables/useAuth';

export default {
  name: 'ProjectSummaryWidget',
  setup() {
    // State
    const projects = ref([]);
    const loading = ref(true);
    const error = ref(null);
    const { user, waitForAuth } = useAuth();
    
    // Computed properties
    const activeProjects = computed(() => {
      return projects.value.filter(p => p.status === 'active' || p.status === 'in-progress');
    });
    
    const completedProjects = computed(() => {
      return projects.value.filter(p => p.status === 'completed');
    });
    
    const recentProjects = computed(() => {
      // Sort by createdAt date (newest first) and take top 3
      return [...projects.value]
        .sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateB - dateA;
        })
        .slice(0, 3);
    });

    // Format date for display
    const formatDate = (timestamp) => {
      if (!timestamp) return 'N/A';
      
      let date;
      try {
        if (timestamp.seconds) {
          date = new Date(timestamp.seconds * 1000);
        } else if (timestamp instanceof Date) {
          date = timestamp;
        } else {
          date = new Date(timestamp);
        }
        
        if (isNaN(date.getTime())) {
          return 'Invalid date';
        }
        
        return date.toLocaleDateString();
      } catch (err) {
        console.error("Error formatting date:", err, timestamp);
        return 'N/A';
      }
    };
    
    // Format status
    const formatStatus = (status) => {
      const statusMap = {
        'active': 'Active',
        'in-progress': 'In Progress',
        'completed': 'Completed',
        'paused': 'Paused',
        'archived': 'Archived'
      };
      return statusMap[status] || status;
    };
    
    // Get CSS class for status
    const statusClass = (project) => {
      return `status-${project.status || 'active'}`;
    };
    
    // Handle image errors
    const onImageError = (event) => {
      event.target.src = '/img/default-project.png';
    };
    
    // Load projects directly from Firestore
    const loadProjects = async () => {
      loading.value = true;
      error.value = null;
      
      try {
        console.log("ProjectSummaryWidget: Loading projects...");
        
        // Wait for authentication
        const currentUser = await waitForAuth();
        
        if (!currentUser) {
          console.warn("ProjectSummaryWidget: No user logged in");
          loading.value = false;
          error.value = "Authentication required";
          return;
        }
        
        // Fetch projects directly from Firestore
        const snapshot = await db.collection('projects')
          .where('userId', '==', currentUser.uid)
          .orderBy('createdAt', 'desc')
          .limit(10) // Only need a few for the summary
          .get();
        
        const fetchedProjects = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            // Convert timestamps to JS Date objects
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : 
              (data.createdAt ? new Date(data.createdAt) : new Date()),
            updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : 
              (data.updatedAt ? new Date(data.updatedAt) : new Date())
          };
        });
        
        console.log(`ProjectSummaryWidget: Loaded ${fetchedProjects.length} projects`);
        projects.value = fetchedProjects;
      } catch (err) {
        console.error("ProjectSummaryWidget: Error loading projects", err);
        error.value = "Failed to load projects";
      } finally {
        loading.value = false;
      }
    };
    
    // Initialize data on component mount
    onMounted(() => {
      loadProjects();
    });
    
    return {
      projects,
      loading,
      error,
      activeProjects,
      completedProjects,
      recentProjects,
      formatDate,
      formatStatus,
      statusClass,
      onImageError,
      loadProjects
    };
  }
}
</script>

<style scoped>
.project-summary-widget {
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

.projects-content {
  flex: 1;
  overflow-y: auto;
  /* Custom scrollbar styling (optional) */
  scrollbar-width: thin;
  scrollbar-color: var(--primary-light) var(--surface-ground);
}
/* Webkit scrollbar styling */
.projects-content::-webkit-scrollbar {
  width: 6px;
}
.projects-content::-webkit-scrollbar-track {
  background: var(--surface-ground);
  border-radius: 3px;
}
.projects-content::-webkit-scrollbar-thumb {
  background-color: var(--primary-light);
  border-radius: 3px;
}

.projects-list-container { /* Renamed for clarity */
  display: flex;
  flex-direction: column;
  height: 100%; /* Ensure it fills content area */
}

.project-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr)); /* Responsive columns */
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.stat-box {
  text-align: center;
  padding: 0.5rem;
  background-color: var(--surface-ground); /* Subtle background */
  border-radius: 8px;
}

.stat-value {
  font-size: 1.5rem; /* Larger stat value */
  font-weight: 600;
  color: var(--primary);
  line-height: 1.2;
}

.stat-label {
  font-size: 0.75rem; /* Smaller label */
  color: var(--text-secondary);
  text-transform: uppercase;
  margin-top: 0.25rem;
}

h3 { /* Style for "Latest Projects" */
  font-size: 0.9rem;
  margin: 0 0 0.75rem 0;
  color: var(--text-secondary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.projects-list {
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1; /* Allow list to take remaining space */
}

.project-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0.25rem;
  border-bottom: 1px solid var(--border-color);
  transition: background-color 0.2s;
}
.project-item:hover {
  background-color: var(--surface-hover);
}

.project-item:last-child {
  border-bottom: none;
}

.project-info {
  flex: 1;
  margin-right: 1rem;
}

.project-name {
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
  text-align: left;
}

.project-details {
  display: flex;
  gap: 0.75rem;
  font-size: 0.8rem;
  color: var(--text-secondary);
  flex-wrap: wrap;
}

.project-status {
  display: inline-flex;
  align-items: center;
  font-weight: 500;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  font-size: 0.75rem;
  /* Use consistent status colors */
  /* Assuming these classes exist or define them */
}
.project-status.status-active,
.project-status.status-in-progress { color: var(--primary-dark, #6f42c1); background-color: var(--primary-light, #e0cffc); }
.project-status.status-completed { color: var(--success-dark, #146c43); background-color: var(--success-light, #d1e7dd); }
.project-status.status-paused { color: var(--warning-dark, #664d03); background-color: var(--warning-light, #fff3cd); }
.project-status.status-archived { color: var(--secondary-dark, #495057); background-color: var(--secondary-light, #e2e3e5); }


.view-project {
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  transition: background-color 0.2s, color 0.2s;
  flex-shrink: 0;
}

.view-project:hover {
  background-color: var(--primary-light);
  color: var(--primary);
}

/* Loading/Error/Empty States (Mostly copied from Objectives widget for consistency) */
.loading-state, .error-state, .empty-state {
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

.error-icon, .empty-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: var(--text-disabled);
}

.error-state p, .empty-state h3, .empty-state p {
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

.retry-btn, .add-btn {
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

.retry-btn:hover, .add-btn:hover {
  background-color: var(--primary-hover);
  box-shadow: 0 4px 8px rgba(var(--primary-rgb), 0.3);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>