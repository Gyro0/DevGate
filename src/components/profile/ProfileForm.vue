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
<<<<<<< HEAD
  }
}
</script>

<style scoped>
.profile-form {
  background: var(--surface-card);
  border-radius: 1.2rem;
  box-shadow: 0 2px 16px 0 rgba(0,0,0,0.35), 0 0 0 2px var(--primary-glow), 0 0 8px 2px var(--circuit-accent);
  border: 1.5px solid var(--border-color, #23272e);
  padding: 2rem 1.5rem;
  color: var(--text);
  max-width: 480px;
  margin: 2rem auto;
}
.profile-form h2 {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--primary);
  margin-bottom: 2rem;
  text-shadow: 0 0 8px var(--primary-glow);
}
.form-group {
  margin-bottom: 1.2rem;
}
label {
  display: block;
  font-weight: 700;
  color: var(--secondary);
  margin-bottom: 0.4rem;
  font-size: 1rem;
}
input, textarea {
  width: 100%;
  padding: 0.6rem 1rem;
  border-radius: 0.6rem;
  border: 1.5px solid var(--border-color, #23272e);
  background: var(--surface-2);
  color: var(--text);
  font-size: 1rem;
  margin-top: 0.1rem;
  transition: border-color 0.18s, box-shadow 0.18s;
  box-shadow: 0 0 8px var(--primary-glow, transparent);
}
input:focus, textarea:focus {
  border-color: var(--primary-glow);
  box-shadow: 0 0 0 2px var(--primary-glow);
  outline: none;
}
.input-with-prefix {
  display: flex;
  align-items: center;
  background: var(--surface-2);
  border-radius: 0.6rem;
  border: 1.5px solid var(--border-color, #23272e);
  box-shadow: 0 0 8px var(--primary-glow, transparent);
}
.input-prefix {
  padding: 0.6rem 0.7rem;
  color: var(--highlight);
  font-size: 1rem;
  background: none;
  border: none;
}
.input-with-prefix input {
  border: none;
  background: none;
  box-shadow: none;
  padding-left: 0;
}
.form-row {
  display: flex;
  gap: 1rem;
}
.form-actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1.5rem;
}
.save-button {
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.6rem 1.4rem;
  font-weight: 700;
  font-size: 1rem;
  box-shadow: 0 0 8px var(--primary-glow);
  cursor: pointer;
  transition: background 0.18s, box-shadow 0.18s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.save-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.save-button:hover:not(:disabled) {
  background: var(--primary-glow);
  box-shadow: 0 0 16px 2px var(--primary-glow);
}
.cancel-button {
  background: var(--surface-2);
  color: var(--primary);
  border: 1.5px solid var(--primary-glow);
  border-radius: 0.5rem;
  padding: 0.6rem 1.4rem;
  font-weight: 700;
  font-size: 1rem;
  box-shadow: 0 0 8px var(--primary-glow);
  cursor: pointer;
  transition: background 0.18s, color 0.18s, border-color 0.18s, box-shadow 0.18s;
}
.cancel-button:hover {
  background: var(--primary-glow);
  color: #fff;
  border-color: var(--primary-glow);
  box-shadow: 0 0 16px 2px var(--primary-glow);
}
</style>
=======
  },
};
</script>
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
