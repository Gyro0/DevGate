<template>
  <div class="dashboard-view bg-light min-vh-100">
    <!-- Header -->
    <AppHeader />

    <div class="container-fluid">
      <div class="row">
        <!-- Sidebar -->
        <div class="col-md-3 col-lg-2 bg-white p-0">
          <AppSidebar :active-page="'dashboard'" />
        </div>

        <!-- Main Content -->
        <div class="col-md-9 col-lg-10 py-4">
          <!-- Welcome Section -->
          <div class="mb-4">
            <UserSummary />
          </div>

          <!-- Dashboard Widgets -->
          <div class="row g-4">
            <div class="col-md-6">
              <SkillSummaryWidget />
            </div>
            <div class="col-md-6">
              <ProjectSummaryWidget />
            </div>
            <div class="col-md-6">
              <ActivityFeedWidget />
            </div>
            <div class="col-md-6">
              <ObjectivesProgressWidget />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppHeader from '@/components/common/AppHeader.vue';
import AppSidebar from '@/components/common/AppSidebar.vue';
import UserSummary from '@/components/dashboard/UserSummary.vue';
import SkillSummaryWidget from '@/components/dashboard/SkillSummaryWidget.vue';
import ProjectSummaryWidget from '@/components/dashboard/ProjectSummaryWidget.vue';
import ActivityFeedWidget from '@/components/dashboard/ActivityFeedWidget.vue';
import ObjectivesProgressWidget from '@/components/dashboard/ObjectivesProgressWidget.vue';
import { onMounted } from 'vue';
import useAuth from '@/composables/useAuth';
import useSkills from '@/composables/useSkills';
import useProjects from '@/composables/useProjects';
import useObjectives from '@/composables/useObjectives';
import useTimeline from '@/composables/useTimeline';

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
  },
  setup() {
    const { fetchUserSkills } = useSkills();
    const { fetchUserProjects } = useProjects();
    const { fetchUserObjectives } = useObjectives();
    const { fetchUserTimeline } = useTimeline();

    onMounted(async () => {
      // Load all user data for dashboard
      await Promise.all([
        fetchUserSkills(),
        fetchUserProjects(),
        fetchUserObjectives(),
        fetchUserTimeline(10), // Fetch recent activities
      ]);
    });

    return {};
  },
};
</script>

<style scoped>
.dashboard-view {
  background-color: #f8f9fa; /* Light background */
}

.container-fluid {
  padding: 0;
}

.row {
  margin: 0;
}

.col-md-3 {
  border-right: 1px solid #e9ecef; /* Light gray border for sidebar */
}

.py-4 {
  padding-top: 1.5rem !important;
  padding-bottom: 1.5rem !important;
}

.g-4 {
  gap: 1.5rem !important; /* Bootstrap gap utility for spacing */
}
</style>