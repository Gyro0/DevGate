<template>
  <div class="dashboard-view">
    <AppHeader />
    <div class="main-layout">
      <AppSidebar :active-page="'dashboard'" />
      
      <div class="content-area">
        <div class="welcome-section">
          <UserSummary />
          <!-- Add Buttons Here -->
          <div class="dashboard-actions">
            <button class="action-btn" @click="openAddSkillModal">Add Skill</button>
            <button class="action-btn" @click="openAddProjectModal">Add Project</button>
            <button class="action-btn" @click="openNewObjectiveModal">New Objective</button>
          </div>
        </div>
        
        <div class="dashboard-grid">
          <div class="dashboard-widget skills-widget">
            <SkillSummaryWidget />
          </div>
          
          <div class="dashboard-widget projects-widget">
            <ProjectSummaryWidget />
          </div>
          
          <div class="dashboard-widget activity-widget">
            <ActivityFeedWidget />
          </div>
          
          <div class="dashboard-widget objectives-widget">
            <ObjectivesProgressWidget />
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <SkillFormModal
      v-if="showSkillModal"
      :skill="null"
      @save="saveSkill"
      @close="closeSkillModal"
    />
    <ProjectFormModal
      v-if="showProjectModal"
      :project="null"
      @save="saveProject"
      @close="closeProjectModal"
    />
    <ObjectiveFormModal
      v-if="showObjectiveModal"
      :objective="null"
      @save="saveObjective"
      @close="closeObjectiveModal"
    />
  </div>
</template>

<script>
import { ref } from 'vue';
import AppHeader from '@/components/common/AppHeader.vue';
import AppSidebar from '@/components/common/AppSidebar.vue';
import UserSummary from '@/components/dashboard/UserSummary.vue';
import SkillSummaryWidget from '@/components/dashboard/SkillSummaryWidget.vue';
import ProjectSummaryWidget from '@/components/dashboard/ProjectSummaryWidget.vue';
import ActivityFeedWidget from '@/components/dashboard/ActivityFeedWidget.vue';
import ObjectivesProgressWidget from '@/components/dashboard/ObjectivesProgressWidget.vue';
import SkillFormModal from '@/components/skills/SkillFormModal.vue';
import ProjectFormModal from '@/components/projects/ProjectFormModal.vue';
import ObjectiveFormModal from '@/components/objectives/ObjectiveFormModal.vue';
import useAuth from '@/composables/useAuth';
import useSkills from '@/composables/useSkills';
import useProjects from '@/composables/useProjects';
import useObjectives from '@/composables/useObjectives';
import useTimeline from '@/composables/useTimeline';
import { onMounted } from 'vue';

export default {
  name: 'DashboardView',
  components: {
    AppHeader,
    AppSidebar,
    UserSummary,
    SkillSummaryWidget,
    ProjectSummaryWidget,
    ActivityFeedWidget,
    ObjectivesProgressWidget,
    SkillFormModal,
    ProjectFormModal,
    ObjectiveFormModal
  },
  setup() {
    const { user } = useAuth();
    const { fetchUserSkills, addSkill } = useSkills();
    const { fetchUserProjects, addProject } = useProjects();
    const { fetchUserObjectives, addObjective } = useObjectives();
    const { fetchUserTimeline, recordEvent } = useTimeline();

    // Modal visibility states
    const showSkillModal = ref(false);
    const showProjectModal = ref(false);
    const showObjectiveModal = ref(false);

    // Fetch data on mount
    onMounted(async () => {
      await Promise.all([
        fetchUserSkills(),
        fetchUserProjects(),
        fetchUserObjectives(),
        fetchUserTimeline(10) // Just recent activities
      ]);
    });

    // Open modals
    const openAddSkillModal = () => {
      showSkillModal.value = true;
    };

    const openAddProjectModal = () => {
      showProjectModal.value = true;
    };

    const openNewObjectiveModal = () => {
      showObjectiveModal.value = true;
    };

    // Close modals
    const closeSkillModal = () => {
      showSkillModal.value = false;
    };

    const closeProjectModal = () => {
      showProjectModal.value = false;
    };

    const closeObjectiveModal = () => {
      showObjectiveModal.value = false;
    };

    // Save handlers
    const saveSkill = async (formData) => {
      try {
        const savedSkill = await addSkill(formData);
        await recordEvent('skill', 'added', savedSkill.id, { name: savedSkill.name });
        closeSkillModal();
      } catch (error) {
        console.error('Error adding skill:', error);
      }
    };

    const saveProject = async (projectData, imageFile) => {
      try {
        const savedProject = await addProject(projectData, imageFile);
        await recordEvent('project', 'added', savedProject.id, { title: savedProject.title });
        closeProjectModal();
      } catch (error) {
        console.error('Error adding project:', error);
      }
    };

    const saveObjective = async (objectiveData) => {
      try {
        const savedObjective = await addObjective(objectiveData);
        await recordEvent('objective', 'added', savedObjective.id, { title: savedObjective.title });
        closeObjectiveModal();
      } catch (error) {
        console.error('Error adding objective:', error);
      }
    };

    return {
      showSkillModal,
      showProjectModal,
      showObjectiveModal,
      openAddSkillModal,
      openAddProjectModal,
      openNewObjectiveModal,
      closeSkillModal,
      closeProjectModal,
      closeObjectiveModal,
      saveSkill,
      saveProject,
      saveObjective
    };
  }
}
</script>

<style scoped>
.dashboard-view {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.main-layout {
  display: flex;
  min-height: calc(100vh - 64px); /* Account for header height */
}

.content-area {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}

.welcome-section {
  margin-bottom: 1.5rem;
}

.dashboard-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.action-btn {
  padding: 0.6rem 1.2rem;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.action-btn:hover {
  background-color: #4338ca;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 1.5rem;
}

.dashboard-widget {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .dashboard-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>