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
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background-color: var(--card-bg);
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  border: 1px solid var(--border-color);
  position: relative;
  overflow: hidden;
}

.modal-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  opacity: 0.7;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.5rem 1rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--text-color);
  font-weight: 600;
}

.modal-close {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 1.25rem;
  cursor: pointer;
  border-radius: 50%;
  padding: 0.5rem;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background-color: var(--bg-darker);
  color: var(--text-color);
  transform: rotate(90deg);
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
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-color);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

input, select, textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
  background-color: var(--bg-darker);
  color: var(--text-color);
  transition: all 0.3s ease;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

input::placeholder, textarea::placeholder {
  color: var(--text-secondary);
}

textarea {
  resize: vertical;
  min-height: 80px;
}

.progress-history {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: var(--bg-darker);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.progress-history h4 {
  margin: 0 0 0.75rem 0;
  color: var(--primary-color);
  font-size: 1.05rem;
  font-weight: 600;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.history-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.95rem;
  color: var(--text-color);
  background: var(--card-bg);
  border-radius: 6px;
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
}

.no-history {
  color: var(--text-secondary);
  font-size: 0.95rem;
  margin: 0;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background-color: var(--primary-color-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

.btn-secondary {
  background-color: var(--bg-darker);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background-color: var(--card-bg);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

@media (max-width: 600px) {
  .modal-content {
    max-width: 98vw;
  }
  .form-row {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
}
</style>