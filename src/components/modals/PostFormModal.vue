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
  background-color: rgba(22, 27, 34, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}
.modal-content {
  background: var(--surface);
  border-radius: 1rem;
  max-width: 500px;
  width: 95%;
  box-shadow: 0 4px 32px 0 rgba(30, 203, 225, 0.08), 0 0 0 2px var(--highlight);
  border: 1.5px solid var(--highlight);
  padding: 2rem 1.5rem;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border);
}
.modal-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--primary);
  font-weight: 700;
  letter-spacing: 1px;
}
.modal-close {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: var(--highlight);
  cursor: pointer;
  transition: color 0.2s;
}
.modal-close:hover {
  color: var(--secondary);
}
.modal-body {
  padding: 1.5rem 0;
}
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border);
  background: var(--background);
  border-bottom-left-radius: 1rem;
  border-bottom-right-radius: 1rem;
}
input, .form-control, textarea {
  background: var(--background);
  color: var(--text);
  border: 1.5px solid var(--highlight);
  border-radius: 8px;
  padding: 0.6rem 1rem;
  font-size: 1rem;
  margin-bottom: 1rem;
  width: 100%;
  box-shadow: 0 0 8px var(--highlight);
  transition: border-color 0.2s, box-shadow 0.2s;
}
input:focus, .form-control:focus, textarea:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 2px var(--highlight);
  outline: none;
}
.btn-secondary, .btn-primary {
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  border: 1.5px solid var(--highlight);
  background: var(--surface);
  color: var(--text);
  transition: background 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
  box-shadow: 0 0 8px var(--highlight);
}
.btn-secondary:hover, .btn-primary:hover {
  background: var(--highlight);
  color: var(--background);
  border-color: var(--primary);
}

/* Image Upload Styles (similar to ProjectFormModal) */
.image-upload { border: 1px solid #d1d5db; border-radius: 6px; overflow: hidden; }
.upload-area { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem 1rem; cursor: pointer; background-color: #f9fafb; text-align: center; }
.upload-area i { font-size: 2rem; color: #9ca3af; margin-bottom: 0.5rem; }
.upload-area span { color: #6b7280; font-size: 0.875rem; }
.image-preview { position: relative; max-height: 250px; text-align: center; background-color: #f3f4f6; }
.image-preview img { max-width: 100%; max-height: 250px; object-fit: contain; }
.clear-image { position: absolute; top: 0.5rem; right: 0.5rem; width: 28px; height: 28px; border-radius: 50%; background-color: rgba(0, 0, 0, 0.6); color: white; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 0.9rem; }

/* Link Entity Styles */
.link-entity-group label { margin-bottom: 0.75rem; }
.link-controls { display: flex; gap: 1rem; }
.link-controls select { flex: 1; }

/* Form Actions */
.form-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid #e5e7eb; }
.btn-primary, .btn-secondary { padding: 0.75rem 1.5rem; border-radius: 6px; font-size: 0.9rem; font-weight: 500; cursor: pointer; transition: background-color 0.2s; display: inline-flex; align-items: center; gap: 0.5rem; }
.btn-primary { background-color: #4f46e5; color: white; border: none; }
.btn-primary:hover:not(:disabled) { background-color: #4338ca; }
.btn-primary:disabled { background-color: #a5b4fc; cursor: not-allowed; }
.btn-secondary { background-color: white; color: #4b5563; border: 1px solid #d1d5db; }
.btn-secondary:hover:not(:disabled) { background-color: #f9fafb; }
.btn-secondary:disabled { opacity: 0.6; cursor: not-allowed; }

.error-message { color: #ef4444; font-size: 0.875rem; margin-top: 0.75rem; }
.error-message.small { font-size: 0.75rem; margin-top: 0.5rem; }

/* Spinner */
.spinner.small {
  width: 1em; height: 1em; border-width: 2px;
  border: 2px solid rgba(255, 255, 255, 0.3); border-radius: 50%; border-top-color: #fff;
  animation: spin 1s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>