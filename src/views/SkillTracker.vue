<template>
  <div class="skill-tracker-view bg-light min-vh-100">
    <AppHeader />
    <div class="container-fluid">
      <div class="row">
        <!-- Sidebar -->
        <div class="col-md-3 col-lg-2 bg-white p-0">
          <AppSidebar :active-page="'skills'" />
        </div>

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

    const filteredSkills = computed(() => {
      return skills.value.filter((skill) => {
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
    };
  },
};
</script>

<style scoped>
.skill-tracker-view {
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
}

@media (max-width: 768px) {
  .charts-section {
    grid-template-columns: 1fr;
  }
}
</style>