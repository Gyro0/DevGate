<template>
  <div class="skill-tracker-view bg-light min-vh-100">
    <AppHeader />
    <div class="container-fluid">
      <div class="row">
        <!-- Sidebar -->
        <div class="col-md-3 col-lg-2 bg-white p-0">
          <AppSidebar :active-page="'skills'" />
        </div>
<<<<<<< HEAD
        
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
=======

        <!-- Main Content -->
        <div class="col-md-9 col-lg-10 py-4">
          <!-- Page Header -->
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h1 class="h4 fw-bold">My Skills</h1>
            <button class="btn btn-primary" @click="openSkillModal">
              <i class="fas fa-plus me-2"></i> Add Skill
            </button>
          </div>

          <!-- Filter Bar -->
          <div class="card shadow-sm border-0 mb-4">
            <div class="card-body">
              <SkillFilterBar v-model="filters" />
            </div>
          </div>

          <!-- Charts Section -->
          <div class="row g-4 mb-4">
            <div class="col-md-6">
              <div class="card shadow-sm border-0">
                <div class="card-body">
                  <h5 class="card-title fw-bold">Skill Categories</h5>
                  <SkillRadarChart :skills="filteredSkills" />
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="card shadow-sm border-0">
                <div class="card-body">
                  <h5 class="card-title fw-bold">Skill Progression</h5>
                  <SkillProgressChart :skills="filteredSkills" />
                </div>
              </div>
            </div>
          </div>

          <!-- Skills Grid -->
          <div class="row g-4">
            <div class="col-md-4" v-for="skill in filteredSkills" :key="skill.id">
              <SkillCard
                :skill="skill"
                @edit="openSkillModal"
                @delete="confirmDeleteSkill"
              />
            </div>
          </div>
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
        </div>
      </div>
    </div>

    <!-- Modals -->
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
    ConfirmDialog,
  },
  setup() {
    const { skills, fetchUserSkills, addSkill, updateSkill, deleteSkill: removeSkill } = useSkills();
    const { recordEvent } = useTimeline();

    const filters = ref({ category: 'all', level: 'all', search: '' });
    const showAddSkillModal = ref(false);
    const showDeleteConfirm = ref(false);
    const selectedSkill = ref(null);
    const skillToDelete = ref(null);

<<<<<<< HEAD
    // Filter skills based on user filters
    const filteredSkills = computed(() => {
      if (!filters.value) return skills.value; 

      return skills.value.filter(skill => {
        // Filter by category
=======
    const filteredSkills = computed(() => {
      return skills.value.filter((skill) => {
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
        if (filters.value.category !== 'all' && skill.category !== filters.value.category) {
          return false;
        }
        if (filters.value.level !== 'all' && skill.level !== parseInt(filters.value.level)) {
          return false;
        }
        if (filters.value.search && !skill.name.toLowerCase().includes(filters.value.search.toLowerCase())) {
          return false;
        }
        return true;
      });
    });

    onMounted(async () => {
      await fetchUserSkills();
    });

    const openSkillModal = (skill = null) => {
      selectedSkill.value = skill ? { ...skill } : null;
      showAddSkillModal.value = true;
    };

    const confirmDeleteSkill = (skill) => {
      skillToDelete.value = skill;
      showDeleteConfirm.value = true;
    };

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

    const saveSkill = async (skillData) => {
      try {
        let savedSkill;
        if (selectedSkill.value?.id) {
          savedSkill = await updateSkill(selectedSkill.value.id, skillData);
          await recordEvent('skill', 'updated', savedSkill.id, { name: savedSkill.name });
        } else {
          savedSkill = await addSkill(skillData);
          await recordEvent('skill', 'added', savedSkill.id, { name: savedSkill.name });
        }
        closeSkillModal();
      } catch (error) {
        console.error('Error saving skill:', error);
      }
    };

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
<<<<<<< HEAD
      skillsLoading,
      skillsError
=======
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
    };
  },
};
</script>

<style scoped>
.skill-tracker-view {
<<<<<<< HEAD
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
=======
  background-color: #f8f9fa;
}

.card {
  border-radius: 8px;
}

.card-title {
  font-size: 1.25rem;
  font-weight: bold;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
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