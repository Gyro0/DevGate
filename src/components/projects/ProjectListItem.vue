<template>
  <div class="project-list-item">
    <div class="project-main">
      <div class="project-thumb" v-if="project.imageUrl">
        <img 
          :src="project.imageUrl" 
          :alt="project.title" 
          @error="onImageError" 
        />
      </div>
      <div class="project-info">
        <h3 class="project-title">{{ project.title }}</h3>
        <p v-if="project.description" class="project-description">
          {{ truncateDescription(project.description) }}
        </p>
        <div class="project-tech">
          <span v-for="tech in project.techStack.slice(0, 4)" :key="tech" class="tech-tag">
            {{ tech }}
          </span>
          <span v-if="project.techStack.length > 4" class="tech-more">
            +{{ project.techStack.length - 4 }}
          </span>
        </div>
      </div>
    </div>
    
    <div class="project-meta">
      <div class="meta-item">
        <span class="meta-label">Created</span>
        <span class="meta-value">{{ formatDate(project.createdAt) }}</span>
      </div>
      
      <div class="meta-item">
        <span class="meta-label">Status</span>
        <span :class="['status-badge', `status-${project.status}`]">
          {{ formatStatus(project.status) }}
        </span>
      </div>
      
      <div class="project-actions">
        <button @click="$emit('edit', project)" class="action-btn edit-btn" title="Edit">
          <i class="fas fa-pen"></i>
        </button>
        <button @click="$emit('delete', project)" class="action-btn delete-btn" title="Delete">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'ProjectListItem',
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
      if (text.length <= 50) return text;
      return text.substring(0, 50) + '...';
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
.project-list-item {
  background-color: var(--card-bg);
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.project-list-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  opacity: 0.7;
}

.project-list-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2),
              0 0 0 1px var(--primary-color),
              0 0 20px rgba(79, 70, 229, 0.2);
}

.project-main {
  display: flex;
  margin-bottom: 1.25rem;
}

.project-thumb {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  margin-right: 1.25rem;
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

.project-list-item:hover .project-thumb img {
  transform: scale(1.05);
}

.project-info {
  flex: 1;
}

.project-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  color: var(--text-color);
  font-weight: 600;
}

.project-description {
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

.project-tech {
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

.project-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.25rem;
  border-top: 1px solid var(--border-color);
}

.meta-item {
  display: flex;
  flex-direction: column;
}

.meta-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-bottom: 0.25rem;
}

.meta-value {
  font-size: 0.875rem;
  color: var(--text-color);
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

.project-actions {
  display: flex;
  gap: 0.75rem;
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
</style>