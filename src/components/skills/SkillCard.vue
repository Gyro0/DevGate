<template>
<<<<<<< HEAD
  <div class="skill-card">
    <div class="skill-header">
      <h3 class="skill-name">{{ skill.name }}</h3>
      <div class="skill-actions">
        <button class="action-btn edit-btn" @click="$emit('edit', skill)" title="Edit Skill">
          <i class="fas fa-edit"></i>
        </button>
        <button class="action-btn delete-btn" @click="$emit('delete', skill)" title="Delete Skill">
=======
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
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
<<<<<<< HEAD
    
    <div class="skill-category">{{ getCategoryName(skill.category) }}</div>
    
    <div class="skill-rating">
      <div class="stars">
        <i 
          v-for="n in 5" 
          :key="n" 
          :class="['fas', n <= skill.level ? 'fa-star' : 'fa-star-o']"
        ></i>
      </div>
      <span class="level-text">{{ getLevelName(skill.level) }}</span>
    </div>
    
    <div class="skill-meta">
      <div class="meta-item">
        <span class="meta-label">Last Updated:</span>
        <span class="meta-value">{{ formatDate(skill.updatedAt || skill.createdAt) }}</span>
      </div>
      
      <div v-if="skill.notes" class="skill-notes">
        <span class="notes-label">Notes:</span>
        <p class="notes-text">{{ skill.notes }}</p>
      </div>
=======

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
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
    </div>
  </div>
</template>

<script>
<<<<<<< HEAD
import { computed } from 'vue';
=======
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
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
<<<<<<< HEAD
    
    // Get category name from category ID
    const getCategoryName = (categoryId) => {
      const category = skillCategories.find(cat => cat.id === categoryId);
      return category ? category.name : categoryId;
    };
    
    // Get level name from level value
    const getLevelName = (level) => {
      const levelObj = skillLevels.find(lvl => lvl.value === level);
      return levelObj ? levelObj.label : `Level ${level}`;
    };
    
    // Format date for display
    const formatDate = (timestamp) => {
      if (!timestamp) return 'N/A';
      
      let date;
      if (timestamp.seconds) {
        date = new Date(timestamp.seconds * 1000);
      } else {
        date = new Date(timestamp);
      }
      
      return date.toLocaleDateString();
    };
    
    return {
      getCategoryName,
      getLevelName,
      formatDate
=======

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
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
    };
  },
};
</script>

<style scoped>
.skill-card {
<<<<<<< HEAD
  background-color: var(--card-bg);
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  border: 1px solid var(--border-color);
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
  overflow: hidden;
}

.skill-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  opacity: 0.7;
}

.skill-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.18), 0 0 0 1px var(--primary-color), 0 0 20px rgba(79,70,229,0.15);
}

.skill-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.skill-name {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-color);
}

.skill-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background: var(--bg-darker);
  border: 1px solid var(--border-color);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-color);
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 0 15px rgba(79,70,229,0.3);
}

.edit-btn:hover {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.delete-btn:hover {
  background: #ef4444;
  color: white;
  border-color: #ef4444;
}

.skill-category {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 0.75rem;
  font-weight: 500;
}

.skill-rating {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.stars {
  display: flex;
  margin-right: 0.75rem;
  color: #eab308;
}

.stars i {
  margin-right: 0.125rem;
  filter: drop-shadow(0 0 2px #eab30855);
}

.stars i.fa-star-o {
  color: var(--border-color);
  filter: none;
}

.level-text {
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.skill-meta {
  font-size: 0.9rem;
}

.meta-item {
  display: flex;
  gap: 0.375rem;
  margin-bottom: 0.5rem;
}

.meta-label {
  color: var(--text-secondary);
  font-weight: 500;
}

.meta-value {
  color: var(--text-color);
}

.skill-notes {
  margin-top: 0.75rem;
  background: var(--bg-darker);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
}

.notes-label {
  color: var(--primary-color);
  font-weight: 600;
  margin-bottom: 0.25rem;
  display: block;
}

.notes-text {
  margin: 0.25rem 0 0 0;
  color: var(--text-color);
  line-height: 1.5;
}

@media (max-width: 640px) {
  .skill-header {
    flex-direction: column;
  }
  .skill-actions {
    margin-top: 0.5rem;
  }
=======
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
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
}
</style>