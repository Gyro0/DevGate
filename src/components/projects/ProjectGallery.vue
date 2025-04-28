<template>
    <div class="project-gallery">
      <div v-if="projects.length === 0" class="empty-state">
        <div class="empty-icon">
          <i class="fas fa-folder-open"></i>
        </div>
        <h3>No Projects Found</h3>
        <p>Create your first project to get started or adjust your filters.</p>
      </div>
      
      <div v-else class="gallery-grid">
        <div 
          v-for="project in projects" 
          :key="project.id" 
          class="project-card"
        >
          <div class="card-image">
            <img 
              :src="project.imageUrl || defaultImage" 
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
      </div>
    </div>
  </template>
  
  <script>
import { ref } from 'vue'; // Removed defineProps, defineEmits

export default {
  name: 'ProjectGallery',
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
        'in-progress': 'In Progress', // Added for consistency if used elsewhere
        'planning': 'Planning' // Added for consistency if used elsewhere
      };
      
      return statusMap[status] || status;
    };

    // Truncate description text
    const truncateDescription = (text) => {
      if (!text || typeof text !== 'string') return ''; // Added check for null/undefined/non-string
      if (text.length <= 100) return text;
      return text.substring(0, 100) + '...';
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
  .project-gallery {
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
  
  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }
  
  .project-card {
    background-color: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .project-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
  
  .card-image {
    position: relative;
    width: 100%;
    height: 160px;
    background-color: #f3f4f6;
  }
  
  .card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .card-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s;
  }
  
  .card-image:hover .card-overlay {
    opacity: 1;
  }
  
  .card-actions {
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
    background: white;
    border: none;
    cursor: pointer;
    transition: transform 0.2s;
  }
  
  .action-btn:hover {
    transform: scale(1.1);
  }
  
  .edit-btn {
    color: #4f46e5;
  }
  
  .delete-btn {
    color: #ef4444;
  }
  
  .card-content {
    padding: 1.25rem;
  }
  
  .project-title {
    margin: 0 0 0.5rem 0;
    font-size: 1.1rem;
    color: #111827;
  }
  
  .project-description {
    color: #6b7280;
    font-size: 0.875rem;
    margin-bottom: 1rem;
    line-height: 1.5;
  }
  
  .project-tech {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
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
    font-size: 0.75rem;
    color: #6b7280;
  }
  
  .meta-date {
    display: flex;
    align-items: center;
  }
  
  .meta-date i {
    margin-right: 0.25rem;
  }
  
  .meta-status {
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
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
  </style>