<template>
  <div class="objective-column card shadow-sm border-0">
    <!-- Column Title -->
    <div class="card-header bg-light">
      <h5 class="card-title mb-0">{{ title }} ({{ objectives.length }})</h5>
    </div>

    <!-- Column Content -->
    <div class="card-body p-3">
      <div v-if="objectives.length > 0">
        <div
          v-for="objective in objectives"
          :key="objective.id"
          class="objective-card card mb-3 shadow-sm border-0"
        >
          <!-- Card Header -->
          <div class="card-header d-flex justify-content-between align-items-start">
            <h6 class="objective-title mb-0 text-truncate">{{ objective.title }}</h6>
            <div class="card-actions">
              <button
                @click="$emit('edit', objective)"
                class="btn btn-sm btn-outline-primary me-2"
                title="Edit"
              >
                <i class="fas fa-pen"></i>
              </button>
              <button
                @click="$emit('delete', objective)"
                class="btn btn-sm btn-outline-danger"
                title="Delete"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>

          <!-- Card Body -->
          <div class="card-body">
            <p class="objective-description text-muted mb-2">
              {{ objective.description || 'No description provided.' }}
            </p>
            <div class="objective-meta d-flex flex-wrap gap-3 small text-muted">
              <div v-if="objective.deadline" class="meta-item">
                <i class="fas fa-calendar me-1"></i> Due {{ formatDate(objective.deadline) }}
              </div>
              <div
                v-if="objective.priority"
                class="meta-item"
                :class="getPriorityClass(objective.priority)"
              >
                <i class="fas fa-flag me-1"></i> {{ capitalize(objective.priority) }}
              </div>
            </div>
          </div>

          <!-- Progress Section -->
          <div v-if="objective.status !== 'completed'" class="card-footer bg-light">
            <label :for="`progress-${objective.id}`" class="form-label small">
              Progress: {{ objective.progress || 0 }}%
            </label>
            <input
              type="range"
              :id="`progress-${objective.id}`"
              :value="objective.progress || 0"
              @input="updateProgress($event, objective.id)"
              min="0"
              max="100"
              step="10"
              class="form-range"
            />
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center text-muted py-4">
        <i class="fas fa-inbox fa-2x mb-3"></i>
        <p>No objectives in this stage.</p>
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
      required: true,
    },
    objectives: {
      type: Array,
      required: true,
      default: () => [],
    },
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
        day: 'numeric',
      });
    };

    // Capitalize text
    const capitalize = (text) => {
      if (!text) return '';
      return text.charAt(0).toUpperCase() + text.slice(1);
    };

    // Get priority class
    const getPriorityClass = (priority) => {
      const priorityClasses = {
        high: 'text-danger',
        medium: 'text-warning',
        low: 'text-success',
      };
      return priorityClasses[priority] || 'text-muted';
    };

    // Emit progress update event
    const updateProgress = (event, objectiveId) => {
      emit('update-progress', objectiveId, parseInt(event.target.value));
    };

    return {
      formatDate,
      capitalize,
      getPriorityClass,
      updateProgress,
    };
  },
};
</script>

<style scoped>
.objective-column {
<<<<<<< HEAD
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

=======
  border-radius: 8px;
  overflow: hidden;
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
}

.objective-card {
  border-radius: 8px;
}

.objective-title {
  font-size: 0.9rem;
  font-weight: 500;
}

.objective-description {
  font-size: 0.875rem;
  line-height: 1.5;
}

>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
.meta-item {
  display: flex;
  align-items: center;
}

.meta-item i {
  margin-right: 0.3rem;
}

<<<<<<< HEAD
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
=======
.form-range {
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
  cursor: pointer;
  accent-color: var(--primary);
  background: var(--surface-card);
  border-radius: 1rem;
  height: 4px;
  margin-top: 0.2rem;
}

<<<<<<< HEAD
.empty-column {
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.95rem;
  padding: 2rem 0;
  background: transparent;
  border-radius: 0.8rem;
=======
.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
}
</style>