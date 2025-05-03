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
  background-color: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.project-main {
  display: flex;
  margin-bottom: 1rem;
}

.project-thumb {
  width: 80px;
  height: 80px;
  border-radius: 6px;
  overflow: hidden;
  margin-right: 1rem;
  flex-shrink: 0;
}

.project-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.project-info {
  flex: 1;
}

.project-title {
  margin: 0 0 0.25rem 0;
  font-size: 1.125rem;
  color: #111827;
}

.project-description {
  margin: 0 0 0.75rem 0;
  font-size: 0.875rem;
  color: #6b7280;
}

.project-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tech-tag {
  background-color: #f3f4f6;
  color: #4b5563;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
}

.tech-more {
  background-color: #e5e7eb;
  color: #6b7280;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
}

.project-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.meta-item {
  display: flex;
  flex-direction: column;
}

.meta-label {
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.meta-value {
  font-size: 0.875rem;
  color: #4b5563;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  text-transform: capitalize;
}

.status-active {
  background-color: #dcfce7;
  color: #16a34a;
}

.status-completed {
  background-color: #dbeafe;
  color: #2563eb;
}

.status-paused {
  background-color: #fef3c7;
  color: #d97706;
}

.status-archived {
  background-color: #f3f4f6;
  color: #6b7280;
}

.project-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.edit-btn:hover {
  background-color: #f3f4f6;
  color: #4f46e5;
}

.delete-btn:hover {
  background-color: #fee2e2;
  color: #ef4444;
}
</style>