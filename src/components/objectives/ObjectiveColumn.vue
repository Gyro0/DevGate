<template>
  <div class="objective-column">
    <h2 class="column-title">{{ title }} ({{ objectives.length }})</h2>
    <div class="column-content">
      <div 
        v-for="objective in objectives" 
        :key="objective.id" 
        class="objective-card"
      >
        <div class="card-header">
          <h3 class="objective-title">{{ objective.title }}</h3>
          <div class="card-actions">
            <button @click="$emit('edit', objective)" class="action-btn edit-btn">
              <i class="fas fa-pen"></i>
            </button>
            <button @click="$emit('delete', objective)" class="action-btn delete-btn">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
        
        <p class="objective-description">{{ objective.description }}</p>
        
        <div class="objective-meta">
          <div v-if="objective.deadline" class="meta-item deadline">
            <i class="fas fa-calendar"></i> Due {{ formatDate(objective.deadline) }}
          </div>
          <div v-if="objective.priority" class="meta-item priority" :class="`priority-${objective.priority}`">
            <i class="fas fa-flag"></i> {{ objective.priority }}
          </div>
        </div>
        
        <div v-if="objective.status !== 'completed'" class="progress-section">
          <label :for="`progress-${objective.id}`">Progress: {{ objective.progress || 0 }}%</label>
          <input 
            type="range" 
            :id="`progress-${objective.id}`" 
            :value="objective.progress || 0" 
            @input="updateProgress($event, objective.id)"
            min="0" 
            max="100" 
            step="10"
            class="progress-slider"
          />
        </div>
      </div>
      
      <div v-if="objectives.length === 0" class="empty-column">
        No objectives in this stage.
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ObjectiveColumn',
  props: {
    title: {
      type: String,
      required: true
    },
    objectives: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  emits: ['edit', 'delete', 'update-progress'],
  setup(props, { emit }) {
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

    // Emit progress update event
    const updateProgress = (event, objectiveId) => {
      emit('update-progress', objectiveId, parseInt(event.target.value));
    };

    // Return methods
    return {
      formatDate,
      updateProgress
    };
  }
}
</script>

<style scoped>
.objective-column {
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.column-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.column-content {
  flex: 1;
  overflow-y: auto;
  padding-right: 0.5rem; /* For scrollbar */
}

.objective-card {
  background-color: #ffffff;
  border-radius: 6px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  padding: 1rem;
  margin-bottom: 1rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.objective-title {
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
  flex: 1;
  margin-right: 0.5rem;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  padding: 0.25rem;
}

.action-btn:hover {
  color: #111827;
}

.edit-btn:hover {
  color: #4f46e5;
}

.delete-btn:hover {
  color: #ef4444;
}

.objective-description {
  font-size: 0.875rem;
  color: #4b5563;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.objective-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 1rem;
}

.meta-item {
  display: flex;
  align-items: center;
}

.meta-item i {
  margin-right: 0.3rem;
}

.priority-high { color: #ef4444; }
.priority-medium { color: #f59e0b; }
.priority-low { color: #10b981; }

.progress-section {
  margin-top: 1rem;
}

.progress-section label {
  display: block;
  font-size: 0.75rem;
  margin-bottom: 0.25rem;
  color: #6b7280;
}

.progress-slider {
  width: 100%;
  cursor: pointer;
}

.empty-column {
  text-align: center;
  color: #9ca3af;
  font-size: 0.875rem;
  padding: 2rem 0;
}
</style>