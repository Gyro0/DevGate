<template>
  <div class="objectives-widget">
    <div class="widget-header">
      <h2>Objectives</h2>
      <router-link to="/objectives" class="view-all">View All</router-link>
    </div>
    
    <div class="objectives-content" v-if="!loading">
      <div v-if="objectives.length > 0" class="objectives-container">
        <div class="progress-overview">
          <div class="progress-container">
            <div class="progress-label">
              <span>{{ completionPercentage }}%</span>
              <span>Complete</span>
            </div>
            <div class="progress-bar">
              <div 
                class="progress-value" 
                :style="{ width: `${completionPercentage}%` }"
              ></div>
            </div>
          </div>
          <div class="objectives-stats">
            <div class="stat-item">
              <div class="stat-value">{{ objectives.length }}</div>
              <div class="stat-label">Total</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ completedObjectives.length }}</div>
              <div class="stat-label">Complete</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ inProgressObjectives.length }}</div>
              <div class="stat-label">In Progress</div>
            </div>
          </div>
        </div>
        
        <h3>Current Goals</h3>
        <ul class="objectives-list">
          <li v-for="objective in activeObjectives" :key="objective.id" class="objective-item">
            <div class="objective-info">
              <div class="objective-title">{{ objective.title }}</div>
              <div class="objective-meta">
                <div v-if="objective.deadline" class="deadline">
                  <i class="fas fa-calendar"></i> Due {{ formatDate(objective.deadline) }}
                </div>
                <div v-if="objective.progress" class="objective-progress">
                  <div class="progress-bar">
                    <div 
                      class="progress-value" 
                      :style="{ width: `${objective.progress}%` }"
                    ></div>
                  </div>
                  <span>{{ objective.progress }}%</span>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      
      <div v-else class="empty-state">
        <div class="empty-icon">
          <i class="fas fa-bullseye"></i>
        </div>
        <h3>No objectives yet</h3>
        <p>Set clear objectives to guide your development journey.</p>
        <router-link to="/objectives" class="add-btn">
          <i class="fas fa-plus"></i> Add Objective
        </router-link>
      </div>
    </div>
    
    <div v-else class="loading-state">
      <div class="spinner"></div>
      <span>Loading objectives...</span>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import useObjectives from '@/composables/useObjectives';

export default {
  name: 'ObjectivesProgressWidget',
  setup() {
    const { objectives, loading } = useObjectives();

    // Computed properties
    const completedObjectives = computed(() => {
      return objectives.value.filter(o => o.status === 'completed');
    });

    const inProgressObjectives = computed(() => {
      return objectives.value.filter(o => o.status === 'in-progress');
    });

    const activeObjectives = computed(() => {
      // Sort in-progress first, then planned, limit to 4
      return [...inProgressObjectives.value, 
              ...objectives.value.filter(o => o.status === 'planned')]
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

    const completionPercentage = computed(() => {
      if (objectives.value.length === 0) return 0;
      return Math.round((completedObjectives.value.length / objectives.value.length) * 100);
    });

    // Format date for display
    const formatDate = (timestamp) => {
      if (!timestamp) return 'No deadline';
      
      const date = timestamp?.seconds 
        ? new Date(timestamp.seconds * 1000) 
        : new Date(timestamp);
        
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    };

    return {
      objectives,
      loading,
      completedObjectives,
      inProgressObjectives,
      activeObjectives,
      completionPercentage,
      formatDate
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

.objectives-content {
  flex: 1;
}

.objectives-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.progress-overview {
  margin-bottom: 1.5rem;
}

.progress-container {
  margin-bottom: 1rem;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.progress-bar {
  height: 8px;
  background-color: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.progress-value {
  height: 100%;
  background-color: #4f46e5;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.objectives-stats {
  display: flex;
  justify-content: space-between;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 600;
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

.objectives-list {
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
  overflow-y: auto;
}

.objective-item {
  display: flex;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e5e7eb;
}

.objective-item:last-child {
  border-bottom: none;
}

.objective-info {
  flex: 1;
}

.objective-title {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.objective-meta {
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  color: #6b7280;
}

.deadline {
  margin-right: 1rem;
}

.deadline i {
  margin-right: 0.25rem;
}

.objective-progress {
  display: flex;
  align-items: center;
  width: 100px; /* Example width */
}

.objective-progress .progress-bar {
  height: 6px;
  flex: 1;
  margin-right: 0.5rem;
}

.objective-progress .progress-value {
  background-color: #34d399; /* Example color */
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
</style>