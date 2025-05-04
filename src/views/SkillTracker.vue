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
            <!-- Add loading state -->
            <div v-if="skillsLoading" class="loading-state small">Loading Chart...</div>
            <SkillRadarChart v-else :skills="filteredSkills" />
          </div>
          
          <div class="chart-card">
            <h3>Skill Progression</h3>
            <!-- Add loading state -->
            <div v-if="skillsLoading" class="loading-state small">Loading Chart...</div>
            <SkillProgressChart v-else :skills="filteredSkills" />
          </div>
        </div>
        
        <div v-if="skillsLoading" class="loading-state">Loading Skills...</div>
        <div v-else class="skills-grid">
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
import AppHeader from '@/components/common/AppHeader.vue';
import AppSidebar from '@/components/common/AppSidebar.vue';
import SkillCard from '@/components/skills/SkillCard.vue';
import SkillFilterBar from '@/components/skills/SkillFilterBar.vue';
import SkillRadarChart from '@/components/skills/SkillRadarChart.vue';
import SkillProgressChart from '@/components/skills/SkillProgressChart.vue';
import SkillFormModal from '@/components/skills/SkillFormModal.vue';
import ConfirmDialog from '@/components/common/ConfirmDialog.vue';
import useSkills from '@/composables/useSkills';
import useTimeline from '@/composables/useTimeline';

export default {
  name: 'SkillTrackerView',
  components: {
    AppHeader,
    AppSidebar,
    SkillCard,
    SkillFilterBar,
    SkillRadarChart,
    SkillProgressChart,
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

    const filters = ref({ category: 'all', level: 'all', search: '' });
    const showAddSkillModal = ref(false);
    const showDeleteConfirm = ref(false);
    const selectedSkill = ref(null);
    const skillToDelete = ref(null);

    // Filter skills based on user filters
    const filteredSkills = computed(() => {
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
      selectedSkill.value = skill ? { ...skill } : null;
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
      }
    };

    // Close skill modal and reset selection
    const closeSkillModal = () => {
      selectedSkill.value = null;
      showAddSkillModal.value = false;
    };

    return {
      skills,
      filteredSkills,
      filters,
      showAddSkillModal,
      showDeleteConfirm,
      selectedSkill,
      skillToDelete,
      openSkillModal,
      confirmDeleteSkill,
      deleteSkill,
      saveSkill,
      closeSkillModal,
      skillsLoading,
      skillsError
    };
  }
}
</script>

<style scoped>
.skill-tracker-view {
  min-height: 100vh;
  background-color: var(--bg-main);
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

.page-header h1 {
  color: var(--text-color);
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
}

.filter-bar {
  margin-bottom: 1.5rem;
  background: var(--card-bg);
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  border: 1px solid var(--border-color);
}

.charts-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.chart-card {
  background: var(--card-bg);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  border: 1px solid var(--border-color);
}

.chart-card h3 {
  color: var(--text-color);
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 8px rgba(79, 70, 229, 0.12);
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background-color: var(--primary-color-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(79, 70, 229, 0.18);
}

.icon {
  font-size: 1.2rem;
  font-weight: bold;
}

.loading-state {
  text-align: center;
  color: var(--text-color-light);
  font-size: 1rem;
  font-weight: 500;
}

.loading-state.small {
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .charts-section {
    grid-template-columns: 1fr;
  }
}
</style>