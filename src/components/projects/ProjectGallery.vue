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
<<<<<<< HEAD
  
  <style scoped>
  .project-gallery {
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
  
  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }
  
  .project-card {
    background-color: var(--card-bg);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    border: 1px solid var(--border-color);
    position: relative;
  }
  
  .project-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
    opacity: 0.7;
  }
  
  .project-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2),
                0 0 0 1px var(--primary-color),
                0 0 20px rgba(79, 70, 229, 0.2);
  }
  
  .card-image {
    position: relative;
    width: 100%;
    height: 180px;
    background-color: var(--bg-darker);
    overflow: hidden;
  }
  
  .card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  .project-card:hover .card-image img {
    transform: scale(1.05);
  }
  
  .card-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    backdrop-filter: blur(2px);
  }
  
  .project-card:hover .card-overlay {
    opacity: 1;
  }
  
  .card-actions {
    display: flex;
    gap: 1rem;
  }
  
  .action-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    cursor: pointer;
    transition: all 0.3s ease;
    color: var(--text-color);
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
  
  .card-content {
    padding: 1.5rem;
  }
  
  .project-title {
    margin: 0 0 0.75rem 0;
    font-size: 1.25rem;
    color: var(--text-color);
    font-weight: 600;
  }
  
  .project-description {
    color: var(--text-secondary);
    font-size: 0.9rem;
    margin-bottom: 1.25rem;
    line-height: 1.6;
  }
  
  .project-tech {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1.25rem;
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
  
  .project-meta {
    display: flex;
    justify-content: space-between;
    font-size: 0.8rem;
    color: var(--text-secondary);
    padding-top: 0.75rem;
    border-top: 1px solid var(--border-color);
  }
  
  .meta-date {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .meta-date i {
    color: var(--primary-color);
  }
  
  .meta-status {
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
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
  </style>
=======

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
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
