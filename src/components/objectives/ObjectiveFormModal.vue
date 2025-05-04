<template>
  <div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="objectiveFormModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h5 class="modal-title" id="objectiveFormModalLabel">
            {{ isEditing ? 'Edit Objective' : 'Add New Objective' }}
          </h5>
          <button type="button" class="btn-close" aria-label="Close" @click="$emit('close')"></button>
        </div>

        <!-- Modal Body -->
        <div class="modal-body">
          <form @submit.prevent="submitForm">
            <!-- Title -->
            <div class="mb-3">
              <label for="objective-title" class="form-label">Title *</label>
              <input
                id="objective-title"
                type="text"
                v-model="formData.title"
                class="form-control"
                required
                placeholder="e.g. Learn Vue 3 Composition API"
              />
            </div>

            <!-- Description -->
            <div class="mb-3">
              <label for="objective-description" class="form-label">Description</label>
              <textarea
                id="objective-description"
                v-model="formData.description"
                class="form-control"
                rows="3"
                placeholder="Describe the objective and its goals"
              ></textarea>
            </div>

            <!-- Status and Priority -->
            <div class="row g-3">
              <div class="col-md-6">
                <label for="objective-status" class="form-label">Status *</label>
                <select id="objective-status" v-model="formData.status" class="form-select" required>
                  <option value="planned">Planned</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="on-hold">On Hold</option>
                </select>
              </div>
              <div class="col-md-6">
                <label for="objective-priority" class="form-label">Priority</label>
                <select id="objective-priority" v-model="formData.priority" class="form-select">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <!-- Start Date and Deadline -->
            <div class="row g-3 mt-3">
              <div class="col-md-6">
                <label for="objective-start-date" class="form-label">Start Date</label>
                <input
                  id="objective-start-date"
                  type="date"
                  v-model="formData.startDate"
                  class="form-control"
                />
              </div>
              <div class="col-md-6">
                <label for="objective-deadline" class="form-label">Deadline</label>
                <input
                  id="objective-deadline"
                  type="date"
                  v-model="formData.deadline"
                  class="form-control"
                />
              </div>
            </div>
          </form>
        </div>

        <!-- Modal Footer -->
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="$emit('close')">Cancel</button>
          <button type="submit" class="btn btn-primary" :disabled="!isFormValid">
            {{ isEditing ? 'Update Objective' : 'Add Objective' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, computed, watch } from 'vue';

export default {
  name: 'ObjectiveFormModal',
  props: {
    objective: {
      type: Object,
      default: null,
    },
  },
  emits: ['save', 'close'],
  setup(props, { emit }) {
    const isEditing = computed(() => !!props.objective?.id);

    const formData = reactive({
      title: '',
      description: '',
      status: 'planned',
      priority: 'medium',
      startDate: '',
      deadline: '',
    });

    const populateForm = (objective) => {
      if (objective) {
        formData.title = objective.title || '';
        formData.description = objective.description || '';
        formData.status = objective.status || 'planned';
        formData.priority = objective.priority || 'medium';
        formData.startDate = objective.startDate || '';
        formData.deadline = objective.deadline || '';
      } else {
        formData.title = '';
        formData.description = '';
        formData.status = 'planned';
        formData.priority = 'medium';
        formData.startDate = '';
        formData.deadline = '';
      }
    };

    watch(
      () => props.objective,
      (newObjective) => {
        populateForm(newObjective);
      },
      { immediate: true }
    );

    const isFormValid = computed(() => {
      return formData.title.trim() !== '' && formData.status !== '';
    });

    const submitForm = () => {
      if (!isFormValid.value) return;
      emit('save', { ...formData });
    };

    return {
      isEditing,
      formData,
      isFormValid,
      submitForm,
    };
  },
};
</script>

<style scoped>
.modal-content {
  border-radius: 8px;
}

.modal-header {
  border-bottom: 1px solid #dee2e6;
}

.modal-footer {
  border-top: 1px solid #dee2e6;
}

.form-label {
  font-weight: 500;
}

.form-control:focus {
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}
</style>