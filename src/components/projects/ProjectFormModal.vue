<template>
  <div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="projectFormModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h5 class="modal-title" id="projectFormModalLabel">
            {{ isEditing ? 'Edit Project' : 'Add New Project' }}
          </h5>
          <button type="button" class="btn-close" aria-label="Close" @click="$emit('close')"></button>
        </div>

        <!-- Modal Body -->
        <div class="modal-body">
          <form @submit.prevent="submitForm">
            <!-- Project Title -->
            <div class="mb-3">
              <label for="project-title" class="form-label">Project Title *</label>
              <input
                type="text"
                id="project-title"
                v-model="formData.title"
                class="form-control"
                required
                placeholder="Enter project title"
              />
            </div>

            <!-- Project Description -->
            <div class="mb-3">
              <label for="project-description" class="form-label">Description</label>
              <textarea
                id="project-description"
                v-model="formData.description"
                class="form-control"
                rows="4"
                placeholder="Describe your project"
              ></textarea>
            </div>

            <!-- Project URL and Status -->
            <div class="row g-3">
              <div class="col-md-6">
                <label for="project-url" class="form-label">Project URL</label>
                <input
                  type="url"
                  id="project-url"
                  v-model="formData.projectUrl"
                  class="form-control"
                  placeholder="https://example.com"
                />
              </div>
              <div class="col-md-6">
                <label for="project-status" class="form-label">Status</label>
                <select id="project-status" v-model="formData.status" class="form-select">
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="paused">Paused</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <!-- Technologies Used -->
            <div class="mb-3">
              <label class="form-label">Technologies Used *</label>
              <div class="d-flex flex-wrap gap-2 mb-2">
                <span
                  v-for="tech in formData.techStack"
                  :key="tech"
                  class="badge bg-primary d-flex align-items-center gap-2"
                >
                  {{ tech }}
                  <button type="button" class="btn-close btn-close-white" @click="removeTech(tech)"></button>
                </span>
              </div>
              <div class="input-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Add a technology..."
                  v-model="techInput"
                  @keydown.enter.prevent="addTech"
                />
                <button
                  type="button"
                  class="btn btn-outline-primary"
                  @click="addTech"
                  :disabled="!techInput.trim()"
                >
                  Add
                </button>
              </div>
              <div class="mt-2">
                <button
                  v-for="tech in filteredSuggestions"
                  :key="tech"
                  type="button"
                  class="btn btn-sm btn-outline-secondary me-2"
                  @click="addSuggestion(tech)"
                >
                  {{ tech }}
                </button>
              </div>
            </div>

            <!-- Project Image -->
            <div class="mb-3">
              <label for="project-image" class="form-label">Project Image</label>
              <div class="d-flex align-items-center">
                <div v-if="imagePreview" class="me-3">
                  <img :src="imagePreview" alt="Project Preview" class="img-thumbnail" style="max-width: 150px;" />
                  <button type="button" class="btn btn-sm btn-danger mt-2" @click="clearImage">
                    Remove Image
                  </button>
                </div>
                <div>
                  <input
                    type="file"
                    id="project-image"
                    accept="image/*"
                    @change="handleImageUpload"
                    class="form-control"
                  />
                </div>
              </div>
            </div>

            <!-- Form Actions -->
            <div class="d-flex justify-content-end gap-2">
              <button type="submit" class="btn btn-primary">
                {{ isEditing ? 'Save Changes' : 'Create Project' }}
              </button>
              <button type="button" class="btn btn-secondary" @click="$emit('close')">Cancel</button>
            </div>
          </form>
        </div>
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
      default: null,
    },
  },
  emits: ['save', 'close'],
  setup(props, { emit }) {
    const isEditing = computed(() => !!props.project);

    const formData = reactive({
      title: '',
      description: '',
      projectUrl: '',
      status: 'active',
      techStack: [],
    });

    const imageFile = ref(null);
    const imagePreview = ref(null);

    const techInput = ref('');
    const commonTechs = [
      'JavaScript',
      'TypeScript',
      'React',
      'Vue',
      'Angular',
      'Node.js',
      'Python',
      'Django',
      'Flask',
      'Ruby',
      'Rails',
      'PHP',
      'Laravel',
      'Java',
      'Spring',
      '.NET',
      'C#',
      'AWS',
      'Firebase',
      'Docker',
      'Kubernetes',
    ];

    const filteredSuggestions = computed(() => {
      if (!techInput.value) return [];
      const input = techInput.value.toLowerCase();
      return commonTechs
        .filter((tech) => !formData.techStack.includes(tech))
        .filter((tech) => tech.toLowerCase().includes(input))
        .slice(0, 5);
    });

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

    const handleImageUpload = (event) => {
      const file = event.target.files[0];
      if (!file) return;
      imageFile.value = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreview.value = e.target.result;
      };
      reader.readAsDataURL(file);
    };

    const clearImage = () => {
      imageFile.value = null;
      imagePreview.value = null;
      const fileInput = document.getElementById('project-image');
      if (fileInput) fileInput.value = '';
    };

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
      formData.techStack = formData.techStack.filter((t) => t !== tech);
    };

    const submitForm = () => {
      if (!formData.title || formData.techStack.length === 0) return;
      emit('save', { ...formData }, imageFile.value);
    };

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
      submitForm,
    };
  },
};
</script>
<<<<<<< HEAD
  
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
=======

<style scoped>
.img-thumbnail {
  max-width: 150px;
  height: auto;
}
</style>
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
