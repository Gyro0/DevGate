<template>
  <div class="skill-tracker-view">
    <AppHeader />
    <div class="main-layout">
      <AppSidebar :active-page="'skills'" />
      
      <div class="content-area">
        <div class="page-header">
          <h1>My Skills</h1>
          <button class="btn-primary" @click="openSkillModal">
            <span class="icon">+</span> Add Skill
          </button>
        </div>
        
        <div class="filter-bar">
          <SkillFilterBar v-model="filters" />
        </div>
        
        <div class="charts-section">
          <div class="chart-card">
            <h3>Skill Categories</h3>
            <SkillRadarChart :skills="filteredSkills" />
          </div>
          
          <div class="chart-card">
            <h3>Skill Progression</h3>
            <SkillProgressChart :skills="filteredSkills" />
          </div>
        </div>
        
        <div class="skills-grid">
          <SkillCard 
            v-for="skill in filteredSkills" 
            :key="skill.id" 
            :skill="skill"
            @edit="openSkillModal"
            @delete="confirmDeleteSkill"
          />
        </div>
      </div>
    </div>
    
    <SkillFormModal
      v-if="showAddSkillModal"
      :skill="selectedSkill"
      @save="saveSkill"
      @close="closeSkillModal"
    />
    
    <ConfirmDialog
      v-if="showDeleteConfirm"
      :message="`Delete skill '${skillToDelete?.name}'?`"
      @confirm="deleteSkill"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import AppHeader from '@/components/common/AppHeader.vue'; // Assuming these are still needed
import AppSidebar from '@/components/common/AppSidebar.vue'; // Assuming these are still needed
import SkillCard from '@/components/skills/SkillCard.vue';
import SkillFilterBar from '@/components/skills/SkillFilterBar.vue'; // Assuming this exists
import SkillRadarChart from '@/components/skills/SkillRadarChart.vue'; // Assuming this exists
import SkillProgressChart from '@/components/skills/SkillProgressChart.vue'; // Assuming this exists
import SkillFormModal from '@/components/skills/SkillFormModal.vue';
import ConfirmDialog from '@/components/common/ConfirmDialog.vue';
import useSkills from '@/composables/useSkills';
import useTimeline from '@/composables/useTimeline';

export default {
  name: 'SkillTrackerView',
  components: {
    // AppHeader, // Remove if not used in template
    // AppSidebar, // Remove if not used in template
    SkillCard,
    // SkillFilterBar, // Remove if not used in template
    // SkillRadarChart, // Remove if not used in template
    // SkillProgressChart, // Remove if not used in template
    SkillFormModal,
    ConfirmDialog
  },
  setup() {
    const { 
      skills, 
      loading: skillsLoading, 
      error: skillsError, 
      fetchUserSkills, 
      addSkill, 
      updateSkill, 
      deleteSkill: removeSkill 
    } = useSkills();
    const { recordEvent } = useTimeline();

    const filters = ref({ category: 'all', level: 'all', search: '' }); // Keep filters if SkillFilterBar is used
    const showAddSkillModal = ref(false);
    const showDeleteConfirm = ref(false);
    const selectedSkill = ref(null);
    const skillToDelete = ref(null);

    // Filter skills based on user filters (adjust if filters are removed)
    const filteredSkills = computed(() => {
      // If filters are removed, just return skills.value
      if (!filters.value) return skills.value; 

      return skills.value.filter(skill => {
        // Filter by category
        if (filters.value.category !== 'all' && skill.category !== filters.value.category) {
          return false;
        }
        
        // Filter by level
        if (filters.value.level !== 'all' && skill.level !== parseInt(filters.value.level)) {
          return false;
        }
        
        // Filter by search term
        if (filters.value.search && !skill.name.toLowerCase().includes(filters.value.search.toLowerCase())) {
          return false;
        }
        
        return true;
      });
    });

    // Fetch skills on component mount
    onMounted(async () => {
      await fetchUserSkills();
    });

    // Open add/edit modal for a skill
    const openSkillModal = (skill = null) => {
      selectedSkill.value = skill ? { ...skill } : null; // Create copy if editing
      showAddSkillModal.value = true;
    };

    // Initialize deletion process for a skill
    const confirmDeleteSkill = (skill) => {
      skillToDelete.value = skill;
      showDeleteConfirm.value = true;
    };

    // Delete the skill after confirmation
    const deleteSkill = async () => {
      if (!skillToDelete.value?.id) return;
      try {
        await removeSkill(skillToDelete.value.id);
        await recordEvent('skill', 'deleted', skillToDelete.value.id, { name: skillToDelete.value.name });
        showDeleteConfirm.value = false;
        skillToDelete.value = null;
      } catch (error) {
        console.error('Error deleting skill:', error);
        // Handle error display
      }
    };

    // Save new or updated skill
    const saveSkill = async (skillData) => {
      try {
        let savedSkill;
        if (selectedSkill.value?.id) {
          // Update existing skill
          savedSkill = await updateSkill(selectedSkill.value.id, skillData);
          await recordEvent('skill', 'updated', savedSkill.id, { name: savedSkill.name });
        } else {
          // Add new skill
          savedSkill = await addSkill(skillData);
          await recordEvent('skill', 'added', savedSkill.id, { name: savedSkill.name });
        }
        closeSkillModal();
      } catch (error) {
        console.error('Error saving skill:', error);
        // Handle error display
      }
    };

    // Close skill modal and reset selection
    const closeSkillModal = () => {
      selectedSkill.value = null;
      showAddSkillModal.value = false;
    };

    // Return reactive state and methods
    return {
      skills, // Raw skills if needed
      filteredSkills, // Use this in the template's v-for
      filters, // If filter bar is used
      showAddSkillModal,
      showDeleteConfirm,
      selectedSkill,
      skillToDelete,
      openSkillModal, // Renamed from editSkill for clarity
      editSkill: openSkillModal, // Keep alias if template uses @edit
      confirmDeleteSkill,
      deleteSkill,
      saveSkill,
      closeSkillModal,
      skillsLoading, // Expose loading/error if needed
      skillsError
    };
  }
}
</script>

<style scoped>
.skill-tracker-view {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.main-layout {
  display: flex;
  min-height: calc(100vh - 64px);
}

.content-area {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.filter-bar {
  margin-bottom: 1.5rem;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.charts-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.chart-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.btn-primary {
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.6rem 1.2rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.btn-primary:hover {
  background-color: #4338ca;
}

.icon {
  font-size: 1.2rem;
  font-weight: bold;
}

@media (max-width: 768px) {
  .charts-section {
    grid-template-columns: 1fr;
  }
}
</style>