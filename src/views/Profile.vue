<template>
    <div class="profile-view">
      <AppHeader />
      <div class="main-layout">
        <AppSidebar :active-page="'profile'" />
        
        <div class="content-area">
          <div class="profile-header">
            <h1>User Profile</h1>
            <button @click="editMode = !editMode" class="edit-button">
              <i :class="editMode ? 'fas fa-times' : 'fas fa-pen'"></i>
              {{ editMode ? 'Cancel' : 'Edit Profile' }}
            </button>
          </div>
          
          <ProfileCard :userProfile="userProfile" :editMode="editMode" @triggerPhotoUpload="triggerPhotoUpload" @handlePhotoChange="handlePhotoChange" />
          
          <ProfileStats :stats="userStats" />
          
          <ProfileForm v-if="editMode" :editedProfile="editedProfile" @saveProfile="saveProfile" />
          
          <AccountSettings :userProfile="userProfile" @changeEmail="showChangeEmailModal = true" @changePassword="showChangePasswordModal = true" />
          
          <ConnectedAccounts :connectedAccounts="userProfile.connectedAccounts" />
        </div>
      </div>
      
      <ChangeEmailModal v-if="showChangeEmailModal" @close="showChangeEmailModal = false" />
      <ChangePasswordModal v-if="showChangePasswordModal" @close="showChangePasswordModal = false" />
      <DeleteAccountModal v-if="showDeleteAccountModal" @close="showDeleteAccountModal = false" />
    </div>
  </template>
  
  <script>
import { ref, onMounted, watch } from 'vue';
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
import useProfile from '@/composables/useProfile'; // Import useProfile
import useFileUpload from '@/composables/useFileUpload'; // Import useFileUpload

export default {
  name: 'ProfileView',
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
    const { 
      userProfile, 
      loading: profileLoading, 
      error: profileError, 
      fetchUserProfile, 
      updateUserProfile 
    } = useProfile();
    const { 
      uploadFile, 
      deleteFile, 
      uploading: fileUploading, 
      error: fileError 
    } = useFileUpload();

    const userStats = ref({}); // Placeholder for stats logic
    const editedProfile = ref({});
    const editMode = ref(false);
    const showChangeEmailModal = ref(false);
    const showChangePasswordModal = ref(false);
    const showDeleteAccountModal = ref(false); // Added for completeness

    // Fetch profile data on mount
    onMounted(async () => {
      await fetchUserProfile();
      // TODO: Fetch or calculate userStats based on projects, skills, etc.
    });

    // Watch for changes in userProfile to update the editable copy
    watch(userProfile, (newProfile) => {
      if (newProfile) {
        editedProfile.value = { ...newProfile };
      }
    }, { immediate: true, deep: true });

    // Watch for editMode changes to reset editedProfile if canceling
    watch(editMode, (newVal) => {
      if (!newVal && userProfile.value) {
        // Reset editedProfile to original when exiting edit mode
        editedProfile.value = { ...userProfile.value };
      }
    });

    // Logic to trigger photo upload (likely handled within ProfileCard now)
    const triggerPhotoUpload = () => {
      // This might just be an event handler now, or could trigger input if needed
      console.log('Trigger photo upload requested from parent');
    };

    // Logic to handle photo change (received from ProfileCard)
    const handlePhotoChange = async (file) => {
      if (!file || !userProfile.value?.uid) return;

      try {
        const oldPhotoPath = userProfile.value.photoPath; // Get path if stored
        const uploadResult = await uploadFile(file, `avatars/${userProfile.value.uid}`);
        
        if (uploadResult) {
          await updateUserProfile({ 
            photoURL: uploadResult.url, 
            photoPath: uploadResult.path // Store path for deletion
          });
          // Optionally delete the old photo if path was stored
          if (oldPhotoPath && oldPhotoPath !== uploadResult.path) {
            await deleteFile(oldPhotoPath);
          }
        }
      } catch (err) {
        console.error("Error uploading/updating photo:", err);
        // Handle error display
      }
    };

    // Logic to save profile changes (received from ProfileForm)
    const saveProfile = async (updatedData) => {
       if (!userProfile.value?.uid) return;
       try {
         await updateUserProfile(updatedData);
         editMode.value = false; // Exit edit mode on successful save
       } catch (err) {
         console.error("Error saving profile:", err);
         // Handle error display
       }
    };

    // Return reactive state and methods
    return {
      userProfile,
      userStats,
      editedProfile,
      editMode,
      showChangeEmailModal,
      showChangePasswordModal,
      showDeleteAccountModal,
      triggerPhotoUpload,
      handlePhotoChange,
      saveProfile,
      profileLoading, // Expose loading/error states if needed for UI
      profileError,
      fileUploading,
      fileError
    };
  }
}
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