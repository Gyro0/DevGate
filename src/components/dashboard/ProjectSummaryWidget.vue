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
            <router-link :to="`/projects/${project.id}`" class="view-project">
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
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.widget-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
}

.view-all {
  font-size: 0.875rem;
  color: #4f46e5;
  text-decoration: none;
}

.view-all:hover {
  text-decoration: underline;
}

.projects-content {
  flex: 1;
  overflow: auto;
}

.project-stats {
  display: flex;
  margin-bottom: 1rem;
  gap: 0.75rem;
}

.stat-box {
  background-color: #f3f4f6;
  border-radius: 8px;
  flex: 1;
  padding: 0.75rem;
  text-align: center;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #111827;
}

.stat-label {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
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
  padding: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

.project-item:last-child {
  border-bottom: none;
}

.project-name {
  font-weight: 500;
  color: #111827;
  margin-bottom: 0.25rem;
}

.project-details {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.project-status {
  display: inline-flex;
  align-items: center;
  font-weight: 500;
}

.status-active, .status-in-progress {
  color: #2563eb;
}

.status-completed {
  color: #10b981;
}

.status-paused {
  color: #f59e0b;
}

.status-archived {
  color: #6b7280;
}

.view-project {
  color: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.view-project:hover {
  background-color: #f3f4f6;
  color: #4f46e5;
}

.loading-state, .error-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 1.5rem;
  text-align: center;
  color: #6b7280;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(99, 102, 241, 0.2);
  border-radius: 50%;
  border-top-color: #6366f1;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.error-icon, .empty-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #d1d5db;
}

.error-state p {
  margin-bottom: 1rem;
}

.retry-btn, .add-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  color: #4b5563;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
  text-decoration: none;
}

.retry-btn:hover, .add-btn:hover {
  background-color: #e5e7eb;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>