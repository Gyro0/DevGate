<template>
  <div class="project-gallery">
    <!-- Empty State -->
    <div v-if="projects.length === 0" class="text-center py-5">
      <div class="mb-3">
        <i class="fas fa-folder-open fa-3x text-muted"></i>
      </div>
      <h3 class="text-secondary">No Projects Found</h3>
      <p class="text-muted">Create your first project to get started or adjust your filters.</p>
    </div>

    <!-- Gallery Grid -->
    <div v-else class="row g-4">
      <div
        v-for="project in projects"
        :key="project.id"
        class="col-md-6 col-lg-4"
      >
        <div class="card shadow-sm border-0 h-100">
          <!-- Project Image -->
          <div class="card-img-top position-relative">
            <img
              :src="project.imageUrl || defaultImage"
              :alt="project.title"
              class="img-fluid"
              @error="onImageError"
            />
            <div class="card-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50 opacity-0 hover-opacity">
              <div class="d-flex gap-2">
                <button
                  @click="$emit('edit', project)"
                  class="btn btn-light btn-sm"
                  title="Edit Project"
                >
                  <i class="fas fa-pen"></i>
                </button>
                <button
                  @click="$emit('delete', project)"
                  class="btn btn-danger btn-sm"
                  title="Delete Project"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Card Content -->
          <div class="card-body">
            <h5 class="card-title text-truncate">{{ project.title }}</h5>
            <p v-if="project.description" class="card-text text-muted">
              {{ truncateDescription(project.description) }}
            </p>
            <div class="d-flex flex-wrap gap-2 mb-3">
              <span
                v-for="tech in project.techStack.slice(0, 3)"
                :key="tech"
                class="badge bg-primary"
              >
                {{ tech }}
              </span>
              <span
                v-if="project.techStack.length > 3"
                class="badge bg-secondary"
              >
                +{{ project.techStack.length - 3 }}
              </span>
            </div>
            <div class="d-flex justify-content-between text-muted small">
              <span>
                <i class="far fa-calendar me-1"></i>
                {{ formatDate(project.createdAt) }}
              </span>
              <span
                v-if="project.status"
                :class="['badge', getStatusClass(project.status)]"
              >
                {{ formatStatus(project.status) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'ProjectGallery',
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
      return text.length > 100 ? `${text.substring(0, 100)}...` : text;
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
.card-img-top {
  height: 200px;
  overflow: hidden;
}

.card-img-top img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-overlay {
  transition: opacity 0.3s ease-in-out;
}

.hover-opacity:hover {
  opacity: 1 !important;
}

.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>