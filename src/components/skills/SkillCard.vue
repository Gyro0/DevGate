<template>
  <div class="skill-card">
    <div class="skill-header">
      <div class="skill-name-level">
        <h3>{{ skill.name }}</h3>
        <div class="skill-level" :class="`level-${skill.level}`">
          {{ getLevelLabel(skill.level) }}
        </div>
      </div>
      <div class="skill-actions">
        <button class="action-btn edit-btn" @click="$emit('edit', skill)">
          <i class="fas fa-pen"></i>
        </button>
        <button class="action-btn delete-btn" @click="$emit('delete', skill)">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
    
    <div class="skill-category">
      <span class="category-badge" :class="`category-${skill.category}`">
        {{ getCategoryName(skill.category) }}
      </span>
    </div>
    
    <div class="skill-progress">
      <div class="progress-bar">
        <div class="progress-fill" :style="`width: ${(skill.level / 5) * 100}%`"></div>
      </div>
    </div>
    
    <div class="skill-dates">
      <div class="date-item">
        <span class="date-label">Added:</span>
        <span class="date-value">{{ formatDate(skill.dateAcquired) }}</span>
      </div>
      <div class="date-item">
        <span class="date-label">Updated:</span>
        <span class="date-value">{{ formatDate(skill.lastUpdated) }}</span>
      </div>
    </div>
    
    <div v-if="skill.notes" class="skill-notes">
      {{ skill.notes }}
    </div>
  </div>
</template>

<script>
import useSkills from '@/composables/useSkills'; // Keep this import

export default {
  name: 'SkillCard',
  props: {
    skill: {
      type: Object,
      required: true
    }
  },
  emits: ['edit', 'delete'],
  setup(props) { // props is automatically available
    const { skillCategories, skillLevels } = useSkills();

    // Get category name from category ID
    const getCategoryName = (categoryId) => {
      const category = skillCategories.find(cat => cat.id === categoryId);
      return category ? category.name : 'Uncategorized';
    };

    // Get level label from level value
    const getLevelLabel = (levelValue) => {
      const level = skillLevels.find(l => l.value === levelValue);
      return level ? level.label : 'Unknown';
    };

    // Format date for display
    const formatDate = (timestamp) => {
      if (!timestamp) return 'N/A';
      
      let date;
      if (timestamp?.toDate) { // Check if it's a Firestore Timestamp object
        date = timestamp.toDate();
      } else if (timestamp?.seconds) { // Check if it's a Firestore Timestamp plain object
        date = new Date(timestamp.seconds * 1000);
      } else { // Assume it's a JS Date or string/number
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

    // Return everything needed by the template
    return {
      getCategoryName,
      getLevelLabel,
      formatDate
      // props.skill is automatically available in the template
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
  display: flex;
  flex-direction: column;
  transition: transform 0.2s, box-shadow 0.2s;
}

.skill-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.skill-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.skill-name-level h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #111827;
}

.skill-level {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-top: 0.5rem;
}

.level-1 { background-color: #DBEAFE; color: #1E40AF; } /* Beginner */
.level-2 { background-color: #E0E7FF; color: #4338CA; } /* Elementary */
.level-3 { background-color: #C7D2FE; color: #4F46E5; } /* Intermediate */
.level-4 { background-color: #DDD6FE; color: #7C3AED; } /* Advanced */
.level-5 { background-color: #EDE9FE; color: #6D28D9; } /* Expert */

.skill-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #6B7280;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background-color 0.2s, color 0.2s;
}

.edit-btn:hover {
  background-color: #F3F4F6;
  color: #4F46E5;
}

.delete-btn:hover {
  background-color: #FEE2E2;
  color: #DC2626;
}

.skill-category {
  margin-bottom: 1rem;
}

.category-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 20px;
  font-size: 0.75rem;
  background-color: #F3F4F6;
  color: #4B5563;
}

.category-frontend { background-color: #FEF3C7; color: #92400E; }
.category-backend { background-color: #D1FAE5; color: #065F46; }
.category-devops { background-color: #DBEAFE; color: #1E40AF; }
.category-mobile { background-color: #FEE2E2; color: #B91C1C; }
.category-database { background-color: #E0E7FF; color: #4338CA; }
.category-other { background-color: #F3F4F6; color: #4B5563; }

.skill-progress {
  margin-bottom: 1rem;
}

.progress-bar {
  height: 6px;
  background-color: #F3F4F6;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #4F46E5;
  border-radius: 3px;
  transition: width 0.3s ease-in-out;
}

.skill-dates {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  font-size: 0.75rem;
  color: #6B7280;
}

.date-item {
  display: flex;
  gap: 0.25rem;
}

.date-label {
  font-weight: 500;
}

.skill-notes {
  font-size: 0.875rem;
  color: #4B5563;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid #E5E7EB;
}
</style>