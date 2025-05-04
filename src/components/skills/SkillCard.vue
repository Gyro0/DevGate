<template>
  <div class="skill-card card shadow-sm border-0">
    <!-- Card Header -->
    <div class="card-header d-flex justify-content-between align-items-start bg-light">
      <div>
        <h5 class="card-title mb-1 text-truncate">{{ skill.name }}</h5>
        <span class="badge level-badge" :class="`level-${skill.level}`">
          {{ getLevelLabel(skill.level) }}
        </span>
      </div>
      <div class="d-flex gap-2">
        <button
          class="btn btn-sm btn-outline-primary"
          @click="$emit('edit', skill)"
          title="Edit Skill"
        >
          <i class="fas fa-pen"></i>
        </button>
        <button
          class="btn btn-sm btn-outline-danger"
          @click="$emit('delete', skill)"
          title="Delete Skill"
        >
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>

    <!-- Card Body -->
    <div class="card-body">
      <!-- Category -->
      <div class="mb-3">
        <span class="badge category-badge" :class="`category-${skill.category}`">
          {{ getCategoryName(skill.category) }}
        </span>
      </div>

      <!-- Progress Bar -->
      <div class="mb-3">
        <label class="form-label small">Progress</label>
        <div class="progress" style="height: 6px;">
          <div
            class="progress-bar"
            role="progressbar"
            :style="{ width: `${(skill.level / 5) * 100}%` }"
            :aria-valuenow="skill.level"
            aria-valuemin="0"
            aria-valuemax="5"
          ></div>
        </div>
      </div>

      <!-- Dates -->
      <div class="d-flex justify-content-between text-muted small">
        <div>
          <i class="fas fa-calendar-alt me-1"></i>
          Added: {{ formatDate(skill.dateAcquired) }}
        </div>
        <div>
          <i class="fas fa-edit me-1"></i>
          Updated: {{ formatDate(skill.lastUpdated) }}
        </div>
      </div>

      <!-- Notes -->
      <div v-if="skill.notes" class="mt-3">
        <h6 class="small text-muted">Notes</h6>
        <p class="mb-0">{{ skill.notes }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import useSkills from '@/composables/useSkills';

export default {
  name: 'SkillCard',
  props: {
    skill: {
      type: Object,
      required: true,
    },
  },
  emits: ['edit', 'delete'],
  setup() {
    const { skillCategories, skillLevels } = useSkills();

    const getCategoryName = (categoryId) => {
      const category = skillCategories.find((cat) => cat.id === categoryId);
      return category ? category.name : 'Uncategorized';
    };

    const getLevelLabel = (levelValue) => {
      const level = skillLevels.find((l) => l.value === levelValue);
      return level ? level.label : 'Unknown';
    };

    const formatDate = (timestamp) => {
      if (!timestamp) return 'N/A';
      const date = timestamp?.seconds
        ? new Date(timestamp.seconds * 1000)
        : new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    };

    return {
      getCategoryName,
      getLevelLabel,
      formatDate,
    };
  },
};
</script>

<style scoped>
.skill-card {
  border-radius: 8px;
  overflow: hidden;
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
}

.level-badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.level-1 {
  background-color: #dbeafe;
  color: #1e40af;
}
.level-2 {
  background-color: #e0e7ff;
  color: #4338ca;
}
.level-3 {
  background-color: #c7d2fe;
  color: #4f46e5;
}
.level-4 {
  background-color: #ddd6fe;
  color: #7c3aed;
}
.level-5 {
  background-color: #ede9fe;
  color: #6d28d9;
}

.category-badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 20px;
}

.category-frontend {
  background-color: #fef3c7;
  color: #92400e;
}
.category-backend {
  background-color: #d1fae5;
  color: #065f46;
}
.category-devops {
  background-color: #dbeafe;
  color: #1e40af;
}
.category-mobile {
  background-color: #fee2e2;
  color: #b91c1c;
}
.category-database {
  background-color: #e0e7ff;
  color: #4338ca;
}
.category-other {
  background-color: #f3f4f6;
  color: #4b5563;
}

.progress-bar {
  background-color: #4f46e5;
}

.text-muted {
  font-size: 0.875rem;
}
</style>