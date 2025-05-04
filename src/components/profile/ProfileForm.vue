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