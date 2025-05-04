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
<<<<<<< HEAD
.project-list {
  width: 100%;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  background-color: var(--card-bg);
  border-radius: 12px;
  text-align: center;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: var(--bg-darker);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  border: 1px solid var(--border-color);
}

.empty-icon i {
  font-size: 1.5rem;
  color: var(--primary-color);
}

.empty-state h3 {
  margin: 0 0 0.5rem 0;
  color: var(--text-color);
  font-weight: 600;
}

.empty-state p {
  color: var(--text-secondary);
  margin: 0;
  font-size: 0.9rem;
}

.projects-table {
  width: 100%;
  border-collapse: collapse;
  background-color: var(--card-bg);
  border-radius: 12px;
=======
.table-responsive {
  background-color: #ffffff;
  border-radius: 8px;
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--border-color);
}

<<<<<<< HEAD
.projects-table th, 
.projects-table td {
  padding: 1.25rem;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.projects-table th {
  background-color: var(--bg-darker);
  color: var(--text-color);
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.projects-table tr:last-child td {
  border-bottom: none;
}

.projects-table tr:hover {
  background-color: var(--bg-darker);
}

.project-cell {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 40%;
}

.project-thumb {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  border: 1px solid var(--border-color);
  background-color: var(--bg-darker);
}

.project-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.projects-table tr:hover .project-thumb img {
  transform: scale(1.05);
}

.project-info {
  min-width: 0;
}

.project-title {
  font-weight: 600;
  color: var(--text-color);
=======
.table {
  margin-bottom: 0;
}

.badge {
  font-size: 0.75rem;
}

.text-truncate {
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 0.25rem;
}
<<<<<<< HEAD

.project-description {
  color: var(--text-secondary);
  font-size: 0.85rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tech-cell {
  width: 25%;
}

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tech-tag {
  background-color: var(--bg-darker);
  color: var(--text-color);
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8rem;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.tech-tag:hover {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
  transform: translateY(-2px);
}

.tech-more {
  background-color: var(--bg-darker);
  color: var(--text-secondary);
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8rem;
  border: 1px solid var(--border-color);
}

.date-cell {
  color: var(--text-secondary);
  font-size: 0.9rem;
  width: 15%;
}

.status-cell {
  width: 15%;
}

.status-badge {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-active {
  background-color: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.status-completed {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.status-paused {
  background-color: rgba(234, 179, 8, 0.1);
  color: #eab308;
}

.status-archived {
  background-color: rgba(107, 114, 128, 0.1);
  color: #6b7280;
}

.actions-cell {
  width: 10%;
}

.action-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-darker);
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--text-color);
  margin-right: 0.5rem;
}

.action-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 0 15px rgba(79, 70, 229, 0.3);
}

.edit-btn:hover {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.delete-btn:hover {
  background: #ef4444;
  color: white;
  border-color: #ef4444;
}

@media (max-width: 1024px) {
  .projects-table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
  
  .projects-table th,
  .projects-table td {
    min-width: 200px;
  }
}
=======
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
</style>