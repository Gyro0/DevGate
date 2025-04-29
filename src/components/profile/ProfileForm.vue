<template>
  <div class="profile-form">
    <h2>Edit Profile</h2>
    <form @submit.prevent="saveProfile">
      <div class="form-group">
        <label for="displayName">Full Name</label>
        <input v-model="editedProfile.displayName" id="displayName" type="text" required />
      </div>
      
      <div class="form-group">
        <label for="title">Title</label>
        <input v-model="editedProfile.title" id="title" type="text" placeholder="e.g. Frontend Developer" />
      </div>
      
      <div class="form-group">
        <label for="bio">Bio</label>
        <textarea v-model="editedProfile.bio" id="bio" rows="4" placeholder="Tell us about yourself"></textarea>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label for="location">Location</label>
          <input v-model="editedProfile.location" id="location" type="text" placeholder="e.g. New York, NY" />
        </div>
        
        <div class="form-group">
          <label for="website">Website</label>
          <input v-model="editedProfile.website" id="website" type="url" placeholder="https://yourwebsite.com" />
        </div>
      </div>
      
      <div class="form-group">
        <label for="github">GitHub Username</label>
        <div class="input-with-prefix">
          <span class="input-prefix">github.com/</span>
          <input v-model="editedProfile.github" id="github" type="text" placeholder="username" />
        </div>
      </div>
      
      <div class="form-actions">
        <button type="submit" class="save-button" :disabled="loading">
          <i class="fas fa-save"></i> Save Changes
        </button>
        <button type="button" @click="cancelEdit" class="cancel-button">
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import useProfile from '@/composables/useProfile';

export default {
  name: 'ProfileForm',
  props: {
    editedProfile: {
      type: Object,
      required: true
    }
  },
  emits: ['saveProfile', 'cancel'],
  setup(props, { emit }) {
    const { loading } = useProfile();

    const saveProfile = async () => {
      emit('saveProfile', props.editedProfile);
    };

    const cancelEdit = () => {
      emit('cancel');
    };

    return {
      saveProfile,
      loading,
      cancelEdit
    };
  }
}
</script>

<style scoped>
.profile-form {
  /* Add your styles here */
}
.form-group {
  margin-bottom: 1rem;
}
.form-actions {
  display: flex;
  justify-content: space-between;
}
</style>