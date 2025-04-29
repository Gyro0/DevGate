<template>
    <div class="profile-view">
      <AppHeader />
      <div class="main-layout">
        <AppSidebar :active-page="'profile'" />

        <!-- Add v-if="userProfile" to the content area or specific components -->
        <div class="content-area" v-if="userProfile">
          <div class="profile-header">
            <h1>User Profile</h1>
            <button @click="editMode = !editMode" class="edit-button">
              <i :class="editMode ? 'fas fa-times' : 'fas fa-pen'"></i>
              {{ editMode ? 'Cancel' : 'Edit Profile' }}
            </button>
          </div>

          <!-- These components rely on userProfile -->
          <ProfileCard :userProfile="userProfile" :editMode="editMode" @triggerPhotoUpload="triggerPhotoUpload" @handlePhotoChange="handlePhotoChange" />
          <ProfileStats :stats="userStats" />
          <ProfileForm 
  v-if="editMode" 
  :editedProfile="editedProfile" 
  @saveProfile="saveProfile" 
  @cancel="cancelEditing" 
/>
          <AccountSettings :userProfile="userProfile" @changeEmail="showChangeEmailModal = true" @changePassword="showChangePasswordModal = true" />
          <ConnectedAccounts :userProfile="userProfile" />

        </div>
        <!-- Optional: Add a loading indicator while userProfile is null -->
        <div class="content-area" v-else>
           <p>Loading profile...</p>
           <!-- Or add a spinner component -->
        </div>
      </div>

      <!-- Modals can stay outside the v-if as they depend on separate refs -->
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
import ProfileStats from '@/components/profile/ProfileStats.vue';
import ProfileForm from '@/components/profile/ProfileForm.vue';
import AccountSettings from '@/components/profile/AccountSettings.vue';
import ConnectedAccounts from '@/components/profile/ConnectedAccounts.vue';
import ChangeEmailModal from '@/components/modals/ChangeEmailModal.vue';
import ChangePasswordModal from '@/components/modals/ChangePasswordModal.vue';
import DeleteAccountModal from '@/components/modals/DeleteAccountModal.vue';
import useProfile from '@/composables/useProfile';
import useFileUpload from '@/composables/useFileUpload';
import useAuth from '@/composables/useAuth';
import { useRouter } from 'vue-router';

export default {
  components: {
    AppHeader,
    AppSidebar,
    ProfileCard,
    ProfileStats,
    ProfileForm,
    AccountSettings,
    ConnectedAccounts,
    ChangeEmailModal,
    ChangePasswordModal,
    DeleteAccountModal
  },
  setup() {
    const router = useRouter();
    // Get Profile data
    const { 
      userProfile, 
      editedProfile, 
      loading, 
      error, 
      fetchUserProfile,
      updateUserProfile 
    } = useProfile();
    
    // Check auth status
    const { user, isAuthenticated } = useAuth();
    
    // File upload functionality
    const { uploadFile } = useFileUpload();
    
    // UI state
    const editMode = ref(false);
    const showChangeEmailModal = ref(false);
    const showChangePasswordModal = ref(false);
    const showDeleteAccountModal = ref(false);
    
    // Computed stats for ProfileStats component
    const userStats = computed(() => {
      if (!userProfile.value) return { skills: 0, objectives: 0, completedProjects: 0 };
      
      return {
        skills: userProfile.value.skillsCount || 0,
        objectives: userProfile.value.objectivesCount || 0,
        completedProjects: userProfile.value.completedProjectsCount || 0
      };
    });
    
    // Watch for authentication status changes
    watch(isAuthenticated, (isAuth) => {
      if (isAuth) {
        fetchUserProfile();
      }
    }, { immediate: true });
    
    // Ensure profile is fetched when component mounts
    onMounted(() => {
      if (isAuthenticated.value) {
        console.log('Fetching user profile on mount');
        fetchUserProfile();
      }
    });

    // Photo upload handlers
    const triggerPhotoUpload = () => {
      // Logic to trigger file input click
      // This is just a placeholder, actual implementation handled by child component
    };
    
    const handlePhotoChange = async (file) => {
      try {
        if (!file) return;
        
        console.log('Uploading profile photo:', file);
        const uploadPath = `profile-photos/${user.value.uid}`;
        
        // Upload the file and wait for result
        const result = await uploadFile(file, uploadPath);
        console.log('Upload successful:', result);
        
        // Update the user profile with the new photo URL
        await updateUserProfile({ 
          photoURL: result.url
        });
        
      } catch (err) {
        console.error('Error updating profile photo:', err);
      }
    };
    
    // Save profile data
    const saveProfile = async (formData) => {
      try {
        // Show loading state
        loading.value = true;
        
        // Update user profile in Firestore
        await updateUserProfile(formData);
        
        // Update the local userProfile with the new data
        userProfile.value = { ...userProfile.value, ...formData };
        
        // Exit edit mode
        editMode.value = false;
        
        // Show success message
        alert('Profile updated successfully!');
      } catch (err) {
        console.error('Error saving profile:', err);
        alert('Failed to save profile changes: ' + err.message);
      } finally {
        loading.value = false;
      }
    };

    // Add this function to handle cancel button click
    const cancelEditing = () => {
      editMode.value = false;
      // Reset the editedProfile back to userProfile
      if (userProfile.value) {
        editedProfile.value = { ...userProfile.value };
      }
    };

    const handleEmailChanged = () => {
      // Success notification or actions after email change
      fetchUserProfile(); // Refresh user data
    };

    const handlePasswordChanged = () => {
      // Success notification or actions after password change
    };

    const handleAccountDeleted = () => {
      // Handle account deletion (redirect to login, etc)
      router.push('/login');
    };
    
    return {
      userProfile,
      editedProfile,
      loading,
      error,
      userStats,
      editMode,
      showChangeEmailModal,
      showChangePasswordModal,
      showDeleteAccountModal,
      triggerPhotoUpload,
      handlePhotoChange,
      saveProfile,
      cancelEditing,
      handleEmailChanged,
      handlePasswordChanged,
      handleAccountDeleted
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
</style>