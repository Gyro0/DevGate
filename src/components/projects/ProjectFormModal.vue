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

<style scoped>
.img-thumbnail {
  max-width: 150px;
  height: auto;
}
</style>