<template>
  <div class="profile-form">
    <h2 class="h5 fw-bold mb-4">Edit Profile</h2>
    <form @submit.prevent="saveProfile">
      <div class="mb-3">
        <label for="displayName" class="form-label">Full Name</label>
        <input v-model="editedProfile.displayName" id="displayName" type="text" class="form-control" required />
      </div>

      <div class="mb-3">
        <label for="title" class="form-label">Title</label>
        <input v-model="editedProfile.title" id="title" type="text" class="form-control" placeholder="e.g. Frontend Developer" />
      </div>

      <div class="mb-3">
        <label for="bio" class="form-label">Bio</label>
        <textarea v-model="editedProfile.bio" id="bio" rows="4" class="form-control" placeholder="Tell us about yourself"></textarea>
      </div>

      <div class="row g-3">
        <div class="col-md-6">
          <label for="location" class="form-label">Location</label>
          <input v-model="editedProfile.location" id="location" type="text" class="form-control" placeholder="e.g. New York, NY" />
        </div>
        <div class="col-md-6">
          <label for="website" class="form-label">Website</label>
          <input v-model="editedProfile.website" id="website" type="url" class="form-control" placeholder="https://yourwebsite.com" />
        </div>
      </div>

      <div class="mb-3 mt-3">
        <label for="github" class="form-label">GitHub Username</label>
        <div class="input-group">
          <span class="input-group-text">github.com/</span>
          <input v-model="editedProfile.github" id="github" type="text" class="form-control" placeholder="username" />
        </div>
      </div>

      <div class="d-flex justify-content-between">
        <button type="submit" class="btn btn-primary" :disabled="loading">
          <i class="fas fa-save"></i> Save Changes
        </button>
        <button type="button" @click="cancelEdit" class="btn btn-secondary">
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
      required: true,
    },
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
      cancelEdit,
    };
  },
};
</script>