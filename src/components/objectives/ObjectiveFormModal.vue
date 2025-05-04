<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h3>{{ isEditing ? 'Edit Objective' : 'Add New Objective' }}</h3>
        <button @click="$emit('close')" class="modal-close">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="modal-body">
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="objective-title">Title *</label>
            <input 
              id="objective-title" 
              type="text" 
              v-model="formData.title" 
              required
              placeholder="e.g. Learn Vue 3 Composition API"
            />
          </div>
          
          <div class="form-group">
            <label for="objective-description">Description</label>
            <textarea 
              id="objective-description" 
              v-model="formData.description" 
              rows="3" 
              placeholder="Describe the objective and its goals"
            ></textarea>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="objective-status">Status *</label>
              <select id="objective-status" v-model="formData.status" required>
                <option value="planned">Planned</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="objective-priority">Priority</label>
              <select id="objective-priority" v-model="formData.priority">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="objective-start-date">Start Date</label>
              <input 
                id="objective-start-date" 
                type="date" 
                v-model="formData.startDate" 
              />
            </div>
            
            <div class="form-group">
              <label for="objective-deadline">Deadline</label>
              <input 
                id="objective-deadline" 
                type="date" 
                v-model="formData.deadline" 
              />
            </div>
          </div>
          
          <div class="form-actions">
            <button type="submit" class="btn-primary" :disabled="!isFormValid">
              {{ isEditing ? 'Update Objective' : 'Add Objective' }}
            </button>
            <button type="button" class="btn-secondary" @click="$emit('close')">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, computed, watch } from 'vue';
import firebase from '@/firebase/firebaseInit'; // Import firebase namespace for Timestamp

export default {
  name: 'ObjectiveFormModal',
  props: {
    objective: {
      type: Object,
      default: null
    }
  },
  emits: ['save', 'close'],
  setup(props, { emit }) {
    const isEditing = computed(() => !!props.objective?.id);

    // Helper to format Firestore Timestamp or Date to YYYY-MM-DD for input[type=date]
    const formatDateForInput = (dateValue) => {
      if (!dateValue) return '';
      let date;
      // Check if it's a Firestore v8 Timestamp
      if (dateValue && typeof dateValue.toDate === 'function') {
        date = dateValue.toDate();
      } else if (dateValue instanceof Date) {
         date = dateValue;
      } else {
        try {
          date = new Date(dateValue); // Attempt to parse string/number
        } catch {
          return ''; // Invalid date format
        }
      }
      
      if (isNaN(date.getTime())) return ''; // Check if date is valid
      
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // Initialize form data
    const formData = reactive({
      title: '',
      description: '',
      status: 'planned',
      priority: 'medium',
      startDate: '',
      deadline: ''
    });

    // Populate form when objective prop changes (for editing)
    const populateForm = (objective) => {
      if (objective) {
        formData.title = objective.title || '';
        formData.description = objective.description || '';
        formData.status = objective.status || 'planned';
        formData.priority = objective.priority || 'medium';
        formData.startDate = formatDateForInput(objective.startDate);
        formData.deadline = formatDateForInput(objective.deadline);
      } else {
        // Reset form if objective is null (for adding)
        formData.title = '';
        formData.description = '';
        formData.status = 'planned';
        formData.priority = 'medium';
        formData.startDate = '';
        formData.deadline = '';
      }
    };

    // Watch for changes in the objective prop
    watch(() => props.objective, (newObjective) => {
      populateForm(newObjective);
    }, { immediate: true }); // immediate: true to run on initial mount

    // Basic form validation
    const isFormValid = computed(() => {
      return formData.title.trim() !== '' && formData.status !== '';
    });

    // Submit form data to parent
    const submitForm = () => {
      if (!isFormValid.value) return;
      
      // Convert date strings back to Firestore v8 Timestamps
      const dataToSave = {
        ...formData,
        // Use v8 firebase.firestore.Timestamp
        startDate: formData.startDate ? firebase.firestore.Timestamp.fromDate(new Date(formData.startDate)) : null,
        deadline: formData.deadline ? firebase.firestore.Timestamp.fromDate(new Date(formData.deadline)) : null,
      };
      emit('save', dataToSave);
    };

    // Return reactive state and methods
    return {
      isEditing,
      formData,
      isFormValid,
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
  background: var(--surface);
  border-radius: 1.1rem;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 16px 0 rgba(0,0,0,0.25), 0 0 0 2px var(--primary-glow), 0 0 8px 2px var(--circuit-accent);
  border: 1.5px solid var(--border-color);
  color: var(--text-color);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1.5px solid var(--border-color);
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--primary);
  text-shadow: 0 0 8px var(--primary-glow);
}

.modal-close {
  background: none;
  border: none;
  color: var(--highlight);
  font-size: 1.25rem;
  cursor: pointer;
  transition: color 0.18s;
}
.modal-close:hover {
  color: var(--primary-glow);
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

label {
  display: block;
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--secondary);
}

input, select, textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1.5px solid var(--border-color);
  border-radius: 0.7rem;
  font-size: 1rem;
  background: var(--surface-2);
  color: var(--text);
  transition: border-color 0.18s, box-shadow 0.18s;
  box-shadow: 0 0 8px var(--primary-glow, transparent);
}
input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: var(--primary-glow);
  box-shadow: 0 0 0 2px var(--primary-glow);
}
select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.75rem center;
  background-repeat: no-repeat;
  background-size: 1em 1em;
  padding-right: 2.5rem;
}
textarea {
  resize: vertical;
  min-height: 80px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1.5px solid var(--border-color);
}

.btn-primary, .btn-secondary {
  padding: 0.75rem 1.5rem;
  border-radius: 0.7rem;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s;
}

.btn-primary {
  background: var(--primary);
  color: #fff;
  border: none;
  box-shadow: 0 0 8px var(--primary-glow);
}
.btn-primary:hover:not(:disabled) {
  background: var(--primary-glow);
  box-shadow: 0 0 16px 2px var(--primary-glow);
}
.btn-primary:disabled {
  background: var(--surface-2);
  color: var(--highlight);
  cursor: not-allowed;
  opacity: 0.7;
}

.btn-secondary {
  background: var(--surface-2);
  color: var(--primary);
  border: 1.5px solid var(--primary-glow);
  box-shadow: 0 0 8px var(--primary-glow);
}
.btn-secondary:hover {
  background: var(--primary-glow);
  color: #fff;
  border-color: var(--primary-glow);
  box-shadow: 0 0 16px 2px var(--primary-glow);
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>