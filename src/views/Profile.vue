<template>
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

<script>
import { ref, onMounted, watch, computed } from 'vue';
import AppHeader from '@/components/common/AppHeader.vue';
import AppSidebar from '@/components/common/AppSidebar.vue';
import ProfileCard from '@/components/profile/ProfileCard.vue';
import AccountSettings from '@/components/profile/AccountSettings.vue';
import ConnectedAccounts from '@/components/profile/ConnectedAccounts.vue';
import ChangeEmailModal from '@/components/modals/ChangeEmailModal.vue';
import ChangePasswordModal from '@/components/modals/ChangePasswordModal.vue';
import DeleteAccountModal from '@/components/modals/DeleteAccountModal.vue';
import useProfile from '@/composables/useProfile';
import useAuth from '@/composables/useAuth';

export default {
  components: {
    AppHeader,
    AppSidebar,
    ProfileCard,
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
    };
  },
};
</script>

<style scoped>
.profile-view {
  min-height: 100vh;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card {
  border-radius: 8px;
}

.card-title {
  font-size: 1.5rem;
  font-weight: bold;
}

.card-text {
  font-size: 0.9rem;
}
</style>