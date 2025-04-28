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
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    background-color: white;
    border-radius: 8px;
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .modal-header h3 {
    margin: 0;
    font-size: 1.25rem;
    color: #111827;
  }
  
  .modal-close {
    background: none;
    border: none;
    font-size: 1.25rem;
    color: #6b7280;
    cursor: pointer;
  }
  
  .modal-body {
    padding: 1.5rem;
  }
  
  .form-group {
    margin-bottom: 1.25rem;
  }
  
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
  }
  
  input, select, textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 0.875rem;
  }
  
  input:focus, select:focus, textarea:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }
  
  textarea {
    resize: vertical;
  }
  
  .tech-selection {
    border: 1px solid #d1d5db;
    border-radius: 6px;
    overflow: hidden;
  }
  
  .selected-techs {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: 0.75rem;
    background-color: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
    min-height: 56px;
  }
  
  .tech-tag {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    background-color: #4f46e5;
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
  }
  
  .remove-tech {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
  }
  
  .tech-input-wrapper {
    display: flex;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .tech-input-wrapper input {
    flex: 1;
    border: none;
    border-radius: 0;
  }
  
  .add-tech-btn {
    padding: 0.5rem 1rem;
    background-color: #f3f4f6;
    border: none;
    cursor: pointer;
    color: #4b5563;
    font-weight: 500;
  }
  
  .add-tech-btn:hover:not(:disabled) {
    background-color: #e5e7eb;
  }
  
  .add-tech-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .tech-suggestions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: 0.75rem;
    background-color: #f9fafb;
  }
  
  .suggestion-btn {
    background-color: #e5e7eb;
    border: none;
    color: #4b5563;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    cursor: pointer;
  }
  
  .suggestion-btn:hover {
    background-color: #d1d5db;
  }
  
  .image-upload {
    border: 1px solid #d1d5db;
    border-radius: 6px;
    overflow: hidden;
  }
  
  .upload-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
    cursor: pointer;
    background-color: #f9fafb;
  }
  
  .upload-area i {
    font-size: 2rem;
    color: #9ca3af;
    margin-bottom: 0.5rem;
  }
  
  .upload-area span {
    color: #6b7280;
    font-size: 0.875rem;
  }
  
  .image-preview {
    position: relative;
    height: 200px;
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
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem;
  }
  
  .btn-primary {
    background-color: #4f46e5;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
  }
  
  .btn-primary:hover {
    background-color: #4338ca;
  }
  
  .btn-secondary {
    border: 1px solid #d1d5db;
    background-color: white;
    color: #374151;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
  }
  
  .btn-secondary:hover {
    background-color: #f9fafb;
  }
  
  @media (max-width: 640px) {
    .form-row {
      grid-template-columns: 1fr;
    }
  }
  </style>