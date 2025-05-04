<template>
  <div class="account-settings-component">

    <!-- Profile Information Section -->
    <div class="setting-item profile-info-section">
      <div class="setting-info">
        <label>Display Name</label>
        <p v-if="!isEditing" class="setting-value">{{ userProfile?.displayName || 'No Name Set' }}</p>
        <input v-else type="text" v-model="editableName" class="form-input" placeholder="Your display name" />
      </div>
      <!-- Edit button only shown when not editing profile info -->
      <button v-if="!isEditing" @click="startEditingProfile" class="btn btn-secondary btn-sm">Edit Profile</button>
    </div>

    <div class="setting-item profile-info-section">
       <div class="setting-info">
         <label>Bio</label>
         <p v-if="!isEditing" class="setting-value bio-text">{{ userProfile?.bio || 'No bio added yet.' }}</p>
         <textarea v-else v-model="editableBio" class="form-input" rows="3" placeholder="Tell us about yourself"></textarea>
       </div>
    </div>

    <div class="setting-item profile-info-section">
       <div class="setting-info">
         <label>Title</label>
         <p v-if="!isEditing" class="setting-value">{{ userProfile?.title || 'No title added yet.' }}</p>
         <input v-else type="text" v-model="editableTitle" class="form-input" placeholder="Your title" />
       </div>
    </div>

    <div class="setting-item profile-info-section">
       <div class="setting-info">
         <label>Location</label>
         <p v-if="!isEditing" class="setting-value">{{ userProfile?.location || 'No location added yet.' }}</p>
         <input v-else type="text" v-model="editableLocation" class="form-input" placeholder="Your location" />
       </div>
    </div>

    <div class="setting-item profile-info-section">
       <div class="setting-info">
         <label>Website</label>
         <p v-if="!isEditing" class="setting-value">{{ userProfile?.website || 'No website added yet.' }}</p>
         <input v-else type="text" v-model="editableWebsite" class="form-input" placeholder="Your website" />
       </div>
    </div>

    <div class="setting-item profile-info-section">
       <div class="setting-info">
         <label>Github</label>
         <p v-if="!isEditing" class="setting-value">{{ userProfile?.github || 'No Github profile added yet.' }}</p>
         <input v-else type="text" v-model="editableGithub" class="form-input" placeholder="Your Github profile" />
       </div>
    </div>

    <!-- Save/Cancel Buttons for Profile Info -->
    <div v-if="isEditing" class="edit-actions">
       <button @click="cancelEditingProfile" class="btn btn-secondary btn-sm">Cancel</button>
       <button @click="saveProfileChanges" class="btn btn-primary btn-sm" :disabled="saving">
         {{ saving ? 'Saving...' : 'Save Changes' }}
       </button>
    </div>

    <!-- Separator -->
    <hr v-if="!isEditing" class="section-separator">

    <!-- Account Security Section (Only show when not editing profile info) -->
    <template v-if="!isEditing">
      <div class="setting-item">
        <div class="setting-info">
          <label>Email Address</label>
          <p class="setting-value">{{ userProfile?.email || 'No email set' }}</p>
        </div>
        <button @click="$emit('changeEmail')" class="btn btn-secondary btn-sm">
          Change Email
        </button>
      </div>

      <div class="setting-item">
        <div class="setting-info">
          <label>Password</label>
          <p class="setting-value">••••••••</p>
        </div>
        <button @click="$emit('changePassword')" class="btn btn-secondary btn-sm">
          Change Password
        </button>
      </div>

      <div class="setting-item danger-zone">
        <div class="setting-info">
          <label>Delete Account</label>
          <p class="setting-description">Permanently delete your account and all associated data. This action cannot be undone.</p>
        </div>
        <button @click="$emit('deleteAccount')" class="btn btn-danger btn-sm">
          Delete Account
        </button>
      </div>
    </template>

  </div>
</template>

<script>
import { ref, watch } from 'vue';

export default {
  name: 'AccountSettings',
  props: {
    userProfile: {
      type: Object,
      required: true,
      default: () => ({
        email: '',
        displayName: '',
        bio: '',
        title: '',
        location: '',
        website: '',
        github: ''
      })
    }
  },
  // Added 'updateProfile' to emits
  emits: ['changeEmail', 'changePassword', 'deleteAccount', 'updateProfile'],
  setup(props, { emit }) {
    const isEditing = ref(false);
    const saving = ref(false); // To disable save button during save
    const editableName = ref('');
    const editableBio = ref('');
    const editableTitle = ref('');
    const editableLocation = ref('');
    const editableWebsite = ref('');
    const editableGithub = ref('');

    // Function to enter edit mode for profile info
    const startEditingProfile = () => {
      editableName.value = props.userProfile?.displayName || '';
      editableBio.value = props.userProfile?.bio || ''; // Loads current bio into the input
      editableTitle.value = props.userProfile?.title || ''; // Loads current title into the input
      editableLocation.value = props.userProfile?.location || ''; // Loads current location into the input
      editableWebsite.value = props.userProfile?.website || ''; // Loads current website into the input
      editableGithub.value = props.userProfile?.github || ''; // Loads current Github profile into the input
      isEditing.value = true;
    };

    // Function to cancel editing profile info
    const cancelEditingProfile = () => {
      isEditing.value = false;
    };

    // Function to save profile changes
    const saveProfileChanges = async () => {
      if (saving.value) return;
      saving.value = true;
      try {
        // Emit an event with the updated data
        emit('updateProfile', {
          displayName: editableName.value,
          bio: editableBio.value, // Sends the edited bio
          title: editableTitle.value, // Sends the edited title
          location: editableLocation.value, // Sends the edited location
          website: editableWebsite.value, // Sends the edited website
          github: editableGithub.value // Sends the edited Github profile
        });
        // Parent component (Settings.vue) will handle the actual update
        // and potentially refetch data, which will update the props here.
        isEditing.value = false; // Exit edit mode after emitting
      } catch (error) {
        console.error("Error saving profile:", error);
        // Optionally show an error message to the user
      } finally {
        saving.value = false;
      }
    };

    // Watch for external changes to userProfile (e.g., after save)
    // and update display if not currently editing.
    watch(() => props.userProfile, (newProfile) => {
        if (!isEditing.value) {
            // This ensures the display updates if the parent refetches data
            // after a successful save triggered by the emitted event.
        }
    }, { deep: true });


    return {
      isEditing,
      saving,
      editableName,
      editableBio,
      editableTitle,
      editableLocation,
      editableWebsite,
      editableGithub,
      startEditingProfile,
      cancelEditingProfile,
      saveProfileChanges
    };
  }
}
</script>

<style scoped>
.account-settings-component {
  /* Existing styles */
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start; /* Align items to top for multi-line content */
  padding: 1.25rem 0;
  border-bottom: 1px solid #e5e7eb;
}
/* Adjust last/first child styles if needed */
.setting-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
.setting-item:first-child {
  padding-top: 0;
}

/* Specific alignment for single-line items */
.setting-item:not(.profile-info-section) {
   align-items: center;
}


.setting-info {
  flex-grow: 1;
  margin-right: 1.5rem;
}

.setting-info label {
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.35rem; /* More space below label */
  font-size: 0.95rem;
}

.setting-value {
  color: #6b7280;
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5; /* Ensure readability */
}
.setting-value.bio-text {
   white-space: pre-wrap; /* Respect line breaks in bio */
}

.setting-description {
  color: #6b7280;
  margin: 0;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

/* Input field styling */
.form-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.9rem;
  color: #1f2937;
  background-color: #fff;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.form-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
}
textarea.form-input {
  resize: vertical; /* Allow vertical resize */
  min-height: 60px;
}


/* Edit Actions (Save/Cancel) */
.edit-actions {
  display: flex;
  justify-content: flex-end; /* Align buttons to the right */
  gap: 0.75rem;
  padding-top: 1rem;
  padding-bottom: 1.25rem; /* Match setting-item padding */
  border-bottom: 1px solid #e5e7eb; /* Separator below actions */
}

/* Separator line */
.section-separator {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 1.25rem 0; /* Match vertical padding */
}


/* Button Styles */
.btn { /* Assuming base btn styles exist elsewhere */
  /* Add base styles if needed */
}
.btn-sm {
  padding: 0.3rem 0.8rem;
  font-size: 0.8rem;
}
.btn-primary { /* Define if not global */
  color: #fff; background-color: #4f46e5; border-color: #4f46e5;
}
.btn-primary:hover { background-color: #4338ca; border-color: #3e33b7; }
.btn-secondary { /* Define if not global */
  color: #fff; background-color: #6c757d; border-color: #6c757d;
}
.btn-secondary:hover { background-color: #5a6268; border-color: #545b62; }
.btn-danger { /* Define if not global */
   color: #fff; background-color: #dc3545; border-color: #dc3545;
}
.btn-danger:hover { background-color: #c82333; border-color: #bd2130; }

.btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}


.danger-zone .setting-info label {
  color: #dc3545;
}

@media (max-width: 640px) {
  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  .setting-info {
     margin-right: 0;
     margin-bottom: 0.5rem;
     width: 100%; /* Ensure info takes full width */
  }
  .btn {
    align-self: flex-start;
  }
  .edit-actions {
    justify-content: flex-start; /* Align buttons left on small screens */
  }
}
</style>