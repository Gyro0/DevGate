<template>
  <div class="objectives-widget">
    <div class="widget-header">
      <h2>Objectives</h2>
      <router-link to="/objectives" class="view-all">View All</router-link>
    </div>
    
    <div class="objectives-content">
      <!-- Loading state -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <span>Loading objectives...</span>
      </div>
      
      <!-- Error state -->
      <div v-else-if="error" class="error-state">
        <div class="error-icon"><i class="fas fa-exclamation-circle"></i></div>
        <p>{{ error }}</p>
        <button @click="loadObjectives" class="retry-btn">Retry</button>
      </div>
      
      <!-- Objectives loaded successfully -->
      <div v-else-if="objectives.length > 0" class="objectives-data">
        <div class="objectives-summary">
          <div class="progress-container">
            <div class="progress-ring">
              <div class="progress-circle">
                <div class="progress-value">{{ completionPercentage }}%</div>
                <div class="progress-label">Completed</div>
              </div>
            </div>
            <div class="status-summary">
              <div class="status-item">
                <div class="status-dot planned"></div>
                <div class="status-label">Planned</div>
                <div class="status-count">{{ plannedCount }}</div>
              </div>
              <div class="status-item">
                <div class="status-dot in-progress"></div>
                <div class="status-label">In Progress</div>
                <div class="status-count">{{ inProgressCount }}</div>
              </div>
              <div class="status-item">
                <div class="status-dot completed"></div>
                <div class="status-label">Completed</div>
                <div class="status-count">{{ completedCount }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <h3>Recent Objectives</h3>
        <ul class="objectives-list">
          <li v-for="objective in recentObjectives" :key="objective.id" class="objective-item">
            <div class="objective-info">
              <div class="objective-title">{{ objective.title }}</div>
              <div class="objective-details">
                <span class="objective-status" :class="`status-${objective.status}`">
                  {{ formatStatus(objective.status) }}
                </span>
                <span v-if="objective.dueDate" class="objective-due-date">
                  Due {{ formatDate(objective.dueDate) }}
                </span>
              </div>
            </div>
            <router-link :to="`/objectives/${objective.id}`" class="view-objective">
              <i class="fas fa-chevron-right"></i>
            </router-link>
          </li>
        </ul>
      </div>
      
      <!-- No objectives state -->
      <div v-else class="empty-state">
        <div class="empty-icon">
          <i class="fas fa-bullseye"></i>
        </div>
        <h3>No objectives yet</h3>
        <p>Define your learning and career objectives to track your progress.</p>
        <router-link to="/objectives" class="add-btn">
          <i class="fas fa-plus"></i> Add Objective
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { db } from '@/firebase/firebaseInit';
import useAuth from '@/composables/useAuth';

export default {
  name: 'ObjectivesProgressWidget',
  setup() {
    // State
    const objectives = ref([]);
    const loading = ref(true);
    const error = ref(null);
    const { waitForAuth } = useAuth();
    
    // Computed properties
    const plannedCount = computed(() => 
      objectives.value.filter(o => o.status === 'planned').length
    );
    
    const inProgressCount = computed(() => 
      objectives.value.filter(o => o.status === 'in-progress').length
    );
    
    const completedCount = computed(() => 
      objectives.value.filter(o => o.status === 'completed').length
    );
    
    const completionPercentage = computed(() => {
      if (objectives.value.length === 0) return 0;
      return Math.round((completedCount.value / objectives.value.length) * 100);
    });
    
    const recentObjectives = computed(() => {
      // Sort by createdAt date (newest first) and take top 3
      return [...objectives.value]
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
        'planned': 'Planned',
        'in-progress': 'In Progress',
        'completed': 'Completed',
        'cancelled': 'Cancelled'
      };
      return statusMap[status] || status;
    };
    
    // Load objectives directly from Firestore
    const loadObjectives = async () => {
      loading.value = true;
      error.value = null;
      
      try {
        console.log("ObjectivesWidget: Loading objectives...");
        
        // Wait for authentication
        const currentUser = await waitForAuth();
        
        if (!currentUser) {
          console.warn("ObjectivesWidget: No user logged in");
          loading.value = false;
          error.value = "Authentication required";
          return;
        }
        
        // Fetch objectives directly from Firestore
        const snapshot = await db.collection('objectives')
          .where('userId', '==', currentUser.uid)
          .orderBy('createdAt', 'desc')
          .limit(10) // Only need a few for the summary
          .get();
        
        const fetchedObjectives = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            // Convert timestamps to JS Date objects
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : 
              (data.createdAt ? new Date(data.createdAt) : new Date()),
            updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : 
              (data.updatedAt ? new Date(data.updatedAt) : new Date()),
            dueDate: data.dueDate?.toDate ? data.dueDate.toDate() : 
              (data.dueDate ? new Date(data.dueDate) : null),
            completedAt: data.completedAt?.toDate ? data.completedAt.toDate() : 
              (data.completedAt ? new Date(data.completedAt) : null)
          };
        });
        
        console.log(`ObjectivesWidget: Loaded ${fetchedObjectives.length} objectives`);
        objectives.value = fetchedObjectives;
      } catch (err) {
        console.error("ObjectivesWidget: Error loading objectives", err);
        error.value = "Failed to load objectives";
      } finally {
        loading.value = false;
      }
    };
    
    // Initialize data on component mount
    onMounted(() => {
      loadObjectives();
    });
    
    return {
      objectives,
      loading,
      error,
      plannedCount,
      inProgressCount,
      completedCount,
      completionPercentage,
      recentObjectives,
      formatDate,
      formatStatus,
      loadObjectives
    };
  }
}
</script>

<style scoped>
.objectives-widget {
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

.objectives-content {
  flex: 1;
  overflow: auto;
}

.objectives-summary {
  margin-bottom: 1.5rem;
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.progress-ring {
  position: relative;
  flex-shrink: 0;
}

.progress-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: conic-gradient(#4f46e5 0%, #4f46e5 calc(var(--percentage) * 1%), #e5e7eb calc(var(--percentage) * 1%), #e5e7eb 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  font-size: 0.875rem;
  color: #4b5563;
  --percentage: v-bind(completionPercentage);
}

.progress-circle::before {
  content: '';
  position: absolute;
  inset: 8px;
  border-radius: 50%;
  background: white;
}

.progress-value, .progress-label {
  position: relative;
  z-index: 1;
}

.progress-value {
  font-size: 1.25rem;
  font-weight: bold;
  color: #111827;
}

.status-summary {
  flex: 1;
}

.status-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 0.5rem;
}

.status-dot.planned {
  background-color: #9ca3af;
}

.status-dot.in-progress {
  background-color: #3b82f6;
}

.status-dot.completed {
  background-color: #10b981;
}

.status-label {
  flex: 1;
  font-size: 0.875rem;
  color: #4b5563;
}

.status-count {
  font-weight: bold;
  color: #111827;
}

h3 {
  font-size: 1rem;
  margin: 1rem 0 0.5rem;
}

.objectives-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.objective-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

.objective-item:last-child {
  border-bottom: none;
}

.objective-title {
  font-weight: 500;
  color: #111827;
  margin-bottom: 0.25rem;
}

.objective-details {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.objective-status {
  display: inline-flex;
  align-items: center;
  font-weight: 500;
}

.objective-status.status-planned {
  color: #9ca3af;
}

.objective-status.status-in-progress {
  color: #3b82f6;
}

.objective-status.status-completed {
  color: #10b981;
}

.objective-status.status-cancelled {
  color: #ef4444;
}

.view-objective {
  color: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.view-objective:hover {
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