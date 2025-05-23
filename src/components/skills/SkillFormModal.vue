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
  /* --- Start: Consistent Modal Styles --- */
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
    max-width: 550px; /* Adjusted max-width for skills modal */
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
  /* --- End: Consistent Modal Styles --- */

  /* --- Start: Skill-Specific Styles --- */
  .progress-history {
    margin-top: 2rem; /* Add space above history */
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: var(--surface-ground, #1e1e20); /* Use surface-ground or bg-darker */
    border-radius: 8px;
    border: 1px solid var(--border-color, #444); /* Use border-color variable */
  }

  .progress-history h4 {
    margin: 0 0 0.75rem 0;
    color: var(--primary, #4f46e5); /* Use primary variable */
    font-size: 1.05rem;
    font-weight: 600; /* Match label weight */
    text-transform: uppercase; /* Match label style */
    letter-spacing: 0.05em; /* Match label style */
  }

  .history-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    max-height: 150px; /* Limit height and make scrollable */
    overflow-y: auto;
    padding-right: 0.5rem; /* Add padding for scrollbar */
  }

  .history-item {
    display: flex;
    justify-content: space-between;
    font-size: 0.95rem;
    color: var(--text, #e0e0e0); /* Use text variable */
    background: var(--surface-section, #333); /* Use surface-section or card-bg */
    border-radius: 6px;
    padding: 0.5rem 1rem;
    border: 1px solid var(--border-color, #444); /* Use border-color variable */
  }

  .history-item span:first-child {
    font-weight: 600; /* Make level bold */
  }
  .history-item span:last-child {
    color: var(--text-secondary, #aaa); /* Dim date */
    font-size: 0.9em;
  }

  .no-history {
    color: var(--text-secondary, #aaa); /* Use text-secondary variable */
    font-size: 0.95rem;
    margin: 0;
    text-align: center;
    padding: 1rem 0;
  }
  /* --- End: Skill-Specific Styles --- */

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
</style>