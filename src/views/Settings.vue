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
  background-color: #f8f9fa; /* Light background */
}

.main-layout {
  display: flex;
  min-height: calc(100vh - 64px); /* Full height minus header */
}

.content-area {
  flex: 1; /* Take remaining space */
  padding: 2rem; /* More padding */
  overflow-y: auto; /* Allow scrolling if content overflows */
  max-width: 900px; /* Limit max width for readability */
  margin: 0 auto; /* Center content area */
}

/* Header */
.page-header {
  margin-bottom: 2rem; /* More space below header */
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb; /* Subtle separator */
}

.page-header h1 {
  margin: 0;
  font-size: 1.75rem; /* Slightly larger */
  color: #1f2937;
  font-weight: 600;
}

/* Settings Section Styling */
.settings-section {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 2rem; /* Increased padding */
  margin-bottom: 2rem; /* Increased spacing between sections */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); /* Subtle shadow */
  border: 1px solid #e5e7eb; /* Light border */
}

.settings-section h2 {
  font-size: 1.3rem; /* Slightly larger section titles */
  font-weight: 600;
  color: #374151;
  margin-top: 0;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem; /* Space below title */
  border-bottom: 1px solid #f3f4f6; /* Lighter border below title */
}

/* Style child components if needed (using :deep selector) */
.settings-section :deep(.setting-item) { /* Example targeting a class within AccountSettings/ConnectedAccounts */
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f9fafb;
}
.settings-section :deep(.setting-item:last-child) {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

/* Loading/Error States */
.state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: calc(100vh - 64px - 4rem); /* Adjust height considering padding */
  color: #6b7280;
}

.loading-state .spinner {
  width: 32px;
  height: 32px;
  border: 4px solid rgba(79, 70, 229, 0.2);
  border-radius: 50%;
  border-top-color: #4f46e5;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.error-state i {
  font-size: 2.5rem;
  color: #ef4444; /* Red for error */
  margin-bottom: 1rem;
}

.error-state p {
  margin-bottom: 1rem;
  font-size: 1rem;
}

.error-state button {
  margin-top: 1rem;
}

/* Feedback Messages */
.error-message {
  color: #ef4444; /* Red */
  background-color: #fee2e2; /* Light red background */
  border: 1px solid #fca5a5; /* Red border */
  border-radius: 6px;
  padding: 0.75rem 1rem;
  margin-top: 1rem;
  font-size: 0.875rem;
}

.success-message { /* Add this class if you implement connectSuccess display */
  color: #166534; /* Green */
  background-color: #dcfce7; /* Light green background */
  border: 1px solid #86efac; /* Green border */
  border-radius: 6px;
  padding: 0.75rem 1rem;
  margin-top: 1rem;
  font-size: 0.875rem;
}


/* Basic Button Styles (if not globally defined) */
.btn {
  display: inline-block;
  font-weight: 500; /* Medium weight */
  line-height: 1.5;
  color: #212529;
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
  background-color: transparent;
  border: 1px solid transparent;
  padding: 0.5rem 1rem; /* Adjusted padding */
  font-size: 0.9rem; /* Slightly smaller */
  border-radius: 6px; /* Consistent radius */
  transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
}
.btn-primary {
  color: #fff;
  background-color: #4f46e5;
  border-color: #4f46e5;
}
.btn-primary:hover {
  color: #fff;
  background-color: #4338ca;
  border-color: #3e33b7;
}
.btn-secondary {
  color: #fff;
  background-color: #6c757d;
  border-color: #6c757d;
}
.btn-secondary:hover {
  color: #fff;
  background-color: #5a6268;
  border-color: #545b62;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .content-area {
    padding: 1.5rem; /* Reduce padding on smaller screens */
    max-width: 100%; /* Allow full width */
  }
  .settings-section {
    padding: 1.5rem;
  }
  .page-header h1 {
    font-size: 1.5rem;
  }
  .settings-section h2 {
    font-size: 1.15rem;
  }
}
</style>