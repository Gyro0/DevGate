<template>
  <div class="card objectives-widget shadow-sm">
    <!-- Header -->
    <div class="card-header d-flex justify-content-between align-items-center">
      <h2 class="h5 mb-0 text-primary">Objectives</h2>
      <router-link to="/objectives" class="btn btn-link p-0 text-decoration-none text-secondary">
        View All
      </router-link>
    </div>
<<<<<<< HEAD
    
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
=======

    <!-- Content -->
    <div class="card-body">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-3 text-muted">Loading objectives...</p>
      </div>

      <!-- Objectives Content -->
      <div v-else>
        <div v-if="objectives.length > 0">
          <!-- Progress Overview -->
          <div class="mb-4">
            <div class="d-flex justify-content-between small text-muted mb-1">
              <span>{{ completionPercentage }}% Complete</span>
            </div>
            <div class="progress">
              <div
                class="progress-bar bg-primary"
                role="progressbar"
                :style="{ width: `${completionPercentage}%` }"
                :aria-valuenow="completionPercentage"
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
          </div>

          <!-- Objectives Stats -->
          <div class="row text-center mb-4">
            <div class="col">
              <div class="h5 text-primary">{{ objectives.length }}</div>
              <div class="small text-muted">Total</div>
            </div>
            <div class="col">
              <div class="h5 text-success">{{ completedObjectives.length }}</div>
              <div class="small text-muted">Complete</div>
            </div>
            <div class="col">
              <div class="h5 text-info">{{ inProgressObjectives.length }}</div>
              <div class="small text-muted">In Progress</div>
            </div>
          </div>

          <!-- Current Goals -->
          <h3 class="h6 text-dark mb-3">Current Goals</h3>
          <ul class="list-group">
            <li
              v-for="objective in activeObjectives"
              :key="objective.id"
              class="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <div class="fw-bold">{{ objective.title }}</div>
                <div class="small text-muted">
                  <span v-if="objective.deadline">
                    <i class="fas fa-calendar-alt me-1"></i>
                    Due {{ formatDate(objective.deadline) }}
                  </span>
                </div>
              </div>
              <div class="d-flex align-items-center">
                <div class="progress me-2" style="width: 100px;">
                  <div
                    class="progress-bar bg-info"
                    role="progressbar"
                    :style="{ width: `${objective.progress}%` }"
                    :aria-valuenow="objective.progress"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
                <span class="small text-muted">{{ objective.progress }}%</span>
              </div>
            </li>
          </ul>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-5">
          <i class="fas fa-bullseye fa-3x text-muted mb-3"></i>
          <h3 class="h6 text-dark">No objectives yet</h3>
          <p class="text-muted">Set clear objectives to guide your development journey.</p>
          <router-link to="/objectives" class="btn btn-primary">
            <i class="fas fa-plus me-2"></i> Add Objective
          </router-link>
        </div>
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
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
<<<<<<< HEAD
    const plannedCount = computed(() => 
      objectives.value.filter(o => o.status === 'planned').length
    );
    
    const inProgressCount = computed(() => 
      objectives.value.filter(o => o.status === 'in-progress').length
    );
    
    const completedCount = computed(() => 
      objectives.value.filter(o => o.status === 'completed').length
    );
    
=======
    const completedObjectives = computed(() => {
      return objectives.value.filter((o) => o.status === 'completed');
    });

    const inProgressObjectives = computed(() => {
      return objectives.value.filter((o) => o.status === 'in-progress');
    });

    const activeObjectives = computed(() => {
      // Sort in-progress first, then planned, limit to 4
      return [...inProgressObjectives.value, ...objectives.value.filter((o) => o.status === 'planned')]
        .sort((a, b) => {
          // Sort by deadline if available
          if (a.deadline && b.deadline) {
            const dateA = a.deadline?.seconds ? new Date(a.deadline.seconds * 1000) : new Date(a.deadline);
            const dateB = b.deadline?.seconds ? new Date(b.deadline.seconds * 1000) : new Date(b.deadline);
            return dateA - dateB;
          }
          return 0;
        })
        .slice(0, 4);
    });

>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
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
<<<<<<< HEAD
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
=======
      if (!timestamp) return 'No deadline';

      const date = timestamp?.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);

      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
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
<<<<<<< HEAD
      recentObjectives,
      formatDate,
      formatStatus,
      loadObjectives
=======
      formatDate,
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
    };
  },
};
</script>

<style scoped>
<<<<<<< HEAD
.objectives-widget {
  height: 100%; /* Ensure widget fills grid cell */
  display: flex;
  flex-direction: column;
  background: var(--surface-card); /* Use card background */
  border-radius: 12px; /* Consistent border radius */
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 1.5rem; /* Consistent padding */
  color: var(--text);
  overflow: hidden; /* Prevent content overflow */
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem; /* Increased space below header */
  flex-shrink: 0; /* Prevent header shrinking */
}

.widget-header h2 {
  margin: 0;
  font-size: 1.1rem; /* Slightly smaller header */
  font-weight: 600; /* Standard weight */
  color: var(--text-primary); /* Use primary text color */
}

.view-all {
  font-size: 0.85rem; /* Smaller link */
  color: var(--primary); /* Use primary color */
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.view-all:hover {
  color: var(--primary-hover); /* Use hover variable */
  text-decoration: underline;
}

.objectives-content {
  flex: 1; /* Allow content to grow */
  overflow-y: auto; /* Enable scrolling if content overflows */
  /* Custom scrollbar styling (optional) */
  scrollbar-width: thin;
  scrollbar-color: var(--primary-light) var(--surface-ground);
}
/* Webkit scrollbar styling */
.objectives-content::-webkit-scrollbar {
  width: 6px;
}
.objectives-content::-webkit-scrollbar-track {
  background: var(--surface-ground);
  border-radius: 3px;
}
.objectives-content::-webkit-scrollbar-thumb {
  background-color: var(--primary-light);
  border-radius: 3px;
}

.objectives-summary {
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color); /* Separator */
  padding-bottom: 1.5rem;
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap; /* Allow wrapping on smaller screens if needed */
}

.progress-ring {
  position: relative;
  flex-shrink: 0;
}

.progress-circle {
  width: 90px; /* Slightly smaller */
  height: 90px;
  border-radius: 50%;
  /* Use CSS variable for percentage */
  background: conic-gradient(var(--primary) calc(var(--percentage) * 1%), var(--surface-border) calc(var(--percentage) * 1%));
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  font-size: 0.8rem; /* Smaller text */
  color: var(--text-secondary);
  --percentage: v-bind(completionPercentage); /* Bind percentage */
  box-shadow: 0 0 8px rgba(var(--primary-rgb), 0.2); /* Softer shadow */
}

.progress-circle::before {
  content: '';
  position: absolute;
  inset: 6px; /* Thinner ring */
  border-radius: 50%;
  background: var(--surface-card); /* Match card background */
}

.progress-value, .progress-label {
  position: relative;
  z-index: 1;
  line-height: 1.2;
}

.progress-value {
  font-size: 1.4rem; /* Larger percentage */
  font-weight: 600;
  color: var(--primary);
}
.progress-label {
  font-size: 0.75rem;
  text-transform: uppercase;
}

.status-summary {
  flex: 1;
  min-width: 150px; /* Ensure minimum width */
}

.status-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.6rem; /* Increased spacing */
}
.status-item:last-child {
  margin-bottom: 0;
}

.status-dot {
  width: 8px; /* Smaller dot */
  height: 8px;
  border-radius: 50%;
  margin-right: 0.6rem;
  flex-shrink: 0;
}

/* Use more distinct status colors if available, otherwise use theme colors */
.status-dot.planned { background-color: var(--info, #0dcaf0); }
.status-dot.in-progress { background-color: var(--primary); }
.status-dot.completed { background-color: var(--success, #198754); }

.status-label {
  flex: 1;
  font-size: 0.85rem; /* Slightly smaller */
  color: var(--text-secondary);
  margin-right: 0.5rem;
}

.status-count {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-primary);
}

h3 { /* Style for "Recent Objectives" */
  font-size: 0.9rem;
  margin: 0 0 0.75rem 0; /* Adjusted margin */
  color: var(--text-secondary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
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
  padding: 0.75rem 0.25rem; /* Adjust padding */
  border-bottom: 1px solid var(--border-color);
  transition: background-color 0.2s;
}
.objective-item:hover {
  background-color: var(--surface-hover);
}

.objective-item:last-child {
  border-bottom: none;
}

.objective-info {
  flex: 1;
  margin-right: 1rem;
}

.objective-title {
  font-weight: 500; /* Standard weight */
  color: var(--text-primary);
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
  text-align: left;
}

.objective-details {
  display: flex;
  gap: 0.75rem; /* Reduced gap */
  font-size: 0.8rem; /* Smaller details */
  color: var(--text-secondary);
  flex-wrap: wrap;
}

.objective-status {
  display: inline-flex;
  align-items: center;
  font-weight: 500;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  font-size: 0.75rem;
}
/* Status background/text colors */
.objective-status.status-planned { color: var(--info-dark, #0a58ca); background-color: var(--info-light, #cfe2ff); }
.objective-status.status-in-progress { color: var(--primary-dark, #6f42c1); background-color: var(--primary-light, #e0cffc); }
.objective-status.status-completed { color: var(--success-dark, #146c43); background-color: var(--success-light, #d1e7dd); }
.objective-status.status-cancelled { color: var(--danger-dark, #b02a37); background-color: var(--danger-light, #f8d7da); }

.view-objective {
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px; /* Slightly larger */
  height: 28px;
  border-radius: 50%;
  transition: background-color 0.2s, color 0.2s;
  flex-shrink: 0;
}

.view-objective:hover {
  background-color: var(--primary-light);
  color: var(--primary);
}

/* Loading/Error/Empty States */
.loading-state, .error-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1; /* Take remaining space */
  padding: 1.5rem;
  text-align: center;
  color: var(--text-secondary);
}

.spinner {
  width: 28px; /* Larger spinner */
  height: 28px;
  border: 3px solid var(--primary-light); /* Lighter border */
  border-radius: 50%;
  border-top-color: var(--primary);
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.error-icon, .empty-icon {
  font-size: 2.5rem; /* Larger icon */
  margin-bottom: 1rem;
  color: var(--text-disabled); /* More subtle color */
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
  max-width: 300px; /* Limit width */
}

.retry-btn, .add-btn {
  /* Use common button styles if available, otherwise define here */
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem; /* Adjust padding */
  background-color: var(--primary);
  border: none;
  border-radius: 6px; /* Consistent radius */
  color: var(--primary-contrast, #fff); /* Contrast color */
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
=======
/* No additional custom styles needed as Bootstrap is used */
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
</style>