<template>
<<<<<<< HEAD
  <div class="profile-card">
    <div class="profile-banner">
      <div class="profile-avatar-container">
        <!-- Use root-relative path for the default avatar -->
        <img :src="userProfile.photoURL || '/default.jpg'" alt="Profile" class="profile-avatar" />
        <button v-if="editMode" class="change-photo-btn" @click="triggerPhotoUpload">
=======
  <div class="card shadow-sm border-0">
    <div class="card-body text-center">
      <div class="profile-avatar-container mx-auto mb-3">
        <img :src="userProfile.photoURL || '/default-avatar.png'" alt="Profile" class="profile-avatar" />
        <button v-if="editMode" class="btn btn-sm btn-primary change-photo-btn" @click="triggerPhotoUpload">
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
          <i class="fas fa-camera"></i>
        </button>
        <input type="file" ref="photoInput" @change="handlePhotoChange" accept="image/*" class="d-none" />
      </div>
      <h2 class="h5 fw-bold">{{ userProfile.displayName }}</h2>
      <p class="text-muted">{{ userProfile.title || 'Developer' }}</p>
      <p class="text-muted">{{ userProfile.bio || 'No bio added yet.' }}</p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'ProfileCard',
  props: {
    userProfile: {
      type: Object,
      required: true,
    },
    editMode: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['triggerPhotoUpload', 'handlePhotoChange'],
  setup(props, { emit }) {
    const photoInput = ref(null);

    const triggerPhotoUpload = () => {
      photoInput.value.click();
      emit('triggerPhotoUpload');
    };

    const handlePhotoChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        emit('handlePhotoChange', file);
      }
    };

    return {
      photoInput,
      triggerPhotoUpload,
      handlePhotoChange,
    };
  },
};
</script>

<style scoped>
<<<<<<< HEAD
.profile-card {
  background: var(--surface-card);
  border-radius: 1.2rem;
  box-shadow: 0 2px 16px 0 rgba(0,0,0,0.35), 0 0 0 2px var(--primary-glow), 0 0 8px 2px var(--circuit-accent);
  border: 1.5px solid var(--border-color, #23272e);
  padding: 2rem 1.5rem;
  color: var(--text);
  max-width: 480px;
  margin: 2rem auto;
}

.profile-banner {
  position: relative;
}

=======
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
.profile-avatar-container {
  position: relative;
<<<<<<< HEAD
  width: 110px;
  height: 110px;
  margin-bottom: 1.2rem;
=======
  width: 100px;
  height: 100px;
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
}
.profile-avatar {
<<<<<<< HEAD
  width: 110px;
  height: 110px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--primary-glow);
  box-shadow: 0 0 16px var(--primary-glow), 0 0 0 2px var(--circuit-accent);
  background: var(--background);
=======
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
}
.change-photo-btn {
  position: absolute;
  bottom: 0;
  right: 0;
<<<<<<< HEAD
  background: var(--primary);
  color: #fff;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 8px var(--primary-glow);
  transition: background 0.18s, box-shadow 0.18s;
  font-size: 1.1rem;
}
.change-photo-btn:hover {
  background: var(--primary-glow);
  box-shadow: 0 0 16px 2px var(--primary-glow);
}
.change-photo-btn i {
  font-size: 1rem;
}

.hidden-input {
  display: none;
}

.profile-info {
  margin-top: 0.5rem;
}

.profile-name {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--primary);
  margin: 0 0 0.25rem 0;
  text-shadow: 0 0 8px var(--primary-glow);
}

.profile-title {
  color: var(--secondary);
  font-size: 1rem;
  margin-bottom: 0.75rem;
  font-weight: 600;
}

.profile-bio {
  margin: 0.75rem 0;
  color: var(--text-secondary);
  font-size: 0.98rem;
  line-height: 1.5;
}

.profile-meta {
  margin-top: 1.2rem;
  font-size: 0.95rem;
}

.meta-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  color: var(--text-tertiary, #7a869a);
}

.meta-item i {
  margin-right: 0.75rem;
  color: var(--primary-glow);
  width: 18px;
  text-align: center;
  font-size: 1.1rem;
}

.meta-item a {
  color: var(--primary);
  text-decoration: underline;
  font-weight: 600;
  transition: color 0.18s;
}
.meta-item a:hover {
  color: var(--primary-glow);
  text-decoration: underline;
=======
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
}
</style>