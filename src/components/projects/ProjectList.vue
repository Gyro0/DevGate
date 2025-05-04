<template>
  <div class="project-list">
    <!-- Empty State -->
    <div v-if="projects.length === 0" class="text-center py-5">
      <div class="mb-3">
        <i class="fas fa-folder-open fa-3x text-muted"></i>
      </div>
      <h3 class="text-secondary">No Projects Found</h3>
      <p class="text-muted">Create your first project to get started or adjust your filters.</p>
    </div>

    <!-- Projects Table -->
    <div v-else class="table-responsive">
      <table class="table table-hover align-middle">
        <thead class="table-light">
          <tr>
            <th scope="col">Project</th>
            <th scope="col">Technologies</th>
            <th scope="col">Date Created</th>
            <th scope="col">Status</th>
            <th scope="col" class="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="project in projects" :key="project.id">
            <!-- Project Info -->
            <td>
              <div class="d-flex align-items-center">
                <img
                  v-if="project.imageUrl"
                  :src="project.imageUrl"
                  alt="Project Thumbnail"
                  class="rounded me-3"
                  style="width: 48px; height: 48px; object-fit: cover;"
                  @error="onImageError"
                />
                <div>
                  <div class="fw-bold text-truncate" style="max-width: 200px;">
                    {{ project.title }}
                  </div>
                  <small v-if="project.description" class="text-muted">
                    {{ truncateDescription(project.description) }}
                  </small>
                </div>
              </div>
            </td>

            <!-- Technologies -->
            <td>
              <div class="d-flex flex-wrap gap-2">
                <span
                  v-for="tech in project.techStack.slice(0, 2)"
                  :key="tech"
                  class="badge bg-primary"
                >
                  {{ tech }}
                </span>
                <span
                  v-if="project.techStack.length > 2"
                  class="badge bg-secondary"
                >
                  +{{ project.techStack.length - 2 }}
                </span>
              </div>
            </td>

            <!-- Date Created -->
            <td>
              <small class="text-muted">{{ formatDate(project.createdAt) }}</small>
            </td>

            <!-- Status -->
            <td>
              <span
                v-if="project.status"
                :class="['badge', getStatusClass(project.status)]"
              >
                {{ formatStatus(project.status) }}
              </span>
              <span v-else class="badge bg-light text-muted">—</span>
            </td>

            <!-- Actions -->
            <td class="text-end">
              <button
                @click="$emit('edit', project)"
                class="btn btn-sm btn-outline-primary me-2"
                title="Edit"
              >
                <i class="fas fa-pen"></i>
              </button>
              <button
                @click="$emit('delete', project)"
                class="btn btn-sm btn-outline-danger"
                title="Delete"
              >
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'ProjectList',
  props: {
    projects: {
      type: Array,
      required: true,
    },
  },
  emits: ['edit', 'delete'],
  setup() {
    const defaultImage = ref('/path/to/default-project.jpg');

    const formatDate = (timestamp) => {
      if (!timestamp) return 'N/A';
      const date = timestamp.seconds
        ? new Date(timestamp.seconds * 1000)
        : new Date(timestamp);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    };

    const formatStatus = (status) => {
      const statusMap = {
        active: 'Active',
        completed: 'Completed',
        paused: 'Paused',
        archived: 'Archived',
      };
      return statusMap[status] || status;
    };

    const getStatusClass = (status) => {
      const statusClassMap = {
        active: 'bg-success text-white',
        completed: 'bg-primary text-white',
        paused: 'bg-warning text-dark',
        archived: 'bg-secondary text-white',
      };
      return statusClassMap[status] || 'bg-light text-dark';
    };

    const truncateDescription = (text) => {
      if (!text || typeof text !== 'string') return '';
      return text.length > 50 ? `${text.substring(0, 50)}...` : text;
    };

    const onImageError = (e) => {
      e.target.src = defaultImage.value;
    };

    return {
      defaultImage,
      formatDate,
      formatStatus,
      getStatusClass,
      truncateDescription,
      onImageError,
    };
  },
};
</script>

<style scoped>
.table-responsive {
  background-color: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.table {
  margin-bottom: 0;
}

.badge {
  font-size: 0.75rem;
}

.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>