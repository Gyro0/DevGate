<template>
<<<<<<< HEAD
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

=======
  <div class="profile-view bg-light min-vh-100">
    <AppHeader />
    <div class="container-fluid">
      <div class="row">
        <!-- Sidebar -->
        <div class="col-md-3 col-lg-2 bg-white p-0">
          <AppSidebar :active-page="'profile'" />
        </div>

        <!-- Main Content -->
        <div class="col-md-9 col-lg-10 py-4">
          <div v-if="userProfile">
            <!-- Profile Header -->
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h1 class="h4">User Profile</h1>
              <button @click="editMode = !editMode" class="btn btn-outline-primary">
                <i :class="editMode ? 'fas fa-times' : 'fas fa-pen'"></i>
                {{ editMode ? 'Cancel' : 'Edit Profile' }}
              </button>
            </div>

            <!-- Profile Card -->
            <div class="mb-4">
              <ProfileCard
                :userProfile="userProfile"
                :editMode="editMode"
                @triggerPhotoUpload="triggerPhotoUpload"
                @handlePhotoChange="handlePhotoChange"
              />
            </div>

            <!-- Profile Stats -->
            <div class="row g-4 mb-4">
              <div class="col-md-3">
                <div class="card text-center shadow-sm">
                  <div class="card-body">
                    <h5 class="card-title text-primary">{{ userStats.skills }}</h5>
                    <p class="card-text text-muted">Skills</p>
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="card text-center shadow-sm">
                  <div class="card-body">
                    <h5 class="card-title text-primary">{{ userStats.objectives }}</h5>
                    <p class="card-text text-muted">Completed Goals</p>
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="card text-center shadow-sm">
                  <div class="card-body">
                    <h5 class="card-title text-primary">{{ userStats.completedProjects }}</h5>
                    <p class="card-text text-muted">Completed Projects</p>
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="card text-center shadow-sm">
                  <div class="card-body">
                    <h5 class="card-title text-primary">30</h5>
                    <p class="card-text text-muted">Days Active</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Account Settings -->
            <div class="mb-4">
              <h2 class="h5 mb-3">Account Settings</h2>
              <AccountSettings
                :userProfile="userProfile"
                @changeEmail="showChangeEmailModal = true"
                @changePassword="showChangePasswordModal = true"
              />
            </div>

            <!-- Connected Accounts -->
            <div class="mb-4">
              <h2 class="h5 mb-3">Connected Accounts</h2>
              <ConnectedAccounts :userProfile="userProfile" />
            </div>
          </div>

          <!-- Loading State -->
          <div v-else class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3 text-muted">Loading profile...</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <ChangeEmailModal
      v-if="showChangeEmailModal"
      @close="showChangeEmailModal = false"
      @email-changed="handleEmailChanged"
    />
    <ChangePasswordModal
      v-if="showChangePasswordModal"
      @close="showChangePasswordModal = false"
      @password-changed="handlePasswordChanged"
    />
    <DeleteAccountModal
      v-if="showDeleteAccountModal"
      @close="showDeleteAccountModal = false"
      @account-deleted="handleAccountDeleted"
    />
  </div>
</template>

>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
<script>
import { ref, onMounted, watch, computed } from 'vue';
import AppHeader from '@/components/common/AppHeader.vue';
import AppSidebar from '@/components/common/AppSidebar.vue';
import ProfileCard from '@/components/profile/ProfileCard.vue';
<<<<<<< HEAD
import ActivityFeedWidget from '@/components/dashboard/ActivityFeedWidget.vue';
import ObjectivesProgressWidget from '@/components/dashboard/ObjectivesProgressWidget.vue';
import SkillSummaryWidget from '@/components/dashboard/SkillSummaryWidget.vue'; // Import Skill Summary
import ProjectSummaryWidget from '@/components/dashboard/ProjectSummaryWidget.vue'; // Import Project Summary

=======
import AccountSettings from '@/components/profile/AccountSettings.vue';
import ConnectedAccounts from '@/components/profile/ConnectedAccounts.vue';
import ChangeEmailModal from '@/components/modals/ChangeEmailModal.vue';
import ChangePasswordModal from '@/components/modals/ChangePasswordModal.vue';
import DeleteAccountModal from '@/components/modals/DeleteAccountModal.vue';
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
import useProfile from '@/composables/useProfile';
import useAuth from '@/composables/useAuth';

export default {
  components: {
    AppHeader,
    AppSidebar,
    ProfileCard,
<<<<<<< HEAD
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
=======
    AccountSettings,
    ConnectedAccounts,
    ChangeEmailModal,
    ChangePasswordModal,
    DeleteAccountModal,
  },
  setup() {
    const { userProfile, editedProfile, fetchUserProfile, updateUserProfile } = useProfile();
    const { user, isAuthenticated } = useAuth();

    const editMode = ref(false);
    const showChangeEmailModal = ref(false);
    const showChangePasswordModal = ref(false);
    const showDeleteAccountModal = ref(false);

    const userStats = computed(() => ({
      skills: userProfile.value?.skillsCount || 0,
      objectives: userProfile.value?.objectivesCount || 0,
      completedProjects: userProfile.value?.completedProjectsCount || 0,
    }));

    watch(isAuthenticated, (isAuth) => {
      if (isAuth) fetchUserProfile();
    }, { immediate: true });

    onMounted(() => {
      if (isAuthenticated.value) fetchUserProfile();
    });

    const handleEmailChanged = () => fetchUserProfile();
    const handlePasswordChanged = () => {};
    const handleAccountDeleted = () => {};

    return {
      userProfile,
      editedProfile,
      editMode,
      showChangeEmailModal,
      showChangePasswordModal,
      showDeleteAccountModal,
      userStats,
      handleEmailChanged,
      handlePasswordChanged,
      handleAccountDeleted,
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
    };
  },
};
</script>

<style scoped>
.profile-view {
  min-height: 100vh;
<<<<<<< HEAD
  background: var(--background);
}

.main-layout {
  display: flex;
  min-height: calc(100vh - 64px);
}

.content-area {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
=======
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

<<<<<<< HEAD
.edit-button {
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: 0.7rem;
  padding: 0.6rem 1.3rem;
  font-weight: 700;
  font-size: 1rem;
  box-shadow: 0 0 8px var(--primary-glow);
  cursor: pointer;
  transition: background 0.18s, box-shadow 0.18s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.edit-button:hover {
  background: var(--primary-glow);
  box-shadow: 0 0 16px 2px var(--primary-glow);
}

.profile-dashboard-section {
  margin-top: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.profile-widget {
  background: var(--surface-card);
  border-radius: 1.1rem;
  box-shadow: 0 2px 16px 0 rgba(0,0,0,0.25), 0 0 0 2px var(--primary-glow), 0 0 8px 2px var(--circuit-accent);
  min-height: 300px;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1.2rem;
  border: 1.5px solid var(--border-color, #23272e);
}

.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 64px);
  color: var(--text-tertiary, #7a869a);
=======
.card {
  border-radius: 8px;
}

.card-title {
  font-size: 1.5rem;
  font-weight: bold;
}

.card-text {
  font-size: 0.9rem;
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
}
</style>