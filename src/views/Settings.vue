<template>
  <div class="settings-view">
    <AppHeader />
    <div class="main-layout">
      <AppSidebar :active-page="'settings'" />

      <div class="content-area" v-if="userProfile">
        <div class="page-header">
          <h1>Settings</h1>
        </div>

        <div class="settings-section">
          <h2>Account Settings</h2>
          <AccountSettings
            :userProfile="userProfile"
            @changeEmail="showChangeEmailModal = true"
            @changePassword="showChangePasswordModal = true"
            @deleteAccount="showDeleteAccountModal = true"
            @updateProfile="handleProfileUpdate"
          />
        </div>

        <div class="settings-section">
          <h2>Connected Accounts</h2>
          <ConnectedAccounts
            :connectedAccounts="userProfile.connectedAccounts"
            @connect="connectProvider"
            @disconnect="disconnectProvider"
          />
          <p v-if="connectError" class="error-message">{{ connectError }}</p>
          <p v-if="connectSuccess" class="success-message">{{ connectSuccess }}</p>
        </div>

      </div>
      <div class="content-area state-container loading-state" v-else-if="loading">
        <div class="spinner"></div>
        <p>Loading settings...</p>
      </div>
       <div class="content-area state-container error-state" v-else>
         <i class="fas fa-exclamation-triangle"></i>
         <p>Could not load user settings. {{ error }}</p>
         <button @click="fetchUserProfile" class="btn btn-secondary">Retry</button>
      </div>
    </div>

    <!-- Modals for Account Settings -->
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
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import AppHeader from '@/components/common/AppHeader.vue';
import AppSidebar from '@/components/common/AppSidebar.vue';
import AccountSettings from '@/components/profile/AccountSettings.vue'; // Reusing component
import ConnectedAccounts from '@/components/profile/ConnectedAccounts.vue'; // Reusing component
import ChangeEmailModal from '@/components/modals/ChangeEmailModal.vue';
import ChangePasswordModal from '@/components/modals/ChangePasswordModal.vue';
import DeleteAccountModal from '@/components/modals/DeleteAccountModal.vue';
import useAuth from '@/composables/useAuth';
import useProfile from '@/composables/useProfile'; // To get profile data

export default {
  name: 'SettingsView',
  components: {
    AppHeader,
    AppSidebar,
    AccountSettings,
    ConnectedAccounts,
    ChangeEmailModal,
    ChangePasswordModal,
    DeleteAccountModal
  },
  setup() {
    const router = useRouter();
    const { user, isAuthenticated, loginWithGoogle, loginWithGithub } = useAuth();
    const { userProfile, loading, error, fetchUserProfile, updateUserProfile } = useProfile();

    // Modal visibility
    const showChangeEmailModal = ref(false);
    const showChangePasswordModal = ref(false);
    const showDeleteAccountModal = ref(false);
    const connectError = ref(null);
    const connectSuccess = ref(null);
    const profileUpdateError = ref(null);
    const profileUpdateSuccess = ref(null);

    // Fetch profile data when authenticated
    const loadData = () => {
      if (isAuthenticated.value) {
        fetchUserProfile();
      }
    };

    watch(isAuthenticated, (isAuth) => {
      if (isAuth) {
        loadData();
      } else {
         userProfile.value = null; // Clear profile if user logs out
      }
    }, { immediate: true });

    onMounted(loadData);

    // --- Account Settings Handlers ---
    const handleEmailChanged = () => {
      fetchUserProfile(); // Refresh profile data
      alert('Email updated successfully!');
    };

    const handlePasswordChanged = () => {
      alert('Password updated successfully!');
    };

    const handleAccountDeleted = () => {
      alert('Account deleted successfully.');
      router.push('/login'); // Redirect after deletion
    };

    const handleProfileUpdate = async (payload) => {
      profileUpdateError.value = null;
      profileUpdateSuccess.value = null;
      try {
        console.log("Settings.vue: Received updateProfile event with payload:", payload);
        await updateUserProfile(payload);
        profileUpdateSuccess.value = "Profile updated successfully!";
      } catch (err) {
        console.error("Settings.vue: Error calling updateUserProfile:", err);
        profileUpdateError.value = `Failed to update profile: ${err.message}`;
      }
    };

    // --- Connected Accounts Handlers ---
     const connectProvider = async (provider) => {
      connectError.value = null;
      connectSuccess.value = null;
      try {
        let authFunction;
        if (provider === 'google') {
          authFunction = loginWithGoogle;
        } else if (provider === 'github') {
          authFunction = loginWithGithub;
        } else {
          throw new Error('Unsupported provider');
        }

        await authFunction();
        // Profile update (linking) is handled within useAuth's login methods
        await fetchUserProfile(); // Refresh profile to show connection
        connectSuccess.value = `${provider.charAt(0).toUpperCase() + provider.slice(1)} connected successfully!`;
      } catch (err) {
        console.error(`Error connecting ${provider}:`, err);
        connectError.value = `Failed to connect ${provider}: ${err.message}`;
      }
    };

    const disconnectProvider = async (provider) => {
       connectError.value = null;
       connectSuccess.value = null;
       if (!userProfile.value || !userProfile.value.connectedAccounts) return;

       const updatedAccounts = { ...userProfile.value.connectedAccounts };
       delete updatedAccounts[provider]; // Remove the provider key

       try {
         await updateUserProfile({ connectedAccounts: updatedAccounts });
         await fetchUserProfile(); // Refresh profile
         connectSuccess.value = `${provider.charAt(0).toUpperCase() + provider.slice(1)} disconnected successfully.`;
       } catch (err) {
         console.error(`Error disconnecting ${provider}:`, err);
         connectError.value = `Failed to disconnect ${provider}: ${err.message}`;
       }
    };


    return {
      userProfile,
      loading,
      error,
      fetchUserProfile,
      showChangeEmailModal,
      showChangePasswordModal,
      showDeleteAccountModal,
      connectError,
      connectSuccess,
      profileUpdateError,
      profileUpdateSuccess,
      handleEmailChanged,
      handlePasswordChanged,
      handleAccountDeleted,
      handleProfileUpdate,
      connectProvider,
      disconnectProvider
    };
  }
};
</script>

<style scoped>
.settings-view {
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

.settings-section {
  background: var(--card-bg);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  border: 1px solid var(--border-color);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.settings-section h2 {
  color: var(--text-color);
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
}

.settings-section p {
  color: var(--text-secondary);
  margin: 0 0 1rem 0;
  font-size: 0.95rem;
}

.error-message {
  color: var(--error-color);
  margin: 0.5rem 0;
  font-size: 0.9rem;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: var(--text-secondary);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--border-color);
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 900px) {
  .settings-section {
    padding: 1rem;
  }
}
</style>