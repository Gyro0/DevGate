<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h3>{{ isEditing ? 'Edit Skill' : 'Add New Skill' }}</h3>
        <button @click="$emit('close')" class="modal-close">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="modal-body">
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="skill-name">Skill Name *</label>
            <input 
              id="skill-name" 
              type="text" 
              v-model="formData.name" 
              required
              placeholder="e.g. JavaScript, React, Docker"
            />
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="skill-category">Category *</label>
              <select id="skill-category" v-model="formData.category" required>
                <option v-for="category in skillCategories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="skill-level">Proficiency Level *</label>
              <select id="skill-level" v-model="formData.level" required>
                <option v-for="level in skillLevels" :key="level.value" :value="level.value">
                  {{ level.value }} - {{ level.label }}
                </option>
              </select>
            </div>
          </div>
          
          <div class="form-group">
            <label for="skill-notes">Notes</label>
            <textarea 
              id="skill-notes" 
              v-model="formData.notes" 
              rows="3" 
              placeholder="Add any details about your experience with this skill"
            ></textarea>
          </div>
          
          <div v-if="isEditing" class="progress-history">
            <h4>Progress History</h4>
            <div v-if="skill?.progressHistory?.length" class="history-list">
              <div v-for="(entry, index) in skill.progressHistory" :key="index" class="history-item">
                <span>Level {{ entry.level }}</span>
                <span>{{ formatDate(entry.date) }}</span>
              </div>
            </div>
            <p v-else class="no-history">No progress history available</p>
          </div>
          
          <div class="form-actions">
            <button type="submit" class="btn-primary">
              {{ isEditing ? 'Update Skill' : 'Add Skill' }}
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
import { reactive, computed } from 'vue'; // Removed defineProps, defineEmits
import useSkills from '@/composables/useSkills';

export default {
  name: 'SkillFormModal',
  props: {
    skill: {
      type: Object,
      default: null
    }
  },
  emits: ['save', 'close'],
  setup(props, { emit }) {
    const { skillCategories, skillLevels } = useSkills();

    // Determine if we're editing an existing skill
    const isEditing = computed(() => !!props.skill);

    // Initialize form data
    const formData = reactive({
      name: props.skill?.name || '',
      // Ensure skillCategories has loaded before accessing [0]
      category: props.skill?.category || (skillCategories.length > 0 ? skillCategories[0].id : ''), 
      level: props.skill?.level || 1,
      notes: props.skill?.notes || ''
    });

    // Format date for display
    const formatDate = (timestamp) => {
      if (!timestamp) return 'N/A';
      
      let date;
      if (timestamp.toDate) {
        // Firestore Timestamp object
        date = timestamp.toDate();
      } else if (timestamp.seconds) {
        // Firestore Timestamp as plain object
        date = new Date(timestamp.seconds * 1000);
      } else {
        // JavaScript Date or string
        date = new Date(timestamp);
      }
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
         return 'Invalid Date';
      }
      
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    };

    // Submit form data to parent
    const submitForm = () => {
      // Basic validation
      if (!formData.name || !formData.category || !formData.level) {
         console.error("Form validation failed: Name, Category, and Level are required.");
         return; 
      }
      emit('save', { ...formData });
    };

    // Return everything needed by the template
    return {
      isEditing,
      formData,
      skillCategories, // Expose for the template v-for
      skillLevels,     // Expose for the template v-for
      formatDate,
      submitForm
      // props.skill is automatically available in the template
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
  max-width: 500px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #E5E7EB;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #111827;
}

.modal-close {
  background: none;
  border: none;
  color: #6B7280;
  font-size: 1.25rem;
  cursor: pointer;
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
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #4B5563;
}

input, select, textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  font-size: 1rem;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: #4F46E5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

textarea {
  resize: vertical;
  min-height: 80px;
}

.progress-history {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #F9FAFB;
  border-radius: 6px;
}

.progress-history h4 {
  margin: 0 0 0.75rem 0;
  font-size: 0.875rem;
  color: #4B5563;
}

.history-list {
  max-height: 150px;
  overflow-y: auto;
}

.history-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  font-size: 0.75rem;
  border-bottom: 1px solid #E5E7EB;
}

.history-item:last-child {
  border-bottom: none;
}

.no-history {
  font-size: 0.75rem;
  color: #9CA3AF;
  font-style: italic;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #E5E7EB;
}

.btn-primary, .btn-secondary {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
}

.btn-primary {
  background-color: #4F46E5;
  color: white;
  border: none;
}

.btn-primary:hover {
  background-color: #4338CA;
}

.btn-secondary {
  background-color: white;
  color: #4B5563;
  border: 1px solid #D1D5DB;
}

.btn-secondary:hover {
  background-color: #F9FAFB;
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>