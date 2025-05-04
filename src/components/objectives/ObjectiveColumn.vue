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

.meta-item {
  display: flex;
  align-items: center;
}

.meta-item i {
  margin-right: 0.3rem;
}

.form-range {
  cursor: pointer;
}

.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>