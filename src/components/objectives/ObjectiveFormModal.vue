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
<<<<<<< HEAD
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
    overflow-y: auto;
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

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    /* Removed margin-bottom from here, handled by .form-group */
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
    box-shadow: none; /* Remove default shadow from previous style */
  }

  input:focus, textarea:focus, select:focus {
    outline: none;
    border-color: var(--primary, #4f46e5); /* Use primary variable */
    box-shadow: 0 0 0 2px var(--primary-glow, rgba(79, 70, 229, 0.2)); /* Use primary-glow variable */
  }

  input::placeholder, textarea::placeholder {
    color: var(--text-secondary, #aaa); /* Use text-secondary variable */
  }

  /* Specific styling for select dropdown arrow if needed */
  select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e"); /* Default arrow */
    background-position: right 0.75rem center;
    background-repeat: no-repeat;
    background-size: 1em 1em;
    padding-right: 2.5rem;
  }

  textarea {
    resize: vertical;
    min-height: 80px; /* Keep min-height */
  }

  /* Removed tech-related styles as they are not in ObjectiveFormModal */

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem; /* Keep margin-top */
    padding-top: 1.5rem; /* Add padding-top for separation */
    border-top: 1px solid var(--border-color, #444); /* Add border-top */
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

  .btn-secondary:hover {
    background-color: var(--surface-hover, #3a3a3e); /* Use surface-hover variable */
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 640px) {
    .form-row {
      grid-template-columns: 1fr; /* Stack columns on smaller screens */
      gap: 0; /* Remove gap when stacked */
    }
    .form-row .form-group {
      margin-bottom: 1.5rem; /* Ensure margin between stacked items */
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
=======
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
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
</style>