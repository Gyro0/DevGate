<template>
  <div class="skill-card">
    <div class="skill-header">
      <h3 class="skill-name">{{ skill.name }}</h3>
      <div class="skill-actions">
        <button class="action-btn edit-btn" @click="$emit('edit', skill)" title="Edit Skill">
          <i class="fas fa-edit"></i>
        </button>
        <button class="action-btn delete-btn" @click="$emit('delete', skill)" title="Delete Skill">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
    
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
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import useSkills from '@/composables/useSkills';

export default {
  name: 'SkillCard',
  props: {
    skill: {
      type: Object,
      required: true
    }
  },
  emits: ['edit', 'delete'],
  setup() {
    const { skillCategories, skillLevels } = useSkills();
    
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
    };
  }
}
</script>

<style scoped>
.skill-card {
  background-color: white;
  border-radius: 8px;
  padding: 1.25rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
}

.skill-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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
}

.skill-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background: none;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.edit-btn:hover {
  background-color: #f3f4f6;
  color: #4f46e5;
}

.delete-btn:hover {
  background-color: #fee2e2;
  color: #ef4444;
}

.skill-category {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.75rem;
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
}

.stars i.empty {
  color: #e5e7eb;
}

.level-text {
  font-size: 0.875rem;
  color: #6b7280;
}

.skill-meta {
  font-size: 0.875rem;
}

.meta-item {
  display: flex;
  gap: 0.375rem;
  margin-bottom: 0.5rem;
}

.meta-label {
  color: #6b7280;
  font-weight: 500;
}

.meta-value {
  color: #374151;
}

.skill-notes {
  margin-top: 0.75rem;
}

.notes-label {
  color: #6b7280;
  font-weight: 500;
  margin-bottom: 0.25rem;
  display: block;
}

.notes-text {
  margin: 0.25rem 0 0 0;
  color: #374151;
  line-height: 1.4;
}

@media (max-width: 640px) {
  .skill-header {
    flex-direction: column;
  }
  
  .skill-actions {
    margin-top: 0.5rem;
  }
}
</style>