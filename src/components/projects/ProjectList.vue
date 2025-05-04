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
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--border-color);
}

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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 0.25rem;
}

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
</style>