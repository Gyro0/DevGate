<template>
  <div class="profile-view">
    <AppHeader />
    <div class="main-layout">
      <AppSidebar :active-page="'profile'" />

      <div class="content-area" v-if="userProfile">
        <div class="profile-header">
          <h1>User Profile</h1>
          <button @click="goToSettings" class="edit-button">
            <i class="fas fa-cog"></i>
            Settings
          </button>
        </div>

        <!-- Profile Info -->
        <ProfileCard :userProfile="userProfile" @triggerPhotoUpload="triggerPhotoUpload" @handlePhotoChange="handlePhotoChange" />

        <!-- Dashboard Components Section -->
        <div class="profile-dashboard-section">
          <div class="profile-widget">
             <UserSummary />
          </div>
          <div class="profile-widget">
            <SkillSummaryWidget /> <!-- Added Skill Summary -->
          </div>
          <div class="profile-widget">
            <ProjectSummaryWidget /> <!-- Added Project Summary -->
          </div>
          <div class="profile-widget">
            <ActivityFeedWidget />
          </div>
           <div class="profile-widget">
             <ObjectivesProgressWidget />
           </div>
        </div>
      </div>
      <!-- Loading/Error States -->
      <div class="content-area loading-state" v-else-if="loading">
         <p>Loading profile...</p>
      </div>
       <div class="content-area error-state" v-else>
         <p>Could not load user profile. {{ error }}</p>
         <button @click="fetchUserProfile">Retry</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch, computed } from 'vue';
import AppHeader from '@/components/common/AppHeader.vue';
import AppSidebar from '@/components/common/AppSidebar.vue';
import ProfileCard from '@/components/profile/ProfileCard.vue';
import UserSummary from '@/components/dashboard/UserSummary.vue';
import ActivityFeedWidget from '@/components/dashboard/ActivityFeedWidget.vue';
import ObjectivesProgressWidget from '@/components/dashboard/ObjectivesProgressWidget.vue';
import SkillSummaryWidget from '@/components/dashboard/SkillSummaryWidget.vue'; // Import Skill Summary
import ProjectSummaryWidget from '@/components/dashboard/ProjectSummaryWidget.vue'; // Import Project Summary

import useProfile from '@/composables/useProfile';
import useFileUpload from '@/composables/useFileUpload';
import useAuth from '@/composables/useAuth';
import { useRouter } from 'vue-router';

export default {
  components: {
    AppHeader,
    AppSidebar,
    ProfileCard,
    UserSummary,
    ActivityFeedWidget,
    ObjectivesProgressWidget,
    SkillSummaryWidget, // Register Skill Summary
    ProjectSummaryWidget, // Register Project Summary
  },
  setup() {
    const router = useRouter(); // Get router instance
    const {
      userProfile,
      loading,
      error,
      fetchUserProfile
    } = useProfile();
    const { user, isAuthenticated } = useAuth();
    const { uploadFile } = useFileUpload(); // Keep for photo change

    const userStats = computed(() => {
      if (!userProfile.value) return { skills: 0, objectives: 0, completedProjects: 0 };
      return {
        skills: userProfile.value.skillsCount || 0,
        objectives: userProfile.value.objectivesCount || 0,
        completedProjects: userProfile.value.completedProjectsCount || 0
      };
    });

    watch(isAuthenticated, (isAuth) => {
      if (isAuth) {
        fetchUserProfile();
      } else {
        userProfile.value = null;
      }
    }, { immediate: true });

    onMounted(() => {
      if (isAuthenticated.value) {
        fetchUserProfile();
      }
    });

    // Function to navigate to settings
    const goToSettings = () => {
      router.push('/settings');
    };

    const triggerPhotoUpload = () => { /* ... */ };
    const handlePhotoChange = async (file) => { /* ... */ };

    return {
      userProfile,
      loading,
      error,
      userStats,
      triggerPhotoUpload, // Keep for now
      handlePhotoChange, // Keep for now
      fetchUserProfile,
      goToSettings, // Expose navigation function
    };
  }
};
</script>

<style scoped>
.profile-view {
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

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.edit-button {
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
}

.profile-dashboard-section {
  margin-top: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.profile-widget {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  min-height: 300px; /* Adjust as needed */
  display: flex;
  flex-direction: column;
  overflow: hidden; /* Ensure content stays within card */
}
/* Ensure widgets inside fill the space */
.profile-widget > div {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 64px);
}
.error-state button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
}
</style>