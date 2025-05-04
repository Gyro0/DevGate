<template>
  <div class="account-settings-component">

    <!-- Profile Picture Section -->
    <div class="setting-item profile-picture-section">
      <div class="setting-info">
        <label>Profile Picture</label>
        <div class="avatar-container">
          <img
            :src="avatarPreview || userProfile?.photoURL || '/default.jpg'"
            alt="Profile Picture"
            class="profile-avatar"
          />
          <input
            v-if="isEditing"
            type="file"
            ref="avatarInput"
            @change="handleAvatarChange"
            accept="image/*"
            class="avatar-input-hidden"
            id="avatar-upload"
          />
          <label v-if="isEditing" for="avatar-upload" class="btn btn-secondary btn-sm change-avatar-btn">
            Change
          </label>
          <button v-if="isEditing && avatarPreview" @click="removeSelectedAvatar" class="btn btn-link btn-sm remove-avatar-btn" title="Remove selected image">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <p v-if="isEditing" class="setting-description">Upload a new profile picture (JPG, PNG, GIF).</p>
      </div>
      <!-- Edit button only shown when not editing profile info -->
      <button v-if="!isEditing" @click="startEditingProfile" class="btn btn-secondary btn-sm edit-profile-btn">Edit Profile</button>
    </div>

    <!-- Profile Information Section -->
    <div class="setting-item profile-info-section">
      <div class="setting-info">
        <label>Display Name</label>
        <p v-if="!isEditing" class="setting-value">{{ userProfile?.displayName || 'No Name Set' }}</p>
        <input v-else type="text" v-model="editableName" class="form-input" placeholder="Your display name" />
      </div>
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
         <label>Title / Headline</label>
         <p v-if="!isEditing" class="setting-value">{{ userProfile?.title || 'No title added yet.' }}</p>
         <input v-else type="text" v-model="editableTitle" class="form-input" placeholder="e.g., Senior Software Engineer" />
       </div>
    </div>

    <div class="setting-item profile-info-section">
       <div class="setting-info">
         <label>Location</label>
         <p v-if="!isEditing" class="setting-value">{{ userProfile?.location || 'No location added yet.' }}</p>
         <input v-else type="text" v-model="editableLocation" class="form-input" placeholder="e.g., London, UK" />
       </div>
    </div>

    <div class="setting-item profile-info-section">
       <div class="setting-info">
         <label>Website</label>
         <p v-if="!isEditing" class="setting-value">
           <a v-if="userProfile?.website" :href="userProfile.website" target="_blank" rel="noopener noreferrer">{{ userProfile.website }}</a>
           <span v-else>No website added yet.</span>
         </p>
         <input v-else type="url" v-model="editableWebsite" class="form-input" placeholder="https://yourwebsite.com" />
       </div>
    </div>

    <div class="setting-item profile-info-section">
       <div class="setting-info">
         <label>GitHub Profile</label>
         <p v-if="!isEditing" class="setting-value">
           <a v-if="userProfile?.github" :href="`https://github.com/${userProfile.github}`" target="_blank" rel="noopener noreferrer">{{ userProfile.github }}</a>
           <span v-else>No GitHub profile added yet.</span>
         </p>
         <input v-else type="text" v-model="editableGithub" class="form-input" placeholder="your-github-username" />
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
        github: '',
        photoURL: null // Added photoURL
      })
    }
  },
  // Added 'updateProfile' to emits
  emits: ['changeEmail', 'changePassword', 'deleteAccount', 'updateProfile'],
  setup(props, { emit }) {
    const isEditing = ref(false);
    const saving = ref(false); // To disable save button during save

    // Refs for editable fields
    const editableName = ref('');
    const editableBio = ref('');
    const editableTitle = ref('');
    const editableLocation = ref('');
    const editableWebsite = ref('');
    const editableGithub = ref('');
    const selectedAvatarFile = ref(null); // To hold the File object
    const avatarPreview = ref(null); // To hold the data URL for preview
    const avatarInput = ref(null); // Ref for the file input element

    // Function to enter edit mode for profile info
    const startEditingProfile = () => {
      editableName.value = props.userProfile?.displayName || '';
      editableBio.value = props.userProfile?.bio || '';
      editableTitle.value = props.userProfile?.title || '';
      editableLocation.value = props.userProfile?.location || '';
      editableWebsite.value = props.userProfile?.website || '';
      editableGithub.value = props.userProfile?.github || '';
      // Reset avatar selection when starting edit
      selectedAvatarFile.value = null;
      avatarPreview.value = null;
      if (avatarInput.value) {
        avatarInput.value.value = ''; // Clear the file input visually
      }
      isEditing.value = true;
    };

    // Function to cancel editing profile info
    const cancelEditingProfile = () => {
      isEditing.value = false;
      // Clear any selections made during edit
      selectedAvatarFile.value = null;
      avatarPreview.value = null;
    };

    // Handle new avatar file selection
    const handleAvatarChange = (event) => {
      const file = event.target.files[0];
      if (file && file.type.startsWith('image/')) {
        selectedAvatarFile.value = file;
        // Create a preview URL
        const reader = new FileReader();
        reader.onload = (e) => {
          avatarPreview.value = e.target.result;
        };
        reader.readAsDataURL(file);
      } else {
        // Handle invalid file type or no file selected
        selectedAvatarFile.value = null;
        avatarPreview.value = null;
        if (avatarInput.value) {
          avatarInput.value.value = ''; // Clear the file input visually
        }
        // Optionally show an error message
        console.warn("Invalid file type selected for avatar.");
      }
    };

    // Remove selected avatar preview and file
    const removeSelectedAvatar = () => {
        selectedAvatarFile.value = null;
        avatarPreview.value = null;
        if (avatarInput.value) {
          avatarInput.value.value = ''; // Clear the file input visually
        }
    };

    // Function to save profile changes
    const saveProfileChanges = async () => {
      if (saving.value) return;
      saving.value = true;
      try {
        // Emit an event with the updated data, including the avatar file if selected
        emit('updateProfile', {
          displayName: editableName.value,
          bio: editableBio.value,
          title: editableTitle.value,
          location: editableLocation.value,
          website: editableWebsite.value,
          github: editableGithub.value,
          avatarFile: selectedAvatarFile.value // Pass the File object
        });
        // Parent component (Settings.vue) will handle the actual update
        // It should reset selectedAvatarFile and avatarPreview here upon success if needed,
        // or rely on the prop update and watch effect.
        isEditing.value = false; // Exit edit mode after emitting
      } catch (error) {
        console.error("Error preparing profile update:", error);
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
            // Resetting preview here ensures it uses the new photoURL prop
            avatarPreview.value = null;
            selectedAvatarFile.value = null;
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
      avatarInput, // Expose ref for file input
      avatarPreview,
      startEditingProfile,
      cancelEditingProfile,
      saveProfileChanges,
      handleAvatarChange,
      removeSelectedAvatar
    };
  }
}
</script>

<style scoped>
/* --- Start of new styles --- */
.account-settings-component { /* Changed from .account-settings to match template root */
  background: var(--surface-card);
  border-radius: 1.2rem;
  box-shadow: 0 2px 16px 0 rgba(0,0,0,0.35), 0 0 0 2px var(--primary-glow), 0 0 8px 2px var(--circuit-accent);
  border: 1.5px solid var(--border-color, #23272e);
  padding: 2rem 1.5rem;
  color: var(--text);
  max-width: 600px; /* Increased max-width slightly for more content */
  margin: 2rem auto;
}

/* General Setting Item Layout (Replaces old .setting-item) */
.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.25rem 0;
  border-bottom: 1px solid var(--border-color, #23272e);
  gap: 1.5rem; /* Add gap between info and button */
}
.setting-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
.setting-item:first-child {
  padding-top: 0;
}

.setting-info {
  flex-grow: 1;
}

.setting-info label {
  display: block;
  font-weight: 700; /* Bolder label */
  color: var(--secondary, #a0a0a0); /* Use secondary color */
  margin-bottom: 0.4rem;
  font-size: 1rem; /* Slightly larger label */
}

.setting-value {
  color: var(--text, #e0e0e0); /* Use primary text color */
  margin: 0;
  font-size: 1.05rem; /* Match new style */
  line-height: 1.5;
  word-break: break-word;
  margin-bottom: 0.7rem; /* Match new style */
}
.setting-value a {
  color: var(--primary, #4f46e5); /* Use primary color for links */
  text-decoration: none;
}
.setting-value a:hover {
  text-decoration: underline;
  text-shadow: 0 0 6px var(--primary-glow); /* Add glow on hover */
}
.setting-value.bio-text {
   white-space: pre-wrap;
   color: var(--text-secondary, #b0b0b0); /* Use secondary text for bio */
}

.setting-description {
  color: var(--text-secondary, #b0b0b0);
  margin: 0;
  font-size: 0.9rem; /* Slightly larger description */
  margin-top: 0.3rem;
}

/* Profile Picture Specific Styles */
.profile-picture-section .setting-info {
  display: flex;
  flex-direction: column;
}
.avatar-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
}
.profile-avatar {
  width: 72px; /* Slightly larger avatar */
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--primary-glow, #4f46e5); /* Use primary glow color for border */
  box-shadow: 0 0 8px 1px var(--primary-glow); /* Add glow effect */
}
.avatar-input-hidden {
  display: none;
}
.change-avatar-btn {
  /* Style the label like a button - use .settings-button styles */
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1.2rem;
  font-weight: 700;
  font-size: 1rem;
  box-shadow: 0 0 8px var(--primary-glow);
  cursor: pointer;
  transition: background 0.18s, box-shadow 0.18s;
  margin-top: 0.5rem; /* Align with other buttons */
}
.change-avatar-btn:hover {
  background: var(--primary-glow);
  color: #fff;
  box-shadow: 0 0 16px 2px var(--primary-glow);
}
.remove-avatar-btn {
  padding: 0.2rem 0.4rem;
  color: #ff4d4f; /* Danger color */
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.1rem; /* Make icon slightly larger */
  transition: color 0.18s, text-shadow 0.18s;
}
.remove-avatar-btn:hover {
  color: #d7263d;
  text-shadow: 0 0 6px #ff4d4f88;
}
.edit-profile-btn {
  /* Use .settings-button styles */
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1.2rem;
  font-weight: 700;
  font-size: 1rem;
  box-shadow: 0 0 8px var(--primary-glow);
  cursor: pointer;
  transition: background 0.18s, box-shadow 0.18s;
  margin-top: 2.5rem; /* Adjust alignment */
  align-self: flex-start;
}
.edit-profile-btn:hover {
  background: var(--primary-glow);
  color: #fff;
  box-shadow: 0 0 16px 2px var(--primary-glow);
}

/* Input field styling */
.form-input {
  width: 100%;
  padding: 0.6rem 0.8rem; /* Slightly more padding */
  border: 1.5px solid var(--border-color, #23272e);
  border-radius: 0.5rem; /* Match button radius */
  font-size: 1rem; /* Match button font size */
  color: var(--text, #e0e0e0);
  background-color: var(--surface-ground, #121212); /* Darker background */
  transition: border-color 0.2s, box-shadow 0.2s;
}
.form-input::placeholder {
  color: var(--text-secondary, #a0a0a0);
  opacity: 0.7;
}
.form-input:focus {
  outline: none;
  border-color: var(--primary, #4f46e5);
  box-shadow: 0 0 0 2px var(--primary-glow), 0 0 8px 2px var(--circuit-accent); /* Enhanced focus */
}
textarea.form-input {
  resize: vertical;
  min-height: 80px;
}

/* Edit Actions (Save/Cancel) */
.edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 1.5rem; /* More space */
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--border-color, #23272e);
}
/* Apply button styles to Save/Cancel */
.edit-actions .btn-primary {
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1.2rem;
  font-weight: 700;
  font-size: 1rem;
  box-shadow: 0 0 8px var(--primary-glow);
  cursor: pointer;
  transition: background 0.18s, box-shadow 0.18s;
}
.edit-actions .btn-primary:hover {
  background: var(--primary-glow);
  color: #fff;
  box-shadow: 0 0 16px 2px var(--primary-glow);
}
.edit-actions .btn-secondary {
  background: var(--surface-section, #333); /* Use a section background */
  color: var(--text-secondary, #ccc);
  border: 1px solid var(--border-color, #444);
  border-radius: 0.5rem;
  padding: 0.5rem 1.2rem;
  font-weight: 700;
  font-size: 1rem;
  box-shadow: none;
  cursor: pointer;
  transition: background 0.18s, color 0.18s;
  
}
.edit-actions .btn-secondary:hover {
  background: var(--surface-hover, #444);
  color: var(--text, #fff);
}
.edit-actions .btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
  background: var(--surface-section, #333);
}


/* Separator line */
.section-separator {
  border: none;
  border-top: 1px solid var(--border-color, #23272e);
  margin: 0;
}

/* General Button Styling (for Change Email/Password) */
.setting-item .btn-secondary { /* Target buttons within setting items */
  background: var(--surface-section, #333);
  color: var(--text-secondary, #ccc);
  border: 1px solid var(--border-color, #444);
  border-radius: 0.5rem;
  padding: 0.5rem 1.2rem;
  font-weight: 700;
  font-size: 1rem;
  box-shadow: none;
  cursor: pointer;
  transition: background 0.18s, color 0.18s;
  margin-top: 0.5rem; /* Add some top margin */
  align-self: flex-start; /* Align button top */
}
.setting-item .btn-secondary:hover {
  background: var(--surface-hover, #444);
  color: var(--text, #fff);
}


/* Danger Zone Specifics */
.danger-zone .setting-info label {
  color: #ff4d4f; /* Danger color */
  text-shadow: 0 0 8px #ff4d4f44;
}
.danger-zone .btn-danger { /* Target Delete Account button */
  background: #ff4d4f;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1.2rem;
  font-weight: 700;
  font-size: 1rem;
  box-shadow: 0 0 8px #ff4d4f88;
  cursor: pointer;
  margin-top: 0.7rem;
  transition: background 0.18s, box-shadow 0.18s;
  align-self: flex-start; /* Align button top */
}
.danger-zone .btn-danger:hover {
  background: #d7263d;
  box-shadow: 0 0 16px 2px #ff4d4f;
}


/* Responsive Adjustments */
@media (max-width: 640px) {
  .account-settings-component {
    padding: 1.5rem 1rem;
  }
  .setting-item {
    flex-direction: column;
    align-items: stretch; /* Stretch items full width */
    gap: 0.75rem;
  }
  .setting-info {
     margin-right: 0;
     margin-bottom: 0.5rem;
     width: 100%;
  }
  /* Ensure buttons take appropriate width or alignment */
  .setting-item .btn-secondary,
  .danger-zone .btn-danger,
  .edit-profile-btn {
    align-self: flex-start; /* Keep buttons aligned left */
    margin-top: 0.5rem; /* Consistent margin */
  }
  .edit-actions {
    justify-content: flex-start;
  }
  .edit-profile-btn {
    margin-top: 0.5rem; /* Adjust margin */
  }
}
/* --- End of new styles --- */
</style>