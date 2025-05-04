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
  background: var(--surface);
  border-radius: 1.1rem;
  box-shadow: 0 2px 16px 0 rgba(0,0,0,0.18), 0 0 0 2px var(--primary-glow), 0 0 8px 2px var(--circuit-accent);
  padding: 1.2rem 1rem;
  display: flex;
  flex-direction: column;
  border: 1.5px solid var(--border-color);
}

.column-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1.5px solid var(--border-color);
  color: var(--primary);
  text-shadow: 0 0 8px var(--primary-glow);
}

.column-content {
  flex: 1;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.objective-card {
  background: var(--surface);
  border-radius: 0.8rem;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.14), 0 0 0 1.5px var(--primary-glow);
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1.5px solid var(--border-color);
  color: var(--text-color);
  transition: box-shadow 0.18s, border-color 0.18s;
}
.objective-card:hover {
  box-shadow: 0 0 16px 2px var(--primary-glow);
  border-color: var(--primary-glow);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.objective-title {
  font-size: 1.08rem;
  font-weight: 700;
  margin: 0;
  flex: 1;
  margin-right: 0.5rem;
  color: var(--secondary);
  text-shadow: 0 0 8px var(--primary-glow);
}

.card-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--highlight);
  padding: 0.25rem;
  font-size: 1.1rem;
  transition: color 0.18s;
}
.action-btn:hover {
  color: var(--primary-glow);
}
.edit-btn:hover {
  color: var(--primary);
}
.delete-btn:hover {
  color: #ff4d4f;
}

.objective-description {
  font-size: 0.97rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
  line-height: 1.5;
}

.objective-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.85rem;
  color: var(--highlight);
  margin-bottom: 1rem;
}

.meta-item {
  display: flex;
  align-items: center;
}

.meta-item i {
  margin-right: 0.3rem;
}

.priority-high { color: #ff4d4f; }
.priority-medium { color: #f59e0b; }
.priority-low { color: #10b981; }

.progress-section {
  margin-top: 1rem;
}

.progress-section label {
  display: block;
  font-size: 0.85rem;
  margin-bottom: 0.25rem;
  color: var(--highlight);
}

.progress-slider {
  width: 100%;
  cursor: pointer;
  accent-color: var(--primary);
  background: var(--surface-card);
  border-radius: 1rem;
  height: 4px;
  margin-top: 0.2rem;
}

.empty-column {
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.95rem;
  padding: 2rem 0;
  background: transparent;
  border-radius: 0.8rem;
}
</style>