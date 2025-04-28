<template>
  <div class="project-list">
    <div v-if="projects.length === 0" class="empty-state">
      <div class="empty-icon">
        <i class="fas fa-folder-open"></i>
      </div>
      <h3>No Projects Found</h3>
      <p>Create your first project to get started or adjust your filters.</p>
    </div>
    
    <table v-else class="projects-table">
      <thead>
        <tr>
          <th>Project</th>
          <th>Technologies</th>
          <th>Date Created</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="project in projects" :key="project.id">
          <td class="project-cell">
            <div class="project-thumb" v-if="project.imageUrl">
              <img :src="project.imageUrl" alt="" @error="onImageError" />
            </div>
            <div class="project-info">
              <div class="project-title">{{ project.title }}</div>
              <div v-if="project.description" class="project-description">
                {{ truncateDescription(project.description) }}
              </div>
            </div>
          </td>
          <td class="tech-cell">
            <div class="tech-stack">
              <div v-for="tech in project.techStack.slice(0, 2)" :key="tech" class="tech-tag">
                {{ tech }}
              </div>
              <div v-if="project.techStack.length > 2" class="tech-more">
                +{{ project.techStack.length - 2 }}
              </div>
            </div>
          </td>
          <td class="date-cell">
            {{ formatDate(project.createdAt) }}
          </td>
          <td class="status-cell">
            <span 
              v-if="project.status" 
              :class="['status-badge', `status-${project.status}`]"
            >
              {{ formatStatus(project.status) }}
            </span>
            <span v-else class="status-badge">—</span>
          </td>
          <td class="actions-cell">
            <button @click="$emit('edit', project)" class="action-btn edit-btn" title="Edit">
              <i class="fas fa-pen"></i>
            </button>
            <button @click="$emit('delete', project)" class="action-btn delete-btn" title="Delete">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ref } from 'vue'; // Removed defineProps, defineEmits

export default {
  name: 'ProjectList',
  props: {
    projects: {
      type: Array,
      required: true
    }
  },
  emits: ['edit', 'delete'],
  setup(props) { // props is automatically available here
    const defaultImage = ref('/path/to/default-project.jpg');

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
        'archived': 'Archived',
        'in-progress': 'In Progress', // Added for consistency
        'planning': 'Planning' // Added for consistency
      };
      
      return statusMap[status] || status;
    };

    // Truncate description text
    const truncateDescription = (text) => {
      if (!text || typeof text !== 'string') return ''; // Added check
      if (text.length <= 50) return text;
      return text.substring(0, 50) + '...';
    };

    // Handle image loading errors
    const onImageError = (e) => {
      e.target.src = defaultImage.value;
    };

    // Return everything needed by the template
    return {
      defaultImage,
      formatDate,
      formatStatus,
      truncateDescription,
      onImageError
      // props.projects is automatically available in the template
    };
  }
}
</script>

<style scoped>
.project-list {
  width: 100%;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  background-color: white;
  border-radius: 8px;
  text-align: center;
}

.empty-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.empty-icon i {
  font-size: 1.5rem;
  color: #9ca3af;
}

.empty-state h3 {
  margin: 0 0 0.5rem 0;
  color: #374151;
}

.empty-state p {
  color: #6b7280;
  margin: 0;
  font-size: 0.875rem;
}

.projects-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.projects-table th, 
.projects-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #f3f4f6;
}

.projects-table th {
  background-color: #f9fafb;
  color: #4b5563;
  font-weight: 500;
  font-size: 0.875rem;
}

.projects-table tr:last-child td {
  border-bottom: none;
}

.project-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 40%;
}

.project-thumb {
  width: 48px;
  height: 48px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
}

.project-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.project-info {
  min-width: 0;
}

.project-title {
  font-weight: 500;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.project-description {
  font-size: 0.875rem;
  color: #6b7280;
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
  background-color: #f3f4f6;
  color: #4b5563;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  white-space: nowrap;
}

.tech-more {
  background-color: #e5e7eb;
  color: #6b7280;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
}

.date-cell {
  width: 15%;
  font-size: 0.875rem;
  color: #6b7280;
}

.status-cell {
  width: 10%;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  text-align: center;
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

.actions-cell {
  width: 10%;
  white-space: nowrap;
  text-align: right;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #6b7280;
  margin-left: 0.25rem;
}

.edit-btn:hover {
  background-color: #f3f4f6;
  color: #4f46e5;
}

.delete-btn:hover {
  background-color: #fee2e2;
  color: #ef4444;
}

@media (max-width: 768px) {
  .projects-table {
    display: block;
    overflow-x: auto;
  }
}
</style>