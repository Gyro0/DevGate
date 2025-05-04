<template>
  <div class="project-card">
    <div class="card-image">
      <img 
        :src="project.imageUrl || '/default-project.jpg'" 
        :alt="project.title" 
        @error="onImageError"
      />
      <div class="card-overlay">
        <div class="card-actions">
          <button @click="$emit('edit', project)" class="action-btn edit-btn">
            <i class="fas fa-pen"></i>
          </button>
          <button @click="$emit('delete', project)" class="action-btn delete-btn">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
    
    <div class="card-content">
      <h3 class="project-title">{{ project.title }}</h3>
      
      <p v-if="project.description" class="project-description">
        {{ truncateDescription(project.description) }}
      </p>
      
      <div class="project-tech">
        <div v-for="tech in project.techStack.slice(0, 3)" :key="tech" class="tech-tag">
          {{ tech }}
        </div>
        <div v-if="project.techStack.length > 3" class="tech-more">
          +{{ project.techStack.length - 3 }}
        </div>
      </div>
      
      <div class="project-meta">
        <span class="meta-date">
          <i class="far fa-calendar"></i>
          {{ formatDate(project.createdAt) }}
        </span>
        <span v-if="project.status" :class="['meta-status', `status-${project.status}`]">
          {{ formatStatus(project.status) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'ProjectCard',
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  emits: ['edit', 'delete'],
  setup() {
    const defaultImage = ref('/default-project.png');

    // Format date for display
    const formatDate = (timestamp) => {
      if (!timestamp) return 'N/A';
      
      let date;
      if (timestamp.seconds) {
        date = new Date(timestamp.seconds * 1000);
      } else {
        date = new Date(timestamp);
      }
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
         return 'Invalid Date';
      }
      
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    };

    // Format project status
    const formatStatus = (status) => {
      const statusMap = {
        'active': 'Active',
        'completed': 'Completed',
        'paused': 'Paused',
        'archived': 'Archived'
      };
      
      return statusMap[status] || status;
    };

    // Truncate description text
    const truncateDescription = (text) => {
      if (!text) return '';
      if (text.length <= 100) return text;
      return text.substring(0, 100) + '...';
    };

    // Handle image loading errors
    const onImageError = (e) => {
      e.target.src = defaultImage.value;
    };

    return {
      defaultImage,
      formatDate,
      formatStatus,
      truncateDescription,
      onImageError
    };
  }
}
</script>

<style scoped>
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