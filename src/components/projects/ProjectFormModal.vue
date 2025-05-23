<template>
    <div class="modal-backdrop" @click.self="$emit('close')">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ isEditing ? 'Edit Project' : 'Add New Project' }}</h3>
          <button @click="$emit('close')" class="modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <form @submit.prevent="submitForm">
            <div class="form-group">
              <label for="project-title">Project Title *</label>
              <input 
                type="text" 
                id="project-title" 
                v-model="formData.title" 
                required 
                placeholder="Enter project title"
              />
            </div>
            
            <div class="form-group">
              <label for="project-description">Description</label>
              <textarea 
                id="project-description" 
                v-model="formData.description" 
                rows="4" 
                placeholder="Describe your project"
              ></textarea>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="project-url">Project URL</label>
                <input 
                  type="url" 
                  id="project-url" 
                  v-model="formData.projectUrl" 
                  placeholder="https://example.com"
                />
              </div>
              
              <div class="form-group">
                <label for="project-status">Status</label>
                <select id="project-status" v-model="formData.status">
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="paused">Paused</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
            
            <div class="form-group">
              <label>Technologies Used *</label>
              <div class="tech-selection">
                <div class="selected-techs">
                  <div 
                    v-for="tech in formData.techStack" 
                    :key="tech" 
                    class="tech-tag"
                  >
                    {{ tech }}
                    <button type="button" @click="removeTech(tech)" class="remove-tech">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </div>
                
                <div class="tech-input-wrapper">
                  <input 
                    type="text" 
                    placeholder="Add a technology..." 
                    v-model="techInput"
                    @keydown.enter.prevent="addTech"
                  />
                  <button 
                    type="button" 
                    @click="addTech" 
                    class="add-tech-btn"
                    :disabled="!techInput.trim()"
                  >
                    Add
                  </button>
                </div>
                
                <div class="tech-suggestions">
                  <button 
                    v-for="tech in filteredSuggestions" 
                    :key="tech" 
                    type="button" 
                    class="suggestion-btn"
                    @click="addSuggestion(tech)"
                  >
                    {{ tech }}
                  </button>
                </div>
              </div>
            </div>
            
            <div class="form-group">
              <label for="project-image">Project Image</label>
              <div class="image-upload">
                <div v-if="imagePreview" class="image-preview">
                  <img :src="imagePreview" alt="Project Preview" />
                  <button type="button" @click="clearImage" class="clear-image">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
                <label v-else for="project-image" class="upload-area">
                  <i class="fas fa-cloud-upload-alt"></i>
                  <span>Click to upload image</span>
                </label>
                <input 
                  type="file" 
                  id="project-image" 
                  accept="image/*"
                  @change="handleImageUpload"
                  style="display: none;"
                />
              </div>
            </div>
            
            <div class="form-actions">
              <button type="submit" class="btn-primary">
                {{ isEditing ? 'Save Changes' : 'Create Project' }}
              </button>
              <button type="button" @click="$emit('close')" class="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
import { ref, reactive, computed, onMounted } from 'vue';

export default {
  name: 'ProjectFormModal',
  props: {
    project: {
      type: Object,
      default: null
    }
  },
  emits: ['save', 'close'],
  setup(props, { emit }) {
    // Check if we're editing an existing project
    const isEditing = computed(() => !!props.project);

    // Form data initialization
    const formData = reactive({
      title: '',
      description: '',
      projectUrl: '',
      status: 'active',
      techStack: []
    });

    // Image handling
    const imageFile = ref(null);
    const imagePreview = ref(null);

    // Tech input handling
    const techInput = ref('');
    const commonTechs = [
      'JavaScript', 'TypeScript', 'React', 'Vue', 'Angular', 
      'Node.js', 'Express', 'Python', 'Django', 'Flask', 
      'Ruby', 'Rails', 'PHP', 'Laravel', 'Java', 'Spring', 
      '.NET', 'C#', 'AWS', 'Firebase', 'Docker', 'Kubernetes'
    ];

    // Filter suggestions based on what's already selected and current input
    const filteredSuggestions = computed(() => {
      if (!techInput.value) return [];
      
      const input = techInput.value.toLowerCase();
      return commonTechs
        .filter(tech => !formData.techStack.includes(tech))
        .filter(tech => tech.toLowerCase().includes(input))
        .slice(0, 5);
    });

    // Initialize form data from existing project
    onMounted(() => {
      if (props.project) {
        formData.title = props.project.title || '';
        formData.description = props.project.description || '';
        formData.projectUrl = props.project.projectUrl || '';
        formData.status = props.project.status || 'active';
        formData.techStack = [...(props.project.techStack || [])];
        
        if (props.project.imageUrl) {
          imagePreview.value = props.project.imageUrl;
        }
      }
    });

    // Handle image upload
    const handleImageUpload = (event) => {
      const file = event.target.files[0];
      if (!file) return;
      
      imageFile.value = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreview.value = e.target.result;
      };
      reader.readAsDataURL(file);
    };

    const clearImage = () => {
      imageFile.value = null;
      imagePreview.value = null;
      // Reset the file input
      const fileInput = document.getElementById('project-image');
      if (fileInput) fileInput.value = '';
    };

    // Tech stack management
    const addTech = () => {
      const tech = techInput.value.trim();
      if (tech && !formData.techStack.includes(tech)) {
        formData.techStack.push(tech);
        techInput.value = '';
      }
    };

    const addSuggestion = (tech) => {
      if (!formData.techStack.includes(tech)) {
        formData.techStack.push(tech);
        techInput.value = '';
      }
    };

    const removeTech = (tech) => {
      formData.techStack = formData.techStack.filter(t => t !== tech);
    };

    // Form submission
    const submitForm = () => {
      // Validate form data
      if (!formData.title) return;
      if (formData.techStack.length === 0) return;
      
      // Emit save event with form data and image file
      emit('save', { ...formData }, imageFile.value);
    };

    // Return everything needed by the template
    return {
      isEditing,
      formData,
      imageFile,
      imagePreview,
      techInput,
      filteredSuggestions,
      handleImageUpload,
      clearImage,
      addTech,
      addSuggestion,
      removeTech,
      submitForm
    };
  }
}
</script>
  
  <style scoped>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7); /* Keep backdrop dark */
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(4px);
  }

  .modal-content {
    background-color: var(--surface-card, #2a2a2e); /* Use surface-card variable */
    border-radius: 12px;
    width: 90%;
    max-width: 700px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    border: 1px solid var(--border-color, #444); /* Use border-color variable */
    position: relative;
  }

  .modal-content::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    /* Use primary/secondary variables if defined, otherwise fallback */
    background: linear-gradient(90deg, var(--primary, #4f46e5), var(--secondary, #7c3aed));
    opacity: 0.7;
  }

  .modal-header {
    padding: 1.5rem;
    border-bottom: 1px solid var(--border-color, #444); /* Use border-color variable */
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .modal-header h3 {
    margin: 0;
    color: var(--primary, #4f46e5); /* Use primary color for header */
    font-size: 1.5rem;
    font-weight: 700; /* Make header bolder */
    text-shadow: 0 0 6px var(--primary-glow, rgba(79, 70, 229, 0.5)); /* Add glow if variable exists */
  }

  .modal-close {
    background: transparent;
    border: none;
    color: var(--text-secondary, #ccc); /* Use text-secondary variable */
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    transition: all 0.3s ease;
  }

  .modal-close:hover {
    background-color: var(--surface-hover, #3a3a3e); /* Use surface-hover variable */
    color: var(--text, #fff); /* Use text variable */
    transform: rotate(90deg);
  }

  .modal-body {
    padding: 1.5rem;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--text, #e0e0e0); /* Use text variable */
    font-weight: 600; /* Make labels bolder, matching table headers */
    font-size: 0.95rem; /* Slightly adjust size if needed */
    text-transform: uppercase; /* Match table header style */
    letter-spacing: 0.05em; /* Match table header style */
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  input, textarea, select {
    width: 100%;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    border: 1px solid var(--border-color, #444); /* Use border-color variable */
    background-color: var(--surface-ground, #1e1e20); /* Use surface-ground or bg-darker */
    color: var(--text, #e0e0e0); /* Use text variable */
    font-size: 0.9rem;
    transition: all 0.3s ease;
  }

  input:focus, textarea:focus, select:focus {
    outline: none;
    border-color: var(--primary, #4f46e5); /* Use primary variable */
    box-shadow: 0 0 0 2px var(--primary-glow, rgba(79, 70, 229, 0.2)); /* Use primary-glow variable */
  }

  input::placeholder, textarea::placeholder {
    color: var(--text-secondary, #aaa); /* Use text-secondary variable */
  }

  .tech-selection {
    background-color: var(--surface-ground, #1e1e20); /* Use surface-ground or bg-darker */
    border-radius: 8px;
    padding: 1rem;
    border: 1px solid var(--border-color, #444); /* Use border-color variable */
  }

  .selected-techs {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .tech-tag {
    background-color: var(--surface-section, #333); /* Use surface-section or card-bg */
    color: var(--text, #e0e0e0); /* Use text variable */
    padding: 0.35rem 0.75rem;
    border-radius: 6px;
    font-size: 0.8rem;
    border: 1px solid var(--border-color, #444); /* Use border-color variable */
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .remove-tech {
    background: transparent;
    border: none;
    color: var(--text-secondary, #ccc); /* Use text-secondary variable */
    cursor: pointer;
    padding: 0;
    font-size: 0.8rem;
    transition: color 0.3s ease;
  }

  .remove-tech:hover {
    color: #ef4444; /* Keep danger color */
  }

  .tech-input-wrapper {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .tech-input-wrapper input {
    flex: 1;
  }

  .add-tech-btn {
    background-color: var(--primary, #4f46e5); /* Use primary variable */
    color: white;
    border: none;
    padding: 0 1rem;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .add-tech-btn:hover:not(:disabled) {
    background-color: var(--primary-dark, #4338ca); /* Use primary-dark variable if exists */
    transform: translateY(-1px);
  }

  .add-tech-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .tech-suggestions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .suggestion-btn {
    background-color: var(--surface-section, #333); /* Use surface-section or card-bg */
    color: var(--text, #e0e0e0); /* Use text variable */
    border: 1px solid var(--border-color, #444); /* Use border-color variable */
    padding: 0.35rem 0.75rem;
    border-radius: 6px;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .suggestion-btn:hover {
    background-color: var(--primary, #4f46e5); /* Use primary variable */
    color: white;
    border-color: var(--primary, #4f46e5); /* Use primary variable */
    transform: translateY(-1px);
  }

  .image-upload {
    background-color: var(--surface-ground, #1e1e20); /* Use surface-ground or bg-darker */
    border-radius: 8px;
    padding: 1rem;
    border: 1px solid var(--border-color, #444); /* Use border-color variable */
  }

  .image-preview {
    position: relative;
    width: 100%;
    height: 200px;
    border-radius: 8px;
    overflow: hidden;
  }

  .image-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .clear-image {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    border: none;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .clear-image:hover {
    background-color: #ef4444; /* Keep danger color */
    transform: scale(1.1);
  }

  .upload-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 200px;
    border: 2px dashed var(--border-color, #444); /* Use border-color variable */
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .upload-area:hover {
    border-color: var(--primary, #4f46e5); /* Use primary variable */
    background-color: var(--surface-hover, rgba(79, 70, 229, 0.05)); /* Use surface-hover variable */
  }

  .upload-area i {
    font-size: 2rem;
    color: var(--primary, #4f46e5); /* Use primary variable */
    margin-bottom: 0.5rem;
  }

  .upload-area span {
    color: var(--text-secondary, #aaa); /* Use text-secondary variable */
    font-size: 0.9rem;
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem;
  }

  .btn-primary {
    background-color: var(--primary, #4f46e5); /* Use primary variable */
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600; /* Match label weight */
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 0 8px var(--primary-glow, rgba(79, 70, 229, 0.5)); /* Add glow */
  }

  .btn-primary:hover {
    background-color: var(--primary-dark, #4338ca); /* Use primary-dark variable if exists */
    transform: translateY(-2px);
    box-shadow: 0 4px 12px var(--primary-glow, rgba(79, 70, 229, 0.3)); /* Enhance glow */
  }

  .btn-secondary {
    background-color: var(--surface-section, #333); /* Use surface-section or similar */
    color: var(--text, #e0e0e0); /* Use text variable */
    border: 1px solid var(--border-color, #444); /* Use border-color variable */
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600; /* Match label weight */
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .btn-secondary:hover {
    background-color: var(--surface-hover, #3a3a3e); /* Use surface-hover variable */
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  </style>