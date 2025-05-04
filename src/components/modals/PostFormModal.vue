<template>
  <div class="modal-backdrop" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <h3>{{ postToEdit ? 'Edit Post' : 'Create New Post' }}</h3>
        <button @click="closeModal" class="modal-close">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="modal-body">
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="post-title">Title (Optional)</label>
            <input
              id="post-title"
              type="text"
              v-model="formData.title"
              placeholder="Add a title for your post"
            />
          </div>

          <div class="form-group">
            <label for="post-description">Description *</label>
            <textarea
              id="post-description"
              v-model="formData.description"
              rows="5"
              required
              placeholder="Share your thoughts, progress, or questions..."
            ></textarea>
          </div>

          <div class="form-group">
            <label for="post-image">Image (Optional)</label>
            <div class="image-upload">
              <div v-if="imagePreview" class="image-preview">
                <img :src="imagePreview" alt="Post Preview" />
                <button type="button" @click="clearImage" class="clear-image">
                  <i class="fas fa-times"></i>
                </button>
              </div>
              <label v-else for="post-image-input" class="upload-area">
                <i class="fas fa-cloud-upload-alt"></i>
                <span>Click to upload image</span>
              </label>
              <input
                type="file"
                id="post-image-input"
                accept="image/*"
                @change="handleImageUpload"
                style="display: none;"
              />
            </div>
          </div>

          <div class="form-group link-entity-group">
            <label>Link to (Optional)</label>
            <div class="link-controls">
              <select v-model="linkedEntityType" @change="linkedEntityId = ''">
                <option value="">None</option>
                <option value="skill">Skill</option>
                <option value="project">Project</option>
                <option value="objective">Objective</option>
              </select>

              <select v-if="linkedEntityType === 'skill'" v-model="linkedEntityId" :disabled="skillsLoading">
                <option value="">Select Skill...</option>
                <option v-for="skill in availableSkills" :key="skill.id" :value="skill.id">
                  {{ skill.name }}
                </option>
                 <option v-if="skillsLoading" value="" disabled>Loading skills...</option>
                 <option v-if="!skillsLoading && availableSkills.length === 0" value="" disabled>No skills found</option>
              </select>

              <select v-if="linkedEntityType === 'project'" v-model="linkedEntityId" :disabled="projectsLoading">
                <option value="">Select Project...</option>
                <option v-for="project in availableProjects" :key="project.id" :value="project.id">
                  {{ project.title }}
                </option>
                 <option v-if="projectsLoading" value="" disabled>Loading projects...</option>
                 <option v-if="!projectsLoading && availableProjects.length === 0" value="" disabled>No projects found</option>
              </select>

              <select v-if="linkedEntityType === 'objective'" v-model="linkedEntityId" :disabled="objectivesLoading">
                <option value="">Select Objective...</option>
                <option v-for="objective in availableObjectives" :key="objective.id" :value="objective.id">
                  {{ objective.title }}
                </option>
                 <option v-if="objectivesLoading" value="" disabled>Loading objectives...</option>
                 <option v-if="!objectivesLoading && availableObjectives.length === 0" value="" disabled>No objectives found</option>
              </select>
            </div>
             <p v-if="skillsError || projectsError || objectivesError" class="error-message small">
               Error loading items to link.
             </p>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-primary" :disabled="!isFormValid || isSaving">
              <span v-if="isSaving" class="spinner small"></span>
              {{ isSaving ? 'Posting...' : (postToEdit ? 'Save Changes' : 'Create Post') }}
            </button>
            <button type="button" class="btn-secondary" @click="closeModal" :disabled="isSaving">
              Cancel
            </button>
          </div>
           <p v-if="saveError" class="error-message">{{ saveError }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import useSkills from '@/composables/useSkills';
import useProjects from '@/composables/useProjects';
import useObjectives from '@/composables/useObjectives';

export default {
  name: 'PostFormModal',
  props: {
    postToEdit: { // Pass the post object if editing
      type: Object,
      default: null
    }
  },
  emits: ['close', 'save'], // Emit 'save' with post data and image file
  setup(props, { emit }) {
    const formData = reactive({
      title: '',
      description: '',
    });
    const imageFile = ref(null);
    const imagePreview = ref(null);
    const linkedEntityType = ref('');
    const linkedEntityId = ref('');
    const isSaving = ref(false);
    const saveError = ref(null);

    // Fetch items for linking
    const { skills: availableSkills, loading: skillsLoading, error: skillsError, fetchUserSkills } = useSkills();
    const { projects: availableProjects, loading: projectsLoading, error: projectsError, fetchUserProjects } = useProjects();
    const { objectives: availableObjectives, loading: objectivesLoading, error: objectivesError, fetchUserObjectives } = useObjectives();

    const isFormValid = computed(() => formData.description.trim() !== '');

    // Populate form if editing
    onMounted(() => {
      if (props.postToEdit) {
        formData.title = props.postToEdit.title || '';
        formData.description = props.postToEdit.description || '';
        linkedEntityType.value = props.postToEdit.linkedEntityType || '';
        linkedEntityId.value = props.postToEdit.linkedEntityId || '';
        if (props.postToEdit.imageUrl) {
          imagePreview.value = props.postToEdit.imageUrl;
          // Note: We don't get the original file back for editing,
          // user needs to re-upload if they want to change the image.
        }
      }
      // Fetch linkable items only if the modal is opened
      fetchUserSkills();
      fetchUserProjects();
      fetchUserObjectives();
    });

    const handleImageUpload = (event) => {
      const file = event.target.files[0];
      if (!file) return;
      imageFile.value = file;
      const reader = new FileReader();
      reader.onload = (e) => { imagePreview.value = e.target.result; };
      reader.readAsDataURL(file);
    };

    const clearImage = () => {
      imageFile.value = null;
      imagePreview.value = null;
      const fileInput = document.getElementById('post-image-input');
      if (fileInput) fileInput.value = '';
      // If editing, maybe set a flag to remove existing image on save?
    };

    const closeModal = () => {
      emit('close');
    };

    const handleSubmit = async () => {
      if (!isFormValid.value || isSaving.value) return;

      isSaving.value = true;
      saveError.value = null;

      const postDetails = {
        ...formData,
        linkedEntityType: linkedEntityType.value || null,
        linkedEntityId: linkedEntityId.value || null,
      };

      try {
        // Emit the data needed by the parent (usePosts composable)
        emit('save', postDetails, imageFile.value);
        // Parent component will call usePosts.addPost/updatePost
        // closeModal(); // Close modal on successful save (handled by parent)
      } catch (err) {
        console.error("Error preparing save data:", err);
        saveError.value = `Failed to save post: ${err.message}`;
      } finally {
         // isSaving is reset by the parent after the actual save operation finishes
         // isSaving.value = false;
      }
    };

    // Watcher to reset linkedEntityId when type changes
     watch(linkedEntityType, (newType) => {
       if (newType === '') {
         linkedEntityId.value = '';
       }
     });

    return {
      formData,
      imageFile,
      imagePreview,
      linkedEntityType,
      linkedEntityId,
      availableSkills,
      availableProjects,
      availableObjectives,
      skillsLoading,
      projectsLoading,
      objectivesLoading,
      skillsError,
      projectsError,
      objectivesError,
      isSaving,
      saveError,
      isFormValid,
      handleImageUpload,
      clearImage,
      closeModal,
      handleSubmit,
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
    max-width: 700px; /* Adjusted max-width */
    max-height: 90vh;
    /* overflow-y: auto; Removed default overflow, handled by body */
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    border: 1px solid var(--border-color, #444); /* Use border-color variable */
    position: relative;
    display: flex; /* Added for flex layout */
    flex-direction: column; /* Added for flex layout */
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
    flex-shrink: 0; /* Prevent header from shrinking */
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
    font-size: 1.25rem; /* Ensure icon size is sufficient */
    line-height: 1; /* Prevent extra space */
  }

  .modal-close:hover {
    background-color: var(--surface-hover, #3a3a3e); /* Use surface-hover variable */
    color: var(--text, #fff); /* Use text variable */
    transform: rotate(90deg);
  }

  .modal-body {
    padding: 1.5rem;
    overflow-y: auto; /* Ensure body scrolls if content exceeds height */
    flex-grow: 1; /* Allow body to take available space */
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

  /* Removed .form-row as it's not used in PostFormModal */

  input, textarea, select {
    width: 100%;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    border: 1px solid var(--border-color, #444); /* Use border-color variable */
    background-color: var(--surface-ground, #1e1e20); /* Use surface-ground or bg-darker */
    color: var(--text, #e0e0e0); /* Use text variable */
    font-size: 0.9rem;
    transition: all 0.3s ease;
    box-shadow: none; /* Remove default shadow */
  }

  input:focus, textarea:focus, select:focus {
    outline: none;
    border-color: var(--primary, #4f46e5); /* Use primary variable */
    box-shadow: 0 0 0 2px var(--primary-glow, rgba(79, 70, 229, 0.2)); /* Use primary-glow variable */
  }

  input::placeholder, textarea::placeholder {
    color: var(--text-secondary, #aaa); /* Use text-secondary variable */
  }

  /* Specific styling for select dropdown arrow */
  select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e"); /* Default arrow */
    background-position: right 0.75rem center;
    background-repeat: no-repeat;
    background-size: 1em 1em;
    padding-right: 2.5rem;
  }
  select:disabled {
    opacity: 0.6;
    background-color: var(--surface-section, #333); /* Slightly different background when disabled */
  }

  textarea {
    resize: vertical;
    min-height: 120px; /* Adjusted min-height for post description */
  }

  /* Removed tech-related styles */

  /* Image Upload Styles */
  .image-upload {
    background-color: var(--surface-ground, #1e1e20); /* Use surface-ground or bg-darker */
    border-radius: 8px;
    padding: 1rem;
    border: 1px solid var(--border-color, #444); /* Use border-color variable */
  }

  .image-preview {
    position: relative;
    width: 100%;
    max-height: 250px; /* Adjusted max-height */
    border-radius: 8px;
    overflow: hidden;
    background-color: var(--surface-section, #333); /* Background for preview area */
    display: flex; /* Center image */
    align-items: center; /* Center image */
    justify-content: center; /* Center image */
  }

  .image-preview img {
    display: block; /* Remove extra space below image */
    max-width: 100%;
    max-height: 250px; /* Match container */
    object-fit: contain; /* Use contain to see whole image */
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
    z-index: 1; /* Ensure it's above the image */
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
    height: 200px; /* Keep height */
    border: 2px dashed var(--border-color, #444); /* Use border-color variable */
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    background-color: transparent; /* Ensure no background color */
    padding: 1rem; /* Add padding */
    text-align: center; /* Center text */
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

  /* Link Entity Styles */
  .link-entity-group label {
    margin-bottom: 0.75rem; /* Keep margin */
  }
  .link-controls {
    display: flex;
    gap: 1rem;
  }
  .link-controls select {
    flex: 1; /* Allow selects to take equal space */
  }

  /* Form Actions */
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem; /* Keep margin-top */
    padding-top: 1.5rem; /* Add padding-top for separation */
    border-top: 1px solid var(--border-color, #444); /* Add border-top */
    flex-shrink: 0; /* Prevent footer from shrinking */
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
    display: inline-flex; /* Align spinner */
    align-items: center; /* Align spinner */
    gap: 0.5rem; /* Space for spinner */
  }

  .btn-primary:hover:not(:disabled) { /* Added :not(:disabled) */
    background-color: var(--primary-dark, #4338ca); /* Use primary-dark variable if exists */
    transform: translateY(-2px);
    box-shadow: 0 4px 12px var(--primary-glow, rgba(79, 70, 229, 0.3)); /* Enhance glow */
  }

  .btn-primary:disabled { /* Style for disabled primary button */
    background: var(--surface-section, #333); /* Use a disabled background */
    color: var(--text-secondary, #aaa); /* Dim text */
    cursor: not-allowed;
    opacity: 0.7;
    box-shadow: none; /* Remove glow when disabled */
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
    box-shadow: none; /* Remove default shadow */
  }

  .btn-secondary:hover:not(:disabled) { /* Added :not(:disabled) */
    background-color: var(--surface-hover, #3a3a3e); /* Use surface-hover variable */
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
   .btn-secondary:disabled { /* Style for disabled secondary button */
     opacity: 0.6;
     cursor: not-allowed;
   }

  .error-message {
    color: #ef4444; /* Keep error color */
    font-size: 0.875rem;
    margin-top: 0.75rem;
  }
  .error-message.small {
    font-size: 0.75rem;
    margin-top: 0.5rem;
  }

  /* Spinner */
  .spinner.small {
    width: 1em; height: 1em; border-width: 2px;
    border: 2px solid rgba(255, 255, 255, 0.3); border-radius: 50%; border-top-color: #fff;
    animation: spin 1s linear infinite;
    display: inline-block; /* Ensure spinner takes space */
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  @media (max-width: 640px) {
    .link-controls {
      flex-direction: column; /* Stack link controls */
      gap: 1rem; /* Keep gap */
    }
    .modal-content {
        max-width: 95%; /* Allow slightly wider modal on small screens */
    }
    .modal-header, .modal-body {
        padding: 1rem; /* Reduce padding on small screens */
    }
    .form-actions {
        margin-top: 1.5rem;
        padding-top: 1rem;
    }
  }
</style>