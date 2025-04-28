<template>
    <div class="dashboard-view">
      <AppHeader />
      <div class="main-layout">
        <AppSidebar :active-page="'dashboard'" />
        
        <div class="content-area">
          <div class="welcome-section">
            <UserSummary />
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
    ObjectivesProgressWidget
  },
  setup() {
    const { user } = useAuth(); // Keep user if needed directly in setup, though likely used by child components
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
        fetchUserTimeline(10) // Just recent activities
      ]);
    });

    // No reactive state or methods needed directly by the template in this case
    return {
      // user // Only return if used directly in the Dashboard template
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
  }
  </style>