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
/* Basic Modal Styles (reuse from other modals or define here) */
.modal-backdrop {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex; justify-content: center; align-items: center; z-index: 1000;
}
.modal-content {
  background-color: white; border-radius: 8px; width: 90%; max-width: 650px;
  max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}
.modal-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 1rem 1.5rem; border-bottom: 1px solid #e5e7eb;
}
.modal-header h3 { margin: 0; font-size: 1.25rem; color: #111827; }
.modal-close { background: none; border: none; font-size: 1.5rem; color: #6b7280; cursor: pointer; }
.modal-body { padding: 1.5rem; overflow-y: auto; }

/* Form Styles */
.form-group { margin-bottom: 1.25rem; }
label { display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 500; color: #374151; }
input[type="text"], textarea, select {
  width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 6px; font-size: 0.9rem;
}
input:focus, textarea:focus, select:focus { outline: none; border-color: #4f46e5; box-shadow: 0 0 0 1px #4f46e5; }
textarea { resize: vertical; min-height: 100px; }

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