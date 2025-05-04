<template>
  <div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="skillFormModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h5 class="modal-title" id="skillFormModalLabel">
            {{ isEditing ? 'Edit Skill' : 'Add New Skill' }}
          </h5>
          <button type="button" class="btn-close" aria-label="Close" @click="$emit('close')"></button>
        </div>

        <!-- Modal Body -->
        <div class="modal-body">
          <form @submit.prevent="submitForm">
            <!-- Skill Name -->
            <div class="mb-3">
              <label for="skill-name" class="form-label">Skill Name *</label>
              <input
                id="skill-name"
                type="text"
                v-model="formData.name"
                class="form-control"
                required
                placeholder="e.g. JavaScript, React, Docker"
              />
            </div>

            <!-- Category and Level -->
            <div class="row g-3">
              <div class="col-md-6">
                <label for="skill-category" class="form-label">Category *</label>
                <select
                  id="skill-category"
                  v-model="formData.category"
                  class="form-select"
                  required
                >
                  <option v-for="category in skillCategories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>
              <div class="col-md-6">
                <label for="skill-level" class="form-label">Proficiency Level *</label>
                <select
                  id="skill-level"
                  v-model="formData.level"
                  class="form-select"
                  required
                >
                  <option v-for="level in skillLevels" :key="level.value" :value="level.value">
                    {{ level.value }} - {{ level.label }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Notes -->
            <div class="mb-3">
              <label for="skill-notes" class="form-label">Notes</label>
              <textarea
                id="skill-notes"
                v-model="formData.notes"
                class="form-control"
                rows="3"
                placeholder="Add any details about your experience with this skill"
              ></textarea>
            </div>

            <!-- Progress History -->
            <div v-if="isEditing" class="mb-3">
              <h6 class="text-muted">Progress History</h6>
              <div v-if="skill?.progressHistory?.length" class="list-group">
                <div
                  v-for="(entry, index) in skill.progressHistory"
                  :key="index"
                  class="list-group-item d-flex justify-content-between align-items-center"
                >
                  <span>Level {{ entry.level }}</span>
                  <span class="text-muted small">{{ formatDate(entry.date) }}</span>
                </div>
              </div>
              <p v-else class="text-muted fst-italic">No progress history available</p>
            </div>
          </form>
        </div>

        <!-- Modal Footer -->
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="$emit('close')">Cancel</button>
          <button type="submit" class="btn btn-primary" :disabled="!isFormValid">
            {{ isEditing ? 'Update Skill' : 'Add Skill' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, computed } from 'vue';
import useSkills from '@/composables/useSkills';

export default {
  name: 'SkillFormModal',
  props: {
    skill: {
      type: Object,
      default: null,
    },
  },
  emits: ['save', 'close'],
  setup(props, { emit }) {
    const { skillCategories, skillLevels } = useSkills();

    const isEditing = computed(() => !!props.skill);

    const formData = reactive({
      name: props.skill?.name || '',
      category: props.skill?.category || (skillCategories.length > 0 ? skillCategories[0].id : ''),
      level: props.skill?.level || 1,
      notes: props.skill?.notes || '',
    });

    const formatDate = (timestamp) => {
      if (!timestamp) return 'N/A';
      const date = timestamp.seconds
        ? new Date(timestamp.seconds * 1000)
        : new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    };

    const isFormValid = computed(() => {
      return formData.name.trim() !== '' && formData.category !== '' && formData.level !== '';
    });

    const submitForm = () => {
      if (!isFormValid.value) return;
      emit('save', { ...formData });
    };

    return {
      isEditing,
      formData,
      skillCategories,
      skillLevels,
      formatDate,
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

.list-group-item {
  font-size: 0.875rem;
}
</style>