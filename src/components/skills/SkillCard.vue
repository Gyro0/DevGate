<template>
  <div class="skill-card">
    <div class="skill-header">
      <h3 class="skill-name">{{ skill.name }}</h3>
      <div class="skill-actions">
        <button class="action-btn edit-btn" @click="$emit('edit', skill)" title="Edit Skill">
          <i class="fas fa-edit"></i>
          <span>Edit</span>
        </button>
        <button class="action-btn delete-btn" @click="$emit('delete', skill)" title="Delete Skill">
          <i class="fas fa-trash"></i>
          <span>Delete</span>
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
  background-color: #e3e3e3; /* Changed back to white */
  border-radius: 8px; /* Consistent border radius */
  padding: 1.5rem; /* Increased padding */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); /* Subtle shadow */
  border: 1px solid #e5e7eb; /* Light border */
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
  height: 100%; /* Ensure cards in a grid have same height */
}

.skill-card:hover {
  transform: translateY(-3px); /* Slightly more lift */
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08); /* Enhanced shadow on hover */
}

.skill-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start; /* Align items to the top */
  margin-bottom: 0.5rem; /* Reduced margin */
}

.skill-name {
  margin: 0;
  font-size: 1.2rem; /* Slightly larger */
  font-weight: 600;
  color: #1f2937; /* Darker text */
  line-height: 1.3; /* Adjust line height */
  margin-right: 0.5rem; /* Space between name and actions */
}

.skill-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0; /* Prevent actions from shrinking */
}

.action-btn {
  background: none;
  border: 1px solid transparent; /* Add border for structure */
  padding: 0.3rem 0.8rem; /* Adjust padding */
  border-radius: 6px; /* Standard button radius */
  display: inline-flex; /* Use inline-flex */
  align-items: center;
  justify-content: center;
  gap: 0.4rem; /* Space between icon and text */
  cursor: pointer;
  color: #6b7280; /* Default icon/text color */
  font-size: 0.8rem; /* Smaller font size */
  font-weight: 500; /* Medium weight */
  transition: background-color 0.2s, color 0.2s, border-color 0.2s;
  white-space: nowrap; /* Prevent text wrapping */
}

.action-btn i {
  font-size: 0.8rem; /* Adjust icon size to match text */
  line-height: 1; /* Ensure icon aligns well */
}

.edit-btn {
  border-color: #d1d5db; /* Light gray border */
}

.edit-btn:hover {
  background-color: #eef2ff; /* Light indigo background */
  color: #4f46e5; /* Indigo color */
  border-color: #c7d2fe; /* Lighter indigo border */
}

.delete-btn {
   border-color: #fca5a5; /* Light red border */
   color: #ef4444; /* Red text/icon */
}

.delete-btn:hover {
  background-color: #fee2e2; /* Light red background */
  color: #dc2626; /* Darker red color */
  border-color: #fca5a5; /* Keep border color */
}

.skill-category {
  font-size: 0.8rem; /* Smaller category text */
  color: #6b7280;
  margin-bottom: 1rem; /* Increased space below category */
  background-color: #f3f4f6; /* Subtle background */
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  display: inline-block; /* Fit content */
  text-transform: uppercase; /* Uppercase for emphasis */
  font-weight: 500;
}

.skill-rating {
  display: flex;
  align-items: center;
  margin-bottom: 1.25rem; /* Increased space below rating */
}

.stars {
  display: flex;
  margin-right: 0.75rem;
  color: #f59e0b; /* Amber color for stars */
  font-size: 1rem; /* Slightly larger stars */
}

.stars i {
  margin-right: 0.125rem;
}

/* Use fa-star-o for empty stars if FontAwesome 4 is used, or adjust if using FA5+ */
.stars i.fa-star-o { /* Or .far.fa-star for FA5 */
  color: #d1d5db; /* Lighter color for empty stars */
}

.level-text {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.skill-meta {
  font-size: 0.8rem; /* Smaller meta text */
  margin-top: auto; /* Push meta to the bottom */
  padding-top: 1rem; /* Space above meta */
  border-top: 1px solid #f3f4f6; /* Light separator */
}

.meta-item {
  display: flex;
  gap: 0.375rem;
  margin-bottom: 0.5rem;
  color: #4b5563; /* Consistent meta text color */
}
.meta-item:last-child {
  margin-bottom: 0;
}

.meta-label {
  color: #6b7280;
  font-weight: 500;
  flex-shrink: 0; /* Prevent label from shrinking */
}

.meta-value {
  color: #374151;
  word-break: break-word;
}

.skill-notes {
  margin-top: 1rem; /* Space above notes */
  background-color: #f9fafb; /* Very light background for notes */
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid #f3f4f6;
}

.notes-label {
  color: #6b7280;
  font-weight: 600; /* Bolder notes label */
  margin-bottom: 0.35rem;
  display: block;
  font-size: 0.8rem;
}

.notes-text {
  margin: 0;
  color: #374151;
  line-height: 1.5; /* Improved line spacing */
  font-size: 0.85rem;
}

@media (max-width: 640px) {
  .skill-header {
    /* Keep header row layout on small screens if possible */
  }
  .skill-name {
    font-size: 1.1rem; /* Adjust font size */
  }
  .skill-card {
    padding: 1rem; /* Reduce padding */
  }
  .action-btn span {
    /* Optionally hide text on very small screens if needed */
    /* display: none; */
  }
  .action-btn {
    /* Adjust padding if text is hidden */
    /* padding: 0.3rem; */
    /* width: 32px; */
    /* height: 32px; */
  }
}
</style>